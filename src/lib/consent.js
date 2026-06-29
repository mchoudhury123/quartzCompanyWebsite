// Cookie consent state — the single source of truth for what tracking is
// allowed. UK GDPR / PECR: non-essential cookies (Analytics, Marketing) must
// not load until the user opts in. Marketing = Meta Pixel + Conversions API.
//
// Choice is persisted in localStorage and broadcast to subscribers so that
// granting/revoking consent takes effect immediately, without a page reload.

const STORAGE_KEY = 'tqc_cookie_consent_v1';

// Essential is always true and cannot be toggled off.
const DEFAULT = { essential: true, analytics: false, marketing: false, decided: false };

const listeners = new Set();

export function getConsent() {
  if (typeof window === 'undefined') return { ...DEFAULT };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT, ...parsed, essential: true };
  } catch {
    return { ...DEFAULT };
  }
}

// True once the user has made any choice (so we know whether to show the banner).
export function hasDecided() {
  return getConsent().decided === true;
}

export function hasMarketingConsent() {
  return getConsent().marketing === true;
}

export function hasAnalyticsConsent() {
  return getConsent().analytics === true;
}

// Persist a choice and notify subscribers. `next` carries the category booleans.
export function setConsent(next) {
  const value = {
    essential: true,
    analytics: !!next.analytics,
    marketing: !!next.marketing,
    decided: true,
    ts: Date.now(),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    /* storage unavailable (private mode) — still notify for this session */
  }
  listeners.forEach((cb) => {
    try {
      cb(value);
    } catch {
      /* a bad subscriber must not break the others */
    }
  });
  return value;
}

// Convenience presets used by the banner buttons.
export const acceptAll = () => setConsent({ analytics: true, marketing: true });
export const rejectNonEssential = () => setConsent({ analytics: false, marketing: false });

// Subscribe to consent changes. Returns an unsubscribe function.
export function onConsentChange(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
