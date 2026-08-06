import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';

// Named, reusable email templates (subject + body) shared across admins.
// Mirrors useEmailGroups. Used by the client email composer to save and
// quickly reload commonly-sent emails.
export default function useEmailTemplates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .order('name', { ascending: true });
    if (error) console.error('Failed to fetch email templates:', error.message);
    setTemplates(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchTemplates(); }, [fetchTemplates]);

  const saveTemplate = async (name, subject, body) => {
    const { data, error } = await supabase
      .from('email_templates')
      .insert({ name, subject, body })
      .select()
      .single();
    if (!error) await fetchTemplates();
    return { data, error };
  };

  const deleteTemplate = async (id) => {
    const { error } = await supabase.from('email_templates').delete().eq('id', id);
    if (!error) await fetchTemplates();
    return { error };
  };

  return { templates, loading, saveTemplate, deleteTemplate, refetch: fetchTemplates };
}
