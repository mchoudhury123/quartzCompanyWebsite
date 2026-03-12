-- ============================================================
-- The Quartz Company CRM — Migration V9: Add enquiry_received activity type
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Drop the existing CHECK constraint and re-add with enquiry_received
ALTER TABLE public.lead_activities DROP CONSTRAINT IF EXISTS lead_activities_activity_type_check;
ALTER TABLE public.lead_activities ADD CONSTRAINT lead_activities_activity_type_check
  CHECK (activity_type IN (
    'status_change', 'note_added', 'quote_created', 'quote_updated',
    'order_created', 'order_updated', 'sample_requested', 'sample_sent',
    'sample_delivered', 'file_uploaded', 'file_deleted', 'call_logged',
    'sms_sent', 'email_sent', 'lead_created', 'lead_updated',
    'enquiry_received'
  ));

-- Also need to allow anonymous users to insert activities
-- (enquiry is logged from public-facing pages, not admin)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'lead_activities'
    AND policyname = 'Anon users can insert activities'
  ) THEN
    CREATE POLICY "Anon users can insert activities"
      ON public.lead_activities FOR INSERT TO anon WITH CHECK (true);
  END IF;
END $$;
