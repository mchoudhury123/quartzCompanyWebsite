-- ============================================================
-- The Quartz Company CRM — Migration V23: Appointment timeline activity
-- Run this in the Supabase SQL Editor.
-- Appointments booked / completed / cancelled with a customer are now
-- recorded in that lead's activity timeline. The lead_activities
-- activity_type CHECK constraint must allow the new types, otherwise the
-- inserts are silently rejected and nothing appears in the history.
-- This re-declares the full allowed list including the appointment types.
-- ============================================================

ALTER TABLE public.lead_activities DROP CONSTRAINT IF EXISTS lead_activities_activity_type_check;
ALTER TABLE public.lead_activities ADD CONSTRAINT lead_activities_activity_type_check
  CHECK (activity_type IN (
    'status_change', 'note_added', 'quote_created', 'quote_updated',
    'order_created', 'order_updated', 'sample_requested', 'sample_sent',
    'sample_delivered', 'file_uploaded', 'file_deleted', 'call_logged',
    'sms_sent', 'email_sent', 'lead_created', 'lead_updated',
    'enquiry_received', 'deposit_paid', 'balance_paid', 'deposit_pending',
    'appointment_booked', 'appointment_updated', 'appointment_cancelled'
  ));
