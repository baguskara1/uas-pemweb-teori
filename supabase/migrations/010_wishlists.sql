create table if not exists wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  camera_id uuid not null references cameras(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, camera_id)
);

alter table wishlists enable row level security;

create policy "Users can read own wishlist" on wishlists for select using (auth.uid() = user_id);
create policy "Users can insert own wishlist" on wishlists for insert with check (auth.uid() = user_id);
create policy "Users can delete own wishlist" on wishlists for delete using (auth.uid() = user_id);
