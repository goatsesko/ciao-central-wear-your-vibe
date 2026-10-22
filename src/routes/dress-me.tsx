import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, Repeat, Share2, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { productsQuery, type Product } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { formatKSh } from "@/lib/format";
import { cn } from "@/lib/utils";
import { BUDGETS, DRESS_ME_SIZES, QUICK_CHIPS, eligibleProducts, type Outfit } from "@/lib/dress-me/logic";
import { recordChosenOutfit, styleMe } from "@/lib/dress-me/dress-me.functions";

const SIZE_KEY = "ciao-dressme-size";

export const Route = createFileRoute("/dress-me")({
  validateSearch: z.object({ look: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Dress Me — AI Stylist | Ciao Central" },
      { name: "description", content: "Tell us where you're going and our AI stylist builds complete Ciao Central outfits in your size and budget." },
      { property: "og:title", content: "Dress Me — Ciao Central AI Stylist" },
      { property: "og:description", content: "Complete looks from our own catalogue, styled for your plans." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery()),
  component: DressMe,
});

type Phase = "input" | "loading" | "results";

function DressMe() {
  const { data: products } = useSuspenseQuery(productsQuery());
  const { look } = Route.useSearch();
  const style = useServerFn(styleMe);
  const [text, setText] = useState("");
  const [size, setSize] = useState<string | null>(null);
  const [budget, setBudget] = useState(0);
  const [phase, setPhase] = useState<Phase>("input");
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);

  useEffect(() => {
    const s = localStorage.getItem(SIZE_KEY);
    if (s) setSize(s);
  }, []);
  const pickSize = (s: string) => {
    const next = size === s ? null : s;
    setSize(next);
    if (next) localStorage.setItem(SIZE_KEY, next);
    else localStorage.removeItem(SIZE_KEY);
  };

  const byId = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);
  const sharedLook = useMemo(() => {
    const ids = (look ?? "").split(",").filter((id) => byId.has(id));
    return ids.length ? ids : null;
  }, [look, byId]);

  const run = async () => {
    if (text.trim().length < 2) {
      toast.error("Tell us where you're going first.");
      return;
    }
    setPhase("loading");
    setError(null);
    try {
      const res = await style({ data: { request: text.trim(), size: (size as never) ?? null, budget: budget || null } });
      if (!res.ok) {
        setError(res.error);
        setPhase("input");
        return;
      }
      setOutfits(res.outfits);
      setNote(res.note);
      setRequestId(res.requestId);
      setPhase("results");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("Something went wrong building your looks. Please try again.");
      setPhase("input");
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-10 md:px-8 md:pt-16">
      <p className="eyebrow text-gold">Dress Me · AI Stylist</p>

      {sharedLook && phase === "input" && (
        <section className="reveal mt-6">
          <h2 className="text-4xl">A look shared with you</h2>
          <div className="mt-4">
            <OutfitCard outfit={{ name: "Shared look", reason: "Styled by Ciao Central's Dress Me.", productIds: sharedLook }} byId={byId} alternatives={() => []} size={size} requestId={null} index={0} />
          </div>
        </section>
      )}

      {phase !== "results" ? (
        <section className="mt-6">
          <h1 className="text-6xl leading-[0.9] md:text-8xl">Tell us where you're going.</h1>
          <label htmlFor="dm-text" className="sr-only">Where are you going?</label>
          <textarea
            id="dm-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={300}
            rows={4}
            disabled={phase === "loading"}
            placeholder="e.g. date night in Westlands, church on Sunday, campus day"
            className="mt-8 w-full resize-none border border-input bg-transparent p-4 text-base placeholder:text-muted-foreground"
          />
          <div className="mt-4 flex flex-wrap gap-2">
            {QUICK_CHIPS.map((c) => (
              <button key={c} type="button" onClick={() => setText(c)} disabled={phase === "loading"}
                className={cn("eyebrow min-h-11 border px-4 text-[11px] transition-colors hover:border-gold", text === c && "border-foreground bg-foreground text-background")}>
                {c}
              </button>
            ))}
          </div>

          <fieldset className="mt-8">
            <legend className="eyebrow text-muted-foreground">Size <span className="normal-case tracking-normal">(optional)</span></legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {DRESS_ME_SIZES.map((s) => (
                <button key={s} type="button" aria-pressed={size === s} onClick={() => pickSize(s)}
                  className={cn("grid size-11 place-items-center border text-sm font-semibold", size === s && "border-foreground bg-foreground text-background")}>
                  {s}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-6">
            <legend className="eyebrow text-muted-foreground">Budget per look</legend>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {BUDGETS.map((b) => (
                <button key={b.value} type="button" aria-pressed={budget === b.value} onClick={() => setBudget(b.value)}
                  className={cn("min-h-11 border px-2 text-xs font-semibold", budget === b.value && "border-foreground bg-foreground text-background")}>
                  {b.label}
                </button>
              ))}
            </div>
          </fieldset>

          {error && (
            <div role="alert" className="mt-6 border border-gold p-4 text-sm">
              {error}
            </div>
          )}

          <button onClick={run} disabled={phase === "loading"} className="btn btn-solid mt-8 w-full">
            <Sparkles className="size-4" /> {phase === "loading" ? "Building your looks..." : error ? "Try again" : "Style me"}
          </button>

          {phase === "loading" && (
            <div className="mt-10 space-y-6" aria-live="polite">
              <p className="eyebrow text-center text-muted-foreground">Building your looks...</p>
              {[0, 1, 2].map((i) => <OutfitSkeleton key={i} />)}
            </div>
          )}
        </section>
      ) : (
        <section className="mt-6">
          <h1 className="text-5xl md:text-7xl">Your looks</h1>
          <p className="mt-2 text-sm text-muted-foreground">For “{text}”{size ? ` · Size ${size}` : ""}{budget ? ` · Under ${formatKSh(budget)}` : ""}</p>
          {note && <p className="mt-6 border-l-2 border-gold pl-4 text-sm">{note}</p>}
          <div className="mt-8 space-y-8">
            {outfits.map((o, i) => (
              <OutfitCard
                key={`${o.name}-${i}`}
                outfit={o}
                byId={byId}
                size={size}
                requestId={requestId}
                index={i}
                alternatives={(p) =>
                  eligibleProducts(products, size, budget || null).filter((x) => x.tags.category === p.tags.category && x.id !== p.id)
                }
              />
            ))}
          </div>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <button onClick={run} className="btn btn-solid flex-1"><Repeat className="size-4" /> Try something different</button>
            <button onClick={() => setPhase("input")} className="btn btn-outline flex-1"><ArrowLeft className="size-4" /> Edit request</button>
          </div>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Looks use only items from our <Link to="/shop" className="underline">shop</Link>, in stock in your size.
          </p>
        </section>
      )}
    </div>
  );
}

function OutfitSkeleton() {
  return (
    <div aria-hidden="true" className="border p-4">
      <div className="shimmer h-6 w-1/2" />
      <div className="shimmer mt-2 h-4 w-3/4" />
      <div className="mt-4 grid grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => <div key={i} className="shimmer aspect-[4/5]" />)}
      </div>
    </div>
  );
}

function pickVariant(p: Product, size: string | null) {
  const ok = p.variants.filter((v) => v.stock !== "sold_out");
  return ok.find((v) => v.size === size) ?? ok.find((v) => v.size === "One size") ?? ok.find((v) => v.size === "M") ?? ok[0] ?? null;
}

function OutfitCard({ outfit, byId, alternatives, size, requestId, index }: {
  outfit: Outfit; byId: Map<string, Product>; alternatives: (p: Product) => Product[];
  size: string | null; requestId: string | null; index: number;
}) {
  const { add, setOpen } = useCart();
  const record = useServerFn(recordChosenOutfit);
  const [ids, setIds] = useState(outfit.productIds);
  const [swapping, setSwapping] = useState<string | null>(null);
  const items = ids.map((id) => byId.get(id)).filter((p): p is Product => !!p);
  const total = items.reduce((s, p) => s + p.price, 0);

  const addAll = () => {
    let added = 0;
    for (const p of items) {
      const v = pickVariant(p, size);
      if (!v) continue;
      add({ sku: v.sku, productId: p.id, slug: p.slug, name: p.name, image: p.images[0] ?? "", price: p.price, size: v.size, colour: v.colour, quantity: 1 });
      added++;
    }
    if (!added) return toast.error("These pieces just sold out.");
    toast.success(`${outfit.name} added to your bag`);
    setOpen(true);
    if (requestId) record({ data: { requestId, outfit: { name: outfit.name, productIds: ids } } }).catch(() => {});
  };

  const share = async () => {
    const url = `${window.location.origin}/dress-me?look=${ids.join(",")}`;
    const msg = `My Ciao Central look: ${outfit.name} — ${items.map((p) => p.name).join(" + ")} (${formatKSh(total)})`;
    if (navigator.share) {
      try { await navigator.share({ title: outfit.name, text: msg, url }); return; } catch { return; }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(`${msg} ${url}`)}`, "_blank", "noopener");
  };
  const copyForInstagram = async () => {
    const url = `${window.location.origin}/dress-me?look=${ids.join(",")}`;
    try { await navigator.clipboard.writeText(url); toast.success("Link copied — paste it into your Instagram story or DM."); }
    catch { toast.error("Couldn't copy the link."); }
  };

  return (
    <article className="reveal border p-4 md:p-6" style={{ animationDelay: `${index * 120}ms` }}>
      <p className="eyebrow text-muted-foreground">Look {index + 1}</p>
      <h2 className="mt-1 text-4xl md:text-5xl">{outfit.name}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{outfit.reason}</p>

      <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map((p) => {
          const alts = alternatives(p);
          return (
            <li key={p.id}>
              <Link to="/product/$slug" params={{ slug: p.slug }} className="block aspect-[4/5] overflow-hidden bg-muted">
                <img src={p.images[0]} alt={p.name} loading="lazy" className="size-full object-cover" />
              </Link>
              <p className="mt-2 text-xs font-semibold leading-snug">{p.name}</p>
              <p className="text-xs">{formatKSh(p.price)}</p>
              {alts.length > 0 && (
                <button onClick={() => setSwapping(swapping === p.id ? null : p.id)} className="eyebrow mt-1 min-h-11 text-[10px] underline-offset-4 hover:underline">
                  Swap
                </button>
              )}
              {swapping === p.id && (
                <ul className="mt-1 space-y-1 border p-2">
                  {alts.map((a) => (
                    <li key={a.id}>
                      <button
                        className="flex min-h-11 w-full items-center gap-2 text-left text-xs hover:text-gold"
                        onClick={() => { setIds((cur) => cur.map((x) => (x === p.id ? a.id : x))); setSwapping(null); }}
                      >
                        <img src={a.images[0]} alt="" className="size-9 object-cover" />
                        <span className="flex-1">{a.name}<br />{formatKSh(a.price)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>

      <div className="mt-5 flex items-baseline justify-between border-t pt-4">
        <span className="eyebrow text-muted-foreground">Total</span>
        <span className="text-lg font-semibold">{formatKSh(total)}</span>
      </div>
      <button onClick={addAll} className="btn btn-solid mt-4 w-full">Add whole look to cart</button>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button onClick={share} className="btn btn-outline text-xs"><Share2 className="size-4" /> Share this look</button>
        <button onClick={copyForInstagram} className="btn btn-outline text-xs">Copy for Instagram</button>
      </div>
    </article>
  );
}
