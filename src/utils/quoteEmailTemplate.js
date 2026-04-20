// Shared quote email HTML template — used by both the backend sender
// (api/zoho-send-quote.js) and the CRM preview modal. Rendering the same
// string in both places guarantees the preview matches what the customer
// receives, byte-for-byte.

export function buildQuoteEmailHtml({
  firstName = 'there',
  quoteNumber = '',
  total = 0,
  deposit = 0,
  validUntil = '',
  viewUrl = '#',
  logoUrl = '',
}) {
  const fmtDate = validUntil
    ? new Date(validUntil).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';
  const fmtCurrency = (v) => `£${Number(v || 0).toFixed(2)}`;

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
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

  <tr><td style="padding:0 48px 32px;font-family:Georgia,'Times New Roman',serif;">

    <p style="margin:0 0 20px;font-family:Georgia,serif;font-size:17px;color:#1a1a1a;">Hi ${firstName},</p>

    <p style="margin:0 0 18px;font-size:15px;line-height:1.75;color:#3a3a3a;">I have completed your Quartz Company quote using the details you have provided. You can view it <a href="${viewUrl}" style="color:#c5a47e;font-weight:600;text-decoration:none;border-bottom:1px solid #c5a47e;">here</a>. Your quote expires on <strong style="color:#c5a47e;">${fmtDate}</strong>.</p>

    <p style="margin:0 0 32px;font-size:15px;line-height:1.75;color:#3a3a3a;">If you would like to secure your quote before this date, all we need is a <strong style="color:#1a1a1a;"><span style="font-family:Arial,Helvetica,sans-serif;">${fmtCurrency(deposit)}</span> deposit</strong> — payable over the phone or via the link below.</p>

    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td align="center" style="padding:0 0 36px;">
        <a href="${viewUrl}" style="display:inline-block;padding:16px 40px;background:#1a1a1a;color:#ffffff;font-family:Georgia,serif;font-size:13px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;text-decoration:none;border:1px solid #c5a47e;">
          View &amp; Secure Quote
        </a>
      </td></tr>
    </table>

    <p style="margin:0 0 8px;font-family:Georgia,serif;font-size:14px;font-weight:700;color:#1a1a1a;">Not quite ready?</p>
    <p style="margin:0 0 32px;font-size:14px;line-height:1.7;color:#5a5a5a;">You can view your quote, update and compare colours and thicknesses on the <a href="${viewUrl}" style="color:#c5a47e;text-decoration:none;border-bottom:1px solid #c5a47e;">customer portal</a>.</p>

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#faf7f2;border:1px solid #eee5d4;">
      <tr><td style="padding:26px 28px;">
        <p style="margin:0 0 16px;font-family:Georgia,serif;font-size:11px;letter-spacing:0.28em;color:#c5a47e;text-transform:uppercase;">Quote Summary</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-family:Arial,sans-serif;font-size:13px;color:#888;padding:7px 0;">Reference</td>
            <td style="font-family:Georgia,serif;font-size:14px;font-weight:700;color:#1a1a1a;text-align:right;padding:7px 0;">${quoteNumber}</td>
          </tr>
          <tr>
            <td style="font-family:Arial,sans-serif;font-size:13px;color:#888;padding:7px 0;">Total (inc. VAT)</td>
            <td style="font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:700;color:#c5a47e;text-align:right;padding:7px 0;">${fmtCurrency(total)}</td>
          </tr>
          <tr>
            <td style="font-family:Arial,sans-serif;font-size:13px;color:#888;padding:7px 0;">Deposit</td>
            <td style="font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;color:#1a1a1a;text-align:right;padding:7px 0;">${fmtCurrency(deposit)}</td>
          </tr>
          <tr>
            <td style="font-family:Arial,sans-serif;font-size:13px;color:#888;padding:7px 0;">Expires</td>
            <td style="font-family:Georgia,serif;font-size:14px;font-weight:600;color:#1a1a1a;text-align:right;padding:7px 0;">${fmtDate}</td>
          </tr>
        </table>
      </td></tr>
    </table>

  </td></tr>

  <tr><td align="center" style="padding:32px 48px 48px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #eee5d4;">
      <tr><td align="center" style="padding:28px 0 0;">
        <p style="margin:0 0 8px;font-family:Georgia,serif;font-size:11px;letter-spacing:0.28em;color:#c5a47e;text-transform:uppercase;">The Quartz Company</p>
        <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#999;letter-spacing:0.02em;">sales@thequartzcompany.co.uk &nbsp;·&nbsp; 07375 303 416</p>
      </td></tr>
    </table>
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
