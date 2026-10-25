import { describe, expect, it } from "vitest";
import { defaultSize, listProducts, getProductBySlug } from "@/lib/catalog";

describe("Kenyan collection", () => {
  it("prices one Kenya bracelet at exactly KSh 500", async () => {
    const bracelet = await getProductBySlug("sample-kenya-beaded-bracelet");
    expect(bracelet?.price).toBe(500);
    if (!bracelet) throw new Error("Bracelet missing");
    expect(defaultSize(bracelet)).toBe("One size");
  });
  it("offers the full Maasai outfit together including tyre shoes", async () => {
    const set = await getProductBySlug("sample-complete-maasai-outfit");
    expect(set?.includedItems).toEqual(["Two checked shuka wraps", "Beaded necklace", "Beaded bracelet", "One pair of Maasai tyre sandals"]);
    expect(set?.variants.some((variant) => variant.size === "42" && variant.stock !== "sold_out")).toBe(true);
  });
  it("makes chains and tyre shoes discoverable by category", async () => {
    const jewellery = await listProducts({ category: "jewellery" });
    expect(jewellery.map((p) => p.id)).toContain("p16");
    const footwear = await listProducts({ category: "footwear" });
    expect(footwear.map((p) => p.id)).toContain("p17");
  });
});