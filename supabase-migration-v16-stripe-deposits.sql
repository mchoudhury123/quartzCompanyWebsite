-- ============================================================
-- The Quartz Company CRM — Migration V16: Stripe deposit payments
-- Run this in the Supabase SQL Editor.
-- Tracks online deposit payments taken via Stripe Checkout against a quote.
-- ============================================================

-- Payment tracking columns on quotes
alter table public.lead_quotes add column if not exists deposit_paid boolean default false;
alter table public.lead_quotes add column if not exists deposit_paid_at timestamptz;
alter table public.lead_quotes add column if not exists stripe_session_id text;
alter table public.lead_quotes add column if not exists stripe_payment_intent text;

-- Allow a 'deposit_paid' activity to be logged when a payment succeeds
ALTER TABLE public.lead_activities DROP CONSTRAINT IF EXISTS lead_activities_activity_type_check;
ALTER TABLE public.lead_activities ADD CONSTRAINT lead_activities_activity_type_check
  CHECK (activity_type IN (
    'status_change', 'note_added', 'quote_created', 'quote_updated',
    'order_created', 'order_updated', 'sample_requested', 'sample_sent',
    'sample_delivered', 'file_uploaded', 'file_deleted', 'call_logged',
    'sms_sent', 'email_sent', 'lead_created', 'lead_updated',
    'enquiry_received', 'deposit_paid'
  ));
