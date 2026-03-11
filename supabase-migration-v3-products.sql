-- ============================================================
-- The Quartz Company CRM — Migration V3: Products & Quote Builder
-- Run this in the Supabase SQL Editor AFTER migration V2
-- ============================================================

-- 1. Products catalog table
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in (
    'stones', 'worktop', 'upstand', 'splashback', 'cladding', 'cill', 'processes'
  )),
  material_type text default 'quartz',
  price_20mm numeric default 0,
  price_30mm numeric default 0,
  unit text default 'per sqm',
  active boolean default true,
  created_at timestamptz default now()
);

-- 2. RLS
alter table public.products enable row level security;
create policy "Auth users can select products" on public.products for select to authenticated using (true);
create policy "Auth users can insert products" on public.products for insert to authenticated with check (true);
create policy "Auth users can update products" on public.products for update to authenticated using (true) with check (true);
create policy "Auth users can delete products" on public.products for delete to authenticated using (true);

-- 3. Add new columns to lead_quotes for the builder
alter table public.lead_quotes add column if not exists deposit_amount numeric default 0;
alter table public.lead_quotes add column if not exists selected_material text;
alter table public.lead_quotes add column if not exists selected_thickness text default '20mm';

-- 4. Seed placeholder products
insert into public.products (name, category, material_type, price_20mm, price_30mm, unit) values
  ('Calacatta Gold', 'stones', 'quartz', 280, 350, 'per sqm'),
  ('Siena Gold', 'stones', 'quartz', 260, 330, 'per sqm'),
  ('Statuario Venato', 'stones', 'quartz', 300, 380, 'per sqm'),
  ('Carrara White', 'stones', 'marble', 220, 290, 'per sqm'),
  ('Nero Marquina', 'stones', 'marble', 250, 320, 'per sqm'),
  ('Standard Worktop', 'worktop', 'quartz', 180, 230, 'per linear m'),
  ('Upstand 100mm', 'upstand', 'quartz', 45, 55, 'per linear m'),
  ('Splashback 300mm', 'splashback', 'quartz', 120, 150, 'per linear m'),
  ('Window Cill', 'cill', 'quartz', 80, 100, 'per linear m'),
  ('Cladding Panel', 'cladding', 'quartz', 160, 200, 'per sqm'),
  ('Hob Cutout', 'processes', 'quartz', 85, 85, 'each'),
  ('Sink Cutout', 'processes', 'quartz', 85, 85, 'each'),
  ('Tap Hole', 'processes', 'quartz', 25, 25, 'each'),
  ('Polishing', 'processes', 'quartz', 40, 40, 'per linear m');
