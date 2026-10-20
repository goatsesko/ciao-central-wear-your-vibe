export function formatKSh(amount: number): string {
  return `KSh ${Math.round(amount).toLocaleString("en-KE")}`;
}

/** Store settings — edit here (later: move to the database). */
export const STORE = {
  freeDeliveryThreshold: 7500,
  deliveryFee: 350,
  deliveryEstimate: "1–3 business days in Nairobi · 3–5 days countrywide",
  handle: "@ciaocentral",
  // Social URLs left empty on purpose — add the real links when ready.
  socials: [
    { name: "TikTok", url: "" },
    { name: "Instagram", url: "" },
    { name: "Facebook", url: "" },
    { name: "Threads", url: "" },
  ],
};

export function deliveryFor(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return subtotal >= STORE.freeDeliveryThreshold ? 0 : STORE.deliveryFee;
}
