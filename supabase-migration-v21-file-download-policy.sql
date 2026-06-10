-- ============================================================
-- The Quartz Company CRM — Migration V21: Fix file downloads
-- Run this in the Supabase SQL Editor
-- ============================================================
--
-- PROBLEM: The `lead-files` storage bucket is private. Admins download
-- customer kitchen plans via a signed URL (storage.createSignedUrl),
-- which requires SELECT permission on storage.objects. Only an anon
-- INSERT (upload) policy existed (migration v10), so admins could never
-- generate a download link — clicking Download did nothing.
--
-- This adds the missing SELECT (download) and DELETE (cleanup) policies
-- for authenticated admin users on the lead-files bucket.

-- Allow authenticated admins to read/download lead files (signed URLs)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'objects'
    AND schemaname = 'storage'
    AND policyname = 'Auth users can read lead files'
  ) THEN
    CREATE POLICY "Auth users can read lead files"
      ON storage.objects FOR SELECT TO authenticated
      USING (bucket_id = 'lead-files');
  END IF;
END $$;

-- Allow authenticated admins to delete lead files from storage
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'objects'
    AND schemaname = 'storage'
    AND policyname = 'Auth users can delete lead files'
  ) THEN
    CREATE POLICY "Auth users can delete lead files"
      ON storage.objects FOR DELETE TO authenticated
      USING (bucket_id = 'lead-files');
  END IF;
END $$;
