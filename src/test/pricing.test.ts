import { describe, expect, it } from "vitest";
import { deliveryFor, formatKSh } from "@/lib/format";
import { listProducts } from "@/lib/catalog";

describe("pricing", () => {
  it("formats prices as KSh", () => {
    expect(formatKSh(2500)).toBe("KSh 2,500");
  });
  it("charges delivery below the free threshold", () => {
    expect(deliveryFor(2500)).toBe(350);
  });
  it("gives free delivery at or above KSh 7,500", () => {
    expect(deliveryFor(7500)).toBe(0);
  });
  it("sorts products by price ascending", async () => {
    const items = await listProducts({ sort: "price-asc" });
    expect(items.map((p) => p.price)).toEqual([2200, 2500, 5500]);
  });
});
