import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';

export default function useEmailGroups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('email_groups')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) console.error('Failed to fetch email groups:', error.message);
    setGroups(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchGroups(); }, [fetchGroups]);

  const saveGroup = async (name, leadIds) => {
    const { data, error } = await supabase
      .from('email_groups')
      .insert({ name, lead_ids: leadIds })
      .select()
      .single();
    if (!error) await fetchGroups();
    return { data, error };
  };

  const updateGroup = async (id, leadIds) => {
    const { error } = await supabase
      .from('email_groups')
      .update({ lead_ids: leadIds })
      .eq('id', id);
    if (!error) await fetchGroups();
    return { error };
  };

  const deleteGroup = async (id) => {
    const { error } = await supabase.from('email_groups').delete().eq('id', id);
    if (!error) await fetchGroups();
    return { error };
  };

  return { groups, loading, saveGroup, updateGroup, deleteGroup, refetch: fetchGroups };
}
