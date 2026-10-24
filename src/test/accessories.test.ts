import { describe, expect, it } from "vitest";
import { SAMPLE_PRODUCTS } from "@/lib/catalog/sample-data";

const accessories = SAMPLE_PRODUCTS.filter((p) => p.category === "accessories");

describe("branded accessories", () => {
  it("has a hat, socks and shoes in the shop", () => {
    const names = accessories.map((p) => p.name.toLowerCase()).join(" ");
    expect(names).toContain("hat");
    expect(names).toContain("socks");
    expect(names).toContain("sneakers");
    expect(names).toContain("scarf");
  });

  it("carries the CC brand mark in every accessory name", () => {
    expect(accessories.length).toBeGreaterThan(0);
    for (const p of accessories) expect(p.name.startsWith("CC ")).toBe(true);
  });

  it("prices the new pieces in KSh", () => {
    const byName = Object.fromEntries(accessories.map((p) => [p.name, p.price]));
    expect(byName["CC Bucket Hat"]).toBe(2200);
    expect(byName["CC Crew Socks"]).toBe(1200);
    expect(byName["CC Low-Top Sneakers"]).toBe(7500);
    expect(byName["CC Wool-Blend Scarf"]).toBe(2800);
  });

  it("keeps every accessory marked as a sample", () => {
    expect(accessories.every((p) => p.isSample)).toBe(true);
  });
});
