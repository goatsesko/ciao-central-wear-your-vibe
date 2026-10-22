export function formatKSh(amount: number): string {
  return `KSh ${Math.round(amount).toLocaleString("en-KE")}`;
}

/** Store settings — edit here (later: move to the database). */
export const STORE = {
  freeDeliveryThreshold: 7500,
  deliveryFee: 350,
  deliveryEstimate: "Nairobi delivery 24–48 hrs · 3–5 days countrywide",
  handle: "@ciaocentral",
  // WhatsApp number in international format without "+" (e.g. 2547XXXXXXXX). Empty until the owner supplies it.
  whatsapp: "",
  // Social URLs left empty on purpose — add the real links when ready.
  socials: [
    { name: "TikTok", url: "" },
    { name: "Instagram", url: "" },
    { name: "WhatsApp", url: "" },
  ],
};

export function deliveryFor(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return subtotal >= STORE.freeDeliveryThreshold ? 0 : STORE.deliveryFee;
}
