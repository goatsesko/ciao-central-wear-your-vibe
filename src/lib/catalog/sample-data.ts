import teeBlack from "@/assets/tee-black.jpg";
import teeWhite from "@/assets/tee-white.jpg";
import denimBlack from "@/assets/denim-black.jpg";
import hoodieBlack from "@/assets/hoodie-black.jpg";
import pantsCargo from "@/assets/pants-cargo.jpg";
import accessoriesCap from "@/assets/accessories-cap.jpg";
import campaign1 from "@/assets/campaign-1.jpg";
import campaign2 from "@/assets/campaign-2.jpg";
import type { Colour, Product, StockStatus, Variant } from "./types";

const SIZES = ["S", "M", "L", "XL", "XXL"];

const BLACK: Colour = { name: "Black", hex: "#111111" };
const WHITE: Colour = { name: "White", hex: "#f5f5f2" };
const CHARCOAL: Colour = { name: "Charcoal", hex: "#3a3a3a" };
const SAND: Colour = { name: "Sand", hex: "#cbbfa8" };

function variants(prefix: string, colours: Colour[], stock: Record<string, StockStatus> = {}, sizes = SIZES): Variant[] {
  return colours.flatMap((c) =>
    sizes.map((size) => ({
      sku: `${prefix}-${c.name.slice(0, 3).toUpperCase()}-${size}`,
      size,
      colour: c.name,
      stock: stock[`${c.name}-${size}`] ?? stock[size] ?? "in_stock",
    })),
  );
}

// SAMPLE catalogue — placeholder products, images and prices for layout only.
// Replace with real data (e.g. from the database) before launch.
export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "p1", slug: "sample-black-oversized-cc-tee", name: "Black Oversized CC T-Shirt", isSample: true,
    category: "tees", collections: ["new", "bestseller"], price: 2800,
    description: "Sample product. A heavyweight oversized tee with a dropped shoulder and a tonal CC monogram on the chest.",
    details: ["Sample description — replace with real fabric details", "Oversized fit", "Embroidered CC monogram"],
    images: [teeBlack, campaign2], colours: [BLACK, WHITE], sizes: SIZES,
    variants: variants("CC-TEE-OVS", [BLACK, WHITE], { XXL: "low" }), tags: { occasion: ["casual","campus","party","date"], vibe: ["streetwear","bold"], color: ["black","white"], fit: "oversized", season: "all-year", category: "top" },
    createdAt: "2026-10-20T00:00:00Z",
  },
  {
    id: "p2", slug: "sample-white-signature-tee", name: "White Signature T-Shirt", isSample: true,
    category: "tees", collections: ["new"], price: 2500,
    description: "Sample product. A clean, everyday signature tee in white with a relaxed cut.",
    details: ["Sample description — replace with real fabric details", "Relaxed fit", "Ribbed crew neck"],
    images: [teeWhite, campaign1], colours: [WHITE, BLACK], sizes: SIZES,
    variants: variants("CC-TEE-SIG", [WHITE, BLACK], { "White-XXL": "sold_out" }), tags: { occasion: ["casual","campus","church","work"], vibe: ["minimal","smart"], color: ["white","black"], fit: "relaxed", season: "all-year", category: "top" },
    createdAt: "2026-10-18T00:00:00Z",
  },
  {
    id: "p3", slug: "sample-cc-heavyweight-hoodie", name: "CC Heavyweight Hoodie", isSample: true,
    category: "hoodies", collections: ["new", "bestseller"], price: 6500,
    description: "Sample product. A brushed-fleece heavyweight hoodie with a boxy fit and gold CC embroidery.",
    details: ["Sample description — replace with real fabric details", "Boxy fit", "Gold embroidered monogram"],
    images: [hoodieBlack], colours: [BLACK, CHARCOAL], sizes: SIZES,
    variants: variants("CC-HD-HVY", [BLACK, CHARCOAL]), tags: { occasion: ["casual","campus","party"], vibe: ["streetwear","bold"], color: ["black","charcoal"], fit: "boxy", season: "cool evenings", category: "layer" },
    createdAt: "2026-10-16T00:00:00Z",
  },
  {
    id: "p4", slug: "sample-utility-cargo-pants", name: "Utility Cargo Pants", isSample: true,
    category: "pants", collections: ["new"], price: 4800,
    description: "Sample product. Relaxed straight-leg cargo pants in washed cotton twill with deep side pockets.",
    details: ["Sample description — replace with real fabric details", "Relaxed straight leg", "Six pockets"],
    images: [pantsCargo], colours: [CHARCOAL, BLACK, SAND], sizes: SIZES,
    variants: variants("CC-PNT-CRG", [CHARCOAL, BLACK, SAND]), tags: { occasion: ["casual","campus","party"], vibe: ["streetwear"], color: ["charcoal","black","sand"], fit: "relaxed", season: "all-year", category: "bottom" },
    createdAt: "2026-10-12T00:00:00Z",
  },
  {
    id: "p5", slug: "sample-black-denim-overshirt", name: "Black Denim Overshirt", isSample: true,
    category: "denim", collections: ["bestseller"], price: 5500,
    description: "Sample product. A washed black denim overshirt with silver snaps and twin chest pockets.",
    details: ["Sample description — replace with real fabric details", "Silver-tone snap buttons", "Twin flap pockets"],
    images: [denimBlack, campaign2], colours: [BLACK], sizes: SIZES,
    variants: variants("CC-DNM-OVR", [BLACK], { S: "sold_out" }), tags: { occasion: ["date","party","work","church"], vibe: ["smart","streetwear"], color: ["black"], fit: "regular", season: "all-year", category: "layer" },
    createdAt: "2026-09-28T00:00:00Z",
  },
  {
    id: "p6", slug: "sample-cc-zip-hoodie", name: "Off-White Zip Hoodie", isSample: true,
    category: "hoodies", collections: [], price: 7000,
    description: "Sample product. A full-zip hoodie in off-white loopback cotton with a tonal CC on the back.",
    details: ["Sample description — replace with real fabric details", "Full zip", "Kangaroo pockets"],
    images: [campaign1, teeWhite], colours: [WHITE, BLACK], sizes: SIZES,
    variants: variants("CC-HD-ZIP", [WHITE, BLACK]), tags: { occasion: ["casual","campus","date"], vibe: ["minimal","streetwear"], color: ["off-white","black"], fit: "relaxed", season: "cool evenings", category: "layer" },
    createdAt: "2026-09-20T00:00:00Z",
  },
  {
    id: "p7", slug: "sample-cc-dad-cap", name: "CC Dad Cap", isSample: true,
    category: "accessories", collections: ["new"], price: 1800,
    description: "Sample product. A six-panel cotton cap with a curved brim and small gold CC embroidery.",
    details: ["Sample description — replace with real fabric details", "Adjustable strap", "One size"],
    images: [accessoriesCap], colours: [BLACK], sizes: ["One size"],
    variants: variants("CC-ACC-CAP", [BLACK], {}, ["One size"]), tags: { occasion: ["casual","campus","party"], vibe: ["streetwear"], color: ["black"], fit: "one size", season: "all-year", category: "accessory" },
    createdAt: "2026-10-14T00:00:00Z",
  },
  {
    id: "p8", slug: "sample-cc-canvas-tote", name: "CC Canvas Tote", isSample: true,
    category: "accessories", collections: [], price: 2000,
    description: "Sample product. A heavy canvas tote with long handles and an embroidered CC.",
    details: ["Sample description — replace with real fabric details", "Inner pocket", "One size"],
    images: [accessoriesCap], colours: [BLACK], sizes: ["One size"],
    variants: variants("CC-ACC-TOT", [BLACK], {}, ["One size"]), tags: { occasion: ["casual","campus","work"], vibe: ["minimal"], color: ["black"], fit: "one size", season: "all-year", category: "accessory" },
    createdAt: "2026-09-10T00:00:00Z",
  },
  {
    id: "p9", slug: "sample-black-straight-jeans", name: "Black Straight-Leg Jeans", isSample: true,
    category: "denim", collections: ["new"], price: 4500,
    description: "Sample product. Washed black straight-leg jeans with a mid rise and a clean hem.",
    details: ["Sample description — replace with real fabric details", "Straight leg", "Five pockets"],
    images: [denimBlack], colours: [BLACK], sizes: SIZES,
    variants: variants("CC-DNM-JNS", [BLACK]),
    tags: { occasion: ["date","party","casual","church","work"], vibe: ["smart","minimal","streetwear"], color: ["black"], fit: "straight", season: "all-year", category: "bottom" },
    createdAt: "2026-10-10T00:00:00Z",
  },
  {
    id: "p10", slug: "sample-charcoal-tailored-trousers", name: "Charcoal Tailored Trousers", isSample: true,
    category: "pants", collections: [], price: 5200,
    description: "Sample product. Relaxed tailored trousers in charcoal with a pressed crease.",
    details: ["Sample description — replace with real fabric details", "Relaxed tailored fit", "Side pockets"],
    images: [pantsCargo], colours: [CHARCOAL, BLACK], sizes: SIZES,
    variants: variants("CC-PNT-TLR", [CHARCOAL, BLACK]),
    tags: { occasion: ["work","church","date"], vibe: ["smart","minimal"], color: ["charcoal","black"], fit: "tailored", season: "all-year", category: "bottom" },
    createdAt: "2026-09-25T00:00:00Z",
  },
];
