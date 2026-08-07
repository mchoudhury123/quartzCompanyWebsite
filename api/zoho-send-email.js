// Vercel Serverless Function — sends email via Zoho Mail
// Env vars needed: ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN, ZOHO_ACCOUNT_ID, SITE_URL
//
// Optionally attaches a PDF: pass `pdfBase64` + `fileName` and it gets uploaded
// to Zoho and referenced on the message. This lives here rather than in its own
// endpoint because the Hobby plan caps a deployment at 12 Serverless Functions
// and api/ is already at that limit — a 13th file fails the build.

// Vercel's Node runtime caps the request body at 4.5MB and that isn't
// configurable; base64 inflates bytes by ~33%. Refuse a PDF that wouldn't
// survive the trip and send without it rather than losing the whole email.
const MAX_PDF_BASE64_BYTES = 3_500_000;

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

  const { to, subject, body, html, from, transactional, pdfBase64, fileName } = req.body || {};

  if (!to || !subject || (!body && !html)) {
    return res.status(400).json({ error: 'Missing to, subject, or body/html' });
  }

  // Only these mailboxes may be used as the sender. Anything else (including
  // an unknown value from the client) falls back to sales. Each address must
  // exist as a "send mail as" address on the Zoho account, or Zoho rejects it.
  const FROM_ADDRESSES = {
    'sales@thequartzcompany.co.uk': '"The Quartz Company" <sales@thequartzcompany.co.uk>',
    'admin@thequartzcompany.co.uk': '"The Quartz Company" <admin@thequartzcompany.co.uk>',
  };
  const fromEmail = FROM_ADDRESSES[from] ? from : 'sales@thequartzcompany.co.uk';
  const fromAddress = FROM_ADDRESSES[fromEmail];

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

    // If the caller supplied ready-made HTML, send it as-is; otherwise wrap
    // the plain-text body in the standard branded template.
    const htmlBody = html || wrapInBrandTemplate({
      subject,
      body,
      siteUrl: SITE_URL,
      contactEmail: fromEmail,
      // Transactional emails (quotes, "we tried to reach you") get no unsubscribe.
      unsubscribeEmail: transactional ? '' : to,
    });

    // Upload the attachment, if there is one. A failed upload must not lose the
    // email — fall back to sending without it and tell the caller.
    let attachments = [];
    let attachWarning = '';

    if (pdfBase64) {
      if (pdfBase64.length > MAX_PDF_BASE64_BYTES) {
        attachWarning = 'The PDF was too large to attach; the email was sent without it.';
      } else {
        try {
          const name = fileName || 'attachment.pdf';
          const uploadRes = await fetch(
            `https://mail.zoho.eu/api/accounts/${ZOHO_ACCOUNT_ID}/messages/attachments?fileName=${encodeURIComponent(
              name
            )}`,
            {
              method: 'POST',
              headers: {
                Authorization: `Zoho-oauthtoken ${tokenData.access_token}`,
                'Content-Type': 'application/octet-stream',
              },
              body: Buffer.from(pdfBase64, 'base64'),
            }
          );
          const uploadData = await uploadRes.json();

          // The raw-upload form returns a single object; the multipart form
          // returns an array. Accept either.
          const entry = Array.isArray(uploadData?.data) ? uploadData.data[0] : uploadData?.data;

          if (entry?.storeName && entry?.attachmentPath) {
            attachments = [
              {
                storeName: entry.storeName,
                attachmentPath: entry.attachmentPath,
                attachmentName: entry.attachmentName || name,
              },
            ];
          } else {
            attachWarning = `Couldn't attach the PDF (${
              uploadData?.status?.description || uploadData?.message || 'upload rejected'
            }); the email was sent without it.`;
          }
        } catch (err) {
          attachWarning = `Couldn't attach the PDF (${err.message}); the email was sent without it.`;
        }
      }
    }

    const sendRes = await fetch(
      `https://mail.zoho.eu/api/accounts/${ZOHO_ACCOUNT_ID}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Zoho-oauthtoken ${tokenData.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromAddress,
          toAddress: to,
          subject,
          content: htmlBody,
          mailFormat: 'html',
          ...(attachments.length ? { attachments } : {}),
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

    return res.status(200).json({
      success: true,
      messageId: sendData.data?.messageId,
      attached: attachments.length > 0,
      attachWarning,
    });
  } catch (err) {
    return res.status(200).json({ error: err.message });
  }
}

function unsubscribeFooter(email, siteUrl) {
  if (!email) return '';
  const url = `${siteUrl}/api/unsubscribe?email=${encodeURIComponent(email)}`;
  return `<p style="margin:16px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.7;color:#b3ab9f;">
      The Quartz Company &middot; Unit 303/2, K2 House Business Centre, Heathfield Way, Northampton NN5 7QP<br>
      You&rsquo;re receiving this email because you enquired with or are a customer of The Quartz Company.<br>
      <a href="${url}" style="color:#b3ab9f;text-decoration:underline;">Unsubscribe</a> from marketing emails.
    </p>`;
}

function wrapInBrandTemplate({ subject, body, siteUrl, contactEmail = 'sales@thequartzcompany.co.uk', unsubscribeEmail = '' }) {
  const logoUrl = `${siteUrl}/logo.png`;
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
    <div style="margin:0 0 16px;">
      <a href="https://www.instagram.com/thequartzcompanyuk/" style="text-decoration:none;margin:0 5px;display:inline-block;"><img src="${siteUrl}/email/instagram.png" alt="Instagram" width="24" height="24" style="border:0;display:inline-block;"></a>
      <a href="https://www.facebook.com/profile.php?id=61587732770864" style="text-decoration:none;margin:0 5px;display:inline-block;"><img src="${siteUrl}/email/facebook.png" alt="Facebook" width="24" height="24" style="border:0;display:inline-block;"></a>
    </div>
    <p style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:11px;letter-spacing:0.28em;color:#c5a47e;text-transform:uppercase;">The Quartz Company</p>
    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#999999;letter-spacing:0.02em;">
      ${contactEmail} &nbsp;·&nbsp; 07375 303 416
    </p>
    ${unsubscribeFooter(unsubscribeEmail, siteUrl)}
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
