// Vercel Serverless Function — generates a signed upload URL for public file uploads
// Client uploads directly to Supabase storage using the signed URL (no Vercel body limit)
// Env vars needed: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { leadId, fileName, fileType, fileSize } = req.body;

  if (!leadId || !fileName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const storagePath = `${leadId}/${Date.now()}-${fileName}`;

  // Create a signed upload URL (valid for 120 seconds)
  const { data: urlData, error: urlError } = await supabase.storage
    .from('lead-files')
    .createSignedUploadUrl(storagePath);

  if (urlError) {
    console.error('Signed URL error:', urlError);
    return res.status(500).json({ error: urlError.message });
  }

  // Insert file record in database
  const { error: dbError } = await supabase.from('lead_files').insert({
    lead_id: leadId,
    file_name: fileName,
    file_type: fileType || 'application/octet-stream',
    file_size: fileSize || 0,
    storage_path: storagePath,
    category: 'plan',
    uploaded_by: 'Customer',
  });

  if (dbError) {
    console.error('File record insert error:', dbError);
    return res.status(500).json({ error: dbError.message });
  }

  return res.status(200).json({
    success: true,
    signedUrl: urlData.signedUrl,
    storagePath,
    fileName,
  });
}
