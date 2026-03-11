// Vercel Serverless Function — fetches unread email count from Zoho Mail
// Env vars needed: ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN, ZOHO_ACCOUNT_ID

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN, ZOHO_ACCOUNT_ID } = process.env;

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

    // 2. Get inbox folder details (unread count)
    const foldersRes = await fetch(
      `https://mail.zoho.eu/api/accounts/${ZOHO_ACCOUNT_ID}/folders`,
      { headers: { Authorization: `Zoho-oauthtoken ${tokenData.access_token}` } }
    );
    const foldersData = await foldersRes.json();

    // Find the Inbox folder
    const inbox = foldersData?.data?.find(
      (f) => f.folderName === 'Inbox' || f.folderType === 'Inbox'
    );

    const unread = inbox?.unreadCount ?? 0;

    return res.status(200).json({ unread });
  } catch (err) {
    return res.status(200).json({ unread: 0, error: err.message });
  }
}
