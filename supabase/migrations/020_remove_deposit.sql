-- Remove deposit columns from loyalty_cards
alter table loyalty_cards
  drop column if exists deposit_balance,
  drop column if exists deposit_required;

-- Revert booking_id to NOT NULL (was made nullable for deposit payments)
alter table payments
  alter column booking_id set not null;
