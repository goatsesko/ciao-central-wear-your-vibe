import teeBlack from "@/assets/tee-black.jpg";
import teeWhite from "@/assets/tee-white.jpg";
import denimBlack from "@/assets/denim-black.jpg";
import campaign1 from "@/assets/campaign-1.jpg";
import campaign2 from "@/assets/campaign-2.jpg";
import type { Product, StockStatus, Variant } from "./types";

const SIZES = ["S", "M", "L", "XL", "XXL"];

function variants(prefix: string, colour: string, stock: Record<string, StockStatus>): Variant[] {
  return SIZES.map((size) => ({
    sku: `${prefix}-${colour.slice(0, 3).toUpperCase()}-${size}`,
    size,
    colour,
    stock: stock[size] ?? "in_stock",
  }));
}

// SAMPLE catalogue — placeholder products, images and prices for layout only.
// Replace with real data (e.g. from the database) before launch.
export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "p1",
    slug: "sample-black-oversized-cc-tee",
    name: "Black Oversized CC T-Shirt",
    isSample: true,
    category: "tees",
    collections: ["new", "bestseller", "signature-tees"],
    price: 2500,
    description:
      "Sample product. A heavyweight oversized tee with a dropped shoulder and a tonal CC monogram on the chest.",
    details: ["Sample description — replace with real fabric details", "Oversized fit", "Embroidered CC monogram"],
    images: [teeBlack, campaign2],
    colours: [{ name: "Black", hex: "#111111" }],
    sizes: SIZES,
    variants: variants("CC-TEE-OVS", "Black", { XXL: "low" }),
    createdAt: "2026-10-15T00:00:00Z",
  },
  {
    id: "p2",
    slug: "sample-white-signature-tee",
    name: "White Signature T-Shirt",
    isSample: true,
    category: "tees",
    collections: ["new", "signature-tees"],
    price: 2200,
    description: "Sample product. A clean, everyday signature tee in white with a relaxed cut.",
    details: ["Sample description — replace with real fabric details", "Relaxed fit", "Ribbed crew neck"],
    images: [teeWhite, campaign1],
    colours: [{ name: "White", hex: "#f5f5f2" }],
    sizes: SIZES,
    variants: variants("CC-TEE-SIG", "White", { S: "low", XXL: "sold_out" }),
    createdAt: "2026-10-10T00:00:00Z",
  },
  {
    id: "p3",
    slug: "sample-black-denim-overshirt",
    name: "Black Denim Overshirt",
    isSample: true,
    category: "denim",
    collections: ["new", "bestseller", "denim"],
    price: 5500,
    description: "Sample product. A washed black denim overshirt with silver snaps and twin chest pockets.",
    details: ["Sample description — replace with real fabric details", "Silver-tone snap buttons", "Twin flap pockets"],
    images: [denimBlack, campaign2],
    colours: [{ name: "Black", hex: "#1c1c1c" }],
    sizes: SIZES,
    variants: variants("CC-DNM-OVR", "Black", { S: "sold_out", M: "low" }),
    createdAt: "2026-10-05T00:00:00Z",
  },
];
