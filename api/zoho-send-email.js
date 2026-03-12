// Vercel Serverless Function — sends email via Zoho Mail
// Env vars needed: ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN, ZOHO_ACCOUNT_ID

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN, ZOHO_ACCOUNT_ID } = process.env;

  if (!ZOHO_CLIENT_ID || !ZOHO_CLIENT_SECRET || !ZOHO_REFRESH_TOKEN || !ZOHO_ACCOUNT_ID) {
    return res.status(200).json({ error: 'Zoho credentials not configured' });
  }

  const { to, subject, body } = req.body || {};

  if (!to || !subject || !body) {
    return res.status(400).json({ error: 'Missing to, subject, or body' });
  }

  try {
    // 1. Refresh Zoho token
    const tokenRes = await fetch('https://accounts.zoho.eu/oauth/v2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: ZOHO_CLIENT_ID,
        client_secret: ZOHO_CLIENT_SECRET,
        refresh_token: ZOHO_REFRESH_TOKEN,
      }),
    });
    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      return res.status(200).json({
        error: 'Token refresh failed',
        detail: tokenData.error || tokenData.message || JSON.stringify(tokenData),
      });
    }

    // 2. Convert plain text body to simple HTML
    const htmlBody = body.replace(/\n/g, '<br>');

    // 3. Send email via Zoho
    const sendRes = await fetch(
      `https://mail.zoho.eu/api/accounts/${ZOHO_ACCOUNT_ID}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Zoho-oauthtoken ${tokenData.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromAddress: 'sales@thequartzcompany.co.uk',
          toAddress: to,
          subject,
          content: htmlBody,
          mailFormat: 'html',
        }),
      }
    );

    const sendData = await sendRes.json();

    const isSuccess =
      sendData.status?.code === 200 ||
      sendData.status?.code === 201 ||
      sendData.data?.messageId;

    if (!isSuccess) {
      return res.status(200).json({
        error: sendData.status?.description || sendData.message || 'Failed to send email',
      });
    }

    return res.status(200).json({ success: true, messageId: sendData.data?.messageId });
  } catch (err) {
    return res.status(200).json({ error: err.message });
  }
}
