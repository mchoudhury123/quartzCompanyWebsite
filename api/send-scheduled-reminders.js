// Vercel Cron — daily sweep that sends due reminder emails
// (chase_measurements and no_answer). Triggered by vercel.json cron entry.
// Env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, CRON_SECRET, plus Zoho vars

import { createClient } from '@supabase/supabase-js';

const SUBJECTS = {
  chase_measurements: "We're ready when your measurements are — The Quartz Company",
  no_answer: 'We tried to reach you — The Quartz Company',
};

function buildBody(type, firstName) {
  if (type === 'chase_measurements') {
    return `Hi ${firstName},\n\nThanks for speaking with us about your worktop. You mentioned you'd get your kitchen measurements to us once you have them.\n\nWhen you're ready, just give us a call on 07375 303 416 or reply to this email with the dimensions and we'll put your quote together right away.\n\nKind regards,\nThe Quartz Company`;
  }
  return `Hi ${firstName},\n\nWe tried to reach you about your quote request but weren't able to get through.\n\nIf you're still interested in a quartz worktop, please give us a call on 07375 303 416 or simply reply to this email and we'll get back to you.\n\nKind regards,\nThe Quartz Company`;
}

export default async function handler(req, res) {
  // Verify Vercel cron auth when CRON_SECRET is set
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = req.headers.authorization || '';
    if (auth !== `Bearer ${cronSecret}`) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: 'Supabase admin credentials missing' });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const nowIso = new Date().toISOString();

  const { data: reminders, error } = await supabase
    .from('email_reminders')
    .select('*, leads:lead_id(id, full_name, email)')
    .is('cancelled_at', null)
    .lte('next_send_at', nowIso)
    .order('next_send_at', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });

  const results = { processed: 0, sent: 0, failed: 0, skipped: 0 };
  const host = req.headers.host;
  const protocol = host?.includes('localhost') ? 'http' : 'https';
  const sendUrl = `${protocol}://${host}/api/zoho-send-email`;

  for (const reminder of reminders || []) {
    results.processed++;
    const lead = reminder.leads;

    if (!lead || !lead.email || reminder.sent_count >= reminder.total_to_send) {
      await supabase
        .from('email_reminders')
        .update({ cancelled_at: nowIso })
        .eq('id', reminder.id);
      results.skipped++;
      continue;
    }

    const firstName = (lead.full_name || '').split(' ')[0] || 'there';
    const subject = SUBJECTS[reminder.reminder_type];
    const body = buildBody(reminder.reminder_type, firstName);

    try {
      const sendRes = await fetch(sendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: lead.email, subject, body }),
      });
      const sendData = await sendRes.json();

      if (sendData.error) {
        results.failed++;
        continue;
      }

      results.sent++;
      const newSentCount = reminder.sent_count + 1;
      const isDone = newSentCount >= reminder.total_to_send;

      const nextSend = new Date();
      nextSend.setDate(nextSend.getDate() + 1);

      await supabase
        .from('email_reminders')
        .update({
          sent_count: newSentCount,
          last_sent_at: nowIso,
          next_send_at: isDone ? reminder.next_send_at : nextSend.toISOString(),
          cancelled_at: isDone ? nowIso : null,
        })
        .eq('id', reminder.id);

      await supabase.from('lead_emails').insert({
        lead_id: lead.id,
        direction: 'outbound',
        subject,
        body,
        to_address: lead.email,
        from_address: 'sales@thequartzcompany.co.uk',
        zoho_message_id: sendData.messageId || null,
        status: 'sent',
        sent_by: 'System',
      });

      await supabase.from('lead_activities').insert({
        lead_id: lead.id,
        activity_type: 'email_sent',
        title: `Day ${newSentCount}/${reminder.total_to_send} reminder sent (${reminder.reminder_type.replace(/_/g, ' ')})`,
        description: subject,
        metadata: { reminder_type: reminder.reminder_type, day: newSentCount },
        author: 'System',
      });
    } catch (err) {
      results.failed++;
    }
  }

  return res.status(200).json(results);
}
