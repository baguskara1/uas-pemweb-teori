-- ============================================================================
-- Sewa Kamera Ryox - Initial Database Schema
-- Migration: 001_initial_schema.sql
-- ============================================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- Drop objects if exist to ensure clean run
drop trigger if exists on_auth_user_created on auth.users;
drop trigger if exists loyalty_cards_updated_at on loyalty_cards;
drop function if exists handle_new_user();
drop function if exists update_updated_at_column();

drop table if exists payments cascade;
drop table if exists loyalty_history cascade;
drop table if exists loyalty_cards cascade;
drop table if exists bookings cascade;
drop table if exists cameras cascade;
drop table if exists profiles cascade;

drop type if exists user_role cascade;
drop type if exists booking_status cascade;
drop type if exists payment_status cascade;
drop type if exists payment_method cascade;

-- ============================================================================
-- ENUMS
-- ============================================================================
create type user_role as enum ('user', 'admin');

create type booking_status as enum (
  'pending',
  'confirmed',
  'in_progress',
  'returned',
  'completed',
  'cancelled'
);

create type payment_status as enum (
  'pending',
  'paid',
  'failed',
  'expired'
);

create type payment_method as enum (
  'va_bca',
  'va_mandiri',
  'va_bni',
  'qris',
  'gopay',
  'shopeepay'
);

-- ============================================================================
-- TABLE: profiles
-- ============================================================================
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  phone text,
  role user_role not null default 'user',
  avatar_url text,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- TABLE: cameras
-- ============================================================================
create table cameras (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brand text not null,
  type text not null, -- DSLR, Mirrorless, Action Cam, etc
  description text,
  price_per_day decimal(12, 2) not null,
  image_url text,
  stock integer not null default 0 check (stock >= 0),
  is_available boolean not null default true,
  created_at timestamptz not null default now()
);

create index cameras_brand_idx on cameras (brand);
create index cameras_type_idx on cameras (type);
create index cameras_available_idx on cameras (is_available) where is_available = true;

-- ============================================================================
-- TABLE: bookings
-- ============================================================================
create table bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  camera_id uuid not null references cameras(id) on delete restrict,
  start_date date not null,
  end_date date not null,
  duration integer not null check (duration > 0),
  total_price decimal(12, 2) not null,
  discount_amount decimal(12, 2) not null default 0,
  final_price decimal(12, 2) not null,
  status booking_status not null default 'pending',
  notes text,
  created_at timestamptz not null default now(),
  constraint bookings_dates_check check (end_date >= start_date)
);

create index bookings_user_idx on bookings (user_id);
create index bookings_camera_idx on bookings (camera_id);
create index bookings_status_idx on bookings (status);
create index bookings_dates_idx on bookings (start_date, end_date);

-- ============================================================================
-- TABLE: loyalty_cards
-- ============================================================================
create table loyalty_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references profiles(id) on delete cascade,
  current_count integer not null default 0 check (current_count >= 0),
  max_count integer not null default 5 check (max_count > 0),
  discount_percent integer not null default 15 check (discount_percent >= 0 and discount_percent <= 100),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- TABLE: loyalty_history
-- ============================================================================
create table loyalty_history (
  id uuid primary key default gen_random_uuid(),
  loyalty_card_id uuid not null references loyalty_cards(id) on delete cascade,
  booking_id uuid references bookings(id) on delete set null,
  count_before integer not null,
  count_after integer not null,
  discount_applied boolean not null default false,
  discount_amount decimal(12, 2) not null default 0,
  created_at timestamptz not null default now()
);

create index loyalty_history_card_idx on loyalty_history (loyalty_card_id);

-- ============================================================================
-- TABLE: payments
-- ============================================================================
create table payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  amount decimal(12, 2) not null,
  method payment_method not null,
  midtrans_order_id text unique,
  midtrans_token text,
  status payment_status not null default 'pending',
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create index payments_booking_idx on payments (booking_id);
create index payments_user_idx on payments (user_id);
create index payments_status_idx on payments (status);
create index payments_midtrans_order_idx on payments (midtrans_order_id);

-- ============================================================================
-- TRIGGER: Auto-create profile on user signup
-- ============================================================================
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    'user'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================================
-- TRIGGER: Auto-update loyalty_card updated_at
-- ============================================================================
create or replace function update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger loyalty_cards_updated_at
  before update on loyalty_cards
  for each row execute function update_updated_at_column();
