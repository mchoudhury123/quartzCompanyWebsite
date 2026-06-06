// Vercel Serverless Function — one-time / repeatable backfill.
// Sends the "deposit received — thank you" email to every quote whose deposit
// has been paid but that hasn't had the confirmation email yet. Idempotent:
// it stamps deposit_confirmation_sent_at, so re-running only targets new ones.
//
// Protected by CRON_SECRET. Trigger with either:
//   GET /api/send-deposit-confirmations?secret=YOUR_CRON_SECRET
//   Authorization: Bearer YOUR_CRON_SECRET
//
// Env vars: CRON_SECRET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, plus Zoho vars

import { createClient } from '@supabase/supabase-js';
import { buildDepositConfirmationEmail } from '../src/utils/depositConfirmationEmail.js';

export default async function handler(req, res) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return res.status(500).json({ error: 'CRON_SECRET is not set — refusing to run unprotected' });
  }
  const provided = req.query.secret || (req.headers.authorization || '').replace('Bearer ', '');
  if (provided !== secret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: 'Supabase admin credentials missing' });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const { data: quotes, error } = await supabase
    .from('lead_quotes')
    .select('id, quote_number, lead_id, leads:lead_id(full_name, email)')
    .eq('deposit_paid', true)
    .is('deposit_confirmation_sent_at', null);

  if (error) return res.status(500).json({ error: error.message });

  const host = req.headers.host;
  const protocol = host?.includes('localhost') ? 'http' : 'https';
  const sendUrl = `${protocol}://${host}/api/zoho-send-email`;
  const nowIso = new Date().toISOString();

  const results = { found: quotes?.length || 0, sent: 0, skipped: 0, failed: 0 };

  for (const q of quotes || []) {
    const email = q.leads?.email;
    if (!email) {
      results.skipped++;
      continue;
    }

    const firstName = (q.leads?.full_name || '').split(' ')[0] || 'there';
    const { subject, body } = buildDepositConfirmationEmail({
      firstName,
      quoteNumber: q.quote_number,
    });

    try {
      const sendRes = await fetch(sendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: email, subject, body }),
      });
      const sendData = await sendRes.json();

      if (sendData.error) {
        results.failed++;
        continue;
      }

      await supabase
        .from('lead_quotes')
        .update({ deposit_confirmation_sent_at: nowIso })
        .eq('id', q.id);

      if (q.lead_id) {
        try {
          await supabase.from('lead_emails').insert({
            lead_id: q.lead_id,
            direction: 'outbound',
            subject,
            body,
            to_address: email,
            from_address: 'sales@thequartzcompany.co.uk',
            zoho_message_id: sendData.messageId || null,
            status: 'sent',
            sent_by: 'System',
          });
        } catch (_) {
          /* ignore */
        }
      }

      results.sent++;
    } catch (_) {
      results.failed++;
    }
  }

  return res.status(200).json(results);
}
