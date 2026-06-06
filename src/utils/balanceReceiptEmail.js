// Branded HTML for the "paid in full" receipt email sent when a customer
// settles their balance. Includes an overview of what they ordered and a
// "Leave a Review" button. Rendered as full HTML (passed to
// api/zoho-send-email.js via the `html` field, bypassing the plain wrapper).

const GOLD = '#b08d57';
const TAN = '#b89a72';
const INK = '#1a1a1a';
const MUTED = '#777777';
const LINE = '#e7ddcb';
const CREAM = '#f7f3ec';
const PRICE_FONT = "'Helvetica Neue', Arial, Helvetica, sans-serif";

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function itemTitle(item) {
  if (item.type === 'accessory' || item.product_name) return item.product_name || 'Product';
  if (item.piece_type === 'specialist') {
    return `${item.description || 'Custom Worktop'} (Specialist Worktop)`;
  }
  const base = item.piece_type || 'Worktop';
  return item.description ? `${base} — ${item.description}` : base;
}

export function buildBalanceReceiptEmailHtml({
  firstName = 'there',
  quoteNumber = '',
  items = [],
  subtotal = 0,
  vat = 0,
  total = 0,
  reviewUrl = '',
  logoUrl = '',
}) {
  const fmt = (v) =>
    `£${Number(v || 0).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const rowsHtml =
    items && items.length
      ? items
          .map((item) => {
            const dims = item.x_mm && item.y_mm ? `${item.x_mm}×${item.y_mm}mm` : '';
            const qty = item.quantity != null ? item.quantity : 1;
            return `
        <tr>
          <td style="padding:14px 0;border-bottom:1px solid ${LINE};vertical-align:top;">
            <span style="display:block;font-family:Georgia,'Times New Roman',serif;font-size:15px;font-weight:700;color:${INK};line-height:1.4;">${escapeHtml(
              itemTitle(item)
            )}</span>
            ${
              dims
                ? `<span style="display:block;margin-top:3px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:${MUTED};">${escapeHtml(
                    dims
                  )}</span>`
                : ''
            }
          </td>
          <td style="padding:14px 0;border-bottom:1px solid ${LINE};text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#3a3a3a;vertical-align:top;">${escapeHtml(
            qty
          )}</td>
          <td style="padding:14px 0;border-bottom:1px solid ${LINE};text-align:right;font-family:${PRICE_FONT};font-size:14px;font-weight:600;color:${INK};vertical-align:top;">${fmt(
            item.line_total
          )}</td>
        </tr>`;
          })
          .join('')
      : '';

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f1ea;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f1ea;padding:40px 12px;">
<tr><td align="center">

<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
<tr><td style="border-top:2px solid ${GOLD};height:2px;font-size:0;line-height:0;">&nbsp;</td></tr>
</table>

<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;">

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
      Thank you — your payment has been received and your order${
        quoteNumber ? ` <strong>${escapeHtml(quoteNumber)}</strong>` : ''
      } is now <strong style="color:${GOLD};">paid in full</strong>. We're delighted to be making your worktops and will be in touch to confirm your installation details.
    </p>
  </td></tr>

  ${
    rowsHtml
      ? `<tr><td style="padding:18px 44px 0;">
    <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:12px;letter-spacing:0.24em;color:${TAN};text-transform:uppercase;">Your Order</p>
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding:12px 0 8px;border-bottom:1px solid ${LINE};font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.14em;color:${MUTED};text-transform:uppercase;">Description</td>
        <td style="padding:12px 0 8px;border-bottom:1px solid ${LINE};text-align:center;font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.14em;color:${MUTED};text-transform:uppercase;">Qty</td>
        <td style="padding:12px 0 8px;border-bottom:1px solid ${LINE};text-align:right;font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.14em;color:${MUTED};text-transform:uppercase;">Amount</td>
      </tr>
      ${rowsHtml}
      <tr>
        <td></td>
        <td style="padding:12px 0 0;text-align:right;font-family:Georgia,serif;font-size:14px;color:${MUTED};">Subtotal</td>
        <td style="padding:12px 0 0;text-align:right;font-family:${PRICE_FONT};font-size:14px;color:${INK};">${fmt(
          subtotal
        )}</td>
      </tr>
      <tr>
        <td></td>
        <td style="padding:6px 0 0;text-align:right;font-family:Georgia,serif;font-size:14px;color:${MUTED};">VAT @20%</td>
        <td style="padding:6px 0 0;text-align:right;font-family:${PRICE_FONT};font-size:14px;color:${INK};">${fmt(
          vat
        )}</td>
      </tr>
      <tr>
        <td></td>
        <td style="padding:12px 0 0;text-align:right;font-family:Georgia,serif;font-size:16px;font-weight:700;color:${INK};border-top:1px solid ${LINE};">Total Paid</td>
        <td style="padding:12px 0 0;text-align:right;font-family:${PRICE_FONT};font-size:18px;font-weight:700;color:${GOLD};border-top:1px solid ${LINE};">${fmt(
          total
        )}</td>
      </tr>
    </table>
  </td></tr>`
      : ''
  }

  ${
    reviewUrl
      ? `<tr><td style="padding:30px 44px 8px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${CREAM};border:1px solid ${LINE};">
      <tr><td align="center" style="padding:28px 28px;">
        <p style="margin:0 0 8px;font-family:Georgia,serif;font-size:16px;font-weight:700;color:${INK};">How did we do?</p>
        <p style="margin:0 0 20px;font-family:Georgia,serif;font-size:14px;line-height:1.7;color:#5a5a5a;">We'd love to hear about your experience — it only takes a minute and means a great deal to us.</p>
        <a href="${reviewUrl}" style="display:inline-block;padding:15px 38px;background:${INK};color:#ffffff;font-family:Arial,sans-serif;font-size:12px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;text-decoration:none;">Leave a Review</a>
      </td></tr>
    </table>
  </td></tr>`
      : ''
  }

  <tr><td align="center" style="padding:30px 44px 44px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${LINE};">
      <tr><td align="center" style="padding:24px 0 0;">
        <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:12px;letter-spacing:0.26em;color:${TAN};text-transform:uppercase;">The Quartz Company</p>
        <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#999;letter-spacing:0.02em;">sales@thequartzcompany.co.uk &nbsp;·&nbsp; 07375 303 416</p>
      </td></tr>
    </table>
  </td></tr>

</table>

<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
<tr><td style="border-top:2px solid ${GOLD};height:2px;font-size:0;line-height:0;">&nbsp;</td></tr>
</table>

</td></tr>
</table>
</body>
</html>`;
}
