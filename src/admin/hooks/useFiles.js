import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { logActivity } from '../utils/activityLogger';

export default function useFiles(leadId) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('lead_files')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });
    setFiles(data || []);
    setLoading(false);
  }, [leadId]);

  useEffect(() => { fetch(); }, [fetch]);

  const uploadFile = async (file, category = 'general') => {
    const path = `${leadId}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('lead-files')
      .upload(path, file);
    if (uploadError) return { error: uploadError };

    const { data, error } = await supabase
      .from('lead_files')
      .insert({
        lead_id: leadId,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        storage_path: path,
        category,
      })
      .select()
      .single();
    if (!error) {
      await logActivity(leadId, {
        type: 'file_uploaded',
        title: `File uploaded: ${file.name}`,
        metadata: { file_id: data.id, category },
      });
      await fetch();
    }
    return { data, error };
  };

  const deleteFile = async (fileId) => {
    const f = files.find((f) => f.id === fileId);
    if (f) {
      await supabase.storage.from('lead-files').remove([f.storage_path]);
    }
    const { error } = await supabase
      .from('lead_files')
      .delete()
      .eq('id', fileId);
    if (!error) {
      await logActivity(leadId, {
        type: 'file_deleted',
        title: `File deleted: ${f?.file_name || ''}`,
        metadata: { file_id: fileId },
      });
      await fetch();
    }
    return { error };
  };

  const getDownloadUrl = async (storagePath) => {
    const { data } = await supabase.storage
      .from('lead-files')
      .createSignedUrl(storagePath, 3600);
    return data?.signedUrl;
  };

  return { files, loading, uploadFile, deleteFile, getDownloadUrl, refetch: fetch };
}
