import Link from "next/link";
import { Layers3 } from "lucide-react";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="focus-ring inline-flex shrink-0 items-center gap-3 rounded-sm" aria-label="DuoTier — accueil">
      <span className="flex size-9 items-center justify-center rounded-lg border border-[#8f8058] bg-[#cbb582]/10 text-[#d8c393]">
        <Layers3 className="size-5" strokeWidth={1.3} />
      </span>
      <span className="display-font text-[27px] leading-none tracking-[-.055em]">DuoTier<span className="text-primary">.</span></span>
    </Link>
  );
}
