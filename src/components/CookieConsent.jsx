import { useState, useEffect } from 'react';
import { FiX, FiShield, FiBarChart2, FiTarget } from 'react-icons/fi';
import {
  getConsent,
  hasDecided,
  hasMarketingConsent,
  setConsent,
  acceptAll,
  rejectNonEssential,
} from '../lib/consent';
import { applyConsent, trackPageView } from '../lib/metaTracking';
import './CookieConsent.css';

// Other components (e.g. the footer link) ask to reopen preferences by
// dispatching this window event.
export const OPEN_PREFERENCES_EVENT = 'tqc:open-cookie-preferences';
export function openCookiePreferences() {
  window.dispatchEvent(new Event(OPEN_PREFERENCES_EVENT));
}

const CATEGORIES = [
  {
    key: 'essential',
    icon: <FiShield />,
    title: 'Essential',
    locked: true,
    description:
      'Required for the website to function — page navigation, security and remembering your cookie choice. These are always on.',
  },
  {
    key: 'analytics',
    icon: <FiBarChart2 />,
    title: 'Analytics',
    description:
      'Help us understand how visitors use the site so we can improve it. Sets Google Analytics cookies. No personal data is sold.',
  },
  {
    key: 'marketing',
    icon: <FiTarget />,
    title: 'Marketing',
    description:
      'Let us measure and improve our advertising via the Meta Pixel and Conversions API, and show you relevant offers on Facebook and Instagram.',
  },
];

export default function CookieConsent() {
  // banner = first-visit bar; panel = the detailed preferences modal
  const [showBanner, setShowBanner] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [prefs, setPrefs] = useState({ analytics: false, marketing: false });

  useEffect(() => {
    if (!hasDecided()) setShowBanner(true);
    applyConsent(); // load whatever a returning visitor already consented to
  }, []);

  // Allow the footer (or anywhere) to reopen the preferences panel.
  useEffect(() => {
    const open = () => {
      const c = getConsent();
      setPrefs({ analytics: c.analytics, marketing: c.marketing });
      setShowPanel(true);
    };
    window.addEventListener(OPEN_PREFERENCES_EVENT, open);
    return () => window.removeEventListener(OPEN_PREFERENCES_EVENT, open);
  }, []);

  // Apply a freshly-saved choice. If Marketing was just turned ON, fire a
  // PageView for the current page (the one blocked on first load), so granting
  // consent begins tracking immediately. Guarded so reopening prefs while
  // already consented doesn't double-count.
  const finish = (wasMarketing) => {
    setShowBanner(false);
    setShowPanel(false);
    applyConsent();
    if (!wasMarketing && hasMarketingConsent()) trackPageView();
  };

  const handleAcceptAll = () => {
    const was = hasMarketingConsent();
    acceptAll();
    finish(was);
  };

  const handleRejectAll = () => {
    const was = hasMarketingConsent();
    rejectNonEssential();
    finish(was);
  };

  const handleSavePrefs = () => {
    const was = hasMarketingConsent();
    setConsent(prefs);
    finish(was);
  };

  // Dismiss the panel without changing anything. If the user hasn't decided
  // yet, fall back to showing the banner so they can't escape the choice.
  const closePanel = () => {
    setShowPanel(false);
    if (!hasDecided()) setShowBanner(true);
  };

  const openPanelFromBanner = () => {
    const c = getConsent();
    setPrefs({ analytics: c.analytics, marketing: c.marketing });
    setShowPanel(true);
  };

  if (!showBanner && !showPanel) return null;

  return (
    <>
      {/* First-visit banner */}
      {showBanner && !showPanel && (
        <div className="cookie-banner" role="dialog" aria-live="polite" aria-label="Cookie consent">
          <div className="cookie-banner__inner">
            <div className="cookie-banner__text">
              <h2 className="cookie-banner__title">Your privacy, beautifully handled</h2>
              <p className="cookie-banner__copy">
                We use cookies to keep the site running smoothly, understand how it&rsquo;s used and
                improve our advertising. You choose what to allow. See our{' '}
                <a href="/cookies" className="cookie-banner__link">Cookie Policy</a>.
              </p>
            </div>
            <div className="cookie-banner__actions">
              <button className="cookie-btn cookie-btn--ghost" onClick={openPanelFromBanner}>
                Manage Preferences
              </button>
              <button className="cookie-btn cookie-btn--outline" onClick={handleRejectAll}>
                Reject Non-Essential
              </button>
              <button className="cookie-btn cookie-btn--solid" onClick={handleAcceptAll}>
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detailed preferences modal */}
      {showPanel && (
        <div className="cookie-modal" role="dialog" aria-modal="true" aria-label="Cookie preferences">
          <div className="cookie-modal__overlay" onClick={closePanel} />
          <div className="cookie-modal__dialog">
            <button
              className="cookie-modal__close"
              onClick={closePanel}
              aria-label="Close cookie preferences"
            >
              <FiX />
            </button>
            <h2 className="cookie-modal__title">Cookie Preferences</h2>
            <p className="cookie-modal__intro">
              Choose which cookies The Quartz Company may use. You can change this at any time from
              the footer.
            </p>

            <div className="cookie-cats">
              {CATEGORIES.map((cat) => {
                const checked = cat.locked ? true : prefs[cat.key];
                return (
                  <div className="cookie-cat" key={cat.key}>
                    <div className="cookie-cat__head">
                      <span className="cookie-cat__icon">{cat.icon}</span>
                      <span className="cookie-cat__title">{cat.title}</span>
                      <label className={`cookie-toggle${cat.locked ? ' cookie-toggle--locked' : ''}`}>
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={cat.locked}
                          onChange={(e) =>
                            setPrefs((p) => ({ ...p, [cat.key]: e.target.checked }))
                          }
                        />
                        <span className="cookie-toggle__track">
                          <span className="cookie-toggle__thumb" />
                        </span>
                        <span className="cookie-toggle__state">
                          {cat.locked ? 'Always on' : checked ? 'On' : 'Off'}
                        </span>
                      </label>
                    </div>
                    <p className="cookie-cat__desc">{cat.description}</p>
                  </div>
                );
              })}
            </div>

            <div className="cookie-modal__actions">
              <button className="cookie-btn cookie-btn--outline" onClick={handleRejectAll}>
                Reject Non-Essential
              </button>
              <button className="cookie-btn cookie-btn--ghost" onClick={handleSavePrefs}>
                Save Preferences
              </button>
              <button className="cookie-btn cookie-btn--solid" onClick={handleAcceptAll}>
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
