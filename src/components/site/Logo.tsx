import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";

export function Logo({ inverted = false, className }: { inverted?: boolean; className?: string }) {
  return (
    <Link to="/" aria-label="Ciao Central — home" className={cn("group flex items-center gap-3", className)}>
      <img
        src={logo}
        alt=""
        width={40}
        height={40}
        className={cn("hidden size-9 lg:block transition-transform duration-500 group-hover:rotate-[-6deg]", inverted && "invert")}
      />
      <span className="font-display text-xl tracking-[0.12em]">Ciao Central</span>
    </Link>
  );
}
