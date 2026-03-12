-- ============================================================
-- The Quartz Company CRM — Migration V8: Lead Actions Workflow
-- Run in Supabase SQL Editor
-- ============================================================

-- Add pending_action column to track what needs doing next for each lead
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS pending_action text;

-- Set existing new leads to call_new so they appear in the workflow
UPDATE public.leads SET pending_action = 'call_new' WHERE status = 'new' AND pending_action IS NULL;
