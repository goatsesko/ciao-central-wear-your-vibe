import { describe, expect, it } from "vitest";
import { SAMPLE_PRODUCTS } from "@/lib/catalog/sample-data";
import { eligibleProducts, sanitizeOutfits } from "@/lib/dress-me/logic";

describe("Dress Me rules", () => {
  it("every product has style tags", () => {
    for (const p of SAMPLE_PRODUCTS) expect(p.tags?.category).toBeTruthy();
  });

  it("excludes items sold out in the chosen size", () => {
    // Black Denim Overshirt (p5) is sold out in S
    expect(eligibleProducts(SAMPLE_PRODUCTS, "S", null).some((p) => p.id === "p5")).toBe(false);
    expect(eligibleProducts(SAMPLE_PRODUCTS, "M", null).some((p) => p.id === "p5")).toBe(true);
  });

  it("drops invented product ids and outfits without a top and bottom", () => {
    const out = sanitizeOutfits(
      [
        { name: "Fake", reason: "x", productIds: ["p1", "nope"] },
        { name: "Good", reason: "x", productIds: ["p1", "p4", "fake-id"] },
      ],
      SAMPLE_PRODUCTS,
      null,
    );
    expect(out).toEqual([{ name: "Good", reason: "x", productIds: ["p1", "p4"] }]);
  });

  it("drops outfits whose total is over budget", () => {
    // p1 2,800 + p4 4,800 = 7,600 > 5,000
    expect(sanitizeOutfits([{ name: "A", reason: "x", productIds: ["p1", "p4"] }], SAMPLE_PRODUCTS, 5000)).toEqual([]);
    expect(sanitizeOutfits([{ name: "A", reason: "x", productIds: ["p1", "p4"] }], SAMPLE_PRODUCTS, 8000)).toHaveLength(1);
  });
});
