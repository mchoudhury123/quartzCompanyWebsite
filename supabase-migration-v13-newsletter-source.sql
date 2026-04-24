-- ============================================================
-- The Quartz Company CRM — Migration V13: Newsletter source
-- Allows leads captured via the footer "Stay Inspired" form
-- Run in Supabase SQL Editor AFTER migration V12
-- ============================================================

ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS leads_source_check;
ALTER TABLE public.leads ADD CONSTRAINT leads_source_check
  CHECK (source IN ('quote_modal', 'contact_form', 'admin', 'quote_page', 'newsletter'));
