-- ============================================================
-- The Quartz Company CRM — ALL-IN-ONE Trade Contacts setup
-- Run this ONCE in the Supabase SQL Editor.
-- Creates the trade_contacts table (if it doesn't already exist), adds the
-- map / coverage / pricing columns, sets up security, and preloads the 7
-- directory contacts with their map positions. Safe to run more than once.
-- ============================================================

-- 1. Helper used by the updated_at trigger (harmless if it already exists).
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- 2. The table (full set of columns).
create table if not exists public.trade_contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  role text,
  phone text,
  email text,
  address text,
  county text,
  postcode text,
  mile_radius integer,
  fabrication boolean not null default false,
  templating boolean not null default false,
  installation boolean not null default false,
  price_1_slab text,
  price_2_slab text,
  price_3_slab text,
  price_4_slab text,
  sink_cutout text,
  hob_cutout text,
  extra_charges text,
  latitude double precision,
  longitude double precision,
  notes text,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2b. If the table already existed without the newer columns, add them.
alter table public.trade_contacts add column if not exists county text;
alter table public.trade_contacts add column if not exists postcode text;
alter table public.trade_contacts add column if not exists mile_radius integer;
alter table public.trade_contacts add column if not exists fabrication boolean not null default false;
alter table public.trade_contacts add column if not exists templating boolean not null default false;
alter table public.trade_contacts add column if not exists installation boolean not null default false;
alter table public.trade_contacts add column if not exists price_1_slab text;
alter table public.trade_contacts add column if not exists price_2_slab text;
alter table public.trade_contacts add column if not exists price_3_slab text;
alter table public.trade_contacts add column if not exists price_4_slab text;
alter table public.trade_contacts add column if not exists sink_cutout text;
alter table public.trade_contacts add column if not exists hob_cutout text;
alter table public.trade_contacts add column if not exists extra_charges text;
alter table public.trade_contacts add column if not exists latitude double precision;
alter table public.trade_contacts add column if not exists longitude double precision;
alter table public.trade_contacts add column if not exists notes text;
alter table public.trade_contacts add column if not exists active boolean default true;

create index if not exists idx_trade_contacts_active on public.trade_contacts(active);
create index if not exists idx_trade_contacts_role on public.trade_contacts(role);

-- 3. Security: signed-in admins can manage the directory.
alter table public.trade_contacts enable row level security;

drop policy if exists "Auth users can select trade_contacts" on public.trade_contacts;
drop policy if exists "Auth users can insert trade_contacts" on public.trade_contacts;
drop policy if exists "Auth users can update trade_contacts" on public.trade_contacts;
drop policy if exists "Auth users can delete trade_contacts" on public.trade_contacts;

create policy "Auth users can select trade_contacts"
  on public.trade_contacts for select to authenticated using (true);
create policy "Auth users can insert trade_contacts"
  on public.trade_contacts for insert to authenticated with check (true);
create policy "Auth users can update trade_contacts"
  on public.trade_contacts for update to authenticated using (true) with check (true);
create policy "Auth users can delete trade_contacts"
  on public.trade_contacts for delete to authenticated using (true);

drop trigger if exists trade_contacts_updated_at on public.trade_contacts;
create trigger trade_contacts_updated_at
  before update on public.trade_contacts
  for each row execute function public.handle_updated_at();

-- 4. Preload the 7 directory contacts (only if not already present).
insert into public.trade_contacts
  (name, company, role, phone, email, address, county, postcode, mile_radius,
   fabrication, templating, installation,
   price_1_slab, price_2_slab, price_3_slab, price_4_slab, sink_cutout, hob_cutout, extra_charges,
   latitude, longitude)
select 'Stone Cut','Stone Cut','Fabricator','44 7793019420',null,'Southall','London','UB1 3DZ',100,
       true,true,true,'900 + VAT','1300 + VAT',null,'1600 + VAT','incl','incl',null,51.509706,-0.358584
where not exists (select 1 from public.trade_contacts where name='Stone Cut');

insert into public.trade_contacts
  (name, company, role, phone, email, address, county, postcode, mile_radius,
   fabrication, templating, installation,
   price_1_slab, price_2_slab, price_3_slab, price_4_slab, sink_cutout, hob_cutout, extra_charges,
   latitude, longitude)
select 'Tarik SMA Marble','Tarik SMA Marble','Fabricator','44 7481935094',null,'283 Water Road','London','HA0 1HX',100,
       true,true,true,'£650','£800','£1,100','£1,350','incl','incl','£90 within London',51.539141,-0.287688
where not exists (select 1 from public.trade_contacts where name='Tarik SMA Marble');

insert into public.trade_contacts
  (name, company, role, phone, email, address, county, postcode, mile_radius,
   fabrication, templating, installation,
   price_1_slab, price_2_slab, price_3_slab, price_4_slab, sink_cutout, hob_cutout, extra_charges,
   latitude, longitude)
select 'Purestone Worktops','Purestone Worktops','Fabricator','44 7356235259','info@purestoneworktops.co.uk','3 Coombe Road','London','NW10 0EB',null,
       true,true,true,null,'£800','£1,600',null,'incl','incl',null,51.564002,-0.259311
where not exists (select 1 from public.trade_contacts where name='Purestone Worktops');

insert into public.trade_contacts
  (name, company, role, phone, email, address, county, postcode, mile_radius,
   fabrication, templating, installation,
   price_1_slab, price_2_slab, price_3_slab, price_4_slab, sink_cutout, hob_cutout, extra_charges,
   latitude, longitude)
select 'Pisa Stone','Pisa Stone','Fabricator','0161 44 33 227','Info@pisastone.co.uk','Textilose Rd, Trafford Park, Stretford','Manchester','M17 1WA',null,
       true,true,true,'1100 + VAT',null,null,null,'incl','incl',null,53.46219,-2.322343
where not exists (select 1 from public.trade_contacts where name='Pisa Stone');

insert into public.trade_contacts
  (name, company, role, phone, email, address, county, postcode, mile_radius,
   fabrication, templating, installation,
   price_1_slab, price_2_slab, price_3_slab, price_4_slab, sink_cutout, hob_cutout, extra_charges,
   latitude, longitude)
select 'Stone Sense','Stone Sense','Fabricator','0121 6302215','estimating@stonesense.co.uk','1-4 Alston Road','Birmingham',null,null,
       true,true,true,null,'835 + VAT',null,null,'incl','incl',null,null,null
where not exists (select 1 from public.trade_contacts where name='Stone Sense');

insert into public.trade_contacts
  (name, company, role, phone, email, address, county, postcode, mile_radius,
   fabrication, templating, installation,
   price_1_slab, price_2_slab, price_3_slab, price_4_slab, sink_cutout, hob_cutout, extra_charges,
   latitude, longitude)
select 'Granite Land','Granite Land','Fabricator','01384 639000','info@graniteland.co.uk','54-56 Lyde Green, Halesowen','Birmingham','B63 2PG',50,
       true,true,true,null,'1100 + VAT',null,null,'incl','incl',null,52.466917,-2.08874
where not exists (select 1 from public.trade_contacts where name='Granite Land');

insert into public.trade_contacts
  (name, company, role, phone, email, address, county, postcode, mile_radius,
   fabrication, templating, installation,
   price_1_slab, price_2_slab, price_3_slab, price_4_slab, sink_cutout, hob_cutout, extra_charges,
   latitude, longitude)
select 'Plymouth Stone','Plymouth Stone','Fabricator','01752 706388','sales@plymstone.com','109 Efford Rd','Plymouth','PL3 6NG',null,
       true,true,true,'1600 + VAT','1900 + VAT','2300 + VAT',null,'incl','incl',null,50.391045,-4.112234
where not exists (select 1 from public.trade_contacts where name='Plymouth Stone');
