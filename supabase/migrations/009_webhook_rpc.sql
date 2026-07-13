-- Webhook-safe RPC for payment status update.
-- anon role can call this without SELECT/UPDATE policy on payments.
-- Security: app-layer validates Midtrans signature before calling; RPC only touches status/paid_at/response.
-- ponytail: skipped per-column RLS (not feasible in Postgres). SECURITY DEFINER bypasses RLS safely here.

create or replace function update_payment_from_webhook(
  p_order_id text,
  p_status   text,
  p_payload  jsonb,
  p_paid_at  timestamptz
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_payment_id uuid;
  v_booking_id uuid;
  v_current_status text;
begin
  -- Lock payment row for update
  select id, booking_id, status into v_payment_id, v_booking_id, v_current_status
  from payments
  where midtrans_order_id = p_order_id
  for update;

  if v_payment_id is null then
    return null;  -- caller interprets as 404
  end if;

  -- Idempotency: skip if already in a terminal state
  if v_current_status in ('paid', 'failed', 'expired') then
    return v_payment_id;
  end if;

  update payments set
    status           = p_status::payment_status,
    midtrans_response = p_payload,
    paid_at          = coalesce(p_paid_at, paid_at),
    updated_at       = now()
  where id = v_payment_id;

  -- Auto-confirm booking when paid
  if p_status = 'paid' and v_booking_id is not null then
    update bookings set status = 'confirmed' where id = v_booking_id and status = 'pending';
  end if;

  return v_payment_id;
end;
$$;

-- Grant anon execute only (not SELECT on tables). App layer authenticates via Midtrans signature.
grant execute on function update_payment_from_webhook(text, text, jsonb, timestamptz) to anon, authenticated;
