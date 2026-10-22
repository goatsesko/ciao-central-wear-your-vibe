import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { productsQuery } from "@/lib/catalog";
import { formatKSh } from "@/lib/format";

export function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const { data: all = [] } = useQuery(productsQuery({}));
  const term = q.trim().toLowerCase();
  const results = term ? all.filter((p) => p.name.toLowerCase().includes(term)) : [];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background reveal" role="dialog" aria-modal="true" aria-label="Search">
      <div className="mx-auto flex w-full max-w-3xl items-center gap-2 border-b px-4 py-3">
        <label htmlFor="site-search" className="sr-only">Search products</label>
        <input
          id="site-search"
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search tees, hoodies…"
          className="h-14 flex-1 bg-transparent font-display text-3xl uppercase placeholder:text-muted-foreground focus:outline-none md:text-5xl"
        />
        <button className="grid size-11 place-items-center" aria-label="Close search" onClick={onClose}>
          <X className="size-6" />
        </button>
      </div>
      <div className="mx-auto w-full max-w-3xl flex-1 overflow-y-auto px-4 py-4" aria-live="polite">
        {!term && <p className="eyebrow text-muted-foreground">Start typing to find a product</p>}
        {term && results.length === 0 && <p className="text-muted-foreground">No products match "{q}".</p>}
        <ul className="divide-y">
          {results.map((p) => (
            <li key={p.id}>
              <Link to="/product/$slug" params={{ slug: p.slug }} onClick={onClose} className="flex min-h-16 items-center gap-4 py-3">
                <img src={p.images[0]} alt="" width={56} height={70} loading="lazy" className="h-[70px] w-14 shrink-0 bg-muted object-cover" />
                <span className="min-w-0 flex-1 truncate text-sm font-semibold">{p.name}</span>
                <span className="shrink-0 text-sm">{formatKSh(p.price)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
