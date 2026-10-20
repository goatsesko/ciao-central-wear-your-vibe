import { Link } from "@tanstack/react-router";
import { productStock, STOCK_LABEL, type Product } from "@/lib/catalog";
import { formatKSh } from "@/lib/format";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const stock = productStock(product);
  return (
    <Link to="/product/$slug" params={{ slug: product.slug }} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <img
          src={product.images[0]}
          alt={product.name}
          width={896}
          height={1152}
          loading={priority ? "eager" : "lazy"}
          className="img-zoom absolute inset-0 size-full object-cover group-hover:scale-105"
        />
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt=""
            loading="lazy"
            className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          />
        )}
        <div className="absolute left-3 top-3 flex gap-2">
          {product.isSample && <span className="eyebrow bg-background px-2 py-1 text-[10px]">Sample</span>}
          {stock !== "in_stock" && <span className="eyebrow bg-ink px-2 py-1 text-[10px] text-ink-foreground">{STOCK_LABEL[stock]}</span>}
        </div>
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-sans text-sm font-semibold normal-case tracking-normal leading-snug">{product.name}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{product.colours.map((c) => c.name).join(" / ")}</p>
        </div>
        <p className="text-sm font-semibold whitespace-nowrap">{formatKSh(product.price)}</p>
      </div>
    </Link>
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
