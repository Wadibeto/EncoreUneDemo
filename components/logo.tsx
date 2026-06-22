import Link from "next/link";
import { Swords } from "lucide-react";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="focus-ring inline-flex items-center gap-2 rounded-lg text-lg font-black tracking-tight">
      <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-sky-500 shadow-glow">
        <Swords className="size-5" />
      </span>
      DuoTier
    </Link>
  );
}
