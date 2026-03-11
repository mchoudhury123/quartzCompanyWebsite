-- ============================================================
-- The Quartz Company CRM — Migration V5: Twilio Integration
-- Run in Supabase SQL Editor
-- ============================================================

-- 1. Add Twilio tracking columns to lead_calls
ALTER TABLE public.lead_calls ADD COLUMN IF NOT EXISTS twilio_call_sid text;
ALTER TABLE public.lead_calls ADD COLUMN IF NOT EXISTS call_type text DEFAULT 'manual'
  CHECK (call_type IN ('manual', 'twilio'));

-- 2. Index on twilio_call_sid for webhook lookups
CREATE INDEX IF NOT EXISTS idx_lead_calls_twilio_sid ON public.lead_calls(twilio_call_sid);

-- 3. Lead SMS table
CREATE TABLE IF NOT EXISTS public.lead_sms (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  direction text NOT NULL DEFAULT 'outbound' CHECK (direction IN ('inbound', 'outbound')),
  body text NOT NULL,
  to_number text NOT NULL,
  from_number text NOT NULL,
  twilio_message_sid text,
  status text DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'failed', 'received')),
  sent_by text NOT NULL DEFAULT 'Admin',
  created_at timestamptz DEFAULT now()
);

-- 4. RLS on lead_sms
ALTER TABLE public.lead_sms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Auth users can select sms" ON public.lead_sms
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can insert sms" ON public.lead_sms
  FOR INSERT TO authenticated WITH CHECK (true);

-- 5. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_lead_sms_lead_id ON public.lead_sms(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_sms_created_at ON public.lead_sms(created_at DESC);

-- 6. Call recording URL column
ALTER TABLE public.lead_calls ADD COLUMN IF NOT EXISTS recording_url text;
