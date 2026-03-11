import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { logActivity } from '../utils/activityLogger';

export default function useSms(leadId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('lead_sms')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });
    setMessages(data || []);
    setLoading(false);
  }, [leadId]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  const sendSms = async ({ to, body }) => {
    const res = await window.fetch('/api/twilio-send-sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, body, leadId }),
    });
    const result = await res.json();

    if (result.error) {
      return { error: result.error };
    }

    const { data, error } = await supabase
      .from('lead_sms')
      .insert({
        lead_id: leadId,
        direction: 'outbound',
        body,
        to_number: to,
        from_number: 'Twilio',
        twilio_message_sid: result.messageSid || null,
        status: result.status || 'sent',
        sent_by: 'Admin',
      })
      .select()
      .single();

    if (!error) {
      await logActivity(leadId, {
        type: 'sms_sent',
        title: 'SMS sent',
        description: body.length > 100 ? body.slice(0, 100) + '...' : body,
        metadata: { sms_id: data.id, to },
      });
      await fetchMessages();
    }

    return { data, error };
  };

  return { messages, loading, sendSms, refetch: fetchMessages };
}
