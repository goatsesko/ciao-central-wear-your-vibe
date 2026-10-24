/**
 * Partners shown on the home page, inside the brand-story block.
 *
 * These names are SAMPLE stand-ins — the owner has not supplied real partner
 * names or logo files yet. Never present one as a confirmed relationship.
 *
 * When real assets arrive: add `logo` (an imported image or hosted URL) and the
 * text wordmark is replaced by the greyscale logo automatically. Add `url` only
 * once the owner confirms it — links are never invented.
 */
export type Partner = {
  /** Displayed as a black-and-white wordmark when no logo file exists. */
  name: string;
  /** Optional logo file. Empty = render the text wordmark. */
  logo?: string;
  /** Partner's own site. Empty until the owner supplies it. */
  url?: string;
  /** True while this is a placeholder, not a confirmed partnership. */
  sample: true;
};

export const PARTNERS: Partner[] = [
  { name: "Maison Noir", sample: true },
  { name: "Atelier 254", sample: true },
  { name: "Velvet Room", sample: true },
  { name: "Koa Studio", sample: true },
  { name: "North Ave", sample: true },
  { name: "Sunday Social", sample: true },
];

/** Shown under the strip so nobody mistakes the samples for real partners. */
export const PARTNERS_NOTE = "Sample partner names — send us your real logos and we'll swap them in.";
