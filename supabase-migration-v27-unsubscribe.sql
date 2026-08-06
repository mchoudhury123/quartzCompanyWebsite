-- ============================================================
-- The Quartz Company CRM — Migration V27: Email unsubscribe
-- Run this in the Supabase SQL Editor.
-- Marks a lead as opted-out of marketing emails. Set when the recipient
-- clicks the unsubscribe link in a marketing/general email (handled by the
-- /api/unsubscribe serverless function using the service role key).
-- Transactional emails (quotes, "we tried to reach you") have no unsubscribe.
-- ============================================================

alter table public.leads add column if not exists unsubscribed boolean not null default false;
alter table public.leads add column if not exists unsubscribed_at timestamptz;

create index if not exists idx_leads_unsubscribed on public.leads(unsubscribed);
