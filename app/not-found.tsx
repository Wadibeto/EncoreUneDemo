import Link from "next/link";
import { SearchX } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-4 text-center"><div><SearchX className="mx-auto size-12 text-slate-600" /><h1 className="mt-5 text-3xl font-black">Session introuvable</h1><p className="mt-2 text-slate-400">Elle n’existe pas ou vous n’y avez pas accès.</p><Link href="/dashboard" className={`${buttonVariants()} mt-6`}>Retour au dashboard</Link></div></main>
  );
}
