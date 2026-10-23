import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { SOCIAL_ICON } from "./BrandIcons";
import { PaymentBadges } from "./PaymentBadges";
import { whatsappUrl } from "./WhatsAppButton";
import { STORE } from "@/lib/format";

export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {STORE.socials.map((s) => {
        const Icon = SOCIAL_ICON[s.name];
        const url = s.name === "WhatsApp" ? s.url || whatsappUrl() : s.url;
        const inner = Icon ? <Icon className="size-5" /> : s.name;
        return (
          <li key={s.name}>
            {url ? (
              <a href={url} target="_blank" rel="noreferrer" aria-label={s.name} className="grid size-11 place-items-center rounded-full border border-current/30 transition-colors hover:border-gold hover:text-gold">
                {inner}
              </a>
            ) : (
              <span aria-label={`${s.name} (coming soon)`} title={`${s.name} — link coming soon`} className="grid size-11 place-items-center rounded-full border border-current/20 opacity-60">
                {inner}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function PaymentBadges() {
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Payment methods">
      <li className="rounded-sm bg-mpesa px-3 py-1.5 text-xs font-extrabold tracking-wide text-ink-foreground">M-PESA</li>
      <li className="rounded-sm bg-ink-foreground px-3 py-1.5 text-xs font-extrabold italic tracking-wide text-visa">VISA</li>
      <li className="flex items-center gap-1 rounded-sm bg-ink-foreground px-3 py-1.5" aria-label="Mastercard">
        <span className="size-3.5 rounded-full bg-mc-red" />
        <span className="-ml-2 size-3.5 rounded-full bg-mc-yellow opacity-90" />
        <span className="ml-1 text-xs font-bold text-ink">mastercard</span>
      </li>
    </ul>
  );
}

const LINKS = [
  { label: "Shop", to: "/shop" as const },
  { label: "About", to: "/about" as const },
  { label: "Contact", to: "/contact" as const },
  { label: "Shipping & Returns", to: "/support" as const, hash: "delivery" },
  { label: "FAQ", to: "/support" as const, hash: "faq" },
];

export function SiteFooter() {
  return (
    <footer className="bg-ink pb-24 text-ink-foreground md:pb-0">
      <div className="mx-auto max-w-[1600px] px-4 py-16 md:px-8">
        <p className="font-display text-[14vw] leading-none md:text-[9vw]">More than clothes.</p>
        <p className="font-display text-[14vw] leading-none text-silver md:text-[9vw]">It's a lifestyle.</p>
        <div className="mt-14 grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div className="space-y-4">
            <Logo inverted />
            <p className="text-sm text-silver">Kenyan streetwear & lifestyle. {STORE.handle}</p>
          </div>
          <nav aria-label="Footer">
            <p className="eyebrow mb-3 text-gold">Explore</p>
            <ul className="grid grid-cols-2 md:grid-cols-1">
              {LINKS.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} {...(l.hash ? { hash: l.hash } : {})} className="flex min-h-11 items-center text-sm hover:text-gold">{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="space-y-8">
            <div>
              <p className="eyebrow mb-3 text-gold">Follow</p>
              <SocialLinks />
            </div>
            <div>
              <p className="eyebrow mb-3 text-gold">We accept</p>
              <PaymentBadges />
            </div>
          </div>
        </div>
        <p className="mt-14 border-t border-charcoal pt-8 text-xs text-silver">© {new Date().getFullYear()} Ciao Central. Nairobi, Kenya.</p>
      </div>
    </footer>
  );
}
