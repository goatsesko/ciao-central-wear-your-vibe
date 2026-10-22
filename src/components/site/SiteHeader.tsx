import { Link } from "@tanstack/react-router";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useCallback, useState } from "react";
import { Logo } from "./Logo";
import { SearchOverlay } from "./SearchOverlay";
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
  const [paused, setPaused] = useState(false);
  const msg = `Free delivery on orders over ${formatKSh(STORE.freeDeliveryThreshold)} · M-Pesa accepted · Nairobi delivery 24–48hrs`;
  const Item = () => (
    <span className="eyebrow flex shrink-0 items-center gap-8 px-4">
      {msg} <span className="text-gold">✦</span>
    </span>
  );
  return (
    <div
      className="cursor-pointer overflow-hidden bg-ink py-2.5 text-ink-foreground"
      role="region"
      aria-label="Announcements"
      onClick={() => setPaused((p) => !p)}
      title={paused ? "Tap to play" : "Tap to pause"}
    >
      <p className="sr-only">{msg}</p>
      <div className="marquee flex w-max" style={{ animationPlayState: paused ? "paused" : "running" }} aria-hidden="true">
        {/* Two identical halves so the -50% loop is seamless */}
        {[0, 1].map((h) => (
          <div key={h} className="flex shrink-0">
            <Item /><Item /><Item />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SiteHeader() {
  const { count, setOpen } = useCart();
  const [menu, setMenu] = useState(false);
  const [searching, setSearching] = useState(false);
  const closeSearch = useCallback(() => setSearching(false), []);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur-md">
      <div className="mx-auto grid h-16 max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center gap-2 px-2 md:h-20 md:px-8 lg:flex lg:justify-between">
        <div className="flex items-center lg:hidden">
          <button className="grid size-11 place-items-center" aria-label="Open menu" onClick={() => setMenu(true)}>
            <Menu className="size-5" />
          </button>
        </div>
        <Logo className="justify-self-center" />
        <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="eyebrow link-underline py-1" activeProps={{ className: "text-foreground" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center justify-end">
          <button className="grid size-11 place-items-center" aria-label="Search" onClick={() => setSearching(true)}>
            <Search className="size-5" />
          </button>
          <Link to="/support" className="hidden size-11 place-items-center sm:grid" aria-label="Account and support">
            <User className="size-5" />
          </Link>
          <button className="relative grid size-11 place-items-center" aria-label={`Open bag, ${count} items`} onClick={() => setOpen(true)}>
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <span className="absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-gold text-[10px] font-bold text-ink">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {searching && <SearchOverlay onClose={closeSearch} />}

      {menu && (
        <div className="fixed inset-0 z-50 flex flex-col bg-ink text-ink-foreground lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="flex h-16 items-center justify-between px-2">
            <span className="eyebrow px-2 text-silver">Menu</span>
            <button className="grid size-11 place-items-center" aria-label="Close menu" onClick={() => setMenu(false)}>
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
