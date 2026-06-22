"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function InviteCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    const url = `${window.location.origin}/join/${code}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 p-1.5 pl-3">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-slate-500">Invitation</p>
        <p className="font-mono text-sm font-bold tracking-wider">{code}</p>
      </div>
      <Button variant="ghost" size="icon" className="ml-auto" onClick={copy} aria-label="Copier le lien">
        {copied ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
      </Button>
    </div>
  );
}
