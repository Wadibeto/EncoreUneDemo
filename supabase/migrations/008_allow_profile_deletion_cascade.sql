-- Account deletion cascades owned boards and sets remaining updated_by FKs to
-- NULL. During that cascade an owned board may already be gone, so validating
-- its tier configuration on an attribution-only update raises 'Unknown tier'.
-- Validate only columns that affect board/category/tier/character membership.
begin;

drop trigger validate_tier_item_before_write on public.tier_list_items;
create trigger validate_tier_item_before_write
before insert or update of tier_list_id, game_id, character_id, variant_id, tier
on public.tier_list_items
for each row execute function public.validate_tier_item();

commit;
