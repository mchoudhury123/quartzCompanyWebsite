-- ============================================================
-- The Quartz Company CRM — Migration V15: Structured customer details
-- Run this in the Supabase SQL Editor.
-- Adds an optional company name plus a city, so quotations can show a
-- structured address: Address Line 1 (existing `address`), City, Postcode
-- (existing `postcode`) — alongside the customer's name (full_name).
-- ============================================================

alter table public.leads add column if not exists company text;
alter table public.leads add column if not exists city text;
