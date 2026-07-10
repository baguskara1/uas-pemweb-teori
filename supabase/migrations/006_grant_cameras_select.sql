-- ============================================================================
-- Sewa Kamera Ryox - Grant Select on cameras to anon/authenticated
-- Migration: 006_grant_cameras_select.sql
-- ============================================================================
-- Policy RLS 'cameras_select_all using (true)' sudah ada di 002.
-- Tapi RLS masih butuh GRANT di level table. Default anon tidak punya SELECT.
-- Migration ini memastikan anon + authenticated bisa SELECT cameras.

grant usage on schema public to anon, authenticated;

grant select on table public.cameras to anon, authenticated;
grant select on table public.profiles to anon, authenticated;
grant select on table public.loyalty_cards to authenticated;
grant select on table public.loyalty_history to authenticated;
grant select, insert, update on table public.bookings to authenticated;
grant select, insert, update on table public.payments to authenticated;

-- Service role (used by server actions with cookie-based auth) gets full access
grant all on table public.cameras to service_role;
grant all on table public.bookings to service_role;
grant all on table public.payments to service_role;
grant all on table public.profiles to service_role;
grant all on table public.loyalty_cards to service_role;
grant all on table public.loyalty_history to service_role;
