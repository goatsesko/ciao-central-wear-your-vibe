import { describe, expect, it } from "vitest";
import { normalizeKenyanPhone } from "@/lib/checkout";

describe("Kenyan phone (+254)", () => {
  it("converts 07... to +254", () => expect(normalizeKenyanPhone("0712 345 678")).toBe("+254712345678"));
  it("keeps +254 numbers", () => expect(normalizeKenyanPhone("+254112345678")).toBe("+254112345678"));
  it("rejects non-Kenyan or short numbers", () => {
    expect(normalizeKenyanPhone("+1 555 123 4567")).toBeNull();
    expect(normalizeKenyanPhone("07123")).toBeNull();
  });
});
