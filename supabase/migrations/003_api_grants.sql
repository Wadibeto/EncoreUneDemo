-- Explicit PostgREST/API privileges. RLS remains the row-level authority.
-- Supabase projects may not grant table privileges automatically for objects
-- created by CLI migrations, so keep these grants versioned with the schema.

grant usage on schema public to authenticated;

grant select on table public.profiles to authenticated;
grant update (username, avatar_url) on table public.profiles to authenticated;

grant select, insert, update, delete on table public.games to authenticated;

grant select on table public.tier_lists to authenticated;
grant update (title) on table public.tier_lists to authenticated;
grant delete on table public.tier_lists to authenticated;
grant select on table public.tier_list_members to authenticated;
grant select on table public.tier_list_items to authenticated;

grant select on table public.guess_sessions to authenticated;
grant select on table public.guess_players to authenticated;
grant update (ready) on table public.guess_players to authenticated;
grant select on table public.guess_player_secrets to authenticated;

grant select, insert, delete on table public.guess_eliminations to authenticated;
grant select, insert on table public.guess_notes to authenticated;
grant update (content) on table public.guess_notes to authenticated;
