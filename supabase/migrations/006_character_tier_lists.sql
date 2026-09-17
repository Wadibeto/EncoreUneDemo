-- Character art boards, custom rows, and serialized collaborative operations.
-- Apply after 001–005. Existing game boards and Guess Who keep their data.
begin;

alter table public.tier_lists
  add column category text not null default 'games' check (category in ('games', 'characters')),
  add column catalog_filter text not null default 'all' check (catalog_filter in ('all', 'crown-gambit', 'sovereign-tower')),
  add column revision integer not null default 0 check (revision >= 0);

-- IDs and valid views are an allowlist. Metadata and artwork live in the versioned
-- app catalogue; API clients cannot inject arbitrary characters or image URLs.
create table public.character_catalog (
  id text primary key check (id ~ '^[a-z0-9][a-z0-9_-]{0,99}$'),
  game text not null check (game in ('crown-gambit', 'sovereign-tower'))
);
create table public.character_variants (
  character_id text not null references public.character_catalog(id),
  id text not null check (id ~ '^[a-z0-9][a-z0-9_-]{0,99}$'),
  primary key (character_id, id)
);
alter table public.character_catalog enable row level security;
alter table public.character_variants enable row level security;
create policy "Authenticated users read character catalogue" on public.character_catalog
  for select to authenticated using (true);
create policy "Authenticated users read character variants" on public.character_variants
  for select to authenticated using (true);
revoke all on public.character_catalog, public.character_variants from anon, authenticated;
grant select on public.character_catalog, public.character_variants to authenticated;

-- CATALOG_SEED_START: verified identifiers from lib/character-catalog.ts.
insert into public.character_catalog (id, game) values
('cg-aliza', 'crown-gambit'),
('cg-rollo', 'crown-gambit'),
('cg-hael', 'crown-gambit'),
('cg-kenwaer', 'crown-gambit'),
('cg-sylir', 'crown-gambit'),
('cg-hunan', 'crown-gambit'),
('cg-gwinblenn', 'crown-gambit'),
('cg-flamme', 'crown-gambit'),
('cg-aquilon', 'crown-gambit'),
('cg-yster', 'crown-gambit'),
('cg-kryomer', 'crown-gambit'),
('cg-gwendor', 'crown-gambit'),
('cg-silence', 'crown-gambit'),
('cg-toull', 'crown-gambit'),
('cg-alann', 'crown-gambit'),
('cg-hermet', 'crown-gambit'),
('cg-lutig', 'crown-gambit'),
('cg-gallenore', 'crown-gambit'),
('st-angelica', 'sovereign-tower'),
('st-gwendan', 'sovereign-tower'),
('st-ursula', 'sovereign-tower'),
('st-gideon', 'sovereign-tower'),
('st-goberto', 'sovereign-tower'),
('st-dulahan', 'sovereign-tower'),
('st-rufus', 'sovereign-tower'),
('st-silgur', 'sovereign-tower'),
('st-brunhilda', 'sovereign-tower'),
('st-tarcus', 'sovereign-tower'),
('st-chester', 'sovereign-tower'),
('st-goose', 'sovereign-tower'),
('st-alwena', 'sovereign-tower'),
('st-carina', 'sovereign-tower'),
('st-rowan', 'sovereign-tower'),
('st-belladona', 'sovereign-tower'),
('st-rupin', 'sovereign-tower'),
('st-sagadin', 'sovereign-tower'),
('st-lady-of-the-tower', 'sovereign-tower'),
('st-sovereign', 'sovereign-tower'),
('st-demon', 'sovereign-tower'),
('st-ari', 'sovereign-tower'),
('st-arron', 'sovereign-tower'),
('st-childeric', 'sovereign-tower'),
('st-daguez', 'sovereign-tower'),
('st-edith', 'sovereign-tower'),
('st-epicrate', 'sovereign-tower'),
('st-gothild', 'sovereign-tower'),
('st-ligia', 'sovereign-tower'),
('st-oliver', 'sovereign-tower'),
('st-wolf', 'sovereign-tower'),
('st-victoria', 'sovereign-tower'),
('st-zolta', 'sovereign-tower');
insert into public.character_variants (character_id, id) values
('cg-aliza', 'official'),
('cg-aliza', 'dialogue'),
('cg-rollo', 'official'),
('cg-rollo', 'dialogue'),
('cg-hael', 'official'),
('cg-hael', 'dialogue'),
('cg-kenwaer', 'official'),
('cg-kenwaer', 'portrait'),
('cg-sylir', 'official'),
('cg-hunan', 'official'),
('cg-gwinblenn', 'official'),
('cg-flamme', 'official'),
('cg-aquilon', 'official'),
('cg-aquilon', 'duo'),
('cg-yster', 'official'),
('cg-kryomer', 'official'),
('cg-gwendor', 'official'),
('cg-silence', 'official'),
('cg-toull', 'official'),
('cg-alann', 'official'),
('cg-hermet', 'official'),
('cg-lutig', 'official'),
('cg-gallenore', 'official'),
('st-angelica', 'official'),
('st-angelica', 'artist'),
('st-angelica', 'community'),
('st-gwendan', 'official'),
('st-gwendan', 'artist'),
('st-gwendan', 'community'),
('st-ursula', 'official'),
('st-ursula', 'artist'),
('st-ursula', 'community'),
('st-gideon', 'official'),
('st-gideon', 'artist'),
('st-gideon', 'dialogue'),
('st-gideon', 'community'),
('st-goberto', 'official'),
('st-goberto', 'artist'),
('st-goberto', 'community'),
('st-dulahan', 'official'),
('st-dulahan', 'community'),
('st-rufus', 'official'),
('st-rufus', 'community'),
('st-silgur', 'official'),
('st-silgur', 'community'),
('st-brunhilda', 'official'),
('st-brunhilda', 'community'),
('st-tarcus', 'official'),
('st-tarcus', 'community'),
('st-chester', 'official'),
('st-chester', 'community'),
('st-goose', 'official'),
('st-alwena', 'official'),
('st-alwena', 'dialogue'),
('st-alwena', 'community'),
('st-carina', 'official'),
('st-carina', 'dialogue'),
('st-rowan', 'official'),
('st-belladona', 'official'),
('st-belladona', 'dialogue'),
('st-rupin', 'official'),
('st-sagadin', 'official'),
('st-lady-of-the-tower', 'official'),
('st-sovereign', 'official'),
('st-demon', 'official'),
('st-ari', 'community'),
('st-arron', 'community'),
('st-childeric', 'community'),
('st-daguez', 'community'),
('st-edith', 'community'),
('st-epicrate', 'community'),
('st-gothild', 'community'),
('st-ligia', 'community'),
('st-oliver', 'community'),
('st-wolf', 'community'),
('st-victoria', 'community'),
('st-zolta', 'community');
-- CATALOG_SEED_END

alter table public.tier_list_items
  alter column game_id drop not null,
  drop constraint tier_list_items_tier_check,
  add column character_id text,
  add column variant_id text,
  add constraint tier_item_content_check check (
    (game_id is not null and character_id is null and variant_id is null)
    or (game_id is null and character_id is not null and variant_id is not null)
  ),
  add constraint tier_item_character_variant_fk foreign key (character_id, variant_id)
    references public.character_variants(character_id, id),
  add constraint tier_list_items_list_character_key unique (tier_list_id, character_id);

-- Config/title writes go through a member-checked RPC, including owner writes,
-- so old direct writes cannot silently bypass configuration revision checks.
revoke update on public.tier_lists from authenticated;
revoke update (title) on public.tier_lists from authenticated;
revoke insert, update, delete on public.tier_list_items from authenticated;

create or replace function public.normalize_tier_config(p_config jsonb)
returns jsonb
language plpgsql immutable set search_path = ''
as $$
declare v_normalized jsonb;
begin
  if jsonb_typeof(p_config) is distinct from 'array' then
    raise exception 'Invalid tier configuration';
  end if;
  if jsonb_array_length(p_config) not between 2 and 21 then
    raise exception 'Use between 1 and 20 ranked tiers';
  end if;
  if exists (
    select 1 from jsonb_array_elements(p_config) item
    where jsonb_typeof(item) is distinct from 'object'
      or jsonb_typeof(item -> 'key') is distinct from 'string'
      or coalesce(item ->> 'key', '') !~ '^[A-Za-z0-9][A-Za-z0-9_-]{0,39}$'
      or jsonb_typeof(item -> 'label') is distinct from 'string'
      or coalesce(char_length(trim(item ->> 'label')), 0) not between 1 and 32
      or jsonb_typeof(item -> 'color') is distinct from 'string'
      or coalesce(item ->> 'color', '') !~ '^#[0-9a-fA-F]{6}$'
  ) then raise exception 'Invalid tier value'; end if;
  if (select count(distinct item ->> 'key') from jsonb_array_elements(p_config) item)
      <> jsonb_array_length(p_config) then raise exception 'Duplicate tier key'; end if;
  if (select count(*) from jsonb_array_elements(p_config) item where item ->> 'key' = 'unranked') <> 1 then
    raise exception 'Keep the unranked tier';
  end if;
  select jsonb_agg(jsonb_build_object(
    'key', item ->> 'key', 'label', trim(item ->> 'label'), 'color', lower(item ->> 'color')
  ) order by (item ->> 'key' = 'unranked'), ordinality)
  into v_normalized
  from jsonb_array_elements(p_config) with ordinality entries(item, ordinality);
  return v_normalized;
end;
$$;

create or replace function public.validate_tier_item()
returns trigger
language plpgsql security definer set search_path = ''
as $$
declare v_category text; v_config jsonb; v_filter text; v_game text;
begin
  select category, tier_config, catalog_filter into v_category, v_config, v_filter
    from public.tier_lists where id = new.tier_list_id;
  if not exists (select 1 from jsonb_array_elements(v_config) entry where entry ->> 'key' = new.tier) then
    raise exception 'Unknown tier';
  end if;
  if (v_category = 'games' and new.game_id is null) or (v_category = 'characters' and new.character_id is null) then
    raise exception 'Item does not match board category';
  end if;
  if new.character_id is not null and v_filter <> 'all' then
    select game into v_game from public.character_catalog where id = new.character_id;
    if v_game is distinct from v_filter then raise exception 'Character does not match board filter'; end if;
  end if;
  return new;
end;
$$;
create trigger validate_tier_item_before_write
before insert or update on public.tier_list_items
for each row execute function public.validate_tier_item();

-- Later additions to the games catalogue must never appear in character boards.
create or replace function public.add_new_game_to_tier_lists()
returns trigger
language plpgsql security definer set search_path = ''
as $$
declare v_list_id uuid;
begin
  for v_list_id in select id from public.tier_lists where category = 'games' order by id for update
  loop
    insert into public.tier_list_items (tier_list_id, game_id, position)
    select v_list_id, new.id, coalesce(max(position) + 1, 0)
    from public.tier_list_items where tier_list_id = v_list_id and tier = 'unranked'
    on conflict (tier_list_id, game_id) do nothing;
  end loop;
  return new;
end;
$$;

create or replace function public.create_character_tier_list(
  p_title text, p_invite_code text, p_catalog_filter text, p_characters jsonb
)
returns uuid
language plpgsql security definer set search_path = ''
as $$
declare v_id uuid;
begin
  if auth.uid() is null then raise exception 'Not authenticated'; end if;
  if coalesce(char_length(trim(p_title)), 0) not between 1 and 80 then raise exception 'Invalid title'; end if;
  if coalesce(p_invite_code, '') !~ '^T-[A-Z2-9]{8}$' then raise exception 'Invalid invitation code'; end if;
  if p_catalog_filter is null or p_catalog_filter not in ('all', 'crown-gambit', 'sovereign-tower') then
    raise exception 'Invalid catalogue filter';
  end if;
  if jsonb_typeof(p_characters) is distinct from 'array' then raise exception 'Invalid character catalogue'; end if;
  if jsonb_array_length(p_characters) not between 1 and 500 then raise exception 'Invalid character count'; end if;
  if (select count(distinct item ->> 'character_id') from jsonb_array_elements(p_characters) item)
      <> jsonb_array_length(p_characters) then raise exception 'Duplicate character'; end if;
  if exists (
    select 1 from jsonb_array_elements(p_characters) item
    left join public.character_catalog character on character.id = item ->> 'character_id'
    left join public.character_variants variant on variant.character_id = character.id and variant.id = item ->> 'variant_id'
    where character.id is null or variant.id is null
      or (p_catalog_filter <> 'all' and character.game <> p_catalog_filter)
  ) then raise exception 'Unknown character or variant'; end if;

  insert into public.tier_lists (title, invite_code, owner_id, category, catalog_filter, tier_config)
  values (trim(p_title), p_invite_code, auth.uid(), 'characters', p_catalog_filter, '[
    {"key":"S","label":"Chef-d’œuvre","color":"#d9b770"},
    {"key":"A","label":"Magnifique","color":"#a88fc5"},
    {"key":"B","label":"Très stylé","color":"#679f99"},
    {"key":"C","label":"Prometteur","color":"#859eb8"},
    {"key":"D","label":"Moins convaincu","color":"#aa7c78"},
    {"key":"unranked","label":"À contempler","color":"#28343d"}
  ]'::jsonb) returning id into v_id;
  insert into public.tier_list_members (tier_list_id, user_id) values (v_id, auth.uid());
  insert into public.tier_list_items (tier_list_id, character_id, variant_id, position, updated_by)
  select v_id, item ->> 'character_id', item ->> 'variant_id', ordinality::int - 1, auth.uid()
    from jsonb_array_elements(p_characters) with ordinality entries(item, ordinality);
  return v_id;
end;
$$;

-- Shared settings are replaced only from the revision the editor originally saw.
-- Moving cards or changing a view does not increment this settings revision.
create or replace function public.update_tier_settings(
  p_list_id uuid, p_title text, p_config jsonb, p_expected_revision integer
)
returns integer
language plpgsql security definer set search_path = ''
as $$
declare v_revision integer; v_config jsonb; v_unranked_end integer;
begin
  if not public.is_tier_list_member(p_list_id) then raise exception 'Not a member'; end if;
  select revision into v_revision from public.tier_lists where id = p_list_id for update;
  if p_expected_revision is null or v_revision is distinct from p_expected_revision then
    raise exception using errcode = '40001', message = 'Settings changed. Reload before saving.';
  end if;
  if coalesce(char_length(trim(p_title)), 0) not between 1 and 80 then raise exception 'Invalid title'; end if;
  v_config := public.normalize_tier_config(p_config);
  select coalesce(max(position) + 1, 0) into v_unranked_end
    from public.tier_list_items where tier_list_id = p_list_id and tier = 'unranked';
  -- Update rows while the old configuration still contains every source tier.
  -- 'unranked' is required by both old and new configurations.
  with removed as (
    select items.id, row_number() over (order by tier, position, items.id)::int - 1 as offset_position
    from public.tier_list_items items
    where tier_list_id = p_list_id
      and not exists (select 1 from jsonb_array_elements(v_config) entry where entry ->> 'key' = items.tier)
  )
  update public.tier_list_items items
    set tier = 'unranked', position = v_unranked_end + removed.offset_position,
      updated_by = auth.uid(), updated_at = timezone('utc', now())
    from removed where items.id = removed.id;
  update public.tier_lists set title = trim(p_title), tier_config = v_config, revision = revision + 1
    where id = p_list_id returning revision into v_revision;
  return v_revision;
end;
$$;

-- Compatibility for older clients; new clients use update_tier_settings to detect
-- conflicting edits. The same validation and removed-row recovery still apply.
create or replace function public.update_tier_config(p_list_id uuid, p_config jsonb)
returns void
language plpgsql security definer set search_path = ''
as $$
declare v_title text; v_revision integer;
begin
  if not public.is_tier_list_member(p_list_id) then raise exception 'Not a member'; end if;
  select title, revision into v_title, v_revision from public.tier_lists where id = p_list_id for update;
  perform public.update_tier_settings(p_list_id, v_title, p_config, v_revision);
end;
$$;

-- A client sends only its intended move. The latest server ordering is used, so
-- two members moving different cards cannot overwrite each other's snapshots.
create or replace function public.move_tier_item(
  p_list_id uuid, p_item_id uuid, p_target_tier text, p_before_item_id uuid default null
)
returns void
language plpgsql security definer set search_path = ''
as $$
declare v_config jsonb; v_old_tier text; v_ids uuid[]; v_order uuid[]; v_current_id uuid;
begin
  if not public.is_tier_list_member(p_list_id) then raise exception 'Not a member'; end if;
  select tier_config into v_config from public.tier_lists where id = p_list_id for update;
  if not exists (select 1 from jsonb_array_elements(v_config) entry where entry ->> 'key' = p_target_tier) then
    raise exception 'Unknown target tier';
  end if;
  select tier into v_old_tier from public.tier_list_items where id = p_item_id and tier_list_id = p_list_id;
  if not found then raise exception 'Unknown tier item'; end if;
  if p_before_item_id = p_item_id then return; end if;
  select coalesce(array_agg(id order by position, id), '{}'::uuid[]) into v_ids
    from public.tier_list_items where tier_list_id = p_list_id and tier = p_target_tier and id <> p_item_id;
  -- If an insertion anchor moved meanwhile, append to the requested tier.
  v_order := '{}'::uuid[];
  foreach v_current_id in array v_ids loop
    if v_current_id = p_before_item_id then v_order := array_append(v_order, p_item_id); end if;
    v_order := array_append(v_order, v_current_id);
  end loop;
  if not (p_item_id = any(v_order)) then v_order := array_append(v_order, p_item_id); end if;
  update public.tier_list_items items
    set tier = p_target_tier, position = ordered.ordinality::int - 1,
      updated_by = auth.uid(), updated_at = timezone('utc', now())
    from unnest(v_order) with ordinality ordered(id, ordinality)
    where items.id = ordered.id
      and (items.tier is distinct from p_target_tier or items.position is distinct from ordered.ordinality::int - 1);
  if v_old_tier <> p_target_tier then
    with ordered as (
      select id, row_number() over (order by position, id)::int - 1 as position
      from public.tier_list_items where tier_list_id = p_list_id and tier = v_old_tier
    )
    update public.tier_list_items items set position = ordered.position,
      updated_by = auth.uid(), updated_at = timezone('utc', now())
      from ordered where items.id = ordered.id and items.position <> ordered.position;
  end if;
  update public.tier_lists set updated_at = timezone('utc', now()) where id = p_list_id;
end;
$$;

create or replace function public.set_tier_item_variant(p_list_id uuid, p_item_id uuid, p_variant_id text)
returns void
language plpgsql security definer set search_path = ''
as $$
declare v_character text;
begin
  if not public.is_tier_list_member(p_list_id) then raise exception 'Not a member'; end if;
  perform 1 from public.tier_lists where id = p_list_id for update;
  select character_id into v_character from public.tier_list_items where id = p_item_id and tier_list_id = p_list_id;
  if not found or v_character is null then raise exception 'Unknown character item'; end if;
  if not exists (select 1 from public.character_variants where character_id = v_character and id = p_variant_id) then
    raise exception 'Unknown character variant';
  end if;
  update public.tier_list_items set variant_id = p_variant_id, updated_by = auth.uid(), updated_at = timezone('utc', now())
    where id = p_item_id and tier_list_id = p_list_id;
  update public.tier_lists set updated_at = timezone('utc', now()) where id = p_list_id;
end;
$$;

-- Legacy bulk RPC remains available, now validating against each board's custom
-- rows and sharing the list lock. New UI exclusively uses move_tier_item.
create or replace function public.reorder_tier_items(p_list_id uuid, p_items jsonb)
returns void
language plpgsql security definer set search_path = ''
as $$
declare v_item jsonb; v_tier text; v_position int; v_id uuid; v_config jsonb;
begin
  if not public.is_tier_list_member(p_list_id) then raise exception 'Not a member'; end if;
  select tier_config into v_config from public.tier_lists where id = p_list_id for update;
  if jsonb_typeof(p_items) is distinct from 'array' then raise exception 'Invalid payload'; end if;
  if jsonb_array_length(p_items) > 1000 then raise exception 'Invalid payload'; end if;
  if (select count(distinct entry ->> 'id') from jsonb_array_elements(p_items) entry) <> jsonb_array_length(p_items) then
    raise exception 'Duplicate or missing item';
  end if;
  for v_item in select value from jsonb_array_elements(p_items)
  loop
    v_id := (v_item ->> 'id')::uuid;
    v_tier := v_item ->> 'tier';
    v_position := (v_item ->> 'position')::int;
    if v_position is null or v_position < 0 or not exists (
      select 1 from jsonb_array_elements(v_config) entry where entry ->> 'key' = v_tier
    ) then raise exception 'Invalid tier item'; end if;
    update public.tier_list_items set tier = v_tier, position = v_position,
      updated_by = auth.uid(), updated_at = timezone('utc', now())
      where id = v_id and tier_list_id = p_list_id;
    if not found then raise exception 'Unknown tier item'; end if;
  end loop;
  update public.tier_lists set updated_at = timezone('utc', now()) where id = p_list_id;
end;
$$;

create or replace function public.reset_tier_list(p_list_id uuid)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  if not public.is_tier_list_member(p_list_id) then raise exception 'Not a member'; end if;
  perform 1 from public.tier_lists where id = p_list_id for update;
  update public.tier_list_items items set tier = 'unranked', position = ordered.position,
    updated_by = auth.uid(), updated_at = timezone('utc', now())
  from (
    select id, row_number() over (order by coalesce(character_id, game_id::text), id)::int - 1 as position
    from public.tier_list_items where tier_list_id = p_list_id
  ) ordered where items.id = ordered.id;
  update public.tier_lists set updated_at = timezone('utc', now()) where id = p_list_id;
end;
$$;

revoke all on function public.normalize_tier_config(jsonb) from public, anon, authenticated;
revoke all on function public.validate_tier_item() from public, anon, authenticated;
revoke all on function public.create_character_tier_list(text, text, text, jsonb) from public, anon;
revoke all on function public.update_tier_settings(uuid, text, jsonb, integer) from public, anon;
revoke all on function public.move_tier_item(uuid, uuid, text, uuid) from public, anon;
revoke all on function public.set_tier_item_variant(uuid, uuid, text) from public, anon;
grant execute on function public.create_character_tier_list(text, text, text, jsonb) to authenticated;
grant execute on function public.update_tier_settings(uuid, text, jsonb, integer) to authenticated;
grant execute on function public.move_tier_item(uuid, uuid, text, uuid) to authenticated;
grant execute on function public.set_tier_item_variant(uuid, uuid, text) to authenticated;

-- Migration 004 already adds tier_lists; keep both publication entries explicit.
do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'tier_lists') then
    alter publication supabase_realtime add table public.tier_lists;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'tier_list_items') then
    alter publication supabase_realtime add table public.tier_list_items;
  end if;
end $$;

notify pgrst, 'reload schema';
commit;
