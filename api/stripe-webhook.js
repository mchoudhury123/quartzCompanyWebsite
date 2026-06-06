// Vercel Serverless Function — Stripe webhook.
// On a completed Checkout, marks the quote's deposit as paid, moves the lead
// to the 'deposit' stage, and logs the payment as an activity.
//
// Stripe signature verification needs the RAW request body, so the default
// body parser is disabled below.
//
// Env vars: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET,
//           SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { buildDepositConfirmationEmail } from '../src/utils/depositConfirmationEmail.js';

export const config = { api: { bodyParser: false } };

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } =
    process.env;

  if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
    return res.status(500).json({ error: 'Stripe webhook not configured' });
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY);

  let event;
  try {
    const raw = await readRawBody(req);
    event = stripe.webhooks.constructEvent(
      raw,
      req.headers['stripe-signature'],
      STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const quoteId = session.metadata?.quoteId;
    const leadId = session.metadata?.lead_id;
    const quoteNumber = session.metadata?.quote_number || '';

    if (quoteId && SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      const nowIso = new Date().toISOString();

      // Read current state + customer details (also tells us if the
      // confirmation email already went out, so retries don't double-send)
      const { data: quote } = await supabase
        .from('lead_quotes')
        .select('id, quote_number, deposit_confirmation_sent_at, leads:lead_id(full_name, email)')
        .eq('id', quoteId)
        .single();

      await supabase
        .from('lead_quotes')
        .update({
          deposit_paid: true,
          deposit_paid_at: nowIso,
          stripe_payment_intent: session.payment_intent || null,
          status: 'accepted',
        })
        .eq('id', quoteId);

      if (leadId) {
        await supabase.from('leads').update({ status: 'deposit' }).eq('id', leadId);

        // Best-effort activity log — never let it fail the webhook
        try {
          await supabase.from('lead_activities').insert({
            lead_id: leadId,
            activity_type: 'deposit_paid',
            title: `Deposit paid${quoteNumber ? ` — ${quoteNumber}` : ''}`,
            description: `£${((session.amount_total || 0) / 100).toFixed(2)} received via Stripe`,
            metadata: {
              session_id: session.id,
              payment_intent: session.payment_intent || null,
              quote_id: quoteId,
            },
            author: 'System',
          });
        } catch (_) {
          /* ignore */
        }
      }

      // Send the "deposit received — thank you" email (once per quote)
      const customerEmail =
        quote?.leads?.email || session.customer_details?.email || session.customer_email;

      if (customerEmail && !quote?.deposit_confirmation_sent_at) {
        const firstName =
          (quote?.leads?.full_name || session.customer_details?.name || '').split(' ')[0] || 'there';
        const { subject, body } = buildDepositConfirmationEmail({
          firstName,
          quoteNumber: quote?.quote_number || quoteNumber,
        });

        try {
          const host = req.headers.host;
          const protocol = host?.includes('localhost') ? 'http' : 'https';
          const sendRes = await fetch(`${protocol}://${host}/api/zoho-send-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ to: customerEmail, subject, body }),
          });
          const sendData = await sendRes.json();

          if (!sendData.error) {
            await supabase
              .from('lead_quotes')
              .update({ deposit_confirmation_sent_at: nowIso })
              .eq('id', quoteId);

            if (leadId) {
              try {
                await supabase.from('lead_emails').insert({
                  lead_id: leadId,
                  direction: 'outbound',
                  subject,
                  body,
                  to_address: customerEmail,
                  from_address: 'sales@thequartzcompany.co.uk',
                  zoho_message_id: sendData.messageId || null,
                  status: 'sent',
                  sent_by: 'System',
                });
              } catch (_) {
                /* ignore */
              }
            }
          }
        } catch (_) {
          /* ignore — payment is recorded regardless of email outcome */
        }
      }
    }
  }

  return res.status(200).json({ received: true });
}
