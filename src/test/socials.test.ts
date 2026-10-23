import { describe, expect, it } from "vitest";
import { STORE } from "@/lib/format";
import { SOCIAL_ICON } from "@/components/site/BrandIcons";

const NETWORK_HOSTS = ["instagram.com", "tiktok.com", "facebook.com", "threads.net", "wa.me"];

describe("social links", () => {
  it("sends every network icon to the @ciaocentral profile", () => {
    const user = STORE.handle.replace("@", "");
    for (const s of STORE.socials) {
      if (!s.url) continue;
      expect(s.url.startsWith("https://")).toBe(true);
      expect(s.url).toContain(user);
    }
  });

  it("links only real network domains, never an invented page", () => {
    for (const s of STORE.socials) {
      if (!s.url) continue;
      const host = new URL(s.url).hostname;
      expect(NETWORK_HOSTS.some((d) => host === d || host.endsWith(`.${d}`))).toBe(true);
    }
  });

  it("covers Instagram, TikTok, Facebook and Threads", () => {
    const names = STORE.socials.map((s) => s.name);
    for (const n of ["Instagram", "TikTok", "Facebook", "Threads"]) expect(names).toContain(n);
  });

  it("has an icon for every network listed", () => {
    for (const s of STORE.socials) expect(SOCIAL_ICON[s.name]).toBeTruthy();
  });

  it("only links WhatsApp once a phone number exists", () => {
    const wa = STORE.socials.find((s) => s.name === "WhatsApp");
    if (STORE.whatsapp) expect(wa?.url || "").toContain(STORE.whatsapp);
    else expect(wa?.url ?? "").toBe("");
  });
});
