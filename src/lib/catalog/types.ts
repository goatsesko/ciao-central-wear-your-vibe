export type StockStatus = "in_stock" | "low" | "sold_out";

export type Colour = { name: string; hex: string };

export type Variant = {
  sku: string;
  size: string;
  colour: string;
  stock: StockStatus;
};

export type Category = "tees" | "denim" | "outerwear" | "accessories";

export type Product = {
  id: string;
  slug: string;
  name: string;
  isSample: boolean;
  category: Category;
  collections: string[]; // e.g. "new", "bestseller", "signature-tees", "denim"
  price: number; // KSh, integer
  description: string;
  details: string[];
  images: string[];
  colours: Colour[];
  sizes: string[];
  variants: Variant[];
  createdAt: string; // ISO
};

export type SortKey = "newest" | "price-asc" | "price-desc";

export type ProductQuery = {
  q?: string;
  category?: string;
  sort?: SortKey;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colours?: string[];
  collection?: string;
  limit?: number;
};
