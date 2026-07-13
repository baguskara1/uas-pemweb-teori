-- ============================================================================
-- Sewa Kamera Ryox - Deposit System untuk Anti-Fraud
-- Migration: 016_loyalty_deposit.sql
-- ============================================================================

-- Tambah kolom deposit ke loyalty_cards
alter table loyalty_cards
  add column if not exists deposit_balance decimal(12, 2) not null default 0,
  add column if not exists deposit_required decimal(12, 2) not null default 100000,
  add column if not exists total_rentals integer not null default 0,
  add column if not exists is_blacklisted boolean not null default false;

-- Index untuk admin search
create index if not exists idx_loyalty_cards_is_blacklisted on loyalty_cards(is_blacklisted);
create index if not exists idx_loyalty_cards_deposit_status on loyalty_cards(user_id) where deposit_balance >= deposit_required;

-- Grant permissions
grant all on loyalty_cards to authenticated;
grant all on loyalty_cards to service_role;
grant all on loyalty_history to service_role;
