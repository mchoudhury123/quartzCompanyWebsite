import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';

export default function useLeadDetail(id) {
  const [lead, setLead] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLead = useCallback(async () => {
    const { data } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single();
    if (data) setLead(data);
  }, [id]);

  const fetchNotes = useCallback(async () => {
    const { data } = await supabase
      .from('lead_notes')
      .select('*')
      .eq('lead_id', id)
      .order('created_at', { ascending: true });
    if (data) setNotes(data);
  }, [id]);

  useEffect(() => {
    async function init() {
      await Promise.all([fetchLead(), fetchNotes()]);
      setLoading(false);
    }
    init();
  }, [fetchLead, fetchNotes]);

  const updateStatus = async (newStatus) => {
    const { error } = await supabase
      .from('leads')
      .update({ status: newStatus })
      .eq('id', id);
    if (!error) setLead((prev) => ({ ...prev, status: newStatus }));
    return { error };
  };

  const addNote = async (content) => {
    const { error } = await supabase
      .from('lead_notes')
      .insert({ lead_id: id, content, author: 'Admin' });
    if (!error) await fetchNotes();
    return { error };
  };

  return { lead, notes, loading, updateStatus, addNote };
}
