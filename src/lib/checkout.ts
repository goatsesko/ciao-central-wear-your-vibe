export const NAIROBI_AREAS = [
  "CBD", "Westlands", "Kilimani", "Kileleshwa", "Lavington", "Karen", "Langata", "South B / South C",
  "Parklands", "Ngong Road", "Kasarani", "Roysambu", "Embakasi", "Eastleigh", "Ruaka", "Rongai", "Other (Nairobi)",
];

/**
 * Normalise a Kenyan mobile number to +254XXXXXXXXX.
 * Accepts 07XXXXXXXX, 01XXXXXXXX, 7XXXXXXXX, 2547XXXXXXXX, +2547XXXXXXXX (spaces/dashes allowed).
 * Returns null when it is not a valid Kenyan mobile number.
 */
export function normalizeKenyanPhone(input: string): string | null {
  const d = input.replace(/[\s-]/g, "").replace(/^\+/, "");
  let rest: string | null = null;
  if (/^254[17]\d{8}$/.test(d)) rest = d.slice(3);
  else if (/^0[17]\d{8}$/.test(d)) rest = d.slice(1);
  else if (/^[17]\d{8}$/.test(d)) rest = d;
  return rest ? `+254${rest}` : null;
}

export type PaymentMethod = "mpesa" | "card";
