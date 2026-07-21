-- ============================================================
-- The Quartz Company CRM — Migration V19: Pending deposits
-- Run this in the Supabase SQL Editor.
-- Lets admin flag a quote's deposit as "pending" with a predicted
-- payment date, before the deposit is actually taken.
-- ============================================================

-- Predicted date the customer is expected to pay their deposit.
-- Nullable: existing quotes are unaffected (stay NULL = not pending).
alter table public.lead_quotes add column if not exists deposit_expected_date date;

-- Allow a 'deposit_pending' activity to be logged when a deposit is
-- flagged as pending with an expected payment date.
ALTER TABLE public.lead_activities DROP CONSTRAINT IF EXISTS lead_activities_activity_type_check;
ALTER TABLE public.lead_activities ADD CONSTRAINT lead_activities_activity_type_check
  CHECK (activity_type IN (
    'status_change', 'note_added', 'quote_created', 'quote_updated',
    'order_created', 'order_updated', 'sample_requested', 'sample_sent',
    'sample_delivered', 'file_uploaded', 'file_deleted', 'call_logged',
    'sms_sent', 'email_sent', 'lead_created', 'lead_updated',
    'enquiry_received', 'deposit_paid', 'balance_paid', 'deposit_pending'
  ));
