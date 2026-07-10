-- Extend payments for Midtrans webhook storage
-- ponytail: skipped dedicated columns (midtrans_transaction_id, gross_amount, payment_type, fraud_status).
-- Single JSONB keeps schema flat. Add dedicated columns when analytics need indexed queries on them.

alter table payments
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists midtrans_response jsonb;
