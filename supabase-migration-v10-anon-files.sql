-- ============================================================
-- The Quartz Company CRM — Migration V10: Anon file uploads + remove won/lost
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Allow anonymous users to insert file records
-- (kitchen plan uploads happen from public-facing quote form)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'lead_files'
    AND policyname = 'Anon users can insert files'
  ) THEN
    CREATE POLICY "Anon users can insert files"
      ON public.lead_files FOR INSERT TO anon WITH CHECK (true);
  END IF;
END $$;

-- Allow anonymous users to upload to the lead-files storage bucket
-- (needed for kitchen plan file uploads from the quote form)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'objects'
    AND schemaname = 'storage'
    AND policyname = 'Anon users can upload lead files'
  ) THEN
    CREATE POLICY "Anon users can upload lead files"
      ON storage.objects FOR INSERT TO anon
      WITH CHECK (bucket_id = 'lead-files');
  END IF;
END $$;

-- Remove won/lost from the leads status CHECK constraint
ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS leads_status_check;
ALTER TABLE public.leads ADD CONSTRAINT leads_status_check
  CHECK (status IN ('new', 'contacted', 'quoted', 'deposit'));
