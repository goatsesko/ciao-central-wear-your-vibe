import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { deliveryFor } from "./format";

export type CartLine = {
  sku: string;
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  size: string;
  colour: string;
  quantity: number;
};

type CartCtx = {
  lines: CartLine[];
  open: boolean;
  setOpen: (o: boolean) => void;
  add: (line: CartLine) => void;
  remove: (sku: string) => void;
  clear: () => void;
  setQty: (sku: string, qty: number) => void;
  count: number;
  subtotal: number;
  delivery: number;
  total: number;
};

// Keep one context instance across hot reloads so provider and consumers never mismatch.
const g = globalThis as unknown as { __ciaoCartCtx?: React.Context<CartCtx | null> };
const Ctx = (g.__ciaoCartCtx ??= createContext<CartCtx | null>(null));
const KEY = "ciao-central-bag-v1";
export const MAX_QTY = 10;

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(KEY, JSON.stringify(lines));
  }, [lines, loaded]);

  const add = useCallback((line: CartLine) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.sku === line.sku);
      if (existing)
        return prev.map((l) => (l.sku === line.sku ? { ...l, quantity: Math.min(MAX_QTY, l.quantity + line.quantity) } : l));
      return [...prev, line];
    });
    setOpen(true);
  }, []);

  const remove = useCallback((sku: string) => setLines((p) => p.filter((l) => l.sku !== sku)), []);
  const clear = useCallback(() => setLines([]), []);
  const setQty = useCallback(
    (sku: string, qty: number) =>
      setLines((p) => (qty <= 0 ? p.filter((l) => l.sku !== sku) : p.map((l) => (l.sku === sku ? { ...l, quantity: Math.min(MAX_QTY, qty) } : l)))),
    [],
  );

  const value = useMemo(() => {
    const subtotal = lines.reduce((s, l) => s + l.price * l.quantity, 0);
    const delivery = deliveryFor(subtotal);
    return {
      lines, open, setOpen, add, remove, clear, setQty,
      count: lines.reduce((s, l) => s + l.quantity, 0),
      subtotal, delivery, total: subtotal + delivery,
    };
  }, [lines, open, add, remove, clear, setQty]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}
