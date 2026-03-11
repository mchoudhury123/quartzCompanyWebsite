-- ============================================================
-- The Quartz Company CRM — Migration V2: Client Detail Features
-- Run this in the Supabase SQL Editor AFTER the initial schema
-- ============================================================

-- 1. Add new columns to leads table
alter table public.leads add column if not exists address text;
alter table public.leads add column if not exists lead_owner text default 'Unassigned';
alter table public.leads add column if not exists lead_category text default 'General';
alter table public.leads add column if not exists marketing_schedule text;

-- 2. Lead Activities (timeline)
create table if not exists public.lead_activities (
  id uuid default gen_random_uuid() primary key,
  lead_id uuid not null references public.leads(id) on delete cascade,
  activity_type text not null check (activity_type in (
    'status_change', 'note_added', 'quote_created', 'quote_updated',
    'order_created', 'order_updated', 'sample_requested', 'sample_sent',
    'sample_delivered', 'file_uploaded', 'file_deleted', 'call_logged',
    'sms_sent', 'email_sent', 'lead_created', 'lead_updated'
  )),
  title text not null,
  description text,
  metadata jsonb default '{}'::jsonb,
  author text not null default 'System',
  created_at timestamptz default now()
);

-- 3. Lead Quotes
create table if not exists public.lead_quotes (
  id uuid default gen_random_uuid() primary key,
  lead_id uuid not null references public.leads(id) on delete cascade,
  quote_number text not null,
  title text not null,
  description text,
  items jsonb default '[]'::jsonb,
  subtotal numeric default 0,
  vat numeric default 0,
  total numeric default 0,
  status text not null default 'draft' check (status in ('draft', 'sent', 'accepted', 'rejected', 'expired')),
  valid_until date,
  created_by text not null default 'Admin',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. Lead Orders
create table if not exists public.lead_orders (
  id uuid default gen_random_uuid() primary key,
  lead_id uuid not null references public.leads(id) on delete cascade,
  quote_id uuid references public.lead_quotes(id) on delete set null,
  order_number text not null,
  status text not null default 'pending' check (status in (
    'pending', 'confirmed', 'in_production', 'ready', 'dispatched', 'installed', 'completed', 'cancelled'
  )),
  total numeric default 0,
  deposit_amount numeric default 0,
  deposit_paid boolean default false,
  installation_date date,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5. Lead Samples
create table if not exists public.lead_samples (
  id uuid default gen_random_uuid() primary key,
  lead_id uuid not null references public.leads(id) on delete cascade,
  product_name text not null,
  colour text,
  material text,
  status text not null default 'requested' check (status in (
    'requested', 'preparing', 'sent', 'delivered', 'returned'
  )),
  tracking_number text,
  requested_at timestamptz default now(),
  sent_at timestamptz,
  delivered_at timestamptz,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 6. Lead Files
create table if not exists public.lead_files (
  id uuid default gen_random_uuid() primary key,
  lead_id uuid not null references public.leads(id) on delete cascade,
  file_name text not null,
  file_type text,
  file_size bigint,
  storage_path text not null,
  category text default 'general' check (category in (
    'measurement', 'plan', 'photo', 'contract', 'invoice', 'general'
  )),
  uploaded_by text not null default 'Admin',
  created_at timestamptz default now()
);

-- 7. Lead Calls
create table if not exists public.lead_calls (
  id uuid default gen_random_uuid() primary key,
  lead_id uuid not null references public.leads(id) on delete cascade,
  direction text not null default 'outbound' check (direction in ('inbound', 'outbound')),
  duration_seconds integer,
  outcome text check (outcome in ('answered', 'no_answer', 'voicemail', 'busy', 'callback_requested')),
  summary text,
  called_by text not null default 'Admin',
  called_at timestamptz default now(),
  created_at timestamptz default now()
);

-- 8. Updated_at triggers for new tables
drop trigger if exists lead_quotes_updated_at on public.lead_quotes;
create trigger lead_quotes_updated_at before update on public.lead_quotes
  for each row execute function public.handle_updated_at();

drop trigger if exists lead_orders_updated_at on public.lead_orders;
create trigger lead_orders_updated_at before update on public.lead_orders
  for each row execute function public.handle_updated_at();

drop trigger if exists lead_samples_updated_at on public.lead_samples;
create trigger lead_samples_updated_at before update on public.lead_samples
  for each row execute function public.handle_updated_at();

-- 9. Enable RLS on all new tables
alter table public.lead_activities enable row level security;
alter table public.lead_quotes enable row level security;
alter table public.lead_orders enable row level security;
alter table public.lead_samples enable row level security;
alter table public.lead_files enable row level security;
alter table public.lead_calls enable row level security;

-- 10. RLS Policies for lead_activities
create policy "Auth users can select activities" on public.lead_activities for select to authenticated using (true);
create policy "Auth users can insert activities" on public.lead_activities for insert to authenticated with check (true);
create policy "Auth users can delete activities" on public.lead_activities for delete to authenticated using (true);

-- 11. RLS Policies for lead_quotes
create policy "Auth users can select quotes" on public.lead_quotes for select to authenticated using (true);
create policy "Auth users can insert quotes" on public.lead_quotes for insert to authenticated with check (true);
create policy "Auth users can update quotes" on public.lead_quotes for update to authenticated using (true) with check (true);
create policy "Auth users can delete quotes" on public.lead_quotes for delete to authenticated using (true);

-- 12. RLS Policies for lead_orders
create policy "Auth users can select orders" on public.lead_orders for select to authenticated using (true);
create policy "Auth users can insert orders" on public.lead_orders for insert to authenticated with check (true);
create policy "Auth users can update orders" on public.lead_orders for update to authenticated using (true) with check (true);
create policy "Auth users can delete orders" on public.lead_orders for delete to authenticated using (true);

-- 13. RLS Policies for lead_samples
create policy "Auth users can select samples" on public.lead_samples for select to authenticated using (true);
create policy "Auth users can insert samples" on public.lead_samples for insert to authenticated with check (true);
create policy "Auth users can update samples" on public.lead_samples for update to authenticated using (true) with check (true);
create policy "Auth users can delete samples" on public.lead_samples for delete to authenticated using (true);

-- 14. RLS Policies for lead_files
create policy "Auth users can select files" on public.lead_files for select to authenticated using (true);
create policy "Auth users can insert files" on public.lead_files for insert to authenticated with check (true);
create policy "Auth users can delete files" on public.lead_files for delete to authenticated using (true);

-- 15. RLS Policies for lead_calls
create policy "Auth users can select calls" on public.lead_calls for select to authenticated using (true);
create policy "Auth users can insert calls" on public.lead_calls for insert to authenticated with check (true);
create policy "Auth users can delete calls" on public.lead_calls for delete to authenticated using (true);

-- 16. Indexes
create index if not exists idx_lead_activities_lead_id on public.lead_activities(lead_id);
create index if not exists idx_lead_activities_created_at on public.lead_activities(created_at desc);
create index if not exists idx_lead_quotes_lead_id on public.lead_quotes(lead_id);
create index if not exists idx_lead_orders_lead_id on public.lead_orders(lead_id);
create index if not exists idx_lead_samples_lead_id on public.lead_samples(lead_id);
create index if not exists idx_lead_files_lead_id on public.lead_files(lead_id);
create index if not exists idx_lead_calls_lead_id on public.lead_calls(lead_id);

-- 17. Storage bucket for lead files
-- NOTE: Run this separately if it fails (some Supabase plans handle storage differently)
-- insert into storage.buckets (id, name, public) values ('lead-files', 'lead-files', false);
