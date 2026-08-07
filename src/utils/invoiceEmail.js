// Branded HTML for the invoice email sent from the CRM's invoice builder
// (Quotes tab → Generate Invoice).
//
// This is a faithful reproduction of the InvoicePDF document — same letterhead,
// invoice meta table, Bill To / From addresses, grouped line items with the PO
// column, totals with the deposit netted off, bank details, and the Google
// review invitation. Keep the two in step: if you change the layout of one,
// change the other.
//
// Rendered as full HTML (passed to api/zoho-send-invoice.js via the `html`
// field), which also attaches the real PDF.
import { BANK_DETAILS } from './bankDetails';
import { GOOGLE_REVIEW_URL } from './reviewRequestEmail';
import { itemTitle, itemDims, groupItems } from './quoteItems';

const GOLD = '#b08d57';
const TAN = '#b89a72';
const INK = '#1a1a1a';
const DARK = '#1C1712';
const LINE = '#e7ddcb';
const CREAM = '#f7f3ec';
const RULE = '#eeeeee';

// Matches InvoicePDF's SUPPLIER.
const SUPPLIER = {
  name: 'The Quartz Company',
  lines: ['Unit 303/2  K2 House', 'Business Centre,', 'Heathfield Way,', 'Northampton'],
  postcode: 'NN5 7QP',
  email: 'sales@thequartzcompany.co.uk',
  phone: '07375 303 416',
};

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const money = (n) => `£${Number(n || 0).toFixed(2)}`;

const SERIF = "Georgia,'Times New Roman',serif";
const SANS = 'Arial,Helvetica,sans-serif';

function metaRow(label, value) {
  return `<tr>
    <td align="right" style="padding:2px 14px 2px 0;font-family:${SANS};font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:#888888;">${label}</td>
    <td align="right" style="padding:2px 0;font-family:${SANS};font-size:12px;font-weight:700;color:${INK};">${value || '&mdash;'}</td>
  </tr>`;
}

function itemRows(items = [], poNumber = '') {
  return items
    .map((item) => {
      const dims = escapeHtml(itemDims(item));
      const qty = item.quantity != null ? item.quantity : 1;
      const name = escapeHtml(itemTitle(item));
      return `<tr>
        <td style="padding:7px 10px 7px 0;border-bottom:1px solid ${RULE};font-family:${SANS};font-size:12px;color:${INK};">
          ${name}${name && dims ? '<br>' : ''}${dims ? `<span style="font-size:11px;color:#888888;">${dims}</span>` : ''}
        </td>
        <td style="padding:7px 10px;border-bottom:1px solid ${RULE};font-family:${SANS};font-size:12px;color:#333333;">${escapeHtml(poNumber) || '&mdash;'}</td>
        <td align="center" style="padding:7px 10px;border-bottom:1px solid ${RULE};font-family:${SANS};font-size:12px;color:#333333;">${escapeHtml(qty)}</td>
        <td align="right" style="padding:7px 0 7px 10px;border-bottom:1px solid ${RULE};font-family:${SANS};font-size:12px;font-weight:600;color:${INK};">${money(item.line_total)}</td>
      </tr>`;
    })
    .join('');
}

function sectionRow(label) {
  return `<tr><td colspan="4" style="padding:9px 10px 4px 0;background:#faf7f2;font-family:${SANS};font-size:11px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;color:${GOLD};">${label}</td></tr>`;
}

function totalRow(label, value, opts = {}) {
  const size = opts.big ? '16px' : '13px';
  const weight = opts.big ? '800' : '400';
  const colour = opts.colour || (opts.big ? DARK : '#555555');
  const border = opts.rule ? `border-top:${opts.rule};` : '';
  return `<tr>
    <td style="${border}padding:${opts.rule ? '8px' : '4px'} 0 4px;font-family:${SERIF};font-size:${size};color:${colour};">${label}</td>
    <td align="right" style="${border}padding:${opts.rule ? '8px' : '4px'} 0 4px;font-family:${SANS};font-size:${size};font-weight:${weight};color:${colour};">${value}</td>
  </tr>`;
}

function bankRow(label, value, last = false) {
  const b = last ? '' : `border-bottom:1px solid ${LINE};`;
  return `<tr>
    <td style="${b}padding:6px 0;font-family:${SERIF};font-size:13px;color:#777777;">${label}</td>
    <td align="right" style="${b}padding:6px 0;font-family:${SANS};font-size:13px;font-weight:700;letter-spacing:0.04em;color:${INK};">${value}</td>
  </tr>`;
}

/**
 * Build the invoice email.
 *
 * mode: 'deposit' | 'balance' | 'full' — decides the wording and which amount
 * is presented as due. Amounts are passed in already calculated so the email,
 * the on-screen preview and the PDF can never disagree.
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
  depositPaidDate = '',
  amountDue = 0,
  invoiceDate = '',
  dueDate = '',
  poNumber = '',
  customerName = '',
  customerCompany = '',
  customerAddress = '',
  customerCity = '',
  customerPostcode = '',
  showReview = true,
  reviewUrl = GOOGLE_REVIEW_URL,
  reviewMessage = 'Thank you for choosing The Quartz Company — it has been a pleasure creating your worktops.',
  hasAttachment = false,
  attachmentName = '',
  logoUrl = '',
} = {}) {
  const dueLabel =
    mode === 'balance' ? 'Balance Now Due' : mode === 'full' ? 'Amount Due' : 'Deposit Due Now';

  const subject =
    mode === 'balance'
      ? `Invoice ${invoiceNumber} — balance due | The Quartz Company`
      : mode === 'deposit'
      ? `Invoice ${invoiceNumber} — deposit due | The Quartz Company`
      : `Invoice ${invoiceNumber} | The Quartz Company`;

  const intro =
    mode === 'balance'
      ? `Thank you for your deposit of ${money(depositPaidAmount)}. Your final invoice is below — the remaining balance is ${money(amountDue)}.`
      : mode === 'deposit'
      ? `Please find your invoice below. A payment of ${money(amountDue)} is due to commence your order.`
      : `Please find your invoice below. The amount due is ${money(amountDue)}.`;

  // Same grouping as the PDF — unlabelled when the saved items carry no
  // category, which is the normal case for a quote loaded from the database.
  const groups = groupItems(items);
  const itemsHtml = groups
    .map((g) => (g.label ? sectionRow(g.label) : '') + itemRows(g.items, poNumber))
    .join('');

  const customerLines = [customerCompany, customerAddress, customerCity, customerPostcode]
    .filter((l) => l && String(l).trim())
    .map((l) => `<div style="font-family:${SERIF};font-size:13px;line-height:1.55;color:#3a3a3a;">${escapeHtml(l)}</div>`)
    .join('');

  const supplierLines = [...SUPPLIER.lines, SUPPLIER.postcode]
    .map((l) => `<div style="font-family:${SERIF};font-size:13px;line-height:1.55;color:#3a3a3a;">${escapeHtml(l)}</div>`)
    .join('');

  const dueNote =
    mode === 'balance'
      ? `Thank you for your deposit of ${money(depositPaidAmount)}. The remaining balance of ${money(amountDue)}${
          dueDate ? ` is due by ${escapeHtml(dueDate)}` : ' is now due'
        }. Please pay by bank transfer:`
      : mode === 'full'
      ? `The full amount of ${money(amountDue)}${
          dueDate ? ` is due by ${escapeHtml(dueDate)}` : ' is now due'
        }. Please pay by bank transfer:`
      : `A payment of ${money(amountDue)} is due now to commence your order. The remaining balance of ${money(
          Math.max(0, total - depositPaidAmount - amountDue)
        )} is due on completion. Please pay by bank transfer:`;

  const attachmentBlock = hasAttachment
    ? `<tr><td style="padding:0 44px 24px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${LINE};background:#ffffff;">
      <tr><td style="padding:15px 18px;font-family:${SERIF};font-size:13px;line-height:1.5;color:${INK};">
        <span style="display:inline-block;padding:3px 8px;margin-right:9px;background:${CREAM};border:1px solid ${LINE};font-family:${SANS};font-size:10px;font-weight:700;letter-spacing:0.1em;color:#8a6c3e;">PDF</span>
        A printable copy of this invoice is attached${attachmentName ? ` as <strong>${escapeHtml(attachmentName)}</strong>` : ''} — download it for your records.
      </td></tr>
    </table>
  </td></tr>`
    : '';

  const reviewBlock = showReview
    ? `<tr><td style="padding:0 44px 8px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${CREAM};border:1px solid ${LINE};">
      <tr><td align="center" style="padding:28px;">
        <p style="margin:0 0 4px;font-family:${SANS};font-size:22px;letter-spacing:5px;color:${GOLD};">&#9733; &#9733; &#9733; &#9733; &#9733;</p>
        <p style="margin:0 0 9px;font-family:${SERIF};font-size:18px;font-weight:700;color:${DARK};">How did we do?</p>
        <p style="margin:0 0 18px;font-family:${SERIF};font-size:13px;line-height:1.65;color:#5a5a5a;">${escapeHtml(reviewMessage)}<br>If you have a moment, we&rsquo;d be hugely grateful if you&rsquo;d share your experience &mdash; it takes less than a minute and helps other homeowners find us.</p>
        <a href="${reviewUrl}" style="display:inline-block;padding:13px 34px;background:${DARK};color:#ffffff;font-family:${SANS};font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;text-decoration:none;">Leave us a Google review</a>
      </td></tr>
    </table>
  </td></tr>`
    : '';

  return {
    subject,
    html: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${escapeHtml(subject)}</title>
<style>
  :root { color-scheme: light; supported-color-schemes: light; }
  /* Stop Gmail/Outlook dark mode repainting the document. */
  [data-ogsc] .doc, [data-ogsb] .doc { background:#ffffff !important; }
</style>
</head>
<body style="margin:0;padding:0;background:#f4f1ea;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f4f1ea" style="background:#f4f1ea;padding:36px 12px;">
<tr><td align="center">

<table align="center" width="640" cellpadding="0" cellspacing="0" border="0" style="max-width:640px;margin:0 auto;">
<tr><td style="border-top:2px solid ${GOLD};height:2px;font-size:0;line-height:0;">&nbsp;</td></tr>
</table>

<table class="doc" align="center" width="640" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="max-width:640px;margin:0 auto;background:#ffffff;">

  <!-- Letterhead: logo + INVOICE wordmark and meta -->
  <tr><td style="padding:36px 44px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td valign="top" width="45%">
          <img src="${logoUrl}" alt="The Quartz Company" width="180" style="display:block;max-width:180px;height:auto;border:0;outline:none;text-decoration:none;">
        </td>
        <td valign="top" align="right">
          <p style="margin:0 0 8px;font-family:${SERIF};font-size:30px;font-weight:700;letter-spacing:0.1em;color:${DARK};">INVOICE</p>
          <table cellpadding="0" cellspacing="0" border="0" align="right">
            ${metaRow('Invoice No.', escapeHtml(invoiceNumber))}
            ${metaRow('Invoice Date', escapeHtml(invoiceDate))}
            ${dueDate ? metaRow('Payment Due', escapeHtml(dueDate)) : ''}
            ${metaRow('Order Ref.', escapeHtml(quoteNumber))}
            ${metaRow('PO Number', escapeHtml(poNumber))}
          </table>
        </td>
      </tr>
    </table>
  </td></tr>

  <tr><td style="padding:18px 44px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td bgcolor="${GOLD}" style="height:3px;background:${GOLD};font-size:0;line-height:0;">&nbsp;</td>
    </tr></table>
  </td></tr>

  <!-- Greeting -->
  <tr><td style="padding:22px 44px 0;">
    <p style="margin:0 0 12px;font-family:${SERIF};font-size:16px;color:${INK};">Hi ${escapeHtml(firstName)},</p>
    <p style="margin:0;font-family:${SERIF};font-size:14px;line-height:1.7;color:#3a3a3a;">${intro}</p>
  </td></tr>

  <!-- Bill To / From -->
  <tr><td style="padding:24px 44px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td valign="top" width="50%">
          <div style="font-family:${SANS};font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:${TAN};padding-bottom:7px;">Bill To</div>
          ${customerName ? `<div style="font-family:${SERIF};font-size:15px;font-weight:700;line-height:1.5;color:${INK};">${escapeHtml(customerName)}</div>` : ''}
          ${customerLines}
        </td>
        <td valign="top" align="right" width="50%">
          <div style="font-family:${SANS};font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:${TAN};padding-bottom:7px;">From</div>
          <div style="font-family:${SERIF};font-size:15px;font-weight:700;line-height:1.5;color:${INK};">${SUPPLIER.name}</div>
          ${supplierLines}
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- Line items -->
  <tr><td style="padding:26px 44px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <th align="left" bgcolor="${DARK}" style="padding:9px 10px 9px 12px;background:${DARK};font-family:${SANS};font-size:10px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#ffffff;">Description</th>
        <th align="left" bgcolor="${DARK}" style="padding:9px 10px;background:${DARK};font-family:${SANS};font-size:10px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#ffffff;">PO Number</th>
        <th align="center" bgcolor="${DARK}" style="padding:9px 10px;background:${DARK};font-family:${SANS};font-size:10px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#ffffff;">Qty</th>
        <th align="right" bgcolor="${DARK}" style="padding:9px 12px 9px 10px;background:${DARK};font-family:${SANS};font-size:10px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#ffffff;">Amount</th>
      </tr>
      ${itemsHtml}
    </table>
  </td></tr>

  <!-- Totals -->
  <tr><td style="padding:14px 44px 0;">
    <table align="right" width="300" cellpadding="0" cellspacing="0" border="0">
      ${totalRow('Subtotal', money(subtotal))}
      ${totalRow('VAT @20%', money(vat))}
      ${totalRow('Total', money(total), { big: true, rule: `2px solid ${DARK}` })}
      ${
        depositPaidAmount > 0
          ? totalRow(
              `Deposit received${depositPaidDate ? ` &mdash; ${escapeHtml(depositPaidDate)}` : ''}`,
              `&minus;${money(depositPaidAmount)}`,
              { colour: '#2f6f3a' }
            ) +
            totalRow('Outstanding', money(Math.max(0, total - depositPaidAmount)), {
              rule: `1px solid ${LINE}`,
            })
          : ''
      }
    </table>
  </td></tr>
  <tr><td style="font-size:0;line-height:0;">&nbsp;</td></tr>

  <!-- Amount due + bank details -->
  <tr><td style="padding:22px 44px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${CREAM}" style="background:${CREAM};border:1px solid ${LINE};border-left:4px solid ${GOLD};">
      <tr><td style="padding:20px 24px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
          <td style="font-family:${SANS};font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#8a6c3e;font-weight:700;">${dueLabel}</td>
          <td align="right" style="font-family:${SANS};font-size:28px;font-weight:800;color:${GOLD};">${money(amountDue)}</td>
        </tr></table>
        <p style="margin:11px 0 15px;font-family:${SERIF};font-size:13px;line-height:1.6;color:#5a5a5a;">${dueNote}</p>
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          ${bankRow('Account name', BANK_DETAILS.accountName)}
          ${bankRow('Sort code', BANK_DETAILS.sortCode)}
          ${bankRow('Account number', BANK_DETAILS.accountNumber)}
          ${bankRow('Bank', BANK_DETAILS.bankName)}
          ${bankRow('Reference', escapeHtml(quoteNumber || invoiceNumber), true)}
        </table>
      </td></tr>
    </table>
  </td></tr>

  <tr><td style="height:24px;font-size:0;line-height:0;">&nbsp;</td></tr>
  ${attachmentBlock}
  ${reviewBlock}

  <!-- Footer -->
  <tr><td align="center" style="padding:28px 44px 40px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${RULE};">
      <tr><td align="center" style="padding:20px 0 0;">
        <p style="margin:0 0 7px;font-family:${SANS};font-size:11px;letter-spacing:0.26em;color:${TAN};text-transform:uppercase;">${SUPPLIER.name}</p>
        <p style="margin:0;font-family:${SANS};font-size:12px;color:#999999;letter-spacing:0.02em;">${SUPPLIER.email} &nbsp;&middot;&nbsp; ${SUPPLIER.phone}</p>
      </td></tr>
    </table>
  </td></tr>

</table>

<table align="center" width="640" cellpadding="0" cellspacing="0" border="0" style="max-width:640px;margin:0 auto;">
<tr><td style="border-top:2px solid ${GOLD};height:2px;font-size:0;line-height:0;">&nbsp;</td></tr>
</table>

</td></tr>
</table>
</body>
</html>`,
  };
}
