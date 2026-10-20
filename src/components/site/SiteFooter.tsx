import { Link, type LinkProps } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { STORE } from "@/lib/format";

export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-x-6 gap-y-2 ${className}`}>
      {STORE.socials.map((s) => (
        <li key={s.name}>
          {s.url ? (
            <a href={s.url} target="_blank" rel="noreferrer" className="eyebrow link-underline">{s.name}</a>
          ) : (
            <span className="eyebrow opacity-70" title="Link coming soon">{s.name}</span>
          )}
        </li>
      ))}
    </ul>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="mx-auto max-w-[1600px] px-4 py-16 md:px-8">
        <p className="font-display text-[14vw] leading-none md:text-[9vw]">More than clothes.</p>
        <p className="font-display text-[14vw] leading-none text-silver md:text-[9vw]">It's a lifestyle.</p>
        <div className="mt-16 grid gap-10 md:grid-cols-4">
          <div className="space-y-4">
            <Logo inverted />
            <p className="text-sm text-silver">Kenyan streetwear & lifestyle. {STORE.handle}</p>
          </div>
          <FooterCol title="Shop" links={[["/shop", "All products"], ["/shop", "New drops"]]} />
          <FooterCol title="Brand" links={[["/about", "Story"], ["/team", "Team"], ["/apps", "Apps"]]} />
          <FooterCol title="Help" links={[["/support", "FAQ & delivery"], ["/support", "Returns & size guide"], ["/contact", "Contact"]]} />
        </div>
        <div className="mt-14 flex flex-col justify-between gap-6 border-t border-charcoal pt-8 md:flex-row">
          <SocialLinks />
          <p className="text-xs text-silver">© {new Date().getFullYear()} Ciao Central. Nairobi, Kenya.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [LinkProps["to"], string][] }) {
  return (
    <div>
      <p className="eyebrow mb-4 text-gold">{title}</p>
      <ul className="space-y-2 text-sm">
        {links.map(([to, label]) => (
          <li key={label}><Link to={to} className="link-underline">{label}</Link></li>
        ))}
      </ul>
    </div>
  );
}
