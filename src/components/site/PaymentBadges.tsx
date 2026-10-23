type MarkProps = { className?: string };

/** M-Pesa: mobile-money signal motif + wordmark in Safaricom green. */
export function MpesaMark({ className = "" }: MarkProps) {
  return (
    <svg viewBox="0 0 76 32" className={className} aria-hidden="true">
      <rect x="4" y="8" width="16" height="16" rx="4.5" fill="var(--mpesa)" />
      <circle cx="8" cy="20" r="1.3" fill="var(--ink-foreground)" />
      <path d="M8 16.5A3.5 3.5 0 0 1 11.5 20" fill="none" stroke="var(--ink-foreground)" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M8 13.5A6.5 6.5 0 0 1 14.5 20" fill="none" stroke="var(--ink-foreground)" strokeWidth="1.4" strokeLinecap="round" />
      <text x="24" y="21" fill="var(--mpesa)" fontFamily="Manrope, system-ui, sans-serif" fontSize="12" fontWeight="700" letterSpacing="-0.4">
        M-PESA
      </text>
    </svg>
  );
}

/** Mastercard: the two overlapping circles with the amber intersection band. */
export function MastercardMark({ className = "" }: MarkProps) {
  return (
    <svg viewBox="0 0 76 32" className={className} aria-hidden="true">
      <defs>
        <clipPath id="cc-mc-overlap">
          <circle cx="31" cy="12" r="8" />
        </clipPath>
      </defs>
      <circle cx="31" cy="12" r="8" fill="var(--mc-red)" />
      <circle cx="45" cy="12" r="8" fill="var(--mc-yellow)" />
      <circle cx="45" cy="12" r="8" fill="var(--mc-orange)" clipPath="url(#cc-mc-overlap)" />
      <text
        x="38"
        y="29"
        textAnchor="middle"
        fill="var(--ink)"
        fontFamily="Manrope, system-ui, sans-serif"
        fontSize="8.5"
        fontWeight="700"
        letterSpacing="0.1"
      >
        mastercard
      </text>
    </svg>
  );
}

const METHODS = [
  { name: "M-Pesa", Mark: MpesaMark },
  { name: "Mastercard", Mark: MastercardMark },
];

/** Payment chips — uniform off-white tiles so the brand marks carry the colour. */
export function PaymentBadges({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`} aria-label="Payment methods">
      {METHODS.map(({ name, Mark }) => (
        <li
          key={name}
          className="grid h-11 w-[76px] place-items-center rounded-md bg-ink-foreground ring-1 ring-charcoal/15 transition-transform duration-300 hover:-translate-y-0.5"
        >
          <span className="sr-only">{name}</span>
          <Mark className="h-full w-full" />
        </li>
      ))}
    </ul>
  );
}
