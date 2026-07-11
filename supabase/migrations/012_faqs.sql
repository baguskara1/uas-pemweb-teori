create table if not exists faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order int not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now()
);

alter table faqs enable row level security;

create policy "Anyone can read faqs" on faqs for select using (is_visible = true);
