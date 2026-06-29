// Meta tracking helper — fires the browser Pixel and the server-side
// Conversions API (CAPI) for the same event, sharing one event_id so Meta
// can deduplicate the two. The CAPI access token lives ONLY on the server
// (see /api/meta-capi.js); nothing secret is referenced here.

const CAPI_ENDPOINT = '/api/meta-capi';

function genEventId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers — uniqueness, not security, is the goal here
  return `evt-${Date.now()}-${Math.floor(Math.random() * 1e9)}`;
}

function getCookie(name) {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : undefined;
}

/**
 * Fire one event to both the browser Pixel and the server CAPI with a shared
 * event_id for deduplication.
 *
 * @param {string} eventName      Standard Meta event (PageView, ViewContent, Contact, Lead…)
 * @param {object} [opts]
 * @param {object} [opts.customData]  Event detail (content_name, value, currency…)
 * @param {object} [opts.userData]    Raw customer info (email, phone, names, postcode).
 *                                    Sent only to OUR server, which hashes it before
 *                                    forwarding to Meta — never sent to Meta from the browser.
 * @returns {string} the event_id used
 */
export function trackEvent(eventName, { customData = {}, userData = {} } = {}) {
  const eventId = genEventId();

  // 1) Browser Pixel — pass eventID so it dedupes against the server event
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', eventName, customData, { eventID: eventId });
  }

  // 2) Server CAPI — fire-and-forget; tracking must never block or break the UI
  try {
    const payload = {
      eventName,
      eventId,
      eventSourceUrl: typeof window !== 'undefined' ? window.location.href : undefined,
      customData,
      userData: {
        ...userData,
        // _fbp / _fbc are first-party cookies set by the Pixel; passing them
        // through greatly improves server-side match quality. Not PII, not hashed.
        fbp: getCookie('_fbp'),
        fbc: getCookie('_fbc'),
      },
    };

    fetch(CAPI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true, // let the request finish even if the page is navigating away
    }).catch(() => {});
  } catch {
    /* swallow — analytics should never surface errors to the customer */
  }

  return eventId;
}

export const trackPageView = () => trackEvent('PageView');

export const trackViewContent = (customData) => trackEvent('ViewContent', { customData });

export const trackContact = (customData) => trackEvent('Contact', { customData });

export const trackLead = (userData, customData) =>
  trackEvent('Lead', { userData, customData });
