import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { logActivity } from '../utils/activityLogger';

export default function useEmails(leadId) {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEmails = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('lead_emails')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });
    setEmails(data || []);
    setLoading(false);
  }, [leadId]);

  useEffect(() => { fetchEmails(); }, [fetchEmails]);

  const sendEmail = async ({ to, subject, body }) => {
    const res = await window.fetch('/api/zoho-send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, subject, body }),
    });
    const result = await res.json();

    if (result.error) {
      return { error: result.error };
    }

    const { data, error } = await supabase
      .from('lead_emails')
      .insert({
        lead_id: leadId,
        direction: 'outbound',
        subject,
        body,
        to_address: to,
        from_address: 'sales@thequartzcompany.co.uk',
        zoho_message_id: result.messageId || null,
        status: 'sent',
        sent_by: 'Admin',
      })
      .select()
      .single();

    if (error) {
      return { error: error.message || 'Failed to save email to database' };
    }

    await logActivity(leadId, {
      type: 'email_sent',
      title: `Email sent: ${subject}`,
      description: body.length > 100 ? body.slice(0, 100) + '...' : body,
      metadata: { email_id: data.id, to },
    });
    await fetchEmails();

    return { data };
  };

  return { emails, loading, sendEmail, refetch: fetchEmails };
}
