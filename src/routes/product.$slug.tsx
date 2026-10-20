import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { productQuery, relatedQuery, STOCK_LABEL, type StockStatus } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { formatKSh, STORE } from "@/lib/format";
import { ProductGrid } from "@/components/site/ProductCard";
import { QtyControl } from "@/components/site/CartDrawer";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$slug")({
  loader: async ({ context, params }) => {
    const product = await context.queryClient.ensureQueryData(productQuery(params.slug));
    if (!product) throw notFound();
    await context.queryClient.ensureQueryData(relatedQuery(product));
    return { name: product.name, description: product.description, price: product.price };
  },
  head: ({ params, loaderData }) =>
    loaderData
      ? {
          meta: [
            { title: `${loaderData.name} — ${formatKSh(loaderData.price)} | Ciao Central` },
            { name: "description", content: loaderData.description },
            { property: "og:title", content: `${loaderData.name} — Ciao Central` },
            { property: "og:description", content: loaderData.description },
            { property: "og:type", content: "product" },
          ],
          links: [{ rel: "canonical", href: `/product/${params.slug}` }],
        }
      : { meta: [{ title: "Product unavailable — Ciao Central" }, { name: "robots", content: "noindex" }] },
  notFoundComponent: () => (
    <div className="py-32 text-center">
      <h1 className="text-6xl">Product not found</h1>
      <Link to="/shop" className="btn btn-solid mt-8">Back to shop</Link>
    </div>
  ),
  component: ProductPage,
});

const stockClass: Record<StockStatus, string> = {
  in_stock: "text-success",
  low: "text-warning",
  sold_out: "text-destructive",
};

function ProductPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(productQuery(slug));
  const product = data!; // loader throws notFound() when missing
  const { data: related } = useSuspenseQuery(relatedQuery(product));
  const { add } = useCart();

  const [active, setActive] = useState(0);
  const [colour, setColour] = useState(product.colours[0]?.name ?? "");
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);

  const variant = size ? product.variants.find((v) => v.size === size && v.colour === colour) : undefined;
  const stock: StockStatus | undefined = variant?.stock;

  const addToBag = () => {
    if (!variant) {
      toast.error("Please choose a size.");
      return;
    }
    add({
      sku: variant.sku, productId: product.id, slug: product.slug, name: product.name,
      image: product.images[0] ?? "", price: product.price, size: variant.size, colour: variant.colour, quantity: qty,
    });
  };

  return (
    <>
      <div className="mx-auto grid max-w-[1600px] gap-10 md:grid-cols-[1.3fr_1fr] md:gap-16 md:px-8 md:py-10">
        {/* Gallery */}
        <div className="md:flex md:gap-4">
          <div className="order-2 hidden flex-col gap-3 md:flex">
            {product.images.map((img, i) => (
              <button key={img + i} onClick={() => setActive(i)} aria-label={`View image ${i + 1}`} aria-current={active === i}
                className={cn("w-20 overflow-hidden border-2", active === i ? "border-foreground" : "border-transparent opacity-60 hover:opacity-100")}>
                <img src={img} alt="" className="aspect-[4/5] object-cover" />
              </button>
            ))}
          </div>
          <div className="flex snap-x snap-mandatory overflow-x-auto md:block md:flex-1">
            {product.images.map((img, i) => (
              <img
                key={img + i}
                src={img}
                alt={`${product.name} — image ${i + 1}`}
                width={896}
                height={1152}
                loading={i === 0 ? "eager" : "lazy"}
                className={cn("aspect-[4/5] w-full shrink-0 snap-center bg-muted object-cover", i !== active && "md:hidden")}
              />
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="px-4 md:sticky md:top-28 md:self-start md:px-0">
          <nav aria-label="Breadcrumb" className="eyebrow text-muted-foreground">
            <Link to="/shop" className="link-underline">Shop</Link> / {product.category}
          </nav>
          {product.isSample && <p className="eyebrow mt-4 inline-block bg-secondary px-2 py-1">Sample product</p>}
          <h1 className="mt-4 text-5xl md:text-7xl">{product.name}</h1>
          <p className="mt-4 text-xl font-semibold">{formatKSh(product.price)}</p>
          <p className="mt-6 leading-relaxed text-muted-foreground">{product.description}</p>

          <fieldset className="mt-8">
            <legend className="eyebrow mb-3">Colour — <span className="text-muted-foreground">{colour}</span></legend>
            <div className="flex gap-3">
              {product.colours.map((c) => (
                <button key={c.name} onClick={() => setColour(c.name)} aria-label={c.name} aria-pressed={colour === c.name}
                  className={cn("size-10 rounded-full border-2 p-0.5", colour === c.name ? "border-foreground" : "border-transparent")}>
                  <span className="block size-full rounded-full border" style={{ background: c.hex }} />
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="mt-8">
            <div className="mb-3 flex justify-between">
              <legend className="eyebrow">Size</legend>
              <Link to="/support" hash="size-guide" className="eyebrow link-underline text-muted-foreground">Size guide</Link>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {product.sizes.map((sz) => {
                const v = product.variants.find((x) => x.size === sz && x.colour === colour);
                const sold = v?.stock === "sold_out";
                return (
                  <button key={sz} disabled={sold} onClick={() => setSize(sz)} aria-pressed={size === sz}
                    aria-label={`${sz}${sold ? ", sold out" : ""}`}
                    className={cn("h-12 border text-sm font-semibold transition-colors",
                      size === sz ? "bg-primary text-primary-foreground" : "hover:border-foreground",
                      sold && "cursor-not-allowed text-muted-foreground line-through")}>
                    {sz}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-2 text-sm">
            <p aria-live="polite">
              {stock ? <span className={cn("font-semibold", stockClass[stock])}>● {STOCK_LABEL[stock]}</span> : <span className="text-muted-foreground">Select a size to see availability</span>}
            </p>
            <p className="text-xs text-muted-foreground">SKU: {variant?.sku ?? "—"}</p>
          </div>

          <div className="mt-6 flex gap-3">
            <QtyControl value={qty} onChange={(n) => setQty(Math.max(1, n))} label={product.name} />
            <button onClick={addToBag} disabled={stock === "sold_out"} className="btn btn-solid flex-1">
              {stock === "sold_out" ? "Sold out" : "Add to bag"}
            </button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Free delivery over {formatKSh(STORE.freeDeliveryThreshold)} · M-Pesa accepted · {STORE.deliveryEstimate}
          </p>

          <ul className="mt-10 space-y-2 border-t pt-6 text-sm">
            {product.details.map((d) => <li key={d}>— {d}</li>)}
          </ul>
        </div>
      </div>

      <section className="mx-auto max-w-[1600px] px-4 py-24 md:px-8">
        <h2 className="mb-10 text-5xl md:text-7xl">You may also like</h2>
        <ProductGrid products={related} />
      </section>
    </>
  );
}
