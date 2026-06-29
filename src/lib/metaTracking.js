// Central Meta tracking module.
//
// Responsibilities:
//  - Lazy-load the Meta Pixel ONLY after Marketing consent is granted (GDPR/PECR).
//  - Lazy-load Google Analytics ONLY after Analytics consent is granted.
//  - Fire each event to both the browser Pixel and the server Conversions API
//    (CAPI) with a shared event_id AND event_time so Meta deduplicates them.
//  - Support both standard Meta events and custom events.
//
// Nothing secret lives here: the Pixel ID is public by design (it appears in
// every Pixel network request). The CAPI access token is read ONLY server-side
// in /api/meta-capi.js and is never exposed to the browser.

import { hasMarketingConsent, hasAnalyticsConsent } from './consent';

// Public Pixel ID. Overridable via env, falls back to the live id.
const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID || '1567787081371591';
// Google Analytics measurement id (also public).
const GA_ID = import.meta.env.VITE_GA_ID || 'G-E60PV6JJYB';

const CAPI_ENDPOINT = '/api/meta-capi';

// Meta standard events use fbq('track', …); anything else is a custom event
// and must use fbq('trackCustom', …). CAPI accepts both by event_name.
const STANDARD_EVENTS = new Set([
  'PageView',
  'ViewContent',
  'Search',
  'Contact',
  'Lead',
  'InitiateCheckout',
  'AddToCart',
  'CompleteRegistration',
  'Subscribe',
  'Purchase',
]);

let pixelLoaded = false;
let analyticsLoaded = false;

/* ───────────────────────── consent-gated loaders ───────────────────────── */

// Inject the Meta Pixel base code and init it. Idempotent; no-op without consent.
export function loadPixel() {
  if (pixelLoaded || typeof window === 'undefined') return;
  if (!hasMarketingConsent()) return;

  /* eslint-disable */
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */

  window.fbq('init', PIXEL_ID);
  pixelLoaded = true;
}

// Inject Google Analytics. Idempotent; no-op without Analytics consent.
export function loadAnalytics() {
  if (analyticsLoaded || typeof window === 'undefined') return;
  if (!hasAnalyticsConsent()) return;

  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID);
  analyticsLoaded = true;
}

// Apply whatever consent currently allows. Safe to call repeatedly (e.g. on
// initial load and again whenever the user changes their choice).
export function applyConsent() {
  loadAnalytics();
  loadPixel();
}

/* ────────────────────────────── helpers ────────────────────────────────── */

function genEventId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `evt-${Date.now()}-${Math.floor(Math.random() * 1e9)}`;
}

function getCookie(name) {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : undefined;
}

// Debug helper: append ?meta_test=YOUR_CODE (from Events Manager → Test Events)
// to any page URL to route server events to the Test Events tab. The code is
// kept for the rest of the browser session so it survives navigation.
function getTestEventCode() {
  if (typeof window === 'undefined') return undefined;
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('meta_test');
    if (fromUrl) sessionStorage.setItem('meta_test_event_code', fromUrl);
    return sessionStorage.getItem('meta_test_event_code') || undefined;
  } catch {
    return undefined;
  }
}

/* ──────────────────────────── core tracking ─────────────────────────────── */

/**
 * Fire one event to the browser Pixel and the server CAPI with a shared
 * event_id + event_time for deduplication. No-ops entirely without Marketing
 * consent — no Pixel, no browser event, no CAPI request.
 *
 * @param {string} eventName      Standard (PageView, Lead…) or custom (QuoteStep1…)
 * @param {object} [opts]
 * @param {object} [opts.customData]  Event detail (content_name, value…)
 * @param {object} [opts.userData]    Raw customer info — sent only to OUR server,
 *                                    which hashes it before forwarding to Meta.
 * @returns {string|undefined} the event_id, or undefined if blocked by consent
 */
export function trackEvent(eventName, { customData = {}, userData = {} } = {}) {
  // Hard consent gate — this is what makes the whole system GDPR-compliant.
  if (!hasMarketingConsent()) return undefined;

  // Make sure the Pixel is present (covers the "granted later" case).
  loadPixel();

  const eventId = genEventId();
  const eventTime = Math.floor(Date.now() / 1000); // shared with server → identical timestamps

  // 1) Browser Pixel — standard vs custom, always with the shared eventID.
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    const method = STANDARD_EVENTS.has(eventName) ? 'track' : 'trackCustom';
    window.fbq(method, eventName, customData, { eventID: eventId });
  }

  // 2) Server CAPI — fire-and-forget; tracking must never block or break the UI.
  try {
    const payload = {
      eventName,
      eventId,
      eventTime,
      eventSourceUrl: typeof window !== 'undefined' ? window.location.href : undefined,
      customData,
      userData: {
        ...userData,
        fbp: getCookie('_fbp'),
        fbc: getCookie('_fbc'),
      },
      testEventCode: getTestEventCode(),
    };

    fetch(CAPI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* analytics must never surface errors to the customer */
  }

  return eventId;
}

/* ───────────────────────── typed event helpers ─────────────────────────── */

export const trackPageView = () => trackEvent('PageView');

export const trackViewContent = (customData) => trackEvent('ViewContent', { customData });

export const trackSearch = (customData) => trackEvent('Search', { customData });

export const trackContact = (customData) => trackEvent('Contact', { customData });

export const trackLead = (userData, customData) => trackEvent('Lead', { userData, customData });

export const trackSubscribe = (userData, customData) =>
  trackEvent('Subscribe', { userData, customData });

export const trackInitiateCheckout = (customData) =>
  trackEvent('InitiateCheckout', { customData });

// Custom analytics-only funnel step (QuoteStep1 / QuoteStep2 / QuoteStep3).
export const trackQuoteStep = (step, customData = {}) =>
  trackEvent(`QuoteStep${step}`, { customData: { ...customData, step } });

// Custom scroll-depth event (Scroll25 / Scroll50 / Scroll75 / Scroll100).
export const trackScroll = (percent) =>
  trackEvent(`Scroll${percent}`, { customData: { percent, page: window.location.pathname } });

// Custom time-on-page engagement event (TimeOnPage30 / 60 / 120).
export const trackTimeOnPage = (seconds) =>
  trackEvent(`TimeOnPage${seconds}`, { customData: { seconds, page: window.location.pathname } });

// Custom CTA click event.
export const trackCTA = (customData) => trackEvent('CTA_Click', { customData });
