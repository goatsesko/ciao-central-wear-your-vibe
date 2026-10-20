import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { CATEGORIES, facetsQuery, productsQuery, type SortKey } from "@/lib/catalog";
import { ProductCardSkeleton, ProductGrid } from "@/components/site/ProductCard";
import { formatKSh } from "@/lib/format";
import { cn } from "@/lib/utils";

const schema = z.object({
  q: fallback(z.string(), "").default(""),
  category: fallback(z.string(), "all").default("all"),
  sort: fallback(z.string(), "newest").default("newest"),
  price: fallback(z.string(), "any").default("any"),
  sizes: fallback(z.string().array(), []).default([]),
  colours: fallback(z.string().array(), []).default([]),
});

const PRICE_RANGES = [
  { value: "any", label: "Any price" },
  { value: "0-2500", label: `Under ${formatKSh(2500)}` },
  { value: "2500-5000", label: `${formatKSh(2500)} – ${formatKSh(5000)}` },
  { value: "5000-", label: `Over ${formatKSh(5000)}` },
];

export const Route = createFileRoute("/shop")({
  validateSearch: zodValidator(schema),
  head: () => ({
    meta: [
      { title: "Shop — Ciao Central" },
      { name: "description", content: "Shop Ciao Central streetwear: signature tees, denim and new drops. Prices in KSh, M-Pesa accepted." },
      { property: "og:title", content: "Shop — Ciao Central" },
      { property: "og:description", content: "Signature tees, denim and new drops from Ciao Central." },
    ],
    links: [{ rel: "canonical", href: "/shop" }],
  }),
  component: Shop,
});

function Shop() {
  const s = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [min, max] = s.price === "any" ? [undefined, undefined] : s.price.split("-").map((n) => (n ? Number(n) : undefined));
  const sort = (["newest", "price-asc", "price-desc"].includes(s.sort) ? s.sort : "newest") as SortKey;

  const products = useQuery(
    productsQuery({ q: s.q, category: s.category, sort, minPrice: min, maxPrice: max, sizes: s.sizes, colours: s.colours }),
  );
  const facets = useQuery(facetsQuery());

  const set = (patch: Partial<typeof s>) => navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true });
  const toggle = (key: "sizes" | "colours", v: string) =>
    set({ [key]: s[key].includes(v) ? s[key].filter((x) => x !== v) : [...s[key], v] });
  const activeCount = s.sizes.length + s.colours.length + (s.price !== "any" ? 1 : 0);
  const clear = () => set({ sizes: [], colours: [], price: "any", q: "" });

  return (
    <div className="mx-auto max-w-[1600px] px-4 md:px-8">
      <header className="pb-8 pt-12 md:pt-20">
        <p className="eyebrow text-muted-foreground">Ciao Central</p>
        <h1 className="mt-3 text-7xl md:text-[10rem]">{s.q ? `"${s.q}"` : "The Shop"}</h1>
      </header>

      <div className="sticky top-16 z-30 -mx-4 border-b bg-background/95 px-4 backdrop-blur md:top-20 md:-mx-8 md:px-8">
        <nav aria-label="Categories" className="flex gap-6 overflow-x-auto py-4">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => set({ category: c.value })}
              aria-pressed={s.category === c.value}
              className={cn("eyebrow shrink-0 py-1", s.category === c.value ? "border-b border-foreground" : "text-muted-foreground hover:text-foreground")}
            >
              {c.label}
            </button>
          ))}
        </nav>
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
          <div className="flex flex-1 items-center gap-3">
            <label htmlFor="shop-q" className="sr-only">Search products</label>
            <input
              id="shop-q"
              type="search"
              defaultValue={s.q}
              key={s.q}
              onKeyDown={(e) => e.key === "Enter" && set({ q: e.currentTarget.value })}
              onBlur={(e) => e.currentTarget.value !== s.q && set({ q: e.currentTarget.value })}
              placeholder="Search"
              className="h-10 w-full max-w-xs border-b border-input bg-transparent text-sm placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
            />
          </div>
          <button onClick={() => setFiltersOpen((o) => !o)} aria-expanded={filtersOpen} className="eyebrow flex items-center gap-2 py-2">
            <SlidersHorizontal className="size-4" /> Filters{activeCount ? ` (${activeCount})` : ""}
          </button>
          <label className="eyebrow flex items-center gap-2">
            <span className="sr-only sm:not-sr-only">Sort</span>
            <select value={sort} onChange={(e) => set({ sort: e.target.value })} className="border-b border-input bg-transparent py-2 text-xs">
              <option value="newest">Newest</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </label>
        </div>

        {filtersOpen && (
          <div className="reveal grid gap-8 border-t py-6 md:grid-cols-3">
            <fieldset>
              <legend className="eyebrow mb-3 text-muted-foreground">Price</legend>
              <div className="flex flex-col gap-2">
                {PRICE_RANGES.map((r) => (
                  <label key={r.value} className="flex items-center gap-2 text-sm">
                    <input type="radio" name="price" checked={s.price === r.value} onChange={() => set({ price: r.value })} className="accent-foreground" />
                    {r.label}
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="eyebrow mb-3 text-muted-foreground">Size</legend>
              <div className="flex flex-wrap gap-2">
                {facets.data?.sizes.map((sz) => (
                  <button key={sz} aria-pressed={s.sizes.includes(sz)} onClick={() => toggle("sizes", sz)}
                    className={cn("h-10 min-w-12 border px-3 text-xs font-semibold", s.sizes.includes(sz) ? "bg-primary text-primary-foreground" : "hover:border-foreground")}>
                    {sz}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="eyebrow mb-3 text-muted-foreground">Colour</legend>
              <div className="flex flex-wrap gap-2">
                {facets.data?.colours.map((c) => (
                  <button key={c.name} aria-pressed={s.colours.includes(c.name)} onClick={() => toggle("colours", c.name)}
                    className={cn("flex h-10 items-center gap-2 border px-3 text-xs font-semibold", s.colours.includes(c.name) ? "border-foreground ring-1 ring-foreground" : "hover:border-foreground")}>
                    <span className="size-4 rounded-full border" style={{ background: c.hex }} aria-hidden="true" />
                    {c.name}
                  </button>
                ))}
              </div>
            </fieldset>
            {activeCount > 0 && (
              <button onClick={clear} className="eyebrow flex items-center gap-1 justify-self-start text-muted-foreground hover:text-foreground">
                <X className="size-3" /> Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      <section className="py-10 pb-24" aria-live="polite" aria-busy={products.isPending}>
        {products.isPending ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : products.isError ? (
          <div className="py-24 text-center">
            <p className="font-display text-5xl uppercase">Couldn't load products</p>
            <p className="mt-3 text-muted-foreground">Please check your connection and try again.</p>
            <button onClick={() => products.refetch()} className="btn btn-solid mt-8">Retry</button>
          </div>
        ) : products.data.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-display text-5xl uppercase">No matches</p>
            <p className="mt-3 text-muted-foreground">Try a different search or clear your filters.</p>
            <button onClick={() => { clear(); set({ category: "all" }); }} className="btn btn-outline mt-8">Reset</button>
          </div>
        ) : (
          <>
            <p className="eyebrow mb-6 text-muted-foreground">{products.data.length} {products.data.length === 1 ? "product" : "products"}</p>
            <ProductGrid products={products.data} />
          </>
        )}
        <p className="mt-16 text-center text-xs text-muted-foreground">
          Items marked SAMPLE are placeholders. <Link to="/support" className="underline">Delivery & returns</Link>
        </p>
      </section>
    </div>
  );
}
