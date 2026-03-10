-- ============================================================
-- The Quartz Company CRM — Supabase Schema
-- Run this in the Supabase SQL Editor (supabase.com > project > SQL Editor)
-- ============================================================

-- 1. Leads table
create table if not exists public.leads (
  id uuid default gen_random_uuid() primary key,
  full_name text not null,
  email text,
  phone text,
  postcode text,
  source text not null check (source in ('quote_modal', 'contact_form')),
  status text not null default 'new' check (status in ('new', 'contacted', 'quoted', 'won', 'lost', 'deposit')),

  -- Quote-specific fields
  product_name text,
  product_material text,
  run_length_mm numeric,
  depth_mm numeric,
  thickness text,
  cut_outs jsonb default '{}'::jsonb,
  want_samples boolean default false,
  want_callback boolean default false,
  callback_time text,

  -- Contact-form-specific fields
  subject text,
  message text,

  -- General
  comments text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Lead notes table
create table if not exists public.lead_notes (
  id uuid default gen_random_uuid() primary key,
  lead_id uuid not null references public.leads(id) on delete cascade,
  content text not null,
  author text not null default 'Sales Team',
  created_at timestamptz default now()
);

-- 3. Auto-update updated_at on leads
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists leads_updated_at on public.leads;
create trigger leads_updated_at
  before update on public.leads
  for each row
  execute function public.handle_updated_at();

-- 4. Enable Row Level Security
alter table public.leads enable row level security;
alter table public.lead_notes enable row level security;

-- 5. RLS Policies for leads
-- Anyone (anon) can INSERT leads (public forms)
create policy "Anon can insert leads"
  on public.leads for insert
  to anon
  with check (true);

-- Authenticated users get full access
create policy "Auth users can select leads"
  on public.leads for select
  to authenticated
  using (true);

create policy "Auth users can update leads"
  on public.leads for update
  to authenticated
  using (true)
  with check (true);

create policy "Auth users can delete leads"
  on public.leads for delete
  to authenticated
  using (true);

create policy "Auth users can insert leads"
  on public.leads for insert
  to authenticated
  with check (true);

-- 6. RLS Policies for lead_notes
-- Only authenticated users can manage notes
create policy "Auth users can select notes"
  on public.lead_notes for select
  to authenticated
  using (true);

create policy "Auth users can insert notes"
  on public.lead_notes for insert
  to authenticated
  with check (true);

create policy "Auth users can delete notes"
  on public.lead_notes for delete
  to authenticated
  using (true);

-- 7. Indexes for performance
create index if not exists idx_leads_status on public.leads(status);
create index if not exists idx_leads_source on public.leads(source);
create index if not exists idx_leads_created_at on public.leads(created_at desc);
create index if not exists idx_lead_notes_lead_id on public.lead_notes(lead_id);
