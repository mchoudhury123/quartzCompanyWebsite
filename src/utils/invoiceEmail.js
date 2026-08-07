// Branded HTML for the invoice email sent from the CRM's invoice builder
// (Quotes tab → Invoice). Mirrors the InvoicePDF document: line items, totals,
// the amount due, bank details, and — once the deposit is in — an invitation to
// leave a Google review.
//
// Rendered as full HTML (passed to api/zoho-send-email.js via the `html` field,
// bypassing the plain wrapper).
import { BANK_DETAILS } from './bankDetails';
import { GOOGLE_REVIEW_URL } from './reviewRequestEmail';

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

const money = (n) => `£${Number(n || 0).toFixed(2)}`;

function itemRows(items = []) {
  if (!items.length) return '';
  return items
    .map((item) => {
      const dims = item.x_mm && item.y_mm ? `${item.x_mm}×${item.y_mm}mm` : '';
      const qty = item.quantity != null ? item.quantity : 1;
      return `<tr>
        <td style="padding:9px 0;border-bottom:1px solid #efe8dc;font-family:Georgia,serif;font-size:13px;color:#3a3a3a;">
          ${escapeHtml(item.product_name)}${dims ? `<br><span style="font-size:11px;color:#999;">${escapeHtml(dims)}</span>` : ''}
        </td>
        <td style="padding:9px 0;border-bottom:1px solid #efe8dc;font-family:Arial,sans-serif;font-size:13px;color:#777;text-align:center;">${escapeHtml(qty)}</td>
        <td style="padding:9px 0;border-bottom:1px solid #efe8dc;font-family:Arial,sans-serif;font-size:13px;color:${INK};font-weight:700;text-align:right;">${money(item.line_total)}</td>
      </tr>`;
    })
    .join('');
}

function totalRow(label, value, opts = {}) {
  const weight = opts.bold ? '700' : '400';
  const size = opts.bold ? '15px' : '13px';
  const colour = opts.colour || (opts.bold ? INK : '#666');
  const border = opts.topRule ? `border-top:1px solid ${LINE};padding-top:10px;` : '';
  return `<tr>
    <td style="${border}padding:5px 0;font-family:Georgia,serif;font-size:${size};color:${colour};">${label}</td>
    <td style="${border}padding:5px 0;font-family:Arial,sans-serif;font-size:${size};font-weight:${weight};color:${colour};text-align:right;">${value}</td>
  </tr>`;
}

/**
 * Build the invoice email.
 *
 * mode: 'deposit' | 'balance' | 'full' — decides the wording and which amount
 * is presented as due. Amounts are passed in already calculated so the email
 * and the PDF can never disagree.
 */
export function buildInvoiceEmail({
  firstName = 'there',
  invoiceNumber = '',
  quoteNumber = '',
  mode = 'balance',
  items = [],
  subtotal = 0,
  vat = 0,
  total = 0,
  depositPaidAmount = 0,
  amountDue = 0,
  dueDate = '',
  showReview = true,
  reviewUrl = GOOGLE_REVIEW_URL,
  reviewMessage = 'Thank you for choosing The Quartz Company — it has been a pleasure creating your worktops.',
  logoUrl = '',
} = {}) {
  const dueLabel =
    mode === 'balance' ? 'Balance now due' : mode === 'full' ? 'Amount due' : 'Deposit due now';

  const subject =
    mode === 'balance'
      ? `Invoice ${invoiceNumber} — balance due | The Quartz Company`
      : mode === 'deposit'
      ? `Invoice ${invoiceNumber} — deposit due | The Quartz Company`
      : `Invoice ${invoiceNumber} | The Quartz Company`;

  const intro =
    mode === 'balance'
      ? `Thank you for your deposit of ${money(depositPaidAmount)}. Please find your final invoice below — the remaining balance is ${money(amountDue)}.`
      : mode === 'deposit'
      ? `Please find your invoice below. A payment of ${money(amountDue)} is due to commence your order.`
      : `Please find your invoice below. The amount due is ${money(amountDue)}.`;

  const reviewBlock = showReview
    ? `<tr><td style="padding:8px 44px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${CREAM};border:1px solid ${LINE};">
      <tr><td align="center" style="padding:30px 28px;">
        <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:24px;letter-spacing:4px;color:${GOLD};">★ ★ ★ ★ ★</p>
        <p style="margin:0 0 10px;font-family:Georgia,serif;font-size:18px;font-weight:700;color:${INK};">How did we do?</p>
        <p style="margin:0 0 20px;font-family:Georgia,serif;font-size:14px;line-height:1.7;color:#5a5a5a;">${escapeHtml(reviewMessage)}<br>If you have a moment, we&rsquo;d be hugely grateful if you&rsquo;d share your experience &mdash; it takes less than a minute and means the world to our small team.</p>
        <a href="${reviewUrl}" style="display:inline-block;padding:15px 38px;background:${INK};color:#ffffff;font-family:Arial,sans-serif;font-size:12px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;text-decoration:none;">Leave us a Google review</a>
      </td></tr>
    </table>
  </td></tr>`
    : '';

  return {
    subject,
    html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:0;background:#f4f1ea;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f1ea;padding:40px 12px;">
<tr><td align="center">

<table align="center" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;margin:0 auto;">
<tr><td style="border-top:2px solid ${GOLD};height:2px;font-size:0;line-height:0;">&nbsp;</td></tr>
</table>

<table align="center" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;margin:0 auto;background:#ffffff;">

  <tr><td align="center" style="padding:44px 32px 14px;">
    <img src="${logoUrl}" alt="The Quartz Company" width="190" style="display:block;max-width:190px;height:auto;border:0;outline:none;text-decoration:none;">
  </td></tr>

  <tr><td align="center" style="padding:0 32px 20px;">
    <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.26em;color:${TAN};text-transform:uppercase;">Invoice</p>
    <p style="margin:0;font-family:Georgia,serif;font-size:26px;font-weight:700;color:${INK};">${escapeHtml(invoiceNumber)}</p>
    ${quoteNumber ? `<p style="margin:6px 0 0;font-family:Arial,sans-serif;font-size:12px;color:#999;">Order ref. ${escapeHtml(quoteNumber)}</p>` : ''}
  </td></tr>

  <tr><td style="padding:0 44px 8px;">
    <p style="margin:0 0 16px;font-family:Georgia,serif;font-size:16px;color:${INK};">Hi ${escapeHtml(firstName)},</p>
    <p style="margin:0 0 20px;font-family:Georgia,serif;font-size:15px;line-height:1.75;color:#3a3a3a;">${escapeHtml(intro)}</p>
  </td></tr>

  ${
    items.length
      ? `<tr><td style="padding:0 44px 4px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <th align="left" style="padding:0 0 8px;border-bottom:2px solid ${INK};font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:#999;font-weight:600;">Description</th>
        <th align="center" style="padding:0 0 8px;border-bottom:2px solid ${INK};font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:#999;font-weight:600;">Qty</th>
        <th align="right" style="padding:0 0 8px;border-bottom:2px solid ${INK};font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:#999;font-weight:600;">Amount</th>
      </tr>
      ${itemRows(items)}
    </table>
  </td></tr>`
      : ''
  }

  <tr><td style="padding:16px 44px 0;">
    <table align="right" width="290" cellpadding="0" cellspacing="0" border="0">
      ${totalRow('Subtotal', money(subtotal))}
      ${totalRow('VAT @20%', money(vat))}
      ${totalRow('Total', money(total), { bold: true, topRule: true })}
      ${depositPaidAmount > 0 ? totalRow('Deposit received', `&minus;${money(depositPaidAmount)}`, { colour: '#2f6f3a' }) : ''}
    </table>
  </td></tr>

  <tr><td style="padding:26px 44px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${CREAM};border:1px solid ${LINE};border-left:4px solid ${GOLD};">
      <tr><td style="padding:22px 26px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
          <td style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#8a6c3e;font-weight:700;">${dueLabel}</td>
          <td align="right" style="font-family:Arial,sans-serif;font-size:26px;font-weight:800;color:${GOLD};">${money(amountDue)}</td>
        </tr></table>
        <p style="margin:12px 0 16px;font-family:Georgia,serif;font-size:13px;line-height:1.6;color:#5a5a5a;">
          ${dueDate ? `Payment is due by ${escapeHtml(dueDate)}. ` : ''}Please pay by bank transfer using the details below.
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td style="padding:7px 0;border-bottom:1px solid ${LINE};font-family:Georgia,serif;font-size:13px;color:#777;">Account name</td><td align="right" style="padding:7px 0;border-bottom:1px solid ${LINE};font-family:Arial,sans-serif;font-size:13px;font-weight:700;color:${INK};">${BANK_DETAILS.accountName}</td></tr>
          <tr><td style="padding:7px 0;border-bottom:1px solid ${LINE};font-family:Georgia,serif;font-size:13px;color:#777;">Sort code</td><td align="right" style="padding:7px 0;border-bottom:1px solid ${LINE};font-family:Arial,sans-serif;font-size:13px;font-weight:700;color:${INK};">${BANK_DETAILS.sortCode}</td></tr>
          <tr><td style="padding:7px 0;border-bottom:1px solid ${LINE};font-family:Georgia,serif;font-size:13px;color:#777;">Account number</td><td align="right" style="padding:7px 0;border-bottom:1px solid ${LINE};font-family:Arial,sans-serif;font-size:13px;font-weight:700;color:${INK};">${BANK_DETAILS.accountNumber}</td></tr>
          <tr><td style="padding:7px 0;border-bottom:1px solid ${LINE};font-family:Georgia,serif;font-size:13px;color:#777;">Bank</td><td align="right" style="padding:7px 0;border-bottom:1px solid ${LINE};font-family:Arial,sans-serif;font-size:13px;font-weight:700;color:${INK};">${BANK_DETAILS.bankName}</td></tr>
          <tr><td style="padding:7px 0;font-family:Georgia,serif;font-size:13px;color:#777;">Reference</td><td align="right" style="padding:7px 0;font-family:Arial,sans-serif;font-size:13px;font-weight:700;color:${INK};">${escapeHtml(quoteNumber || invoiceNumber)}</td></tr>
        </table>
      </td></tr>
    </table>
  </td></tr>

  <tr><td style="height:22px;font-size:0;line-height:0;">&nbsp;</td></tr>
  ${reviewBlock}

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
