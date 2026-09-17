-- A stale edit is a permanent business conflict, not a serialization failure.
-- PostgREST 14 retries SQLSTATE 40001 transactions indefinitely. P0001 produces
-- a normal HTTP 400 response, so the UI can refresh and ask the user to retry.
-- Migration 006 is already deployed; preserve its checksum and repair here.
begin;

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
    raise exception 'Settings changed. Reload before saving.';
  end if;
  if coalesce(char_length(trim(p_title)), 0) not between 1 and 80 then raise exception 'Invalid title'; end if;
  v_config := public.normalize_tier_config(p_config);
  select coalesce(max(position) + 1, 0) into v_unranked_end
    from public.tier_list_items where tier_list_id = p_list_id and tier = 'unranked';
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

-- CREATE OR REPLACE preserves the member-only RPC privileges from migration 006.
revoke all on function public.update_tier_settings(uuid, text, jsonb, integer) from public, anon;
grant execute on function public.update_tier_settings(uuid, text, jsonb, integer) to authenticated;

notify pgrst, 'reload schema';
commit;
