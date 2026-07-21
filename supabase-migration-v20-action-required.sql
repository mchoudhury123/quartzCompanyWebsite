-- ============================================================
-- The Quartz Company CRM — Migration V20: Action Required
-- Run this in the Supabase SQL Editor.
-- Lets admin flag a client with a free-text "action required" note
-- (via pending_action = 'action_required'), optionally booking an
-- appointment if a date is set.
-- ============================================================

-- Free-text description of what needs doing for this client.
-- Nullable: existing leads are unaffected (stay NULL).
alter table public.leads add column if not exists action_note text;
