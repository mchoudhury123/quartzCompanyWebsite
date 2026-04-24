import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { logActivity } from '../utils/activityLogger';
import { startReminderDrip, cancelReminders } from '../utils/emailReminders';

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

  const completeAction = async (outcomes) => {
    const currentAction = lead?.pending_action;
    if (!currentAction) return;

    // Chase measurements flow
    if (currentAction === 'chase_measurements') {
      if (outcomes.gotMeasurements) {
        await supabase.from('leads').update({ pending_action: null, status: 'contacted' }).eq('id', id);
        setLead((prev) => ({ ...prev, pending_action: null, status: 'contacted' }));
        await cancelReminders(id, 'chase_measurements');
        await logActivity(id, { type: 'status_change', title: 'Measurements received — ready to quote', metadata: { old_action: 'chase_measurements' } });
      }
      // If no, keep chase_measurements — they'll try again later
      return;
    }

    // Call flow (call_new / follow_up)
    // Always log a call record so the "1+ Quote Requests" filter can count unanswered calls
    const callOutcome = outcomes.answered ? 'answered' : 'no_answer';
    const callSummary = outcomes.answered
      ? (outcomes.canQuote ? 'Customer answered — ready to quote' : 'Customer answered — needs measurements')
      : `No answer (${currentAction === 'call_new' ? '1st attempt' : '2nd attempt'})`;

    const { data: callData } = await supabase
      .from('lead_calls')
      .insert({
        lead_id: id,
        direction: 'outbound',
        outcome: callOutcome,
        summary: callSummary,
        called_by: 'Admin',
      })
      .select()
      .single();

    if (callData) {
      await logActivity(id, {
        type: 'call_logged',
        title: callSummary,
        metadata: { call_id: callData.id, outcome: callOutcome, action: currentAction },
      });
    }

    if (outcomes.answered) {
      if (outcomes.canQuote) {
        // Customer answered and admin can quote
        await supabase.from('leads').update({ pending_action: null, status: 'contacted' }).eq('id', id);
        setLead((prev) => ({ ...prev, pending_action: null, status: 'contacted' }));
        await cancelReminders(id);
        await logActivity(id, { type: 'status_change', title: 'Customer contacted — ready to quote', metadata: { old_action: currentAction } });
      } else {
        // Customer answered but need measurements — start 2-day chase drip
        await supabase.from('leads').update({ pending_action: 'chase_measurements' }).eq('id', id);
        setLead((prev) => ({ ...prev, pending_action: 'chase_measurements' }));
        await cancelReminders(id, 'no_answer');
        await startReminderDrip({
          leadId: id,
          leadEmail: lead?.email,
          leadName: lead?.full_name,
          reminderType: 'chase_measurements',
        });
        await logActivity(id, { type: 'lead_updated', title: 'Need kitchen measurements — chase later', metadata: { old_action: currentAction, new_action: 'chase_measurements' } });
      }
    } else {
      // Customer didn't answer
      if (currentAction === 'call_new') {
        // First attempt failed — schedule follow-up
        await supabase.from('leads').update({ pending_action: 'follow_up' }).eq('id', id);
        setLead((prev) => ({ ...prev, pending_action: 'follow_up' }));
        await logActivity(id, { type: 'lead_updated', title: 'No answer — follow-up call scheduled', metadata: { old_action: 'call_new', new_action: 'follow_up' } });
      } else {
        // Second attempt failed — start the 2-day "we tried to reach you" drip
        // Lead stays in current status; 2+ unanswered calls place it in "1+ Quote Requests"
        await startReminderDrip({
          leadId: id,
          leadEmail: lead?.email,
          leadName: lead?.full_name,
          reminderType: 'no_answer',
        });

        // Clear action — lead moves to "1+ Quote Requests" via unanswered call count
        await supabase.from('leads').update({ pending_action: null }).eq('id', id);
        setLead((prev) => ({ ...prev, pending_action: null }));
        await logActivity(id, { type: 'lead_updated', title: 'No answer after 2 attempts', metadata: { old_action: 'follow_up' } });
      }
    }
  };

  const retryCall = async (outcomes) => {
    // Called from RetryBar when lead is in "1+ Quote Requests" (status=new, no pending_action)
    if (outcomes.canQuote) {
      await supabase.from('leads').update({ status: 'contacted' }).eq('id', id);
      setLead((prev) => ({ ...prev, status: 'contacted' }));
      await cancelReminders(id);
      await logActivity(id, { type: 'status_change', title: 'Customer contacted on retry — ready to quote', metadata: { old_status: 'new', new_status: 'contacted' } });
    } else {
      await supabase.from('leads').update({ pending_action: 'chase_measurements' }).eq('id', id);
      setLead((prev) => ({ ...prev, pending_action: 'chase_measurements' }));
      await cancelReminders(id, 'no_answer');
      await startReminderDrip({
        leadId: id,
        leadEmail: lead?.email,
        leadName: lead?.full_name,
        reminderType: 'chase_measurements',
      });
      await logActivity(id, { type: 'lead_updated', title: 'Customer answered on retry — needs measurements', metadata: { new_action: 'chase_measurements' } });
    }
  };

  return { lead, notes, loading, updateStatus, updateLeadField, addNote, deleteNote, completeAction, retryCall, refetchLead: fetchLead };
}
