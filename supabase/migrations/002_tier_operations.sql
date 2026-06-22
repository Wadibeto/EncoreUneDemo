-- Atomic collaborative tier-list operations.

create or replace function public.reorder_tier_items(p_list_id uuid, p_items jsonb)
returns void
language plpgsql
security definer set search_path = ''
as $$
declare v_item jsonb; v_tier text; v_position int; v_id uuid;
begin
  if not public.is_tier_list_member(p_list_id) then raise exception 'Not a member'; end if;
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) > 100 then raise exception 'Invalid payload'; end if;
  for v_item in select value from jsonb_array_elements(p_items)
  loop
    v_id := (v_item ->> 'id')::uuid;
    v_tier := v_item ->> 'tier';
    v_position := (v_item ->> 'position')::int;
    if v_tier not in ('unranked','S','A','B','C','D','E','unfinished','demo','abandoned') or v_position < 0 then
      raise exception 'Invalid tier item';
    end if;
    update public.tier_list_items
      set tier = v_tier, position = v_position, updated_by = auth.uid(), updated_at = timezone('utc', now())
      where id = v_id and tier_list_id = p_list_id;
    if not found then raise exception 'Unknown tier item'; end if;
  end loop;
  update public.tier_lists set updated_at = timezone('utc', now()) where id = p_list_id;
end;
$$;

create or replace function public.reset_tier_list(p_list_id uuid)
returns void
language plpgsql
security definer set search_path = ''
as $$
begin
  if not public.is_tier_list_member(p_list_id) then raise exception 'Not a member'; end if;
  update public.tier_list_items items
  set tier = 'unranked', position = ordered.position, updated_by = auth.uid(), updated_at = timezone('utc', now())
  from (
    select id, row_number() over (order by game_id)::int - 1 as position
    from public.tier_list_items where tier_list_id = p_list_id
  ) ordered
  where items.id = ordered.id;
  update public.tier_lists set updated_at = timezone('utc', now()) where id = p_list_id;
end;
$$;

revoke all on function public.reorder_tier_items(uuid, jsonb) from public;
revoke all on function public.reset_tier_list(uuid) from public;
grant execute on function public.reorder_tier_items(uuid, jsonb) to authenticated;
grant execute on function public.reset_tier_list(uuid) to authenticated;
