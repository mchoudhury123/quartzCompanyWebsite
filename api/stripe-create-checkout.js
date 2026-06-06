// Vercel Serverless Function — creates a Stripe Checkout Session for a quote
// deposit and sends the customer to Stripe's hosted payment page.
//
// Two entry points:
//   GET  /api/stripe-create-checkout?quoteId=...  -> 303 redirect to Stripe
//        (used by the "Pay Deposit" button in the emailed quote)
//   POST { quoteId }                              -> { url } JSON
//        (used by the "Pay Deposit" button on the online quote view page)
//
// Env vars: STRIPE_SECRET_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SITE_URL

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
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

  const quoteId = isGet ? req.query.quoteId : req.body?.quoteId;

  // GET errors send the customer back to a friendly page; POST errors return JSON
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
      .select('id, lead_id, quote_number, title, total, deposit_amount, deposit_paid, leads:lead_id(full_name, email)')
      .eq('id', quoteId)
      .single();

    if (error || !quote) return fail(404, 'Quote not found');

    // Already paid — don't double-charge
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

    // Record the session id (best-effort)
    await supabase
      .from('lead_quotes')
      .update({ stripe_session_id: session.id })
      .eq('id', quoteId);

    if (isGet) return res.redirect(303, session.url);
    return res.status(200).json({ url: session.url });
  } catch (err) {
    return fail(500, err.message);
  }
}
