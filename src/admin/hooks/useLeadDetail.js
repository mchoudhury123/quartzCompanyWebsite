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

  const completeAction = async (outcomes) => {
    const currentAction = lead?.pending_action;
    if (!currentAction) return;

    // Chase measurements flow
    if (currentAction === 'chase_measurements') {
      if (outcomes.gotMeasurements) {
        await supabase.from('leads').update({ pending_action: null, status: 'contacted' }).eq('id', id);
        setLead((prev) => ({ ...prev, pending_action: null, status: 'contacted' }));
        await logActivity(id, { type: 'status_change', title: 'Measurements received — ready to quote', metadata: { old_action: 'chase_measurements' } });
      }
      // If no, keep chase_measurements — they'll try again later
      return;
    }

    // Call flow (call_new / follow_up)
    if (outcomes.answered) {
      if (outcomes.canQuote) {
        // Customer answered and admin can quote
        await supabase.from('leads').update({ pending_action: null, status: 'contacted' }).eq('id', id);
        setLead((prev) => ({ ...prev, pending_action: null, status: 'contacted' }));
        await logActivity(id, { type: 'status_change', title: 'Customer contacted — ready to quote', metadata: { old_action: currentAction } });
      } else {
        // Customer answered but need measurements
        await supabase.from('leads').update({ pending_action: 'chase_measurements' }).eq('id', id);
        setLead((prev) => ({ ...prev, pending_action: 'chase_measurements' }));
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
        // Second attempt failed — send auto-email and clear action
        // Lead stays in current status; 2+ unanswered calls place it in "1+ Quote Requests"
        const firstName = lead?.full_name?.split(' ')[0] || 'there';
        const emailBody = `Hi ${firstName},\n\nWe tried to contact you regarding your quote request but weren't able to reach you.\n\nIf you're still interested in a quartz worktop, please give us a call on 07414 121 706 or simply reply to this email and we'll get back to you.\n\nKind regards,\nThe Quartz Company`;

        // Send auto-email if lead has an email address
        if (lead?.email) {
          try {
            const res = await window.fetch('/api/zoho-send-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                to: lead.email,
                subject: 'We tried to reach you — The Quartz Company',
                body: emailBody,
              }),
            });
            const result = await res.json();

            // Log email in lead_emails table
            const { data: emailData } = await supabase
              .from('lead_emails')
              .insert({
                lead_id: id,
                direction: 'outbound',
                subject: 'We tried to reach you — The Quartz Company',
                body: emailBody,
                to_address: lead.email,
                from_address: 'sales@thequartzcompany.co.uk',
                zoho_message_id: result.messageId || null,
                status: result.error ? 'failed' : 'sent',
                sent_by: 'System',
              })
              .select()
              .single();

            if (emailData) {
              await logActivity(id, {
                type: 'email_sent',
                title: 'Auto-email sent: unreachable customer',
                description: 'Automated email sent after two failed contact attempts',
                metadata: { email_id: emailData.id, to: lead.email },
              });
            }
          } catch (err) {
            console.error('Auto-email failed:', err);
          }
        }

        // Clear action — lead moves to "1+ Quote Requests" via unanswered call count
        await supabase.from('leads').update({ pending_action: null }).eq('id', id);
        setLead((prev) => ({ ...prev, pending_action: null }));
        await logActivity(id, { type: 'lead_updated', title: 'No answer after 2 attempts — auto-email sent', metadata: { old_action: 'follow_up' } });
      }
    }
  };

  return { lead, notes, loading, updateStatus, updateLeadField, addNote, deleteNote, completeAction, refetchLead: fetchLead };
}
