alter table bookings
  add column if not exists order_group text;

create index if not exists bookings_order_group_idx on bookings (order_group);

-- Update webhook RPC to confirm ALL bookings in the same order_group
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
  v_order_group text;
begin
  select id, booking_id into v_payment_id, v_booking_id
  from payments
  where midtrans_order_id = p_order_id
  for update;

  if v_payment_id is null then
    return null;
  end if;

  update payments set
    status           = p_status::payment_status,
    midtrans_response = p_payload,
    paid_at          = coalesce(p_paid_at, paid_at),
    updated_at       = now()
  where id = v_payment_id;

  -- Confirm all bookings when paid
  if p_status = 'paid' then
    -- Get order_group from the payment's booking
    select order_group into v_order_group
    from bookings
    where id = v_booking_id;

    if v_order_group is not null then
      -- Confirm all bookings in the same order_group
      update bookings
      set status = 'confirmed'
      where order_group = v_order_group
        and status = 'pending';
    elsif v_booking_id is not null then
      -- Single booking (no order_group) — existing behavior
      update bookings
      set status = 'confirmed'
      where id = v_booking_id
        and status = 'pending';
    end if;
  end if;

  return v_payment_id;
end;
$$;
