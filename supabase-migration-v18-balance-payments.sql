-- ============================================================
-- The Quartz Company CRM — Migration V18: Balance (final) payments
-- Run this in the Supabase SQL Editor.
-- Lets a customer pay the remaining balance after their deposit.
-- ============================================================

alter table public.lead_quotes add column if not exists balance_paid boolean default false;
alter table public.lead_quotes add column if not exists balance_paid_at timestamptz;
alter table public.lead_quotes add column if not exists balance_session_id text;
alter table public.lead_quotes add column if not exists balance_payment_intent text;
alter table public.lead_quotes add column if not exists balance_confirmation_sent_at timestamptz;

-- Allow a 'balance_paid' activity to be logged when the balance is paid
ALTER TABLE public.lead_activities DROP CONSTRAINT IF EXISTS lead_activities_activity_type_check;
ALTER TABLE public.lead_activities ADD CONSTRAINT lead_activities_activity_type_check
  CHECK (activity_type IN (
    'status_change', 'note_added', 'quote_created', 'quote_updated',
    'order_created', 'order_updated', 'sample_requested', 'sample_sent',
    'sample_delivered', 'file_uploaded', 'file_deleted', 'call_logged',
    'sms_sent', 'email_sent', 'lead_created', 'lead_updated',
    'enquiry_received', 'deposit_paid', 'balance_paid'
  ));
