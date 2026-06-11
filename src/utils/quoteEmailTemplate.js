// Shared quote email HTML template — used by both the backend sender
// (api/zoho-send-quote.js) and the CRM preview modal. Rendering the same
// string in both places guarantees the preview matches what the customer
// receives, byte-for-byte.
//
// The email body IS the full quotation document: supplier + customer
// address blocks, quote number, date, description, an itemised materials
// table, totals, and a deposit panel — matching the printed/online quote.

const SUPPLIER = {
  name: 'The Quartz Company',
  lines: [
    'Unit 303/2  K2 House',
    'Business Centre,',
    'Heathfield Way,',
    'Northampton',
  ],
  postcode: 'NN5 7QP',
};

import { BANK_DETAILS as BANK } from './bankDetails.js';

const BUSINESS_PHONE = '07375 303 416';
const BUSINESS_PHONE_TEL = '+447375303416';
const BUSINESS_EMAIL = 'sales@thequartzcompany.co.uk';

// Brand colours pulled from the quotation design
const GOLD = '#b08d57'; // grand total, deposit amount, accent bars
const TAN = '#b89a72'; // eyebrow / section labels
const INK = '#1a1a1a';
const MUTED = '#777777';
const LINE = '#e7ddcb';
const CREAM = '#f7f3ec';

// Prices/amounts use a clean sans-serif — the serif numerals were hard to
// read. This is applied ONLY to monetary figures, not to labels or headings.
const PRICE_FONT = "'Helvetica Neue', Arial, Helvetica, sans-serif";

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function itemTitle(item) {
  if (item.type === 'accessory' || item.product_name) {
    return item.product_name || 'Product';
  }
  if (item.piece_type === 'specialist') {
    return `${item.description || 'Custom Worktop'} (Specialist Worktop)`;
  }
  const base = item.piece_type || 'Worktop';
  return item.description ? `${base} — ${item.description}` : base;
}

function itemDims(item) {
  return item.x_mm && item.y_mm ? `${item.x_mm}×${item.y_mm}mm` : '';
}

export function buildQuoteEmailHtml({
  quoteNumber = '',
  date = '',
  description = '',
  items = [],
  subtotal = 0,
  vat = 0,
  total = 0,
  deposit = 0,
  customerName = '',
  customerCompany = '',
  customerAddressLines = [],
  customerPostcode = '',
  logoUrl = '',
}) {
  const fmtCurrency = (v) =>
    `£${Number(v || 0).toLocaleString('en-GB', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const fmtDate = date
    ? new Date(date).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  const depositPct = total > 0 ? Math.round((deposit / total) * 100) : 0;

  // Bank transfer details block (replaces online card payment). The payment
  // reference is the quote number so we can match the deposit to the order.
  const bankReference = quoteNumber || '—';
  const bankRow = (label, value) =>
    `<tr>
      <td style="padding:9px 0;border-bottom:1px solid ${LINE};font-family:Arial,sans-serif;font-size:13px;color:${MUTED};">${label}</td>
      <td style="padding:9px 0;border-bottom:1px solid ${LINE};text-align:right;font-family:${PRICE_FONT};font-size:15px;font-weight:700;color:${INK};letter-spacing:0.04em;">${escapeHtml(
        value
      )}</td>
    </tr>`;
  const bankDetailsHtml = `
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      ${bankRow('Account name', BANK.accountName)}
      ${bankRow('Sort code', BANK.sortCode)}
      ${bankRow('Account number', BANK.accountNumber)}
      ${bankRow('Bank', BANK.bankName)}
      ${bankRow('Reference', bankReference)}
    </table>`;

  // Customer block order matches the quotation: first + last name (bold),
  // then optional company, then each address line, then postcode.
  const customerBlockLines = [
    customerCompany,
    ...(Array.isArray(customerAddressLines)
      ? customerAddressLines
      : String(customerAddressLines || '').split(/\r?\n/)),
    customerPostcode,
  ].filter((l) => l && String(l).trim());

  const addressLineHtml = (lines) =>
    lines
      .map(
        (l) =>
          `<span style="display:block;font-family:Georgia,'Times New Roman',serif;font-size:14px;line-height:1.55;color:#3a3a3a;">${escapeHtml(
            l
          )}</span>`
      )
      .join('');

  // Materials rows
  const rowsHtml =
    items && items.length
      ? items
          .map((item) => {
            const dims = itemDims(item);
            const qty = item.quantity != null ? item.quantity : 1;
            return `
        <tr>
          <td style="padding:18px 0;border-bottom:1px solid ${LINE};vertical-align:top;">
            <span style="display:block;font-family:Georgia,'Times New Roman',serif;font-size:16px;font-weight:700;color:${INK};line-height:1.4;">${escapeHtml(
              itemTitle(item)
            )}</span>
            ${
              dims
                ? `<span style="display:block;margin-top:4px;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${MUTED};">${escapeHtml(
                    dims
                  )}</span>`
                : ''
            }
          </td>
          <td style="padding:18px 0;border-bottom:1px solid ${LINE};text-align:center;vertical-align:top;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#3a3a3a;">${escapeHtml(
              qty
            )}</td>
          <td style="padding:18px 0;border-bottom:1px solid ${LINE};text-align:right;vertical-align:top;font-family:${PRICE_FONT};font-size:15px;font-weight:600;color:${INK};">${fmtCurrency(
              item.line_total
            )}</td>
        </tr>`;
          })
          .join('')
      : `<tr><td colspan="3" style="padding:18px 0;border-bottom:1px solid ${LINE};font-family:Arial,sans-serif;font-size:14px;color:${MUTED};">No items listed.</td></tr>`;

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f1ea;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f1ea;padding:40px 12px;">
<tr><td align="center">

<table width="640" cellpadding="0" cellspacing="0" border="0" style="max-width:640px;">
<tr><td style="border-top:2px solid ${GOLD};height:2px;font-size:0;line-height:0;">&nbsp;</td></tr>
</table>

<table width="640" cellpadding="0" cellspacing="0" border="0" style="max-width:640px;background:#ffffff;">

  <!-- Supplier / Logo / Customer -->
  <tr><td style="padding:40px 40px 8px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td width="33%" style="vertical-align:top;">
          <p style="margin:0 0 12px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.22em;color:${TAN};text-transform:uppercase;">Supplier</p>
          <span style="display:block;font-family:Georgia,'Times New Roman',serif;font-size:15px;font-weight:700;color:${INK};line-height:1.5;">${escapeHtml(
            SUPPLIER.name
          )}</span>
          ${addressLineHtml([...SUPPLIER.lines, SUPPLIER.postcode])}
        </td>
        <td width="34%" style="vertical-align:top;text-align:center;padding:0 8px;">
          <img src="${logoUrl}" alt="The Quartz Company" width="170" style="display:inline-block;max-width:170px;height:auto;border:0;outline:none;text-decoration:none;">
        </td>
        <td width="33%" style="vertical-align:top;text-align:right;">
          <p style="margin:0 0 12px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.22em;color:${TAN};text-transform:uppercase;">Customer</p>
          ${
            customerName
              ? `<span style="display:block;font-family:Georgia,'Times New Roman',serif;font-size:15px;font-weight:700;color:${INK};line-height:1.5;">${escapeHtml(
                  customerName
                )}</span>`
              : ''
          }
          ${addressLineHtml(customerBlockLines)}
        </td>
      </tr>
    </table>
  </td></tr>

  <!-- Small centre divider -->
  <tr><td align="center" style="padding:24px 40px 20px;">
    <table width="36" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="border-bottom:1px solid ${GOLD};font-size:0;line-height:0;">&nbsp;</td>
    </tr></table>
  </td></tr>

  <!-- Quotation heading -->
  <tr><td align="center" style="padding:0 40px 4px;">
    <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.26em;color:${TAN};text-transform:uppercase;">Your Quotation</p>
  </td></tr>
  <tr><td align="center" style="padding:6px 40px 28px;">
    <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:34px;font-weight:400;letter-spacing:0.04em;color:#2a2a2a;">${escapeHtml(
      quoteNumber
    )}</p>
  </td></tr>

  <!-- Date + Description -->
  <tr><td style="padding:0 40px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding:8px 0;font-family:Georgia,serif;font-size:14px;color:${MUTED};">Date</td>
        <td style="padding:8px 0;text-align:right;font-family:Georgia,serif;font-size:15px;font-weight:700;color:${INK};">${escapeHtml(
          fmtDate
        )}</td>
      </tr>
      ${
        description
          ? `<tr>
        <td style="padding:8px 0;font-family:Georgia,serif;font-size:14px;color:${MUTED};">Description</td>
        <td style="padding:8px 0;text-align:right;font-family:Georgia,serif;font-size:15px;font-weight:700;color:${INK};">${escapeHtml(
          description
        )}</td>
      </tr>`
          : ''
      }
    </table>
  </td></tr>

  <tr><td style="padding:24px 40px 0;"><div style="border-top:1px solid ${LINE};font-size:0;line-height:0;">&nbsp;</div></td></tr>

  <!-- Materials -->
  <tr><td style="padding:24px 40px 0;">
    <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:12px;letter-spacing:0.24em;color:${TAN};text-transform:uppercase;">Materials</p>
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding:14px 0 10px;border-bottom:1px solid ${LINE};font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.16em;color:${MUTED};text-transform:uppercase;">Description</td>
        <td style="padding:14px 0 10px;border-bottom:1px solid ${LINE};text-align:center;font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.16em;color:${MUTED};text-transform:uppercase;">Quantity</td>
        <td style="padding:14px 0 10px;border-bottom:1px solid ${LINE};text-align:right;font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.16em;color:${MUTED};text-transform:uppercase;">Amount</td>
      </tr>
      ${rowsHtml}
    </table>
  </td></tr>

  <!-- Totals -->
  <tr><td style="padding:18px 40px 0;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding:7px 0;"></td>
        <td style="padding:7px 0;text-align:right;font-family:Georgia,serif;font-size:15px;color:${MUTED};width:160px;">Subtotal</td>
        <td style="padding:7px 0;text-align:right;font-family:${PRICE_FONT};font-size:15px;color:${INK};width:140px;">${fmtCurrency(
          subtotal
        )}</td>
      </tr>
      <tr>
        <td style="padding:7px 0;"></td>
        <td style="padding:7px 0;text-align:right;font-family:Georgia,serif;font-size:15px;color:${MUTED};">VAT @20%</td>
        <td style="padding:7px 0;text-align:right;font-family:${PRICE_FONT};font-size:15px;color:${INK};">${fmtCurrency(
          vat
        )}</td>
      </tr>
      <tr>
        <td style="padding:16px 0 0;"></td>
        <td style="padding:16px 0 0;text-align:right;font-family:Georgia,serif;font-size:20px;font-weight:700;color:${INK};border-top:1px solid ${LINE};">Grand Total</td>
        <td style="padding:16px 0 0;text-align:right;font-family:${PRICE_FONT};font-size:22px;font-weight:700;color:${GOLD};border-top:1px solid ${LINE};">${fmtCurrency(
          total
        )}</td>
      </tr>
    </table>
  </td></tr>

  <!-- Deposit panel -->
  <tr><td style="padding:32px 40px 8px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${CREAM};border:1px solid ${LINE};">
      <tr><td style="padding:30px 32px;">
        <p style="margin:0 0 10px;font-family:Arial,sans-serif;font-size:12px;letter-spacing:0.24em;color:${TAN};text-transform:uppercase;">Deposit to Secure</p>
        <p style="margin:0 0 6px;font-family:${PRICE_FONT};font-size:38px;font-weight:700;color:${GOLD};line-height:1.1;">${fmtCurrency(
          deposit
        )}</p>
        <p style="margin:0 0 22px;font-family:Georgia,serif;font-size:15px;color:#5a5a5a;">A ${depositPct}% deposit secures your quote. Please pay by bank transfer using the details below.</p>

        <p style="margin:0 0 10px;font-family:Arial,sans-serif;font-size:12px;letter-spacing:0.2em;color:${TAN};text-transform:uppercase;">Pay by Bank Transfer</p>
        ${bankDetailsHtml}

        <p style="margin:20px 0 0;font-family:Georgia,serif;font-size:13px;line-height:1.55;color:${MUTED};">Please use <strong style="color:${INK};">${escapeHtml(
          bankReference
        )}</strong> as your payment reference. Once you've sent the transfer, reply to this email or call <a href="tel:${BUSINESS_PHONE_TEL}" style="color:${INK};text-decoration:none;font-weight:700;">${BUSINESS_PHONE}</a> and we'll confirm your order.</p>
      </td></tr>
    </table>
  </td></tr>

  <!-- Footer -->
  <tr><td align="center" style="padding:28px 40px 44px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${LINE};">
      <tr><td align="center" style="padding:26px 0 0;">
        <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:12px;letter-spacing:0.26em;color:${TAN};text-transform:uppercase;">The Quartz Company</p>
        <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#999;letter-spacing:0.02em;">${BUSINESS_EMAIL} &nbsp;·&nbsp; ${BUSINESS_PHONE}</p>
      </td></tr>
    </table>
  </td></tr>

</table>

<table width="640" cellpadding="0" cellspacing="0" border="0" style="max-width:640px;">
<tr><td style="border-top:2px solid ${GOLD};height:2px;font-size:0;line-height:0;">&nbsp;</td></tr>
</table>

</td></tr>
</table>
</body>
</html>`;
}
