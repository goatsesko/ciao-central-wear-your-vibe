import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PaymentBadges } from "@/components/site/PaymentBadges";

describe("payment methods", () => {
  it("shows M-Pesa and Mastercard only", () => {
    const { getByLabelText, queryByText } = render(<PaymentBadges />);
    expect(getByLabelText("Payment methods")).toBeTruthy();
    const text = getByLabelText("Payment methods").textContent || "";
    expect(text).toContain("M-Pesa");
    expect(text).toContain("Mastercard");
    expect(queryByText("VISA")).toBeNull();
    expect(text).not.toContain("Visa");
  });
});
