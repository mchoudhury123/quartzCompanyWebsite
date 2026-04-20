// Vercel Serverless Function — sends branded quote email via Zoho Mail
// Env vars needed: ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN, ZOHO_ACCOUNT_ID, SITE_URL

import { buildQuoteEmailHtml } from '../src/utils/quoteEmailTemplate.js';

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

    const firstName = clientName ? clientName.split(' ')[0] : 'there';
    const htmlBody = buildQuoteEmailHtml({
      firstName,
      quoteNumber: quoteNumber || '',
      total,
      deposit,
      validUntil,
      viewUrl: `${SITE_URL}/quote/view/${quoteId}`,
      logoUrl: `${SITE_URL}/LOGO%20IDEA%20BIG%20QUARTZ%20ARIAL.png`,
    });

    const sendRes = await fetch(
      `https://mail.zoho.eu/api/accounts/${ZOHO_ACCOUNT_ID}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Zoho-oauthtoken ${tokenData.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fromAddress: 'The Quartz Company <sales@thequartzcompany.co.uk>',
          toAddress: clientEmail,
          subject: `Your Quote ${quoteNumber || ''} from The Quartz Company`,
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
        zohoResponse: JSON.stringify(sendData),
      });
    }

    return res.status(200).json({ success: true, messageId: sendData.data?.messageId });
  } catch (err) {
    return res.status(200).json({ error: err.message });
  }
}
