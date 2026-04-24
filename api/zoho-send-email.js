// Vercel Serverless Function — sends email via Zoho Mail
// Env vars needed: ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN, ZOHO_ACCOUNT_ID, SITE_URL

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN, ZOHO_ACCOUNT_ID } = process.env;
  const SITE_URL = process.env.SITE_URL || 'https://quartz-company-website.vercel.app';

  if (!ZOHO_CLIENT_ID || !ZOHO_CLIENT_SECRET || !ZOHO_REFRESH_TOKEN || !ZOHO_ACCOUNT_ID) {
    return res.status(200).json({ error: 'Zoho credentials not configured' });
  }

  const { to, subject, body } = req.body || {};

  if (!to || !subject || !body) {
    return res.status(400).json({ error: 'Missing to, subject, or body' });
  }

  try {
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

    const htmlBody = wrapInBrandTemplate({ subject, body, siteUrl: SITE_URL });

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

function wrapInBrandTemplate({ subject, body, siteUrl }) {
  const logoUrl = `${siteUrl}/LOGO%20IDEA%20BIG%20QUARTZ%20ARIAL.png`;
  const paragraphs = body
    .split(/\n{2,}/)
    .map(
      (p) =>
        `<p style="margin:0 0 18px;font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.75;color:#3a3a3a;">${p.replace(/\n/g, '<br>')}</p>`
    )
    .join('');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#f4f1ea;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f1ea;padding:40px 16px;">
<tr><td align="center">

<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
<tr><td style="border-top:2px solid #c5a47e;height:2px;font-size:0;line-height:0;">&nbsp;</td></tr>
</table>

<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;">
  <tr><td align="center" style="padding:48px 32px 20px;">
    <img src="${logoUrl}" alt="The Quartz Company" width="220" style="display:block;max-width:220px;height:auto;border:0;outline:none;text-decoration:none;">
  </td></tr>

  <tr><td align="center" style="padding:0 32px 36px;">
    <table width="40" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="border-bottom:1px solid #c5a47e;font-size:0;line-height:0;">&nbsp;</td>
    </tr></table>
  </td></tr>

  <tr><td style="padding:0 48px 40px;">
    ${paragraphs}
  </td></tr>

  <tr><td align="center" style="padding:0 48px 24px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="border-bottom:1px solid #eee5d4;font-size:0;line-height:0;">&nbsp;</td>
    </tr></table>
  </td></tr>

  <tr><td align="center" style="padding:0 48px 48px;">
    <p style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:11px;letter-spacing:0.28em;color:#c5a47e;text-transform:uppercase;">The Quartz Company</p>
    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#999999;letter-spacing:0.02em;">
      sales@thequartzcompany.co.uk &nbsp;·&nbsp; 07375 303 416
    </p>
  </td></tr>
</table>

<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
<tr><td style="border-top:2px solid #c5a47e;height:2px;font-size:0;line-height:0;">&nbsp;</td></tr>
</table>

</td></tr>
</table>
</body>
</html>`;
}
