-- ============================================================
-- The Quartz Company CRM — Migration V26: Sale periods
-- Run this in the Supabase SQL Editor.
-- Named sale campaigns with a date range. Leads are auto-sorted into the
-- period that was most recently running when they came in (by created_at),
-- so the Clients list can colour-code leads by how many sale periods ago
-- they enquired. Managed from the "Sale Periods" admin screen.
-- ============================================================

create table if not exists public.sale_periods (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  start_date date not null,
  end_date date,
  created_at timestamptz default now()
);

alter table public.sale_periods enable row level security;

drop policy if exists "sale_periods_authenticated_all" on public.sale_periods;
create policy "sale_periods_authenticated_all"
  on public.sale_periods for all
  to authenticated
  using (true) with check (true);

-- The public website reads the current sale period to show its end date
-- (ticker, banners, countdown popup), so allow anonymous read-only access.
-- Sale dates are public marketing info; no write access is granted to anon.
drop policy if exists "sale_periods_anon_read" on public.sale_periods;
create policy "sale_periods_anon_read"
  on public.sale_periods for select
  to anon
  using (true);
