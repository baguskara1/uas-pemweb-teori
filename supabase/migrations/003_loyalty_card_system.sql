-- ============================================================================
-- Sewa Kamera Ryox - Loyalty Card System
-- Migration: 003_loyalty_card_system.sql
-- ============================================================================

-- Auto-create loyalty card on first booking.
create or replace function ensure_loyalty_card_for_booking()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into loyalty_cards (user_id)
  values (new.user_id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists bookings_ensure_loyalty_card on bookings;
create trigger bookings_ensure_loyalty_card
  after insert on bookings
  for each row execute function ensure_loyalty_card_for_booking();

-- Increment loyalty progress when booking is marked completed.
create or replace function update_loyalty_on_booking_completed()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  card loyalty_cards%rowtype;
  before_count integer;
  after_count integer;
begin
  if new.status <> 'completed' or old.status = 'completed' then
    return new;
  end if;

  insert into loyalty_cards (user_id)
  values (new.user_id)
  on conflict (user_id) do nothing;

  select * into card
  from loyalty_cards
  where user_id = new.user_id
  for update;

  before_count := card.current_count;
  after_count := least(card.current_count + 1, card.max_count);

  update loyalty_cards
  set current_count = after_count
  where id = card.id;

  insert into loyalty_history (
    loyalty_card_id,
    booking_id,
    count_before,
    count_after,
    discount_applied,
    discount_amount
  ) values (
    card.id,
    new.id,
    before_count,
    after_count,
    false,
    0
  );

  return new;
end;
$$;

drop trigger if exists bookings_update_loyalty_on_completed on bookings;
create trigger bookings_update_loyalty_on_completed
  after update of status on bookings
  for each row execute function update_loyalty_on_booking_completed();

-- Create booking with availability check, stock update, and loyalty discount.
create or replace function create_booking_with_loyalty(
  p_camera_id uuid,
  p_start_date date,
  p_end_date date,
  p_duration integer,
  p_total_price decimal
)
returns table (
  booking_id uuid,
  final_price decimal,
  discount_applied boolean
)
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  selected_camera cameras%rowtype;
  active_booking_count integer;
  card loyalty_cards%rowtype;
  discount_amount decimal(12, 2) := 0;
  computed_final_price decimal(12, 2);
  new_booking_id uuid;
begin
  if current_user_id is null then
    raise exception 'Unauthorized';
  end if;

  if p_duration <= 0 or p_end_date < p_start_date then
    raise exception 'Tanggal booking tidak valid';
  end if;

  select * into selected_camera
  from cameras
  where id = p_camera_id
  for update;

  if not found then
    raise exception 'Kamera tidak ditemukan';
  end if;

  if not selected_camera.is_available or selected_camera.stock < 1 then
    raise exception 'Kamera tidak tersedia';
  end if;

  select count(*) into active_booking_count
  from bookings
  where camera_id = p_camera_id
    and status in ('pending', 'confirmed', 'in_progress')
    and start_date <= p_end_date
    and end_date >= p_start_date;

  if active_booking_count >= selected_camera.stock then
    raise exception 'Kamera sudah dipesan pada tanggal tersebut';
  end if;

  insert into loyalty_cards (user_id)
  values (current_user_id)
  on conflict (user_id) do nothing;

  select * into card
  from loyalty_cards
  where user_id = current_user_id
  for update;

  if card.is_active and card.current_count >= card.max_count then
    discount_amount := round(p_total_price * card.discount_percent / 100.0);
  end if;

  computed_final_price := p_total_price - discount_amount;

  insert into bookings (
    user_id,
    camera_id,
    start_date,
    end_date,
    duration,
    total_price,
    discount_amount,
    final_price,
    status
  ) values (
    current_user_id,
    p_camera_id,
    p_start_date,
    p_end_date,
    p_duration,
    p_total_price,
    discount_amount,
    computed_final_price,
    'pending'
  ) returning id into new_booking_id;

  update cameras
  set stock = selected_camera.stock - 1,
      is_available = (selected_camera.stock - 1) > 0
  where id = p_camera_id;

  if discount_amount > 0 then
    update loyalty_cards
    set current_count = 0
    where id = card.id;

    insert into loyalty_history (
      loyalty_card_id,
      booking_id,
      count_before,
      count_after,
      discount_applied,
      discount_amount
    ) values (
      card.id,
      new_booking_id,
      card.current_count,
      0,
      true,
      discount_amount
    );
  end if;

  return query select new_booking_id, computed_final_price, discount_amount > 0;
end;
$$;

revoke all on function create_booking_with_loyalty(uuid, date, date, integer, decimal) from public;
grant execute on function create_booking_with_loyalty(uuid, date, date, integer, decimal) to authenticated;

revoke all on function ensure_loyalty_card_for_booking() from public;
revoke all on function update_loyalty_on_booking_completed() from public;
