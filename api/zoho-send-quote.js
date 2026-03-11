// Vercel Serverless Function — sends branded quote email via Zoho Mail
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

  const { quoteId, quoteNumber, total, deposit, validUntil, clientEmail, clientName } = req.body || {};

  if (!quoteId) {
    return res.status(400).json({ error: 'Missing quoteId' });
  }

  if (!clientEmail) {
    return res.status(200).json({ error: 'No client email provided' });
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
      return res.status(200).json({ error: 'Token refresh failed' });
    }

    // 3. Build email HTML
    const viewUrl = `${SITE_URL}/quote/view/${quoteId}`;
    const fmtDate = validUntil
      ? new Date(validUntil).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
      : '';
    const fmtCurrency = (v) => `£${Number(v || 0).toFixed(2)}`;

    const htmlBody = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f7f7f7;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f7f7;padding:32px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

  <!-- Gold Header -->
  <tr>
    <td style="background:#c5a47e;padding:28px 32px;text-align:center;">
      <h1 style="margin:0;font-family:Georgia,serif;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:0.06em;">THE QUARTZ COMPANY</h1>
    </td>
  </tr>

  <!-- Body -->
  <tr>
    <td style="padding:32px;">
      <p style="font-size:16px;color:#333;margin:0 0 20px;">Hi ${clientName || 'there'},</p>
      <p style="font-size:15px;color:#555;margin:0 0 24px;line-height:1.5;">Your quote is ready to view. Please review the details below and secure your quote before it expires.</p>

      <!-- Quote Details -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf9f7;border-radius:8px;padding:20px;margin-bottom:24px;">
        <tr><td style="padding:20px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-size:13px;color:#888;padding:4px 0;">Quote</td>
              <td style="font-size:13px;font-weight:700;color:#1a1a1a;text-align:right;padding:4px 0;">${quoteNumber || ''}</td>
            </tr>
            <tr>
              <td style="font-size:13px;color:#888;padding:4px 0;">Total (inc. VAT)</td>
              <td style="font-size:15px;font-weight:800;color:#c5a47e;text-align:right;padding:4px 0;">${fmtCurrency(total)}</td>
            </tr>
            <tr>
              <td style="font-size:13px;color:#888;padding:4px 0;">Deposit Required</td>
              <td style="font-size:14px;font-weight:700;color:#ef4444;text-align:right;padding:4px 0;">${fmtCurrency(deposit)}</td>
            </tr>
            ${fmtDate ? `<tr>
              <td style="font-size:13px;color:#888;padding:4px 0;">Valid Until</td>
              <td style="font-size:13px;font-weight:600;color:#1a1a1a;text-align:right;padding:4px 0;">${fmtDate}</td>
            </tr>` : ''}
          </table>
        </td></tr>
      </table>

      <!-- CTA Button -->
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td align="center" style="padding:8px 0 24px;">
          <a href="${viewUrl}" style="display:inline-block;padding:14px 36px;background:#c5a47e;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;border-radius:8px;">
            View and secure your quote
          </a>
        </td></tr>
      </table>

      <p style="font-size:12px;color:#aaa;text-align:center;margin:0;">If you have any questions, reply to this email or call us directly.</p>
    </td>
  </tr>

  <!-- Footer -->
  <tr>
    <td style="background:#faf9f7;padding:20px 32px;text-align:center;border-top:1px solid #eee;">
      <p style="margin:0;font-size:12px;color:#999;">The Quartz Company</p>
      <p style="margin:4px 0 0;font-size:11px;color:#bbb;">info@thequartzcompany.co.uk</p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`;

    // 4. Send email via Zoho
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
          toAddress: clientEmail,
          subject: `Your Quote ${quoteNumber || ''} from The Quartz Company`,
          content: htmlBody,
          mailFormat: 'html',
        }),
      }
    );

    const sendData = await sendRes.json();

    // Zoho returns various response shapes — check for success
    const isSuccess =
      sendData.status?.code === 200 ||
      sendData.status?.code === 201 ||
      sendData.data?.messageId;

    if (!isSuccess) {
      return res.status(200).json({
        error: sendData.status?.description || sendData.message || 'Failed to send email',
        zohoResponse: JSON.stringify(sendData),
      });
    }

    return res.status(200).json({ success: true, messageId: sendData.data?.messageId });
  } catch (err) {
    return res.status(200).json({ error: err.message });
  }
}
