-- ============================================================
-- The Quartz Company CRM — Migration V22: Allow 'cold' lead status
-- Run this in the Supabase SQL Editor.
-- The admin UI offers a "Cold Leads" status (StatusSelect, dashboard tile,
-- Leads filter), but the leads status CHECK constraint never permitted 'cold'.
-- Selecting it therefore failed silently — the DB rejected the update and the
-- UI only reflects a status change when the write succeeds. This adds 'cold'
-- to the allowed statuses so cold leads can be marked and filtered.
-- ============================================================

ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS leads_status_check;
ALTER TABLE public.leads ADD CONSTRAINT leads_status_check
  CHECK (status IN ('new', 'contacted', 'quoted', 'deposit', 'won', 'lost', 'cold'));
