// Vercel Serverless Function — one-click email unsubscribe.
// GET /api/unsubscribe?email=<address> marks every matching lead as
// unsubscribed (service-role write) and returns a branded confirmation page.
// Env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SITE_URL
import { createClient } from '@supabase/supabase-js';

function page({ title, message, siteUrl }) {
  const logoUrl = `${siteUrl}/logo.png`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} — The Quartz Company</title>
</head>
<body style="margin:0;padding:0;background:#f4f1ea;font-family:Arial,Helvetica,sans-serif;">
<div style="max-width:520px;margin:0 auto;padding:64px 24px;text-align:center;">
  <img src="${logoUrl}" alt="The Quartz Company" width="200" style="max-width:200px;height:auto;margin-bottom:32px;">
  <div style="background:#ffffff;border-top:3px solid #c5a47e;border-radius:6px;padding:40px 32px;">
    <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:24px;color:#2b2b2b;margin:0 0 14px;">${title}</h1>
    <p style="font-size:15px;line-height:1.7;color:#555;margin:0;">${message}</p>
  </div>
  <p style="font-size:12px;color:#999;margin-top:28px;">
    The Quartz Company &nbsp;&middot;&nbsp; sales@thequartzcompany.co.uk &nbsp;&middot;&nbsp; 07375 303 416
  </p>
</div>
</body>
</html>`;
}

export default async function handler(req, res) {
  const SITE_URL = process.env.SITE_URL || 'https://www.thequartzcompany.co.uk';
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  const email = (req.query?.email || '').toString().trim().toLowerCase();

  if (!email) {
    return res.status(200).send(page({
      title: 'Unsubscribe',
      message: 'We couldn’t identify your email address. To be removed from our mailing list, please email sales@thequartzcompany.co.uk and we’ll take care of it.',
      siteUrl: SITE_URL,
    }));
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(200).send(page({
      title: 'Something went wrong',
      message: 'We could not process your request right now. Please email sales@thequartzcompany.co.uk to unsubscribe and we’ll remove you straight away.',
      siteUrl: SITE_URL,
    }));
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    await supabase
      .from('leads')
      .update({ unsubscribed: true, unsubscribed_at: new Date().toISOString() })
      .ilike('email', email);

    return res.status(200).send(page({
      title: 'You’ve been unsubscribed',
      message: `<strong>${email}</strong> has been removed from our marketing emails. You will still receive essential messages about any quotes or orders you have with us. If this was a mistake, just reply to any of our emails and we’ll add you back.`,
      siteUrl: SITE_URL,
    }));
  } catch (err) {
    return res.status(200).send(page({
      title: 'Something went wrong',
      message: 'We could not process your request right now. Please email sales@thequartzcompany.co.uk to unsubscribe and we’ll remove you straight away.',
      siteUrl: SITE_URL,
    }));
  }
}
