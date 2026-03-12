import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { logActivity } from '../utils/activityLogger';

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
    const oldStatus = lead?.status;
    const { error } = await supabase
      .from('leads')
      .update({ status: newStatus })
      .eq('id', id);
    if (!error) {
      setLead((prev) => ({ ...prev, status: newStatus }));
      await logActivity(id, {
        type: 'status_change',
        title: `Status changed to ${newStatus}`,
        metadata: { old_status: oldStatus, new_status: newStatus },
      });
    }
    return { error };
  };

  const updateLeadField = async (field, value) => {
    const { error } = await supabase
      .from('leads')
      .update({ [field]: value })
      .eq('id', id);
    if (!error) {
      setLead((prev) => ({ ...prev, [field]: value }));
      await logActivity(id, {
        type: 'lead_updated',
        title: `${field.replace(/_/g, ' ')} updated`,
        metadata: { field, value },
      });
    }
    return { error };
  };

  const addNote = async (content) => {
    const { data, error } = await supabase
      .from('lead_notes')
      .insert({ lead_id: id, content, author: 'Admin' })
      .select()
      .single();
    if (!error) {
      await logActivity(id, {
        type: 'note_added',
        title: 'Note added',
        description: content.length > 100 ? content.slice(0, 100) + '...' : content,
        metadata: { note_id: data.id },
      });
      await fetchNotes();
    }
    return { error };
  };

  const deleteNote = async (noteId) => {
    const { error } = await supabase
      .from('lead_notes')
      .delete()
      .eq('id', noteId);
    if (!error) await fetchNotes();
    return { error };
  };

  return { lead, notes, loading, updateStatus, updateLeadField, addNote, deleteNote, refetchLead: fetchLead };
}
