import { notFound, redirect } from "next/navigation";
import { ListOrdered } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { InviteCode } from "@/components/invite-code";
import { TierBoard } from "@/components/tier-board";
import { createClient } from "@/lib/supabase/server";
import type { Profile, TierItem } from "@/lib/types";
import type { TierDefinition } from "@/lib/types";
import { DEFAULT_TIER_CONFIG } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

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
  return (
    <AppShell>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-5">
        <div><p className="flex items-center gap-2 text-sm font-semibold text-violet-300"><ListOrdered className="size-4" />Tier list collaborative</p><h1 className="mt-2 text-3xl font-black">{list.title}</h1><p className="mt-2 text-xs text-slate-500">Créée le {formatDate(list.created_at)} · Mise à jour {formatDate(list.updated_at)}</p></div>
        <InviteCode code={list.invite_code} />
      </div>
      <TierBoard listId={id} initialItems={items as unknown as TierItem[]} initialConfig={(list.tier_config as TierDefinition[] | null) ?? DEFAULT_TIER_CONFIG} currentUser={profile as Profile} members={members} />
    </AppShell>
  );
}
