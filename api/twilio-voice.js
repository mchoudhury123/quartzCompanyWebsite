// Vercel Serverless Function — TwiML voice routing for outbound calls
// Env vars needed: TWILIO_PHONE_NUMBER

import twilio from 'twilio';

const { VoiceResponse } = twilio.twiml;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');

  const { TWILIO_PHONE_NUMBER } = process.env;
  let toNumber = req.body.To || req.body.to || '';
  const leadId = req.body.leadId || '';
  const callSid = req.body.CallSid || '';

  // Normalize UK numbers: 07xxx → +447xxx
  toNumber = toNumber.replace(/\s+/g, '');
  if (toNumber.startsWith('0') && !toNumber.startsWith('+')) {
    toNumber = '+44' + toNumber.slice(1);
  }
  if (toNumber && !toNumber.startsWith('+')) {
    toNumber = '+' + toNumber;
  }

  const response = new VoiceResponse();

  if (toNumber) {
    const dial = response.dial({
      callerId: TWILIO_PHONE_NUMBER,
      timeout: 30,
      action: `/api/twilio-dial-status?leadId=${encodeURIComponent(leadId)}&callSid=${encodeURIComponent(callSid)}`,
      method: 'POST',
    });
    dial.number(toNumber);
  } else {
    response.say('No phone number provided.');
  }

  res.setHeader('Content-Type', 'text/xml');
  return res.status(200).send(response.toString());
}
