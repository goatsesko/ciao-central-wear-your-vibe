import type { Product } from "@/lib/catalog/types";

export const DRESS_ME_SIZES = ["S", "M", "L", "XL", "XXL"] as const;
export const BUDGETS = [
  { value: 5000, label: "Under KSh 5,000" },
  { value: 8000, label: "Under KSh 8,000" },
  { value: 12000, label: "Under KSh 12,000" },
  { value: 0, label: "Any" },
] as const;
export const QUICK_CHIPS = ["Date Night", "Weekend in Nairobi", "Campus", "Church", "Out With The Boys", "Work"];

export type Outfit = { name: string; reason: string; productIds: string[] };

/** True when the product has a non-sold-out variant in this size (one-size items always fit). */
export function availableInSize(p: Product, size: string | null): boolean {
  return p.variants.some(
    (v) => v.stock !== "sold_out" && (!size || v.size === size || v.size === "One size"),
  );
}

/** Products the stylist may use: in stock in the user's size, and individually within budget. */
export function eligibleProducts(all: Product[], size: string | null, budget: number | null): Product[] {
  return all.filter((p) => availableInSize(p, size) && (!budget || p.price <= budget));
}

/** Guess an occasion keyword from free text, for tracking. */
export function detectOccasion(text: string): string | null {
  const t = text.toLowerCase();
  const map: [string, RegExp][] = [
    ["date", /date|dinner|romant/],
    ["church", /church|sunday|service|mass/],
    ["work", /work|office|interview|meeting/],
    ["party", /party|club|boys|night out|birthday|concert/],
    ["campus", /campus|class|uni|school|lecture/],
    ["casual", /weekend|casual|chill|brunch|hangout/],
  ];
  return map.find(([, re]) => re.test(t))?.[0] ?? null;
}

/**
 * Keep only outfits made of allowed products, with exactly one top and one bottom,
 * at most one layer and one accessory, and a total within budget.
 */
export function sanitizeOutfits(raw: Outfit[], allowed: Product[], budget: number | null): Outfit[] {
  const byId = new Map(allowed.map((p) => [p.id, p]));
  const out: Outfit[] = [];
  for (const o of raw) {
    const ids = Array.from(new Set(o.productIds)).filter((id) => byId.has(id));
    const slots: Record<string, string[]> = {};
    for (const id of ids) (slots[byId.get(id)!.tags.category] ??= []).push(id);
    if (slots.top?.length !== 1 || slots.bottom?.length !== 1) continue;
    if ((slots.layer?.length ?? 0) > 1 || (slots.accessory?.length ?? 0) > 1) continue;
    const total = ids.reduce((s, id) => s + byId.get(id)!.price, 0);
    if (budget && total > budget) continue;
    const name = o.name.trim().slice(0, 60);
    if (!name) continue;
    out.push({ name, reason: o.reason.trim().slice(0, 200), productIds: ids });
  }
  return out.slice(0, 3);
}
