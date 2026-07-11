create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  avatar_url text,
  comment text not null,
  rating int not null default 5,
  project text,
  is_visible boolean not null default true,
  created_at timestamptz not null default now()
);

alter table testimonials enable row level security;

create policy "Anyone can read testimonials" on testimonials for select using (is_visible = true);
