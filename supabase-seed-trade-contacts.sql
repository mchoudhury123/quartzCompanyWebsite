-- ============================================================
-- The Quartz Company CRM — Seed: Fabricator & subcontractor directory
-- Run this in the Supabase SQL Editor AFTER migration v28.
-- Preloads the trade contacts from the directory spreadsheet, with map
-- coordinates already geocoded from their postcodes. Idempotent: each row is
-- only inserted if a contact with that name doesn't already exist.
-- Services are set to fab+templating+installation (their pricing is for the
-- full package) — adjust any that are wrong from the Edit Contact screen.
-- ============================================================

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
