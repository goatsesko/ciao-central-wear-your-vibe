import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "./Logo";
import { useCart } from "@/lib/cart";
import { formatKSh, STORE } from "@/lib/format";

const NAV = [
  { to: "/shop", label: "Shop" },
  { to: "/apps", label: "Apps" },
  { to: "/about", label: "Story" },
  { to: "/team", label: "Team" },
  { to: "/contact", label: "Contact" },
] as const;

export function AnnouncementBar() {
  const msg = `Free delivery on orders over ${formatKSh(STORE.freeDeliveryThreshold)} · M-Pesa accepted · More than clothes. It's a lifestyle.`;
  return (
    <div className="overflow-hidden bg-ink py-2 text-ink-foreground" role="region" aria-label="Announcements">
      <p className="sr-only">{msg}</p>
      <div className="marquee flex w-max whitespace-nowrap" aria-hidden="true">
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} className="eyebrow px-8">
            {msg} <span className="text-gold">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function SiteHeader() {
  const { count, setOpen } = useCart();
  const [menu, setMenu] = useState(false);
  const [searching, setSearching] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-4 px-4 md:h-20 md:px-8">
        <button className="-ml-2 p-2 lg:hidden" aria-label="Open menu" onClick={() => setMenu(true)}>
          <Menu className="size-5" />
        </button>
        <Logo />
        <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="eyebrow link-underline py-1" activeProps={{ className: "text-foreground" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <button className="p-2" aria-label="Search" aria-expanded={searching} onClick={() => setSearching((s) => !s)}>
            <Search className="size-5" />
          </button>
          <Link to="/support" className="hidden p-2 sm:inline-flex" aria-label="Account and support">
            <User className="size-5" />
          </Link>
          <button className="relative p-2" aria-label={`Open bag, ${count} items`} onClick={() => setOpen(true)}>
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <span className="absolute right-0 top-0 grid size-4 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {searching && (
        <form
          role="search"
          className="reveal border-t px-4 py-4 md:px-8"
          onSubmit={(e) => {
            e.preventDefault();
            setSearching(false);
            navigate({ to: "/shop", search: { q } });
          }}
        >
          <label htmlFor="site-search" className="sr-only">Search products</label>
          <input
            id="site-search"
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search tees, denim…"
            className="mx-auto block w-full max-w-3xl border-b border-foreground bg-transparent py-2 font-display text-2xl uppercase placeholder:text-muted-foreground focus:outline-none md:text-4xl"
          />
        </form>
      )}

      {menu && (
        <div className="fixed inset-0 z-50 flex flex-col bg-ink text-ink-foreground lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="flex h-16 items-center justify-between px-4">
            <span className="eyebrow text-silver">Menu</span>
            <button className="p-2" aria-label="Close menu" onClick={() => setMenu(false)}>
              <X className="size-6" />
            </button>
          </div>
          <nav aria-label="Mobile" className="flex flex-1 flex-col justify-center gap-2 px-6">
            {[{ to: "/", label: "Home" }, ...NAV, { to: "/support", label: "Support" }].map((n, i) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setMenu(false)}
                className="reveal font-display text-6xl uppercase hover:text-gold"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
