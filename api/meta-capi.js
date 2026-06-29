// Vercel Serverless Function — Meta Conversions API (server-side events)
// Receives an event from the browser, hashes any customer PII, and forwards it
// to Meta's Conversions API. Pairs with the browser Pixel via a shared event_id
// so Meta deduplicates the two.
//
// Env vars needed: META_PIXEL_ID, META_CAPI_ACCESS_TOKEN
// The access token is read here only and is NEVER sent to the browser.

import crypto from 'crypto';

const GRAPH_VERSION = 'v21.0';

// Meta requires customer PII to be SHA-256 hashed, lower-cased and trimmed.
function hash(value) {
  if (value === undefined || value === null || value === '') return undefined;
  const normalized = String(value).trim().toLowerCase();
  if (!normalized) return undefined;
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

// Phone must be digits only (with country code), no '+', spaces or punctuation.
function hashPhone(phone) {
  if (!phone) return undefined;
  let digits = String(phone).replace(/[^0-9]/g, '');
  if (!digits) return undefined;
  // UK numbers entered as 07… → normalise to 447… so they match the Pixel
  if (digits.startsWith('0')) digits = '44' + digits.slice(1);
  return crypto.createHash('sha256').update(digits).digest('hex');
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const PIXEL_ID = process.env.META_PIXEL_ID;
  const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN;

  if (!PIXEL_ID || !ACCESS_TOKEN) {
    // Don't hard-fail the client; tracking is non-critical
    return res.status(200).json({ error: 'Meta CAPI not configured' });
  }

  const {
    eventName,
    eventId,
    eventSourceUrl,
    customData = {},
    userData = {},
    testEventCode, // optional — routes the event to the Test Events tab for debugging
  } = req.body || {};

  if (!eventName || !eventId) {
    return res.status(400).json({ error: 'Missing eventName or eventId' });
  }

  // Captured server-side — more reliable than anything the browser could send
  const forwardedFor = req.headers['x-forwarded-for'] || '';
  const clientIp = forwardedFor.split(',')[0].trim() || req.socket?.remoteAddress;
  const userAgent = req.headers['user-agent'];

  // Build the hashed user_data block. Only include keys we actually have.
  const user_data = {};
  const em = hash(userData.email);
  if (em) user_data.em = [em];
  const ph = hashPhone(userData.phone);
  if (ph) user_data.ph = [ph];
  const fn = hash(userData.firstName);
  if (fn) user_data.fn = [fn];
  const ln = hash(userData.lastName);
  if (ln) user_data.ln = [ln];
  const zp = hash(userData.postcode && String(userData.postcode).replace(/\s/g, ''));
  if (zp) user_data.zp = [zp];
  // fbp / fbc are NOT hashed — Meta expects them raw
  if (userData.fbp) user_data.fbp = userData.fbp;
  if (userData.fbc) user_data.fbc = userData.fbc;
  if (clientIp) user_data.client_ip_address = clientIp;
  if (userAgent) user_data.client_user_agent = userAgent;

  const event = {
    event_name: eventName,
    event_time: Math.floor(Date.now() / 1000),
    event_id: eventId, // shared with the browser Pixel → dedup
    action_source: 'website',
    event_source_url: eventSourceUrl,
    user_data,
  };
  if (customData && Object.keys(customData).length > 0) {
    event.custom_data = customData;
  }

  try {
    const url = `https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(ACCESS_TOKEN)}`;
    const body = { data: [event] };
    // When testing, this makes the server event appear in Events Manager →
    // Test Events (alongside the browser Pixel) instead of only live data.
    if (testEventCode) body.test_event_code = testEventCode;

    const fbRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const result = await fbRes.json();

    if (!fbRes.ok) {
      console.error(`Meta CAPI rejected ${eventName} (${fbRes.status}):`, JSON.stringify(result));
      return res.status(200).json({ success: false, status: fbRes.status, error: result });
    }

    // Logged so production logs show successful server sends, not just failures
    console.log(`Meta CAPI sent ${eventName} (event_id=${eventId}):`, JSON.stringify(result));
    return res.status(200).json({ success: true, status: fbRes.status, result });
  } catch (err) {
    console.error('Meta CAPI request failed:', err);
    return res.status(200).json({ success: false, error: String(err) });
  }
}
