-- ============================================================================
-- Sewa Kamera Ryox - Row Level Security Policies
-- Migration: 002_rls_policies.sql
-- ============================================================================

-- ============================================================================
-- Helper: admin check (security definer avoids recursive profile lookups)
-- ============================================================================
create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ============================================================================
-- profiles
-- ============================================================================
alter table profiles enable row level security;

create policy "profiles_select_own_or_admin"
  on profiles for select
  using (auth.uid() = id or is_admin());

create policy "profiles_insert_self"
  on profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own_or_admin"
  on profiles for update
  using (auth.uid() = id or is_admin())
  with check (auth.uid() = id or is_admin());

create policy "profiles_delete_admin"
  on profiles for delete
  using (is_admin());

-- ============================================================================
-- cameras
-- ============================================================================
alter table cameras enable row level security;

create policy "cameras_select_all"
  on cameras for select
  using (true);

create policy "cameras_insert_admin"
  on cameras for insert
  with check (is_admin());

create policy "cameras_update_admin"
  on cameras for update
  using (is_admin())
  with check (is_admin());

create policy "cameras_delete_admin"
  on cameras for delete
  using (is_admin());

-- ============================================================================
-- bookings
-- ============================================================================
alter table bookings enable row level security;

create policy "bookings_select_own_or_admin"
  on bookings for select
  using (auth.uid() = user_id or is_admin());

create policy "bookings_insert_self"
  on bookings for insert
  with check (auth.uid() = user_id);

create policy "bookings_update_own_or_admin"
  on bookings for update
  using (auth.uid() = user_id or is_admin())
  with check (auth.uid() = user_id or is_admin());

create policy "bookings_delete_admin"
  on bookings for delete
  using (is_admin());

-- ============================================================================
-- loyalty_cards
-- ============================================================================
alter table loyalty_cards enable row level security;

create policy "loyalty_cards_select_own_or_admin"
  on loyalty_cards for select
  using (auth.uid() = user_id or is_admin());

-- Inserts/updates happen via security definer functions in the backend
create policy "loyalty_cards_modify_admin"
  on loyalty_cards for all
  using (is_admin())
  with check (is_admin());

-- ============================================================================
-- loyalty_history
-- ============================================================================
alter table loyalty_history enable row level security;

create policy "loyalty_history_select_own_or_admin"
  on loyalty_history for select
  using (
    is_admin()
    or exists (
      select 1 from loyalty_cards lc
      where lc.id = loyalty_history.loyalty_card_id
        and lc.user_id = auth.uid()
    )
  );

create policy "loyalty_history_modify_admin"
  on loyalty_history for all
  using (is_admin())
  with check (is_admin());

-- ============================================================================
-- payments
-- ============================================================================
alter table payments enable row level security;

create policy "payments_select_own_or_admin"
  on payments for select
  using (auth.uid() = user_id or is_admin());

create policy "payments_insert_self"
  on payments for insert
  with check (auth.uid() = user_id);

-- Status changes come from webhook (service role bypasses RLS)
create policy "payments_update_admin"
  on payments for update
  using (is_admin())
  with check (is_admin());
