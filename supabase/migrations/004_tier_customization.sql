-- Per-list tier labels, colors and ordering.

alter table public.tier_lists
add column tier_config jsonb not null default '[
  {"key":"S","label":"S","color":"#f43f5e"},
  {"key":"A","label":"A","color":"#f97316"},
  {"key":"B","label":"B","color":"#facc15"},
  {"key":"C","label":"C","color":"#84cc16"},
  {"key":"D","label":"D","color":"#06b6d4"},
  {"key":"E","label":"E","color":"#3b82f6"},
  {"key":"unfinished","label":"Pas fini","color":"#8b5cf6"},
  {"key":"demo","label":"Démo","color":"#d946ef"},
  {"key":"abandoned","label":"Abandonné","color":"#475569"},
  {"key":"unranked","label":"À classer","color":"#1e293b"}
]'::jsonb;

create or replace function public.update_tier_config(p_list_id uuid, p_config jsonb)
returns void
language plpgsql
security definer set search_path = ''
as $$
declare v_distinct_keys int;
begin
  if not public.is_tier_list_member(p_list_id) then raise exception 'Not a member'; end if;
  if jsonb_typeof(p_config) <> 'array' or jsonb_array_length(p_config) <> 10 then
    raise exception 'Invalid tier configuration';
  end if;

  if exists (
    select 1 from jsonb_array_elements(p_config) item
    where item ->> 'key' not in ('unranked','S','A','B','C','D','E','unfinished','demo','abandoned')
      or char_length(trim(item ->> 'label')) not between 1 and 32
      or coalesce(item ->> 'color', '') !~ '^#[0-9a-fA-F]{6}$'
  ) then raise exception 'Invalid tier value'; end if;

  select count(distinct item ->> 'key') into v_distinct_keys
  from jsonb_array_elements(p_config) item;
  if v_distinct_keys <> 10 then raise exception 'Duplicate tier key'; end if;

  update public.tier_lists
  set tier_config = (
    select jsonb_agg(
      jsonb_build_object(
        'key', item ->> 'key',
        'label', trim(item ->> 'label'),
        'color', lower(item ->> 'color')
      ) order by ordinality
    )
    from jsonb_array_elements(p_config) with ordinality values_with_order(item, ordinality)
  )
  where id = p_list_id;
end;
$$;

revoke all on function public.update_tier_config(uuid, jsonb) from public;
grant execute on function public.update_tier_config(uuid, jsonb) to authenticated;

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'tier_lists'
  ) then
    alter publication supabase_realtime add table public.tier_lists;
  end if;
end $$;
