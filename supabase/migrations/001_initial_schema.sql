-- DuoTier initial schema
-- Apply with `supabase db push` or paste into the Supabase SQL editor.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null check (char_length(username) between 2 and 32),
  avatar_url text,
  is_admin boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.games (
  id uuid primary key default gen_random_uuid(),
  title text not null unique check (char_length(title) between 1 and 120),
  cover_url text,
  release_year int check (release_year between 1970 and 2100),
  genre text,
  tags text[] not null default '{}',
  description text check (char_length(description) <= 500),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.tier_lists (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 80),
  invite_code text not null unique check (invite_code ~ '^T-[A-Z2-9]{8}$'),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.tier_list_members (
  tier_list_id uuid not null references public.tier_lists(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default timezone('utc', now()),
  primary key (tier_list_id, user_id)
);

create table public.tier_list_items (
  id uuid primary key default gen_random_uuid(),
  tier_list_id uuid not null references public.tier_lists(id) on delete cascade,
  game_id uuid not null references public.games(id) on delete cascade,
  tier text not null default 'unranked' check (tier in ('unranked','S','A','B','C','D','E','unfinished','demo','abandoned')),
  position int not null default 0 check (position >= 0),
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default timezone('utc', now()),
  unique (tier_list_id, game_id)
);

create table public.guess_sessions (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 80),
  invite_code text not null unique check (invite_code ~ '^G-[A-Z2-9]{8}$'),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'waiting' check (status in ('waiting','active','finished','abandoned')),
  current_turn uuid references public.profiles(id) on delete set null,
  winner_id uuid references public.profiles(id) on delete set null,
  round int not null default 0 check (round >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.guess_players (
  session_id uuid not null references public.guess_sessions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  player_number smallint not null check (player_number in (1, 2)),
  ready boolean not null default false,
  joined_at timestamptz not null default timezone('utc', now()),
  primary key (session_id, user_id),
  unique (session_id, player_number)
);

-- Deliberately separate from guess_players. RLS exposes only the caller's row.
create table public.guess_player_secrets (
  session_id uuid not null references public.guess_sessions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  secret_game_id uuid not null references public.games(id) on delete restrict,
  round int not null,
  created_at timestamptz not null default timezone('utc', now()),
  primary key (session_id, user_id)
);

create table public.guess_eliminations (
  session_id uuid not null references public.guess_sessions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  game_id uuid not null references public.games(id) on delete cascade,
  eliminated_at timestamptz not null default timezone('utc', now()),
  primary key (session_id, user_id, game_id)
);

create table public.guess_notes (
  session_id uuid not null references public.guess_sessions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null default '' check (char_length(content) <= 5000),
  updated_at timestamptz not null default timezone('utc', now()),
  primary key (session_id, user_id)
);

create or replace function public.add_new_game_to_tier_lists()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.tier_list_items (tier_list_id, game_id, position)
  select lists.id, new.id, coalesce((
    select max(item.position) + 1 from public.tier_list_items item
    where item.tier_list_id = lists.id and item.tier = 'unranked'
  ), 0)
  from public.tier_lists lists
  on conflict (tier_list_id, game_id) do nothing;
  return new;
end;
$$;

create trigger on_game_created
after insert on public.games
for each row execute function public.add_new_game_to_tier_lists();

create index tier_list_members_user_idx on public.tier_list_members(user_id);
create index tier_list_items_list_tier_position_idx on public.tier_list_items(tier_list_id, tier, position);
create index guess_players_user_idx on public.guess_players(user_id);
create index guess_eliminations_owner_idx on public.guess_eliminations(session_id, user_id);
create index games_title_idx on public.games using gin (to_tsvector('simple', title));
create index games_tags_idx on public.games using gin (tags);

create trigger profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger games_updated_at before update on public.games
for each row execute function public.set_updated_at();
create trigger tier_lists_updated_at before update on public.tier_lists
for each row execute function public.set_updated_at();
create trigger guess_sessions_updated_at before update on public.guess_sessions
for each row execute function public.set_updated_at();
create trigger guess_notes_updated_at before update on public.guess_notes
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    lpad(left(coalesce(nullif(new.raw_user_meta_data ->> 'username', ''), split_part(new.email, '@', 1), 'Joueur'), 32), 2, '_')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

insert into public.profiles (id, username)
select id, lpad(left(coalesce(nullif(raw_user_meta_data ->> 'username', ''), split_part(email, '@', 1), 'Joueur'), 32), 2, '_')
from auth.users
on conflict (id) do nothing;

create or replace function public.is_admin()
returns boolean
language sql stable
security definer set search_path = ''
as $$
  select exists(select 1 from public.profiles where id = auth.uid() and is_admin);
$$;

create or replace function public.is_tier_list_member(list_id uuid)
returns boolean
language sql stable
security definer set search_path = ''
as $$
  select exists(
    select 1 from public.tier_list_members
    where tier_list_id = list_id and user_id = auth.uid()
  );
$$;

create or replace function public.is_guess_session_member(game_session_id uuid)
returns boolean
language sql stable
security definer set search_path = ''
as $$
  select exists(
    select 1 from public.guess_players
    where session_id = game_session_id and user_id = auth.uid()
  );
$$;

alter table public.profiles enable row level security;
alter table public.games enable row level security;
alter table public.tier_lists enable row level security;
alter table public.tier_list_members enable row level security;
alter table public.tier_list_items enable row level security;
alter table public.guess_sessions enable row level security;
alter table public.guess_players enable row level security;
alter table public.guess_player_secrets enable row level security;
alter table public.guess_eliminations enable row level security;
alter table public.guess_notes enable row level security;

create policy "Authenticated users can read profiles" on public.profiles
for select to authenticated using (true);
create policy "Users update their own profile" on public.profiles
for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy "Authenticated users can read games" on public.games
for select to authenticated using (true);
create policy "Admins create games" on public.games
for insert to authenticated with check (public.is_admin());
create policy "Admins update games" on public.games
for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins delete games" on public.games
for delete to authenticated using (public.is_admin());

create policy "Members read tier lists" on public.tier_lists
for select to authenticated using (public.is_tier_list_member(id));
create policy "Owners update tier lists" on public.tier_lists
for update to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy "Owners delete tier lists" on public.tier_lists
for delete to authenticated using (owner_id = auth.uid());

create policy "Members read tier list membership" on public.tier_list_members
for select to authenticated using (public.is_tier_list_member(tier_list_id));
create policy "Members read tier items" on public.tier_list_items
for select to authenticated using (public.is_tier_list_member(tier_list_id));
create policy "Members update tier items" on public.tier_list_items
for update to authenticated using (public.is_tier_list_member(tier_list_id))
with check (public.is_tier_list_member(tier_list_id));

create policy "Players read their session" on public.guess_sessions
for select to authenticated using (public.is_guess_session_member(id));
create policy "Players read participants" on public.guess_players
for select to authenticated using (public.is_guess_session_member(session_id));
create policy "Players update their ready state" on public.guess_players
for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "Players read only their own secret" on public.guess_player_secrets
for select to authenticated using (user_id = auth.uid() and public.is_guess_session_member(session_id));

create policy "Players read only their eliminations" on public.guess_eliminations
for select to authenticated using (user_id = auth.uid() and public.is_guess_session_member(session_id));
create policy "Players create only their eliminations" on public.guess_eliminations
for insert to authenticated with check (user_id = auth.uid() and public.is_guess_session_member(session_id));
create policy "Players delete only their eliminations" on public.guess_eliminations
for delete to authenticated using (user_id = auth.uid() and public.is_guess_session_member(session_id));

create policy "Players read only their notes" on public.guess_notes
for select to authenticated using (user_id = auth.uid() and public.is_guess_session_member(session_id));
create policy "Players create only their notes" on public.guess_notes
for insert to authenticated with check (user_id = auth.uid() and public.is_guess_session_member(session_id));
create policy "Players update only their notes" on public.guess_notes
for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Column grants complement RLS: identities, ownership and admin flags are immutable from the API.
revoke update on public.profiles from authenticated;
grant update (username, avatar_url) on public.profiles to authenticated;
revoke update on public.tier_lists from authenticated;
grant update (title) on public.tier_lists to authenticated;
revoke insert, update, delete on public.tier_list_items from authenticated;
revoke update on public.guess_players from authenticated;
grant update (ready) on public.guess_players to authenticated;
revoke update on public.guess_notes from authenticated;
grant update (content) on public.guess_notes to authenticated;

create or replace function public.create_tier_list(p_title text, p_invite_code text)
returns uuid
language plpgsql
security definer set search_path = ''
as $$
declare v_id uuid;
begin
  if auth.uid() is null then raise exception 'Not authenticated'; end if;
  if char_length(trim(p_title)) not between 1 and 80 then raise exception 'Invalid title'; end if;
  if p_invite_code !~ '^T-[A-Z2-9]{8}$' then raise exception 'Invalid invitation code'; end if;

  insert into public.tier_lists (title, invite_code, owner_id)
  values (trim(p_title), p_invite_code, auth.uid()) returning id into v_id;
  insert into public.tier_list_members (tier_list_id, user_id) values (v_id, auth.uid());
  insert into public.tier_list_items (tier_list_id, game_id, position, updated_by)
  select v_id, id, row_number() over (order by title)::int - 1, auth.uid() from public.games;
  return v_id;
end;
$$;

create or replace function public.join_tier_list(p_invite_code text)
returns uuid
language plpgsql
security definer set search_path = ''
as $$
declare v_id uuid; v_count int;
begin
  if auth.uid() is null then raise exception 'Not authenticated'; end if;
  select id into v_id from public.tier_lists where invite_code = upper(trim(p_invite_code)) for update;
  if v_id is null then raise exception 'Session not found'; end if;
  select count(*) into v_count from public.tier_list_members where tier_list_id = v_id;
  if v_count >= 2 and not exists (select 1 from public.tier_list_members where tier_list_id = v_id and user_id = auth.uid()) then
    raise exception 'Session is full';
  end if;
  insert into public.tier_list_members (tier_list_id, user_id) values (v_id, auth.uid()) on conflict do nothing;
  return v_id;
end;
$$;

create or replace function public.create_guess_session(p_title text, p_invite_code text)
returns uuid
language plpgsql
security definer set search_path = ''
as $$
declare v_id uuid;
begin
  if auth.uid() is null then raise exception 'Not authenticated'; end if;
  if char_length(trim(p_title)) not between 1 and 80 then raise exception 'Invalid title'; end if;
  if p_invite_code !~ '^G-[A-Z2-9]{8}$' then raise exception 'Invalid invitation code'; end if;
  insert into public.guess_sessions (title, invite_code, owner_id)
  values (trim(p_title), p_invite_code, auth.uid()) returning id into v_id;
  insert into public.guess_players (session_id, user_id, player_number) values (v_id, auth.uid(), 1);
  return v_id;
end;
$$;

create or replace function public.join_guess_session(p_invite_code text)
returns uuid
language plpgsql
security definer set search_path = ''
as $$
declare v_id uuid; v_count int;
begin
  if auth.uid() is null then raise exception 'Not authenticated'; end if;
  select id into v_id from public.guess_sessions where invite_code = upper(trim(p_invite_code)) for update;
  if v_id is null then raise exception 'Session not found'; end if;
  if exists (select 1 from public.guess_players where session_id = v_id and user_id = auth.uid()) then return v_id; end if;
  select count(*) into v_count from public.guess_players where session_id = v_id;
  if v_count >= 2 then raise exception 'Session is full'; end if;
  insert into public.guess_players (session_id, user_id, player_number) values (v_id, auth.uid(), 2);
  return v_id;
end;
$$;

create or replace function public.start_guess_round(p_session_id uuid)
returns void
language plpgsql
security definer set search_path = ''
as $$
declare v_players uuid[]; v_player_count int; v_game_1 uuid; v_game_2 uuid; v_round int; v_status text;
begin
  if not public.is_guess_session_member(p_session_id) then raise exception 'Not a member'; end if;
  select status into v_status from public.guess_sessions where id = p_session_id for update;
  if v_status = 'active' then raise exception 'Round already active'; end if;
  select array_agg(user_id order by player_number), count(*)::int into v_players, v_player_count
  from public.guess_players where session_id = p_session_id;
  if v_player_count <> 2 then raise exception 'Two players required'; end if;
  select id into v_game_1 from public.games order by gen_random_uuid() limit 1;
  select id into v_game_2 from public.games where id <> v_game_1 order by gen_random_uuid() limit 1;
  if v_game_1 is null or v_game_2 is null then raise exception 'At least two games required'; end if;
  select round + 1 into v_round from public.guess_sessions where id = p_session_id for update;

  delete from public.guess_eliminations where session_id = p_session_id;
  delete from public.guess_notes where session_id = p_session_id;
  insert into public.guess_player_secrets (session_id, user_id, secret_game_id, round)
  values (p_session_id, v_players[1], v_game_1, v_round), (p_session_id, v_players[2], v_game_2, v_round)
  on conflict (session_id, user_id) do update set secret_game_id = excluded.secret_game_id, round = excluded.round, created_at = timezone('utc', now());
  update public.guess_sessions set status = 'active', current_turn = v_players[1], winner_id = null, round = v_round where id = p_session_id;
end;
$$;

create or replace function public.make_guess(p_session_id uuid, p_game_id uuid)
returns boolean
language plpgsql
security definer set search_path = ''
as $$
declare v_opponent uuid; v_secret uuid; v_turn uuid; v_status text; v_correct boolean;
begin
  if not public.is_guess_session_member(p_session_id) then raise exception 'Not a member'; end if;
  select current_turn, status into v_turn, v_status from public.guess_sessions where id = p_session_id for update;
  if v_status <> 'active' then raise exception 'Round is not active'; end if;
  if v_turn <> auth.uid() then raise exception 'Not your turn'; end if;
  if not exists (select 1 from public.games where id = p_game_id) then raise exception 'Unknown game'; end if;
  select user_id into v_opponent from public.guess_players where session_id = p_session_id and user_id <> auth.uid();
  select secret_game_id into v_secret from public.guess_player_secrets where session_id = p_session_id and user_id = v_opponent;
  v_correct := p_game_id = v_secret;
  if v_correct then
    update public.guess_sessions set status = 'finished', winner_id = auth.uid(), current_turn = null where id = p_session_id;
  else
    update public.guess_sessions set current_turn = v_opponent where id = p_session_id;
  end if;
  return v_correct;
end;
$$;

create or replace function public.pass_guess_turn(p_session_id uuid)
returns void
language plpgsql
security definer set search_path = ''
as $$
declare v_opponent uuid; v_turn uuid; v_status text;
begin
  if not public.is_guess_session_member(p_session_id) then raise exception 'Not a member'; end if;
  select current_turn, status into v_turn, v_status from public.guess_sessions where id = p_session_id for update;
  if v_status <> 'active' or v_turn <> auth.uid() then raise exception 'Not your turn'; end if;
  select user_id into v_opponent from public.guess_players where session_id = p_session_id and user_id <> auth.uid();
  update public.guess_sessions set current_turn = v_opponent where id = p_session_id;
end;
$$;

create or replace function public.abandon_guess_session(p_session_id uuid)
returns void
language plpgsql
security definer set search_path = ''
as $$
declare v_opponent uuid;
begin
  if not public.is_guess_session_member(p_session_id) then raise exception 'Not a member'; end if;
  select user_id into v_opponent from public.guess_players where session_id = p_session_id and user_id <> auth.uid();
  update public.guess_sessions set status = 'abandoned', winner_id = v_opponent, current_turn = null where id = p_session_id and status in ('waiting','active');
end;
$$;

revoke all on function public.create_tier_list(text, text) from public;
revoke all on function public.join_tier_list(text) from public;
revoke all on function public.create_guess_session(text, text) from public;
revoke all on function public.join_guess_session(text) from public;
revoke all on function public.start_guess_round(uuid) from public;
revoke all on function public.make_guess(uuid, uuid) from public;
revoke all on function public.pass_guess_turn(uuid) from public;
revoke all on function public.abandon_guess_session(uuid) from public;
grant execute on function public.create_tier_list(text, text) to authenticated;
grant execute on function public.join_tier_list(text) to authenticated;
grant execute on function public.create_guess_session(text, text) to authenticated;
grant execute on function public.join_guess_session(text) to authenticated;
grant execute on function public.start_guess_round(uuid) to authenticated;
grant execute on function public.make_guess(uuid, uuid) to authenticated;
grant execute on function public.pass_guess_turn(uuid) to authenticated;
grant execute on function public.abandon_guess_session(uuid) to authenticated;

do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'tier_list_items') then alter publication supabase_realtime add table public.tier_list_items; end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'tier_list_members') then alter publication supabase_realtime add table public.tier_list_members; end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'guess_sessions') then alter publication supabase_realtime add table public.guess_sessions; end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'guess_players') then alter publication supabase_realtime add table public.guess_players; end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'guess_player_secrets') then alter publication supabase_realtime add table public.guess_player_secrets; end if;
end $$;
