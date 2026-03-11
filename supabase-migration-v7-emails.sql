-- ============================================================
-- The Quartz Company CRM — Migration V7: Lead Emails Table
-- Run in Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS public.lead_emails (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  direction text DEFAULT 'outbound',
  subject text,
  body text NOT NULL,
  to_address text,
  from_address text DEFAULT 'sales@thequartzcompany.co.uk',
  zoho_message_id text,
  status text DEFAULT 'sent',
  sent_by text DEFAULT 'Admin',
  created_at timestamptz DEFAULT now()
);

-- RLS policies
ALTER TABLE public.lead_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Auth users can select emails"
  ON public.lead_emails FOR SELECT TO authenticated USING (true);

CREATE POLICY "Auth users can insert emails"
  ON public.lead_emails FOR INSERT TO authenticated WITH CHECK (true);
