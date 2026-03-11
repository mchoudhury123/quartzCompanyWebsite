// Vercel Serverless Function — proxies Twilio recording audio to avoid auth prompts
// Env vars needed: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).send('Method not allowed');

  const { url } = req.query;

  if (!url || !url.includes('api.twilio.com')) {
    return res.status(400).send('Invalid recording URL');
  }

  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
    return res.status(500).send('Missing Twilio credentials');
  }

  try {
    // Ensure we request the .mp3 format
    const recordingUrl = url.endsWith('.mp3') ? url : `${url}.mp3`;

    const response = await fetch(recordingUrl, {
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64'),
      },
    });

    if (!response.ok) {
      console.error('[twilio-recording] fetch failed:', response.status, response.statusText);
      return res.status(response.status).send('Failed to fetch recording');
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');

    const arrayBuffer = await response.arrayBuffer();
    return res.send(Buffer.from(arrayBuffer));
  } catch (err) {
    console.error('[twilio-recording] error:', err.message);
    return res.status(500).send('Error fetching recording');
  }
}
