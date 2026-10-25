import { queryOptions } from "@tanstack/react-query";
import { SAMPLE_PRODUCTS } from "./sample-data";
import type { Product, ProductQuery, StockStatus } from "./types";

export * from "./types";

/**
 * Catalog data layer. Every read goes through these async functions so the
 * sample source can be swapped for a database query without touching UI code.
 */
export const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "tees", label: "T-Shirts" },
  { value: "hoodies", label: "Hoodies" },
  { value: "pants", label: "Pants" },
  { value: "denim", label: "Denim" },
  { value: "accessories", label: "Accessories" },
  { value: "jewellery", label: "Chains & Bracelets" },
  { value: "footwear", label: "Shoes & Sandals" },
  { value: "traditional", label: "Traditional Attire" },
];

export async function listProducts(query: ProductQuery = {}): Promise<Product[]> {
  let items = [...SAMPLE_PRODUCTS];
  const q = query.q?.trim().toLowerCase();
  if (q) items = items.filter((p) => `${p.name} ${p.description} ${p.category}`.toLowerCase().includes(q));
  if (query.category && query.category !== "all") items = items.filter((p) => p.category === query.category);
  const { collection, minPrice, maxPrice, sizes, colours } = query;
  if (collection) items = items.filter((p) => p.collections.includes(collection));
  if (minPrice != null) items = items.filter((p) => p.price >= minPrice);
  if (maxPrice != null) items = items.filter((p) => p.price <= maxPrice);
  if (sizes?.length)
    items = items.filter((p) =>
      p.variants.some((v) => sizes.includes(v.size) && v.stock !== "sold_out"),
    );
  if (colours?.length) items = items.filter((p) => p.colours.some((c) => colours.includes(c.name)));
  const sort = query.sort ?? "newest";
  items.sort((a, b) =>
    sort === "price-asc" ? a.price - b.price : sort === "price-desc" ? b.price - a.price : b.createdAt.localeCompare(a.createdAt),
  );
  return query.limit ? items.slice(0, query.limit) : items;
}

/** Default variant for quick-add: first colour, size M if available, else first in-stock size. */
export function quickAddVariant(p: Product) {
  const colour = p.colours[0]?.name;
  const avail = p.variants.filter((v) => v.colour === colour && v.stock !== "sold_out");
  return avail.find((v) => v.size === "M") ?? avail[0] ?? null;
}

/** One-size items (caps, socks, scarves) arrive pre-picked so they can be bagged at once. */
export function defaultSize(p: Product): string | null {
  return p.sizes.length === 1 ? (p.sizes[0] ?? null) : null;
}

/** Products created within `days` of the newest product get a NEW tag. */
export function isNew(p: Product, all: Product[], days = 14): boolean {
  const newest = Math.max(...all.map((x) => Date.parse(x.createdAt)));
  return newest - Date.parse(p.createdAt) <= days * 86400000;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return SAMPLE_PRODUCTS.find((p) => p.slug === slug) ?? null;
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  return SAMPLE_PRODUCTS.filter((p) => p.id !== product.id).slice(0, limit);
}

export async function getFilterFacets() {
  const sizes = Array.from(new Set(SAMPLE_PRODUCTS.flatMap((p) => p.sizes)));
  const colours = Array.from(
    new Map(SAMPLE_PRODUCTS.flatMap((p) => p.colours).map((c) => [c.name, c])).values(),
  );
  return { sizes, colours };
}

export function productStock(p: Product): StockStatus {
  if (p.variants.every((v) => v.stock === "sold_out")) return "sold_out";
  if (p.variants.filter((v) => v.stock === "in_stock").length <= 1) return "low";
  return "in_stock";
}

export const STOCK_LABEL: Record<StockStatus, string> = {
  in_stock: "In stock",
  low: "Low stock",
  sold_out: "Sold out",
};

export const productsQuery = (query: ProductQuery = {}) =>
  queryOptions({ queryKey: ["products", query], queryFn: () => listProducts(query) });

export const productQuery = (slug: string) =>
  queryOptions({ queryKey: ["product", slug], queryFn: () => getProductBySlug(slug) });

export const relatedQuery = (product: Product) =>
  queryOptions({ queryKey: ["related", product.id], queryFn: () => getRelatedProducts(product) });

export const facetsQuery = () => queryOptions({ queryKey: ["facets"], queryFn: getFilterFacets });
