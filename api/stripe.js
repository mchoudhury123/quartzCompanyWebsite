// Vercel Serverless Function — all Stripe / deposit-payment logic in one
// function to stay within the Hobby plan's 12-function limit. The public URLs
// are preserved via rewrites in vercel.json, which set ?mode=:
//
//   /api/stripe-create-checkout   -> mode=checkout  (email + online "Pay Deposit")
//   /api/stripe-webhook           -> mode=webhook   (Stripe events)
//   /api/send-deposit-confirmations -> mode=backfill (one-off catch-up emails)
//
// Body parsing is disabled because the webhook needs the raw body for Stripe
// signature verification; the other modes parse what they need manually.
//
// Env vars: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, SITE_URL,
//           SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, CRON_SECRET, Zoho vars

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
  const mode = req.query.mode;
  if (mode === 'webhook') return handleWebhook(req, res);
  if (mode === 'backfill') return handleBackfill(req, res);
  return handleCheckout(req, res); // default
}

// ── Checkout: create a Stripe Checkout session for the quote deposit ──────────
async function handleCheckout(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const isGet = req.method === 'GET';
  if (!isGet && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { STRIPE_SECRET_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  const SITE_URL = process.env.SITE_URL || `https://${req.headers.host}`;

  let quoteId = req.query.quoteId;
  if (!isGet) {
    try {
      const raw = await readRawBody(req);
      const parsed = raw.length ? JSON.parse(raw.toString('utf8')) : {};
      quoteId = quoteId || parsed.quoteId;
    } catch (_) {
      /* ignore */
    }
  }

  const fail = (status, message) => {
    if (isGet) {
      return res.redirect(303, `${SITE_URL}/quote/view/${quoteId || ''}?payerror=1`);
    }
    return res.status(status).json({ error: message });
  };

  if (!STRIPE_SECRET_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return fail(500, 'Payment is not configured yet');
  }
  if (!quoteId) return fail(400, 'Missing quoteId');

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: quote, error } = await supabase
      .from('lead_quotes')
      .select(
        'id, lead_id, quote_number, title, total, deposit_amount, deposit_paid, leads:lead_id(full_name, email)'
      )
      .eq('id', quoteId)
      .single();

    if (error || !quote) return fail(404, 'Quote not found');

    if (quote.deposit_paid) {
      if (isGet) return res.redirect(303, `${SITE_URL}/quote/view/${quoteId}?paid=1`);
      return res.status(200).json({ url: `${SITE_URL}/quote/view/${quoteId}?paid=1`, alreadyPaid: true });
    }

    const deposit = Number(quote.deposit_amount) || 0;
    if (deposit <= 0) return fail(400, 'No deposit amount set on this quote');

    const stripe = new Stripe(STRIPE_SECRET_KEY);
    const metadata = {
      quoteId: quote.id,
      quote_number: quote.quote_number || '',
      lead_id: quote.lead_id || '',
    };

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'gbp',
            unit_amount: Math.round(deposit * 100),
            product_data: {
              name: `Deposit — Quote ${quote.quote_number || ''}`.trim(),
              description: quote.title || undefined,
            },
          },
        },
      ],
      customer_email: quote.leads?.email || undefined,
      success_url: `${SITE_URL}/quote/view/${quoteId}?paid=1`,
      cancel_url: `${SITE_URL}/quote/view/${quoteId}`,
      metadata,
      payment_intent_data: { metadata },
    });

    await supabase.from('lead_quotes').update({ stripe_session_id: session.id }).eq('id', quoteId);

    if (isGet) return res.redirect(303, session.url);
    return res.status(200).json({ url: session.url });
  } catch (err) {
    return fail(500, err.message);
  }
}

// ── Webhook: mark deposit paid, advance the lead, send the thank-you email ────
async function handleWebhook(req, res) {
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
    event = stripe.webhooks.constructEvent(raw, req.headers['stripe-signature'], STRIPE_WEBHOOK_SECRET);
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

// ── Backfill: email anyone who paid a deposit but hasn't been confirmed ───────
async function handleBackfill(req, res) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return res.status(500).json({ error: 'CRON_SECRET is not set — refusing to run unprotected' });
  }
  const provided = req.query.secret || (req.headers.authorization || '').replace('Bearer ', '');
  if (provided !== secret) return res.status(401).json({ error: 'Unauthorized' });

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
    const { subject, body } = buildDepositConfirmationEmail({ firstName, quoteNumber: q.quote_number });

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
