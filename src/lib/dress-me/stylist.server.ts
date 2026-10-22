import { createOpenAI } from "@ai-sdk/openai";
import { NoObjectGeneratedError, Output, streamText } from "ai";
import { z } from "zod";
import type { Product } from "@/lib/catalog/types";
import type { Outfit } from "./logic";

const schema = z.object({
  outfits: z.array(z.object({ name: z.string(), reason: z.string(), productIds: z.array(z.string()) })),
  note: z.string().nullable(),
});

export class StylistError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

export async function askStylist(input: {
  request: string;
  size: string | null;
  budget: number | null;
  products: Product[];
}): Promise<{ outfits: Outfit[]; note: string | null }> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new StylistError("Stylist is not configured.", 500);

  let runId: string | undefined;
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: async (url, init) => {
      const headers = new Headers(init?.headers);
      if (runId) headers.set("X-Lovable-AIG-Run-ID", runId);
      const res = await fetch(url, { ...init, headers });
      runId ??= res.headers.get("X-Lovable-AIG-Run-ID") ?? undefined;
      if (!res.ok) {
        const body = await res.clone().text().catch(() => "");
        console.error("AI gateway error", res.status, body.slice(0, 300));
        throw new StylistError(
          res.status === 429 ? "Our stylist is busy right now. Try again in a moment."
          : res.status === 402 || res.status === 403 ? "The stylist is unavailable right now."
          : "The stylist couldn't finish. Please try again.",
          res.status,
        );
      }
      return res;
    },
  });

  const catalog = input.products.map((p) => ({ id: p.id, name: p.name, price: p.price, tags: p.tags }));
  const instructions = `You are the in-house stylist for Ciao Central, a Nairobi streetwear brand.
Build up to 3 complete outfits for the customer using ONLY products from the provided JSON list.
Rules:
- Use only product ids from the list. Never invent items.
- Each outfit: exactly one product with category "top", exactly one with category "bottom", optionally one "layer" and/or one "accessory".
- Outfits should differ from each other where possible.
- ${input.budget ? `The total price of each outfit must be at most KSh ${input.budget}.` : "There is no budget limit."}
- Every product in the list is already available in the customer's size.
- If nothing fits the request well, return fewer outfits (or none) and explain honestly in "note". Otherwise set note to null.
- name: short and punchy (max 4 words). reason: one line on why it works for the occasion.`;

  const result = streamText({
    model: provider.responses("openai/gpt-6-astra"),
    instructions,
    messages: [{
      role: "user",
      content: `Request: ${input.request}\nSize: ${input.size ?? "not given"}\nBudget: ${input.budget ? `KSh ${input.budget}` : "any"}\nProducts: ${JSON.stringify(catalog)}`,
    }],
    output: Output.object({ schema }),
    maxRetries: 0,
    providerOptions: {
      openai: { forceReasoning: true, reasoningEffort: "low", store: false },
    },
  });

  try {
    const out = await result.output;
    return { outfits: out.outfits, note: out.note };
  } catch (e) {
    if (e instanceof StylistError) throw e;
    if (NoObjectGeneratedError.isInstance(e)) {
      try {
        const parsed = schema.parse(JSON.parse(e.text ?? ""));
        return { outfits: parsed.outfits, note: parsed.note };
      } catch {
        throw new StylistError("The stylist got tangled up. Please try again.", 502);
      }
    }
    // Errors thrown in fetch may be wrapped by the SDK
    const cause = (e as { cause?: unknown })?.cause;
    if (cause instanceof StylistError) throw cause;
    console.error("Stylist failed", e);
    throw new StylistError("The stylist couldn't finish. Please try again.", 500);
  }
}
