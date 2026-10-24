import { PARTNERS, PARTNERS_NOTE } from "@/lib/partners";
import { cn } from "@/lib/utils";

/**
 * Partner row shown inside the brand-story block.
 * Strictly black and white — no gold, no colour — so it reads as editorial
 * credit line rather than a badge wall.
 */
export function PartnerStrip({ className }: { className?: string }) {
  return (
    <div role="group" aria-label="Our partners" className={cn("border-t px-4 py-10 md:px-8 md:py-14", className)}>
      <p className="eyebrow text-muted-foreground">Our partners</p>
      <ul className="mt-8 grid grid-cols-2 items-center gap-x-6 gap-y-8 sm:grid-cols-3 lg:flex lg:flex-wrap lg:items-center lg:justify-between lg:gap-8">
        {PARTNERS.map((p) => (
          <li key={p.name} className="group flex min-h-11 items-center justify-center lg:justify-start">
            {p.logo ? (
              <img
                src={p.logo}
                alt={p.name}
                loading="lazy"
                className="h-8 w-auto max-w-40 object-contain opacity-60 grayscale contrast-125 transition duration-500 group-hover:opacity-100"
              />
            ) : (
              <span className="font-display text-base uppercase leading-none tracking-[0.2em] text-foreground/55 transition-colors duration-500 group-hover:text-foreground md:text-xl">
                {p.name}
              </span>
            )}
          </li>
        ))}
      </ul>
      <p className="mt-8 text-xs leading-relaxed text-muted-foreground">{PARTNERS_NOTE}</p>
    </div>
  );
}
