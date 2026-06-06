-- ============================================================
-- The Quartz Company CRM — Migration V20: Restore 'won' (Completed) status
-- Run this in the Supabase SQL Editor.
-- Migration v10 removed 'won'/'lost' from the leads status constraint, which
-- silently blocked moving a lead to Completed when the balance is paid in
-- full. This restores them ('won' is shown as "Completed" in the CRM).
-- ============================================================

ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS leads_status_check;
ALTER TABLE public.leads ADD CONSTRAINT leads_status_check
  CHECK (status IN ('new', 'contacted', 'quoted', 'deposit', 'won', 'lost'));
