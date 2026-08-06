-- ============================================================
-- The Quartz Company CRM — Migration V25: Saved email templates
-- Run this in the Supabase SQL Editor.
-- Stores named, reusable email templates (subject + message) so admins can
-- save a composed client email and quickly reuse it when emailing others.
-- ============================================================

create table if not exists public.email_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subject text not null default '',
  body text not null default '',
  created_at timestamptz default now()
);

alter table public.email_templates enable row level security;

drop policy if exists "email_templates_authenticated_all" on public.email_templates;
create policy "email_templates_authenticated_all"
  on public.email_templates for all
  to authenticated
  using (true) with check (true);
