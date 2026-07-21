-- ============================================================
-- The Quartz Company CRM — Migration V21: Email marketing groups
-- Run this in the Supabase SQL Editor.
-- Stores saved recipient groups for the Email Marketing tab.
-- ============================================================

create table if not exists public.email_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  lead_ids uuid[] not null default '{}',
  created_at timestamptz default now()
);

alter table public.email_groups enable row level security;

drop policy if exists "email_groups_authenticated_all" on public.email_groups;
create policy "email_groups_authenticated_all"
  on public.email_groups for all
  to authenticated
  using (true) with check (true);
