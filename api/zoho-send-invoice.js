// Vercel Serverless Function — sends an invoice email via Zoho Mail with the
// invoice PDF attached.
//
// The PDF is built in the browser (html2canvas + jsPDF) and posted here as
// base64. Zoho needs attachments uploaded first, then referenced by
// storeName/attachmentPath when sending the message.
//
// Env vars needed: ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN,
// ZOHO_ACCOUNT_ID

// Vercel's Node runtime caps the request body at 4.5MB and that isn't
// configurable, so refuse a PDF that wouldn't survive the trip and send
// without the attachment rather than losing the whole email.
const MAX_PDF_BASE64_BYTES = 3_500_000;

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

  const { to, subject, html, pdfBase64, fileName } = req.body || {};

  if (!to || !subject || !html) {
    return res.status(400).json({ error: 'Missing to, subject, or html' });
  }

  const FROM_ADDRESS = '"The Quartz Company" <sales@thequartzcompany.co.uk>';

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

    const accessToken = tokenData.access_token;

    // --- Upload the PDF, if there is one ---
    // A failed upload must not lose the email: fall back to sending the
    // (self-contained) HTML invoice and tell the caller the PDF is missing.
    let attachments = [];
    let attachWarning = '';

    if (pdfBase64) {
      if (pdfBase64.length > MAX_PDF_BASE64_BYTES) {
        attachWarning = 'The invoice PDF was too large to attach; the email was sent without it.';
      } else {
        try {
          const name = fileName || 'invoice.pdf';
          const uploadRes = await fetch(
            `https://mail.zoho.eu/api/accounts/${ZOHO_ACCOUNT_ID}/messages/attachments?fileName=${encodeURIComponent(
              name
            )}`,
            {
              method: 'POST',
              headers: {
                Authorization: `Zoho-oauthtoken ${accessToken}`,
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

    // --- Send ---
    const sendRes = await fetch(
      `https://mail.zoho.eu/api/accounts/${ZOHO_ACCOUNT_ID}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromAddress: FROM_ADDRESS,
          toAddress: to,
          subject,
          content: html,
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
