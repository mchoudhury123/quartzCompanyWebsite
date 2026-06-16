// Branded HTML for the "leave us a review" email. Sent manually by the admin
// from the Quotes tab once an order is complete (balance paid in full).
// Rendered as full HTML (passed to api/zoho-send-email.js via the `html` field,
// bypassing the plain wrapper).
//
// The Quartz Company's Google "write a review" link (from the Google Business
// Profile → "Ask for reviews"). This is where the review email button sends
// customers — they land straight on the star-rating form.
export const GOOGLE_REVIEW_URL = 'https://g.page/r/CdcXFD2VhxFMEBM/review';

const GOLD = '#b08d57';
const TAN = '#b89a72';
const INK = '#1a1a1a';
const LINE = '#e7ddcb';
const CREAM = '#f7f3ec';

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function buildReviewRequestEmailHtml({
  firstName = 'there',
  quoteNumber = '',
  reviewUrl = GOOGLE_REVIEW_URL,
  logoUrl = '',
} = {}) {
  const orderRef = quoteNumber ? ` (order ${escapeHtml(quoteNumber)})` : '';

  return {
    subject: 'How did we do? Leave us a review | The Quartz Company',
    html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f1ea;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f1ea;padding:40px 12px;">
<tr><td align="center">

<table align="center" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;margin:0 auto;">
<tr><td style="border-top:2px solid ${GOLD};height:2px;font-size:0;line-height:0;">&nbsp;</td></tr>
</table>

<table align="center" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;margin:0 auto;background:#ffffff;">

  <tr><td align="center" style="padding:44px 32px 16px;">
    <img src="${logoUrl}" alt="The Quartz Company" width="190" style="display:block;max-width:190px;height:auto;border:0;outline:none;text-decoration:none;">
  </td></tr>

  <tr><td align="center" style="padding:0 32px 28px;">
    <table width="36" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="border-bottom:1px solid ${GOLD};font-size:0;line-height:0;">&nbsp;</td>
    </tr></table>
  </td></tr>

  <tr><td style="padding:0 44px 8px;">
    <p style="margin:0 0 18px;font-family:Georgia,serif;font-size:17px;color:${INK};">Hi ${escapeHtml(
      firstName
    )},</p>
    <p style="margin:0 0 16px;font-family:Georgia,serif;font-size:15px;line-height:1.75;color:#3a3a3a;">
      Thank you for choosing The Quartz Company${orderRef}. It's been a pleasure creating your worktops, and we hope you're absolutely delighted with the result.
    </p>
    <p style="margin:0 0 4px;font-family:Georgia,serif;font-size:15px;line-height:1.75;color:#3a3a3a;">
      If you have a moment, we'd be hugely grateful if you'd share your experience with a quick review. It takes less than a minute, helps other homeowners find us, and means the world to our small team.
    </p>
  </td></tr>

  <tr><td style="padding:26px 44px 8px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${CREAM};border:1px solid ${LINE};">
      <tr><td align="center" style="padding:30px 28px;">
        <p style="margin:0 0 6px;font-family:Georgia,serif;font-size:18px;font-weight:700;color:${INK};">How did we do?</p>
        <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:26px;letter-spacing:4px;color:${GOLD};">★ ★ ★ ★ ★</p>
        <p style="margin:0 0 22px;font-family:Georgia,serif;font-size:14px;line-height:1.7;color:#5a5a5a;">Tap below to leave your review on Google.</p>
        <a href="${reviewUrl}" style="display:inline-block;padding:15px 40px;background:${INK};color:#ffffff;font-family:Arial,sans-serif;font-size:12px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;text-decoration:none;">Leave a Review</a>
      </td></tr>
    </table>
  </td></tr>

  <tr><td style="padding:22px 44px 0;">
    <p style="margin:0;font-family:Georgia,serif;font-size:14px;line-height:1.75;color:#5a5a5a;">
      If anything wasn't perfect, please reply to this email or call us on 07375 303 416 first — we'd love the chance to put it right.
    </p>
  </td></tr>

  <tr><td align="center" style="padding:30px 44px 44px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${LINE};">
      <tr><td align="center" style="padding:24px 0 0;">
        <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:12px;letter-spacing:0.26em;color:${TAN};text-transform:uppercase;">The Quartz Company</p>
        <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#999;letter-spacing:0.02em;">sales@thequartzcompany.co.uk &nbsp;·&nbsp; 07375 303 416</p>
      </td></tr>
    </table>
  </td></tr>

</table>

<table align="center" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;margin:0 auto;">
<tr><td style="border-top:2px solid ${GOLD};height:2px;font-size:0;line-height:0;">&nbsp;</td></tr>
</table>

</td></tr>
</table>
</body>
</html>`,
  };
}
