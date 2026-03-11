// Vercel Serverless Function — sends SMS via Twilio
// Env vars needed: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER

import twilio from 'twilio';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER } = process.env;

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    return res.status(200).json({ error: 'Twilio credentials not configured' });
  }

  const { to: rawTo, body } = req.body || {};

  if (!rawTo || !body) {
    return res.status(400).json({ error: 'Missing "to" or "body" field' });
  }

  // Normalize UK numbers: 07xxx → +447xxx
  let to = rawTo.replace(/\s+/g, '');
  if (to.startsWith('0') && !to.startsWith('+')) {
    to = '+44' + to.slice(1);
  }
  if (!to.startsWith('+')) {
    to = '+' + to;
  }

  try {
    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

    const message = await client.messages.create({
      body,
      from: TWILIO_PHONE_NUMBER,
      to,
    });

    return res.status(200).json({
      success: true,
      messageSid: message.sid,
      status: message.status,
    });
  } catch (err) {
    return res.status(200).json({ error: err.message });
  }
}
