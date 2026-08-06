-- ============================================================
-- The Quartz Company CRM — Migration V28: Trade contacts map + pricing
-- Run this in the Supabase SQL Editor.
-- Extends trade_contacts with coverage (mile radius), services offered,
-- guideline pricing and map coordinates so the Trade Contacts page can plot
-- each operative with their service-radius circle and show pricing on click.
-- Coordinates are set from the postcode (geocoded via postcodes.io on save).
-- ============================================================

alter table public.trade_contacts add column if not exists county text;
alter table public.trade_contacts add column if not exists postcode text;
alter table public.trade_contacts add column if not exists mile_radius integer;

-- Services offered
alter table public.trade_contacts add column if not exists fabrication boolean not null default false;
alter table public.trade_contacts add column if not exists templating boolean not null default false;
alter table public.trade_contacts add column if not exists installation boolean not null default false;

-- Guideline pricing (free text so "£650", "900 + VAT", "incl" etc. all work)
alter table public.trade_contacts add column if not exists price_1_slab text;
alter table public.trade_contacts add column if not exists price_2_slab text;
alter table public.trade_contacts add column if not exists price_3_slab text;
alter table public.trade_contacts add column if not exists price_4_slab text;
alter table public.trade_contacts add column if not exists sink_cutout text;
alter table public.trade_contacts add column if not exists hob_cutout text;
alter table public.trade_contacts add column if not exists extra_charges text;

-- Map coordinates (from the postcode)
alter table public.trade_contacts add column if not exists latitude double precision;
alter table public.trade_contacts add column if not exists longitude double precision;
