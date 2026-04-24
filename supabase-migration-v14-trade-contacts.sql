-- ============================================================
-- The Quartz Company CRM — Migration V14: Trade contacts
-- Directory for external partners (fabricators, templaters,
-- installers, delivery drivers, etc.) that the business works with.
-- Run in Supabase SQL Editor AFTER migration V13
-- ============================================================

create table if not exists public.trade_contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  role text,
  phone text,
  email text,
  address text,
  notes text,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_trade_contacts_active on public.trade_contacts(active);
create index if not exists idx_trade_contacts_role on public.trade_contacts(role);

alter table public.trade_contacts enable row level security;

drop policy if exists "Auth users can select trade_contacts" on public.trade_contacts;
drop policy if exists "Auth users can insert trade_contacts" on public.trade_contacts;
drop policy if exists "Auth users can update trade_contacts" on public.trade_contacts;
drop policy if exists "Auth users can delete trade_contacts" on public.trade_contacts;

create policy "Auth users can select trade_contacts"
  on public.trade_contacts for select to authenticated using (true);
create policy "Auth users can insert trade_contacts"
  on public.trade_contacts for insert to authenticated with check (true);
create policy "Auth users can update trade_contacts"
  on public.trade_contacts for update to authenticated using (true) with check (true);
create policy "Auth users can delete trade_contacts"
  on public.trade_contacts for delete to authenticated using (true);

drop trigger if exists trade_contacts_updated_at on public.trade_contacts;
create trigger trade_contacts_updated_at
  before update on public.trade_contacts
  for each row execute function public.handle_updated_at();
