import Link from "next/link";
import { Crown } from "lucide-react";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="focus-ring inline-flex shrink-0 items-center gap-3 rounded-sm" aria-label="DuoTier — accueil">
      <span className="court-seal flex size-10 items-center justify-center transition-transform duration-300 hover:-rotate-12">
        <Crown className="size-5" strokeWidth={1.3} />
      </span>
      <span className="display-font text-[27px] leading-none tracking-[-.055em]">DuoTier<span className="text-primary">.</span></span>
    </Link>
  );
}
