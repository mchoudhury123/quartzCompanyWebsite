// Delegated click tracking — ONE document listener powers Contact, CTA_Click
// and InitiateCheckout events. Centralising it here avoids duplicate listeners
// and keeps the per-page components clean. Every event still flows through the
// consent-gated trackEvent(), so nothing fires without Marketing consent.

import { trackContact, trackCTA, trackInitiateCheckout } from './metaTracking';

// Work out what a clicked link/button represents.
function classify(el) {
  const href = (el.getAttribute && el.getAttribute('href')) || '';
  const text = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60);
  const lc = text.toLowerCase();

  // Direct contact channels (also count as CTAs).
  if (href.startsWith('tel:')) {
    return { contactMethod: 'phone', ctaName: 'Call Now', destination: href };
  }
  if (/wa\.me|api\.whatsapp\.com|whatsapp:/i.test(href)) {
    return { contactMethod: 'whatsapp', ctaName: 'WhatsApp', destination: href };
  }
  if (href.startsWith('mailto:')) {
    return { contactMethod: 'email', ctaName: 'Email', destination: href };
  }

  // Quote CTAs → CTA_Click + InitiateCheckout.
  const isQuote =
    href === '/quote' ||
    href.startsWith('/quote?') ||
    href.startsWith('/quote#') ||
    /\b(get|request)\b.*\bquote\b/.test(lc) ||
    lc.includes('free quote');
  if (isQuote) {
    return { ctaName: 'Get Quote', destination: href || '/quote', initiateCheckout: true };
  }

  // Other primary CTAs (best-effort match by destination then text).
  if (lc.includes('sample')) return { ctaName: 'Request Samples', destination: href };
  if (href.startsWith('/colours') || lc.includes('browse colours') || lc.includes('view colours')) {
    return { ctaName: 'Browse Colours', destination: href };
  }
  if (href === '/contact' || lc === 'contact' || lc.includes('contact us')) {
    return { ctaName: 'Contact', destination: href };
  }

  return null;
}

export function initClickTracking() {
  const onClick = (e) => {
    // Don't track inside the admin CRM — that's staff activity, not customers.
    if (window.location.pathname.startsWith('/admin')) return;

    const el = e.target.closest && e.target.closest('a[href], button');
    if (!el) return;

    const info = classify(el);
    if (!info) return;

    const page = window.location.pathname;
    const pageUrl = window.location.href;
    const buttonName = info.ctaName || (el.textContent || '').trim().slice(0, 60);

    // Contact event for phone / WhatsApp / email.
    if (info.contactMethod) {
      trackContact({
        contact_method: info.contactMethod,
        content_name: buttonName,
        page_url: pageUrl,
      });
    }

    // CTA_Click for every recognised CTA.
    trackCTA({
      button_name: buttonName,
      page,
      destination: info.destination || '',
    });

    // Start of the quote funnel.
    if (info.initiateCheckout) {
      trackInitiateCheckout({
        content_name: 'Quote Request',
        content_category: 'Engineered Quartz',
      });
    }
  };

  document.addEventListener('click', onClick);
  return () => document.removeEventListener('click', onClick);
}
