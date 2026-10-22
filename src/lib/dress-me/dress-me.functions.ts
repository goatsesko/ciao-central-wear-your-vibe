import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { listProducts } from "@/lib/catalog";
import { detectOccasion, eligibleProducts, sanitizeOutfits, type Outfit } from "./logic";

const styleInput = z.object({
  request: z.string().trim().min(2).max(300),
  size: z.enum(["S", "M", "L", "XL", "XXL"]).nullable(),
  budget: z.number().int().min(0).max(1_000_000).nullable(),
});

export type StyleResult =
  | { ok: true; requestId: string | null; outfits: Outfit[]; note: string | null }
  | { ok: false; error: string };

export const styleMe = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => styleInput.parse(d))
  .handler(async ({ data }): Promise<StyleResult> => {
    const { askStylist, StylistError } = await import("./stylist.server");
    const budget = data.budget || null;
    const allowed = eligibleProducts(await listProducts(), data.size, budget);
    let outfits: Outfit[] = [];
    let note: string | null = null;
    if (allowed.length) {
      try {
        const res = await askStylist({ request: data.request, size: data.size, budget, products: allowed });
        outfits = sanitizeOutfits(res.outfits, allowed, budget);
        note = res.note;
      } catch (e) {
        return { ok: false, error: e instanceof StylistError ? e.message : "Something went wrong. Please try again." };
      }
    }
    if (!outfits.length && !note) note = "We couldn't build a full look that fits your size and budget right now. Try a bigger budget or a different size.";

    let requestId: string | null = null;
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: row } = await supabaseAdmin
        .from("dress_me_requests")
        .insert({ request_text: data.request, occasion: detectOccasion(data.request), size: data.size, budget, outfits })
        .select("id")
        .single();
      requestId = row?.id ?? null;
    } catch (e) {
      console.error("Tracking insert failed", e);
    }
    return { ok: true, requestId, outfits, note };
  });

export const recordChosenOutfit = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ requestId: z.string().uuid(), outfit: z.object({ name: z.string().max(80), productIds: z.array(z.string().max(20)).max(6) }) }).parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin
      .from("dress_me_requests")
      .update({ chosen_outfit: data.outfit, chosen_at: new Date().toISOString() })
      .eq("id", data.requestId);
    return { ok: true };
  });
