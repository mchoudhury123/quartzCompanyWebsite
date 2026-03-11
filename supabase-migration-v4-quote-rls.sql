-- Migration v4: Allow public read access to lead_quotes for customer-facing quote view
-- Run this in Supabase SQL Editor

-- Enable RLS on lead_quotes if not already enabled
alter table public.lead_quotes enable row level security;

-- Allow public (anonymous) read access to quotes by ID
-- This is needed for the /quote/view/:quoteId customer page
create policy "Public can view quotes by ID"
  on public.lead_quotes
  for select
  using (true);

-- Note: If you want to restrict to only 'sent' status quotes, replace the policy above with:
-- create policy "Public can view sent quotes"
--   on public.lead_quotes
--   for select
--   using (status in ('sent', 'accepted'));
