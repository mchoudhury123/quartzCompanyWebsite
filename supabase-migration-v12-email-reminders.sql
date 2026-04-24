-- ============================================================
-- The Quartz Company CRM — Migration V12: Daily email reminders
-- Run this in the Supabase SQL Editor AFTER migration V11
-- ============================================================

-- 1. Reminders table — one row per active drip (chase_measurements, no_answer)
create table if not exists public.email_reminders (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  reminder_type text not null check (reminder_type in ('chase_measurements', 'no_answer')),
  total_to_send int not null default 2,
  sent_count int not null default 0,
  last_sent_at timestamptz,
  next_send_at timestamptz not null default now(),
  cancelled_at timestamptz,
  created_at timestamptz not null default now()
);

-- Index used by the cron sweep ("find rows whose next email is due")
create index if not exists email_reminders_due_idx
  on public.email_reminders (next_send_at)
  where cancelled_at is null;

create index if not exists email_reminders_lead_idx
  on public.email_reminders (lead_id, reminder_type);

-- 2. RLS — authenticated admins can manage; service role (cron) bypasses RLS
alter table public.email_reminders enable row level security;

drop policy if exists "Auth users can select email_reminders" on public.email_reminders;
drop policy if exists "Auth users can insert email_reminders" on public.email_reminders;
drop policy if exists "Auth users can update email_reminders" on public.email_reminders;

create policy "Auth users can select email_reminders"
  on public.email_reminders for select to authenticated using (true);
create policy "Auth users can insert email_reminders"
  on public.email_reminders for insert to authenticated with check (true);
create policy "Auth users can update email_reminders"
  on public.email_reminders for update to authenticated using (true) with check (true);
