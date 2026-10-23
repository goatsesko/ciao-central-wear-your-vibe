export function formatKSh(amount: number): string {
  return `KSh ${Math.round(amount).toLocaleString("en-KE")}`;
}

/** The one handle we own on every network: @ciaocentral. Change it here and every link follows. */
const HANDLE = "ciaocentral";

/** Store settings — edit here (later: move to the database). */
export const STORE = {
  freeDeliveryThreshold: 7500,
  deliveryFee: 350,
  deliveryEstimate: "Nairobi delivery 24–48 hrs · 3–5 days countrywide",
  handle: `@${HANDLE}`,
  // WhatsApp number in international format without "+" (e.g. 2547XXXXXXXX). Empty until the owner supplies it.
  whatsapp: "",
  // Built from the handle so a tap always lands on the profile. WhatsApp needs a phone number first.
  socials: [
    { name: "Instagram", url: `https://www.instagram.com/${HANDLE}/` },
    { name: "TikTok", url: `https://www.tiktok.com/@${HANDLE}` },
    { name: "Facebook", url: `https://www.facebook.com/${HANDLE}` },
    { name: "Threads", url: `https://www.threads.net/@${HANDLE}` },
    { name: "WhatsApp", url: "" },
  ],
};

export function deliveryFor(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return subtotal >= STORE.freeDeliveryThreshold ? 0 : STORE.deliveryFee;
}
