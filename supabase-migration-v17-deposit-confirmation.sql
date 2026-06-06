-- ============================================================
-- The Quartz Company CRM — Migration V17: Deposit confirmation email
-- Run this in the Supabase SQL Editor.
-- Tracks when the "deposit received — thank you" email was sent, so each
-- customer only ever receives it once (webhook retries + backfill are safe).
-- ============================================================

alter table public.lead_quotes add column if not exists deposit_confirmation_sent_at timestamptz;
