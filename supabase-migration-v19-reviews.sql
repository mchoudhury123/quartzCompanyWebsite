-- ============================================================
-- The Quartz Company CRM — Migration V19: Customer reviews
-- Run this in the Supabase SQL Editor.
-- Stores star-rated reviews left by customers after their order is paid.
-- ============================================================

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete set null,
  quote_id uuid references public.lead_quotes(id) on delete set null,
  customer_name text,
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz default now()
);

create index if not exists idx_reviews_created_at on public.reviews(created_at desc);

alter table public.reviews enable row level security;

-- Customers submit reviews from the public review page (anon)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reviews' AND policyname = 'Anon can insert reviews') THEN
    CREATE POLICY "Anon can insert reviews" ON public.reviews FOR INSERT TO anon WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reviews' AND policyname = 'Auth can select reviews') THEN
    CREATE POLICY "Auth can select reviews" ON public.reviews FOR SELECT TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reviews' AND policyname = 'Auth can delete reviews') THEN
    CREATE POLICY "Auth can delete reviews" ON public.reviews FOR DELETE TO authenticated USING (true);
  END IF;
END $$;
