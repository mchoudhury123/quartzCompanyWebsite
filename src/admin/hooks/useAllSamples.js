import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { logActivity } from '../utils/activityLogger';

export default function useAllSamples() {
  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('lead_samples')
      .select('*, leads:lead_id(id, full_name, email, phone, address)')
      .in('status', ['preparing', 'sent', 'delivered'])
      .order('created_at', { ascending: false });
    setSamples(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const updateStatus = async (sampleId, newStatus, leadId) => {
    const updates = { status: newStatus };
    if (newStatus === 'sent') updates.sent_at = new Date().toISOString();
    if (newStatus === 'delivered') updates.delivered_at = new Date().toISOString();

    const { error } = await supabase
      .from('lead_samples')
      .update(updates)
      .eq('id', sampleId);

    if (!error) {
      const s = samples.find((x) => x.id === sampleId);
      const actType = newStatus === 'sent' ? 'sample_sent'
        : newStatus === 'delivered' ? 'sample_delivered'
        : 'sample_requested';
      await logActivity(leadId, {
        type: actType,
        title: `Sample ${s?.product_name || ''} marked ${newStatus}`,
        metadata: { sample_id: sampleId, status: newStatus },
      });
      await fetchAll();
    }
    return { error };
  };

  // Group by lead
  const grouped = samples.reduce((acc, s) => {
    const lid = s.lead_id;
    if (!acc[lid]) acc[lid] = { lead: s.leads, samples: [] };
    acc[lid].samples.push(s);
    return acc;
  }, {});

  // Split into preparing vs completed groups
  // A lead only moves to "Completed" when ALL their samples are sent/delivered
  const preparingGroups = {};
  const completedGroups = {};
  Object.entries(grouped).forEach(([lid, group]) => {
    const allCompleted = group.samples.every((s) => s.status === 'sent' || s.status === 'delivered');
    if (allCompleted) {
      completedGroups[lid] = { lead: group.lead, samples: group.samples };
    } else {
      preparingGroups[lid] = { lead: group.lead, samples: group.samples };
    }
  });

  // Confirm all samples for a lead at once and email the customer
  const confirmAll = async (leadId, lead, leadSamples) => {
    const now = new Date().toISOString();
    const sampleIds = leadSamples.map((s) => s.id);

    // Bulk update all samples to 'sent'
    const { error } = await supabase
      .from('lead_samples')
      .update({ status: 'sent', sent_at: now })
      .in('id', sampleIds);

    if (error) return { error };

    // Log activity for each sample
    for (const s of leadSamples) {
      await logActivity(leadId, {
        type: 'sample_sent',
        title: `Sample ${s.product_name} marked sent`,
        metadata: { sample_id: s.id, status: 'sent' },
      });
    }

    // Send confirmation email to customer
    if (lead.email) {
      const sampleList = leadSamples.map((s) => s.product_name).join(', ');
      const emailBody =
        `Hi ${lead.full_name},\n\n` +
        `Great news! Your samples are now being processed and are on their way.\n\n` +
        `Samples: ${sampleList}\n\n` +
        `You can expect delivery within 3\u20135 working days.\n\n` +
        `If you have any questions in the meantime, feel free to reply to this email or call us on 07414 121 706.\n\n` +
        `Kind regards,\n` +
        `The Quartz Company`;

      const emailRes = await window.fetch('/api/zoho-send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: lead.email,
          subject: 'Your samples are on their way!',
          body: emailBody,
        }),
      });
      const emailResult = await emailRes.json();

      // Save email record to database
      if (!emailResult.error) {
        await supabase.from('lead_emails').insert({
          lead_id: leadId,
          direction: 'outbound',
          subject: 'Your samples are on their way!',
          body: emailBody,
          to_address: lead.email,
          from_address: 'sales@thequartzcompany.co.uk',
          zoho_message_id: emailResult.messageId || null,
          status: 'sent',
          sent_by: 'Admin',
        });

        await logActivity(leadId, {
          type: 'email_sent',
          title: 'Email sent: Your samples are on their way!',
          description: `Samples dispatch confirmation sent to ${lead.email}`,
          metadata: { to: lead.email },
        });
      }
    }

    await fetchAll();
    return { error: null };
  };

  return { samples, preparingGroups, completedGroups, loading, updateStatus, confirmAll, refetch: fetchAll };
}
