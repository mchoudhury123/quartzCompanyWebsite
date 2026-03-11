-- ============================================================
-- The Quartz Company CRM — Migration V6: Admin Lead Source
-- Run in Supabase SQL Editor
-- ============================================================

-- 1. Widen the source CHECK constraint to allow 'admin' and 'quote_page'
ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS leads_source_check;
ALTER TABLE public.leads ADD CONSTRAINT leads_source_check
  CHECK (source IN ('quote_modal', 'contact_form', 'admin', 'quote_page'));
