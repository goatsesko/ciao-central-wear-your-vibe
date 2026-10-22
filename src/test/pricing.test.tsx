import { describe, expect, it } from "vitest";
import { deliveryFor, formatKSh } from "@/lib/format";
import { listProducts } from "@/lib/catalog";

describe("pricing", () => {
  it("keeps sample tees within KSh 2,500–3,500 and hoodies within KSh 5,500–7,000", async () => {
    for (const p of await listProducts({ category: "tees" })) expect(p.price >= 2500 && p.price <= 3500).toBe(true);
    for (const p of await listProducts({ category: "hoodies" })) expect(p.price >= 5500 && p.price <= 7000).toBe(true);
  });
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
    const prices = items.map((p) => p.price);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });
});
