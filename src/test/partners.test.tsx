import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PartnerStrip } from "@/components/site/PartnerStrip";
import { PARTNERS } from "@/lib/partners";

/** Brands we must never show as partners — no real relationship exists. */
const REAL_BRANDS = ["Gucci", "Prada", "Nike", "Adidas", "Zara", "Louis Vuitton", "Safaricom", "M-Pesa"];

describe("partner strip", () => {
  it("flags every partner as a sample until the owner confirms real ones", () => {
    expect(PARTNERS.length).toBeGreaterThan(0);
    expect(PARTNERS.every((p) => p.sample === true)).toBe(true);
    expect(PARTNERS.every((p) => !p.url)).toBe(true);
  });

  it("never claims a partnership with a real brand", () => {
    const { getByLabelText } = render(<PartnerStrip />);
    const text = (getByLabelText("Our partners").textContent || "").toLowerCase();
    for (const brand of REAL_BRANDS) expect(text).not.toContain(brand.toLowerCase());
  });

  it("says the names are samples", () => {
    const { getByLabelText } = render(<PartnerStrip />);
    expect(getByLabelText("Our partners").textContent).toContain("Sample partner names");
  });
});
