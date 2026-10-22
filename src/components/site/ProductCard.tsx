import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { productStock, quickAddVariant, STOCK_LABEL, type Product } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { formatKSh } from "@/lib/format";
import { cn } from "@/lib/utils";

export function ProductCard({ product, priority = false, isNew = false }: { product: Product; priority?: boolean; isNew?: boolean }) {
  const stock = productStock(product);
  const { add } = useCart();
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  const quickAdd = () => {
    const v = quickAddVariant(product);
    if (!v) {
      toast.error("Sold out");
      return;
    }
    add({
      sku: v.sku, productId: product.id, slug: product.slug, name: product.name,
      image: product.images[0] ?? "", price: product.price, size: v.size, colour: v.colour, quantity: 1,
    });
    toast.success(`Added ${product.name} (${v.colour}, ${v.size})`);
  };

  return (
    <div className="group">
      <div className={cn("relative aspect-[4/5] overflow-hidden bg-muted", !loaded && "shimmer")}>
        <Link to="/product/$slug" params={{ slug: product.slug }} aria-label={product.name} className="absolute inset-0">
          <img
            ref={imgRef}
            src={product.images[0]}
            alt={product.name}
            width={896}
            height={1120}
            loading={priority ? "eager" : "lazy"}
            onLoad={() => setLoaded(true)}
            className={cn("img-zoom absolute inset-0 size-full object-cover transition-opacity duration-500 group-hover:scale-105", loaded ? "opacity-100" : "opacity-0")}
          />
        </Link>
        <div className="pointer-events-none absolute left-2 top-2 flex flex-wrap gap-1">
          {isNew && <span className="eyebrow bg-gold px-2 py-1 text-[10px] text-ink">New</span>}
          {stock !== "in_stock" && <span className="eyebrow bg-ink px-2 py-1 text-[10px] text-ink-foreground">{STOCK_LABEL[stock]}</span>}
        </div>
        {stock !== "sold_out" && (
          <button
            onClick={quickAdd}
            aria-label={`Quick add ${product.name}`}
            className="absolute bottom-2 right-2 grid size-11 place-items-center rounded-full bg-background text-foreground shadow-md transition-colors hover:bg-gold hover:text-ink"
          >
            <Plus className="size-5" />
          </button>
        )}
      </div>
      <Link to="/product/$slug" params={{ slug: product.slug }} className="mt-3 block">
        <h3 className="font-sans text-sm font-semibold normal-case leading-snug tracking-normal">{product.name}</h3>
        <p className="mt-1 text-sm">{formatKSh(product.price)}</p>
        {product.isSample && <p className="mt-0.5 text-[11px] text-muted-foreground">Sample product</p>}
      </Link>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="shimmer aspect-[4/5]" />
      <div className="shimmer mt-4 h-4 w-2/3" />
      <div className="shimmer mt-2 h-3 w-1/3" />
    </div>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 xl:grid-cols-4">
      {products.map((p, i) => (
        <li key={p.id} className="reveal" style={{ animationDelay: `${i * 60}ms` }}>
          <ProductCard product={p} priority={i < 2} />
        </li>
      ))}
    </ul>
  );
}
