type MarkProps = { className?: string };

/** M-Pesa: mobile-money signal motif + wordmark in Safaricom green. */
export function MpesaMark({ className = "" }: MarkProps) {
  return (
    <svg viewBox="0 0 76 32" className={className} aria-hidden="true">
      <rect x="30" y="3" width="15" height="15" rx="4" fill="var(--mpesa)" />
      <circle cx="33.5" cy="14.5" r="1.2" fill="var(--ink-foreground)" />
      <path d="M33.5 11.3A3.2 3.2 0 0 1 36.7 14.5" fill="none" stroke="var(--ink-foreground)" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M33.5 8.5A6 6 0 0 1 39.5 14.5" fill="none" stroke="var(--ink-foreground)" strokeWidth="1.3" strokeLinecap="round" />
      <text x="38" y="28" textAnchor="middle" fill="var(--mpesa)" fontFamily="Manrope, system-ui, sans-serif" fontSize="10" fontWeight="700" letterSpacing="-0.2">
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
      <circle cx="31" cy="11" r="7.5" fill="var(--mc-red)" />
      <circle cx="45" cy="11" r="7.5" fill="var(--mc-yellow)" />
      <circle cx="45" cy="11" r="7.5" fill="var(--mc-orange)" clipPath="url(#cc-mc-overlap)" />
      <text
        x="38"
        y="28"
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
