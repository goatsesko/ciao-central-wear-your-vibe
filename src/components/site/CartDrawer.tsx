import { Link } from "@tanstack/react-router";
import { Minus, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { productsQuery, setPriceBreakdown } from "@/lib/catalog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { MAX_QTY, useCart } from "@/lib/cart";
import { formatKSh, STORE } from "@/lib/format";

export function CartDrawer() {
  const { lines, open, setOpen, remove, setQty, subtotal, delivery, total } = useCart();
  const toFree = STORE.freeDeliveryThreshold - subtotal;
  const { data: products = [] } = useQuery({ ...productsQuery(), enabled: open });

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b p-6">
          <SheetTitle className="font-display text-3xl uppercase">Your Bag</SheetTitle>
          <SheetDescription>
            {lines.length === 0
              ? "Your bag is empty."
              : toFree > 0
                ? `Add ${formatKSh(toFree)} more for free delivery.`
                : "You've unlocked free delivery."}
          </SheetDescription>
          {lines.length > 0 && (
            <div className="mt-2 h-0.5 w-full bg-muted" aria-hidden="true">
              <div className="h-full bg-gold transition-all duration-700" style={{ width: `${Math.min(100, (subtotal / STORE.freeDeliveryThreshold) * 100)}%` }} />
            </div>
          )}
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6 text-center">
            <p className="font-display text-5xl uppercase text-muted-foreground">Nothing here yet</p>
            <Link to="/shop" onClick={() => setOpen(false)} className="btn btn-solid">Shop the collection</Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y overflow-y-auto px-6">
              {lines.map((l) => {
                const product = products.find((p) => p.id === l.productId);
                const breakdown = product ? setPriceBreakdown(product, l.quantity) : [];
                return (
                <li key={l.sku} className="flex gap-4 py-5">
                  <img src={l.image} alt={l.name} width={80} height={104} className="h-26 w-20 bg-muted object-cover" />
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <Link to="/product/$slug" params={{ slug: l.slug }} onClick={() => setOpen(false)} className="text-sm font-semibold link-underline">
                        {l.name}
                      </Link>
                      <button aria-label={`Remove ${l.name}`} onClick={() => { remove(l.sku); toast(`Removed ${l.name}`); }} className="p-1 text-muted-foreground hover:text-foreground">
                        <X className="size-4" />
                      </button>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{l.colour} · {l.size} · {l.sku}</p>
                     {breakdown.length > 0 && (
                       <div className="mt-3 border-y py-3">
                         <p className="eyebrow mb-2">Included pieces</p>
                         <ul className="space-y-2 text-xs" aria-label={`Price breakdown for ${l.name}`}>
                           {breakdown.map((item) => (
                             <li key={item.name} className="flex flex-wrap justify-between gap-x-2 gap-y-1">
                               <span className="min-w-0 flex-1 text-muted-foreground">
                                 {item.name}<span className="block">{item.quantity} × {formatKSh(item.unitPrice)}</span>
                               </span>
                               <span className="shrink-0 font-semibold">{formatKSh(item.total)}</span>
                             </li>
                           ))}
                         </ul>
                         {product?.isSample && <p className="mt-2 text-xs text-muted-foreground">Sample prices · bracelet KSh 500 each</p>}
                       </div>
                     )}
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <QtyControl value={l.quantity} onChange={(q) => setQty(l.sku, q)} label={l.name} />
                      <span className="text-sm font-semibold">{formatKSh(l.price * l.quantity)}</span>
                    </div>
                  </div>
                </li>
                );
              })}
            </ul>
            <div className="space-y-2 border-t p-6 text-sm">
              <Row label="Subtotal" value={formatKSh(subtotal)} />
              <Row label="Delivery" value={delivery === 0 ? "Free" : formatKSh(delivery)} />
              <p className="text-xs text-muted-foreground">{STORE.deliveryEstimate}</p>
              <div className="flex justify-between border-t pt-3 text-base font-bold">
                <span>Total</span><span>{formatKSh(total)}</span>
              </div>
              <button className="btn btn-solid mt-3 w-full" onClick={() => toast("Checkout with M-Pesa is coming soon.")}>
                Checkout · M-Pesa
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between"><span className="text-muted-foreground">{label}</span><span>{value}</span></div>
  );
}

export function QtyControl({ value, onChange, label, max = MAX_QTY }: { value: number; onChange: (n: number) => void; label: string; max?: number }) {
  return (
    <div className="inline-flex items-center border" role="group" aria-label={`Quantity for ${label}`}>
      <button className="grid size-9 place-items-center hover:bg-muted" aria-label="Decrease quantity" onClick={() => onChange(value - 1)}>
        <Minus className="size-3" />
      </button>
      <span className="w-8 text-center text-sm" aria-live="polite">{value}</span>
      <button className="grid size-9 place-items-center hover:bg-muted disabled:opacity-30" aria-label="Increase quantity" disabled={value >= max} onClick={() => onChange(value + 1)}>
        <Plus className="size-3" />
      </button>
    </div>
  );
}
