import { supabase } from '../../lib/supabase';
import { logActivity } from './activityLogger';

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

// Send the first reminder email immediately and schedule the follow-up for
// ~24 hours later. A matching row in email_reminders drives the daily cron
// which sends any remaining emails in the drip.
export async function startReminderDrip({ leadId, leadEmail, leadName, reminderType, totalToSend = 2 }) {
  if (!leadEmail) {
    // No email on file — skip the drip entirely so the CRM flow still completes.
    return { skipped: 'no_email' };
  }

  const firstName = (leadName || '').split(' ')[0] || 'there';
  const subject = SUBJECTS[reminderType];
  const body = buildBody(reminderType, firstName);

  // 1. Cancel any outstanding reminders of this type for this lead so we
  //    never double-drip (e.g. if the admin retries the same action).
  await supabase
    .from('email_reminders')
    .update({ cancelled_at: new Date().toISOString() })
    .eq('lead_id', leadId)
    .eq('reminder_type', reminderType)
    .is('cancelled_at', null);

  // 2. Send the first email now via the existing Zoho endpoint (the prestige
  //    template wrapping happens server-side in zoho-send-email.js).
  let messageId = null;
  let emailStatus = 'sent';
  let sendError = null;
  try {
    const res = await fetch('/api/zoho-send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: leadEmail, subject, body }),
    });
    const result = await res.json().catch(() => ({ error: 'Invalid response' }));
    if (result.error) {
      emailStatus = 'failed';
      sendError = result.error;
    } else {
      messageId = result.messageId || null;
    }
  } catch (err) {
    emailStatus = 'failed';
    sendError = err.message;
  }

  // 3. Log the email in lead_emails so it shows up in the Emails tab.
  await supabase.from('lead_emails').insert({
    lead_id: leadId,
    direction: 'outbound',
    subject,
    body,
    to_address: leadEmail,
    from_address: 'sales@thequartzcompany.co.uk',
    zoho_message_id: messageId,
    status: emailStatus,
    sent_by: 'System',
  });

  await logActivity(leadId, {
    type: 'email_sent',
    title: emailStatus === 'sent'
      ? `Day 1/${totalToSend} reminder sent (${reminderType.replace(/_/g, ' ')})`
      : `Day 1 reminder failed (${reminderType.replace(/_/g, ' ')})`,
    description: emailStatus === 'sent' ? subject : `Error: ${sendError}`,
    metadata: { reminder_type: reminderType, day: 1 },
    author: 'System',
  });

  // 4. Schedule the next email ~24 hours out. The cron sweep picks this up
  //    tomorrow and sends day 2 (and any subsequent days if total_to_send > 2).
  const nextSend = new Date();
  nextSend.setDate(nextSend.getDate() + 1);

  await supabase.from('email_reminders').insert({
    lead_id: leadId,
    reminder_type: reminderType,
    total_to_send: totalToSend,
    sent_count: emailStatus === 'sent' ? 1 : 0,
    last_sent_at: emailStatus === 'sent' ? new Date().toISOString() : null,
    next_send_at: nextSend.toISOString(),
  });

  return { status: emailStatus };
}

// Used when the admin has resolved the underlying situation (got measurements,
// customer reached on retry, etc.) — stops any outstanding drip so the
// customer doesn't receive further nudges.
export async function cancelReminders(leadId, reminderType = null) {
  let query = supabase
    .from('email_reminders')
    .update({ cancelled_at: new Date().toISOString() })
    .eq('lead_id', leadId)
    .is('cancelled_at', null);
  if (reminderType) query = query.eq('reminder_type', reminderType);
  await query;
}
