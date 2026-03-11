// Vercel Serverless Function — handles <Dial> completion, logs call outcome to Supabase
// Env vars needed: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

import { createClient } from '@supabase/supabase-js';

const TWILIO_TO_CRM_OUTCOME = {
  completed: 'answered',
  answered: 'answered',
  busy: 'busy',
  'no-answer': 'no_answer',
  failed: 'no_answer',
  canceled: 'no_answer',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');

  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;

  console.log('[dial-status] env check:', { hasUrl: !!SUPABASE_URL, hasKey: !!SUPABASE_SERVICE_ROLE_KEY });
  console.log('[dial-status] body:', JSON.stringify(req.body));
  console.log('[dial-status] query:', JSON.stringify(req.query));

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('[dial-status] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    res.setHeader('Content-Type', 'text/xml');
    return res.status(200).send('<Response/>');
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const dialCallStatus = req.body.DialCallStatus || req.body.CallStatus || 'no-answer';
  const dialCallDuration = parseInt(req.body.DialCallDuration || req.body.CallDuration || '0', 10);
  const callSid = req.query.callSid || req.body.CallSid || null;
  const leadId = req.query.leadId;
  const recordingUrl = req.body.RecordingUrl || null;

  const outcome = TWILIO_TO_CRM_OUTCOME[dialCallStatus] || 'no_answer';

  console.log('[dial-status] parsed:', { leadId, outcome, dialCallStatus, dialCallDuration, callSid, recordingUrl });

  try {
    if (leadId && leadId !== 'undefined' && leadId !== '') {
      const { data: callData, error: callError } = await supabase
        .from('lead_calls')
        .insert({
          lead_id: leadId,
          direction: 'outbound',
          duration_seconds: dialCallDuration || null,
          outcome,
          summary: `Twilio call — ${outcome}`,
          called_by: 'Admin',
          twilio_call_sid: callSid,
          call_type: 'twilio',
          recording_url: recordingUrl,
        })
        .select()
        .single();

      console.log('[dial-status] call insert:', { callData, callError: callError?.message });

      if (!callError && callData) {
        const { error: actError } = await supabase.from('lead_activities').insert({
          lead_id: leadId,
          activity_type: 'call_logged',
          title: `Outbound call — ${outcome}`,
          description: `Twilio call (${dialCallDuration}s)`,
          metadata: { call_id: callData.id, direction: 'outbound', outcome, twilio_call_sid: callSid },
          author: 'Admin',
        });
        console.log('[dial-status] activity insert:', { error: actError?.message });
      }
    } else {
      console.warn('[dial-status] skipped — no valid leadId:', leadId);
    }
  } catch (err) {
    console.error('[dial-status] error:', err.message);
  }

  res.setHeader('Content-Type', 'text/xml');
  return res.status(200).send('<Response/>');
}
