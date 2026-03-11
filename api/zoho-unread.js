// Vercel Serverless Function — fetches unread email count from Zoho Mail
// Env vars needed: ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN, ZOHO_ACCOUNT_ID, ZOHO_INBOX_FOLDER_ID

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN, ZOHO_ACCOUNT_ID } = process.env;
  const INBOX_FOLDER_ID = process.env.ZOHO_INBOX_FOLDER_ID || '7696391000000002014';

  if (!ZOHO_CLIENT_ID || !ZOHO_CLIENT_SECRET || !ZOHO_REFRESH_TOKEN || !ZOHO_ACCOUNT_ID) {
    return res.status(200).json({ unread: 0, error: 'Zoho credentials not configured' });
  }

  try {
    // 1. Refresh the access token
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
      return res.status(200).json({ unread: 0, error: 'Token refresh failed' });
    }

    // 2. Fetch unread messages from inbox
    const messagesRes = await fetch(
      `https://mail.zoho.eu/api/accounts/${ZOHO_ACCOUNT_ID}/messages/view?folderId=${INBOX_FOLDER_ID}&limit=50&status=unread`,
      { headers: { Authorization: `Zoho-oauthtoken ${tokenData.access_token}` } }
    );
    const messagesData = await messagesRes.json();

    const unread = Array.isArray(messagesData?.data) ? messagesData.data.length : 0;

    return res.status(200).json({ unread });
  } catch (err) {
    return res.status(200).json({ unread: 0, error: err.message });
  }
}
