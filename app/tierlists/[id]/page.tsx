import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { InviteCode } from "@/components/invite-code";
import { TierBoard } from "@/components/tier-board";
import { createClient } from "@/lib/supabase/server";
import type { Profile, TierItem, TierDefinition, TierCategory } from "@/lib/types";
import { DEFAULT_TIER_CONFIG } from "@/lib/constants";

export default async function TierListPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const [{ data: list }, { data: items }, { data: memberships }, { data: profile }] = await Promise.all([
    supabase.from("tier_lists").select("*").eq("id", id).single(),
    supabase.from("tier_list_items").select("*, game:games(*)").eq("tier_list_id", id).order("position"),
    supabase.from("tier_list_members").select("user_id, profile:profiles(*)").eq("tier_list_id", id),
    supabase.from("profiles").select("*").eq("id", user.id).single(),
  ]);
  if (!list || !items || !profile) notFound();
  const members = (memberships ?? []).flatMap((row) => row.profile ? [row.profile as unknown as Profile] : []);
  return <AppShell>
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4"><Link href="/dashboard" className="focus-ring flex items-center gap-2 text-xs text-stone-400 hover:text-[#dbc393]"><ArrowLeft className="size-3.5" />Mes collections</Link><InviteCode code={list.invite_code} /></div>
    <TierBoard listId={id} initialTitle={list.title} initialItems={items as unknown as TierItem[]} initialConfig={(list.tier_config as TierDefinition[] | null) ?? DEFAULT_TIER_CONFIG} initialRevision={list.revision ?? 0} category={(list.category ?? "games") as TierCategory} currentUser={profile as Profile} members={members} />
  </AppShell>;
}
