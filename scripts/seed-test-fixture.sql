-- Seed minimal data for webhook integration test.
-- Creates: 1 auth.user, 1 profile, 1 booking, 1 payment record (pending).
-- The webbook test then submits a "settlement" notification -> expect payment status=paid + booking status=confirmed.

-- Idempotency: clean prior test rows by known test email.
do $$
declare
  v_user_id uuid;
  v_booking_id uuid;
  v_payment_id uuid;
  v_camera_id uuid;
  v_order_id  text := 'camera-rental-test-fixture';
begin
  -- Camera
  select id into v_camera_id from cameras order by name limit 1;
  if v_camera_id is null then
    raise exception 'No cameras in DB. Run supabase db push first.';
  end if;

  select id into v_user_id from profiles where email = 'qa-tester@local.test';
  if v_user_id is null then
    v_user_id := gen_random_uuid();
    insert into auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_user_meta_data)
    values (v_user_id, '00000000-0000-0000-0000-000000000000', 'qa-tester@local.test', crypt('test1234', gen_salt('bf')), now(), '{"full_name":"QA Tester","phone":"08123456789"}'::jsonb);

    insert into profiles (id, email, full_name, phone, role)
    values (v_user_id, 'qa-tester@local.test', 'QA Tester', '08123456789', 'user')
    on conflict (id) do nothing;
  end if;

  -- Remove prior fixture rows (re-runnable)
  delete from payments  where midtrans_order_id = v_order_id;
  delete from bookings   where notes = 'qa-fixture-do-not-rent';

  insert into bookings (user_id, camera_id, start_date, end_date, duration, total_price, final_price, status, notes)
  values (v_user_id, v_camera_id, current_date, current_date + 2, 3, 150000, 150000, 'pending', 'qa-fixture-do-not-rent')
  returning id into v_booking_id;

  insert into payments (booking_id, user_id, midtrans_order_id, amount, method, status)
  values (v_booking_id, v_user_id, v_order_id, 150000, 'qris', 'pending')
  returning id into v_payment_id;

  raise notice 'qa-tester user = %', v_user_id;
  raise notice 'qa-booking   = %', v_booking_id;
  raise notice 'qa-payment   = % payment_order_id=%', v_payment_id, v_order_id;
end $$;

-- ponytail: SQLite-style auth.users insert skips real RLS-friendly signup. OK for test-only fixture; remove from prod.
