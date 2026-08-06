// Eye-catching HTML sale email templates for the Email Marketing tab.
// Each builder returns a full, email-client-safe HTML document (table layout,
// inline styles) that is sent as-is via the `html` field of /api/zoho-send-email.

const LOGO_URL = 'https://www.thequartzcompany.co.uk/logo.png';
const INSTAGRAM_URL = 'https://www.instagram.com/thequartzcompanyuk/';
const FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=61587732770864';
const IG_ICON = 'https://www.thequartzcompany.co.uk/email/instagram.png';
const FB_ICON = 'https://www.thequartzcompany.co.uk/email/facebook.png';

// Instagram + Facebook icons linking to the company's social accounts.
export function socialIcons() {
  return `<div style="margin:0 0 16px;">
    <a href="${INSTAGRAM_URL}" style="text-decoration:none;margin:0 5px;display:inline-block;"><img src="${IG_ICON}" alt="Instagram" width="24" height="24" style="border:0;display:inline-block;"></a>
    <a href="${FACEBOOK_URL}" style="text-decoration:none;margin:0 5px;display:inline-block;"><img src="${FB_ICON}" alt="Facebook" width="24" height="24" style="border:0;display:inline-block;"></a>
  </div>`;
}

export const SALE_TEMPLATES = [
  { id: 'bold', name: 'Bold & Luxe', description: 'Dark hero, big discount — high impact.' },
  { id: 'seasonal', name: 'Seasonal', description: 'Warm banner in your chosen colour.' },
  { id: 'elegant', name: 'Elegant Minimal', description: 'Refined, understated, brand-led.' },
];

// Preset accent colours to suit different seasons/sales.
export const ACCENT_PRESETS = [
  { label: 'Quartz Gold', value: '#c5a47e' },
  { label: 'Summer Coral', value: '#e2703a' },
  { label: 'Autumn Rust', value: '#b5451b' },
  { label: 'Halloween Orange', value: '#f2681f' },
  { label: 'Spooky Purple', value: '#6b2d8f' },
  { label: 'Winter Teal', value: '#2f6f8f' },
  { label: 'Festive Red', value: '#a3252a' },
];

export const DEFAULT_SALE_FIELDS = {
  saleName: 'Summer Sale',
  discount: '40% OFF',
  headline: 'Transform your kitchen for less',
  message:
    'For a limited time, enjoy an exclusive discount on our premium quartz worktops. Book your free, no-obligation quote today and let our team help you create the kitchen you have always wanted.',
  endDate: '',
  ctaLabel: 'Get Your Free Quote',
  ctaUrl: 'https://www.thequartzcompany.co.uk/quote',
  accent: '#c5a47e',
  // Optional "what's discounted" breakdown — mirrors the sale page bars.
  showBreakdown: true,
  breakdownTitle: "What's included in the sale",
  breakdown: [
    { value: '40% off', label: 'Materials' },
    { value: '40% off', label: 'Processing' },
    { value: '20% off', label: 'Installation' },
  ],
};

export function formatEndDate(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d)) return '';
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

function esc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function paragraphs(message, color) {
  return String(message || '')
    .split(/\n{2,}/)
    .map(
      (p) =>
        `<p style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.75;color:${color};">${esc(p).replace(/\n/g, '<br>')}</p>`
    )
    .join('');
}

function endsPill(endDate, bg, fg) {
  const d = formatEndDate(endDate);
  if (!d) return '';
  return `<div style="margin:22px 0 0;"><span style="display:inline-block;background:${bg};color:${fg};font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;padding:8px 16px;border-radius:999px;">Sale ends ${esc(d)}</span></div>`;
}

function ctaButton(label, url, bg, fg) {
  return `<a href="${esc(url)}" style="display:inline-block;background:${bg};color:${fg};font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;letter-spacing:0.04em;text-decoration:none;padding:15px 34px;border-radius:6px;">${esc(label)}</a>`;
}

// Optional breakdown of what's discounted (materials / processing / installation).
// Rendered as an email-safe row of cells; valueColor themes it to the template.
function breakdownBlock(f, valueColor) {
  if (!f.showBreakdown) return '';
  const items = (f.breakdown || []).filter((it) => it && (it.value || it.label));
  if (!items.length) return '';
  const title = f.breakdownTitle
    ? `<p style="margin:0 0 14px;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:#8a8178;">${esc(f.breakdownTitle)}</p>`
    : '';
  const cells = items
    .map(
      (it) => `<td align="center" valign="top" style="padding:14px 12px;border:1px solid #e6ddcf;">
        <div style="font-family:Georgia,'Times New Roman',serif;font-size:20px;font-weight:800;line-height:1;color:${valueColor};text-transform:uppercase;">${esc(it.value)}</div>
        <div style="margin-top:6px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#8a8178;">${esc(it.label)}</div>
      </td>`
    )
    .join('<td style="width:10px;font-size:0;line-height:0;">&nbsp;</td>');
  return `<div style="padding:6px 0 20px;">${title}<table align="center" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;"><tr>${cells}</tr></table></div>`;
}

function footer() {
  return `
  <tr><td align="center" style="padding:28px 48px 44px;background:#ffffff;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="border-bottom:1px solid #eee5d4;font-size:0;line-height:0;">&nbsp;</td>
    </tr></table>
    <div style="height:22px;line-height:22px;font-size:0;">&nbsp;</div>
    ${socialIcons()}
    <p style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:11px;letter-spacing:0.28em;color:#c5a47e;text-transform:uppercase;">The Quartz Company</p>
    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#999999;letter-spacing:0.02em;">
      sales@thequartzcompany.co.uk &nbsp;&middot;&nbsp; 07375 303 416
    </p>
  </td></tr>`;
}

function shell(inner, subject) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#f4f1ea;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f1ea;padding:40px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
${inner}
</table>
</td></tr>
</table>
</body>
</html>`;
}

/* ── Template: Bold & Luxe (dark hero) ── */
function bold(f) {
  const inner = `
  <tr><td style="background:#1b1b1b;padding:52px 40px 46px;text-align:center;">
    <p style="margin:0 0 20px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.32em;color:${f.accent};text-transform:uppercase;">The Quartz Company</p>
    <h1 style="margin:0 0 10px;font-family:Georgia,'Times New Roman',serif;font-size:34px;line-height:1.1;color:#ffffff;letter-spacing:0.02em;">${esc(f.saleName)}</h1>
    <div style="font-family:Arial,Helvetica,sans-serif;font-size:56px;line-height:1;font-weight:800;color:${f.accent};margin:6px 0 14px;">${esc(f.discount)}</div>
    <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:17px;color:#d8d2c6;">${esc(f.headline)}</p>
    ${endsPill(f.endDate, f.accent, '#1b1b1b')}
  </td></tr>
  <tr><td style="background:#ffffff;padding:40px 48px 8px;text-align:center;">
    ${paragraphs(f.message, '#3a3a3a')}
    ${breakdownBlock(f, f.accent)}
    <div style="padding:12px 0 20px;">${ctaButton(f.ctaLabel, f.ctaUrl, f.accent, '#ffffff')}</div>
  </td></tr>
  ${footer()}`;
  return shell(inner, `${f.saleName} — ${f.discount}`);
}

/* ── Template: Seasonal (coloured banner) ── */
function seasonal(f) {
  const inner = `
  <tr><td style="background:#ffffff;padding:34px 40px 6px;text-align:center;">
    <img src="${LOGO_URL}" alt="The Quartz Company" width="200" style="display:block;margin:0 auto;max-width:200px;height:auto;border:0;">
  </td></tr>
  <tr><td style="background:${f.accent};padding:38px 40px;text-align:center;">
    <h1 style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:32px;line-height:1.1;color:#ffffff;">${esc(f.saleName)}</h1>
    <div style="font-family:Arial,Helvetica,sans-serif;font-size:44px;line-height:1;font-weight:800;color:#ffffff;">${esc(f.discount)}</div>
    <p style="margin:14px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:16px;color:#fff7ee;">${esc(f.headline)}</p>
  </td></tr>
  <tr><td style="background:#ffffff;padding:36px 48px 8px;text-align:center;">
    ${paragraphs(f.message, '#3a3a3a')}
    ${breakdownBlock(f, f.accent)}
    ${endsPill(f.endDate, '#f4efe6', '#7a5c33')}
    <div style="padding:22px 0 18px;">${ctaButton(f.ctaLabel, f.ctaUrl, f.accent, '#ffffff')}</div>
  </td></tr>
  ${footer()}`;
  return shell(inner, `${f.saleName} — ${f.discount}`);
}

/* ── Template: Elegant Minimal ── */
function elegant(f) {
  const inner = `
  <tr><td style="border-top:3px solid ${f.accent};font-size:0;line-height:0;background:#ffffff;">&nbsp;</td></tr>
  <tr><td style="background:#ffffff;padding:44px 48px 0;text-align:center;">
    <img src="${LOGO_URL}" alt="The Quartz Company" width="210" style="display:block;margin:0 auto 28px;max-width:210px;height:auto;border:0;">
    <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.3em;color:${f.accent};text-transform:uppercase;">${esc(f.saleName)}</p>
    <h1 style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:30px;line-height:1.15;color:#2b2b2b;">${esc(f.headline)}</h1>
    <div style="display:inline-block;border:1px solid ${f.accent};color:${f.accent};font-family:Arial,Helvetica,sans-serif;font-size:22px;font-weight:700;letter-spacing:0.04em;padding:10px 26px;margin-bottom:8px;">${esc(f.discount)}</div>
  </td></tr>
  <tr><td style="background:#ffffff;padding:26px 56px 8px;text-align:center;">
    ${paragraphs(f.message, '#4a4a4a')}
    ${breakdownBlock(f, f.accent)}
    ${endsPill(f.endDate, '#f4efe6', '#7a5c33')}
    <div style="padding:24px 0 20px;">${ctaButton(f.ctaLabel, f.ctaUrl, f.accent, '#ffffff')}</div>
  </td></tr>
  ${footer()}`;
  return shell(inner, `${f.saleName} — ${f.discount}`);
}

const BUILDERS = { bold, seasonal, elegant };

export function buildSaleEmail(templateId, fields) {
  const f = { ...DEFAULT_SALE_FIELDS, ...fields };
  const builder = BUILDERS[templateId] || bold;
  return builder(f);
}

// Standard branded email for a plain custom message. Mirrors the server-side
// template in api/zoho-send-email.js so the preview matches what's sent.
export function buildBrandedEmail({ subject = '', body = '', contactEmail = 'sales@thequartzcompany.co.uk' }) {
  const paras = String(body)
    .split(/\n{2,}/)
    .map(
      (p) =>
        `<p style="margin:0 0 18px;font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.75;color:#3a3a3a;">${esc(p).replace(/\n/g, '<br>')}</p>`
    )
    .join('');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#f4f1ea;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f4f1ea;padding:40px 16px;">
<tr><td align="center">

<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
<tr><td style="border-top:2px solid #c5a47e;height:2px;font-size:0;line-height:0;">&nbsp;</td></tr>
</table>

<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;">
  <tr><td align="center" style="padding:48px 32px 20px;">
    <img src="${LOGO_URL}" alt="The Quartz Company" width="220" style="display:block;max-width:220px;height:auto;border:0;outline:none;text-decoration:none;">
  </td></tr>

  <tr><td align="center" style="padding:0 32px 36px;">
    <table width="40" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="border-bottom:1px solid #c5a47e;font-size:0;line-height:0;">&nbsp;</td>
    </tr></table>
  </td></tr>

  <tr><td style="padding:0 48px 40px;">
    ${paras}
  </td></tr>

  <tr><td align="center" style="padding:0 48px 24px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="border-bottom:1px solid #eee5d4;font-size:0;line-height:0;">&nbsp;</td>
    </tr></table>
  </td></tr>

  <tr><td align="center" style="padding:0 48px 48px;">
    ${socialIcons()}
    <p style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:11px;letter-spacing:0.28em;color:#c5a47e;text-transform:uppercase;">The Quartz Company</p>
    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#999999;letter-spacing:0.02em;">
      ${esc(contactEmail)} &nbsp;&middot;&nbsp; 07375 303 416
    </p>
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
