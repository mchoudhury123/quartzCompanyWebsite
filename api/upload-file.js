// Vercel Serverless Function — handles file uploads from public forms
// Uses service role key to bypass storage RLS
// Env vars needed: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

import { createClient } from '@supabase/supabase-js';

export const config = {
  api: { bodyParser: { sizeLimit: '6mb' } },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { leadId, fileName, fileType, fileSize, fileBase64 } = req.body;

  if (!leadId || !fileName || !fileBase64) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const storagePath = `${leadId}/${Date.now()}-${fileName}`;

  // Decode base64 to buffer and upload to storage
  const fileBuffer = Buffer.from(fileBase64, 'base64');
  const { error: uploadError } = await supabase.storage
    .from('lead-files')
    .upload(storagePath, fileBuffer, { contentType: fileType });

  if (uploadError) {
    console.error('Storage upload error:', uploadError);
    return res.status(500).json({ error: uploadError.message });
  }

  // Insert file record in database
  const { error: dbError } = await supabase.from('lead_files').insert({
    lead_id: leadId,
    file_name: fileName,
    file_type: fileType,
    file_size: fileSize,
    storage_path: storagePath,
    category: 'plan',
    uploaded_by: 'Customer',
  });

  if (dbError) {
    console.error('File record insert error:', dbError);
    return res.status(500).json({ error: dbError.message });
  }

  return res.status(200).json({ success: true, storagePath, fileName });
}
