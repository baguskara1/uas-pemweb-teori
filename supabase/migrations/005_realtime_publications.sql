-- ============================================================================
-- Sewa Kamera Ryox - Realtime Publications
-- Migration: 005_realtime_publications.sql
-- ============================================================================
-- Supabase Realtime listens via postgres_publication.
-- Default `supabase_realtime` publication must include the tables we want streamed.

do $$
begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    create publication supabase_realtime for table
      cameras,
      bookings,
      loyalty_cards,
      loyalty_history,
      payments;
  else
    -- ensure required tables are members of the publication
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'cameras'
    ) then
      alter publication supabase_realtime add table cameras;
    end if;
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'bookings'
    ) then
      alter publication supabase_realtime add table bookings;
    end if;
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'loyalty_cards'
    ) then
      alter publication supabase_realtime add table loyalty_cards;
    end if;
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'loyalty_history'
    ) then
      alter publication supabase_realtime add table loyalty_history;
    end if;
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'payments'
    ) then
      alter publication supabase_realtime add table payments;
    end if;
  end if;
end $$;

-- Make sure the publication's row filter uses the Supabase Realtime identity helper.
alter table cameras replica identity default;
alter table bookings replica identity default;
alter table loyalty_cards replica identity default;
alter table loyalty_history replica identity default;
alter table payments replica identity default;
