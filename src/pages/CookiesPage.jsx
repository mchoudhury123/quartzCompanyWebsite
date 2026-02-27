import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CookiesPage.css';

const CookiesPage = () => {
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: true,
    marketing: false,
    functional: true,
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleToggle = (category) => {
    if (category === 'essential') return;
    setPreferences((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
    setSaved(false);
  };

  const handleSavePreferences = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleAnchorClick = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="cookies-page">
      <section className="cookies-hero">
        <div className="cookies-hero__content">
          <h1 className="cookies-hero__title">Cookie Policy</h1>
          <p className="cookies-hero__date">Last updated: March 2025</p>
        </div>
      </section>

      <div className="cookies-body">
        <nav className="cookies-body__toc">
          <h2 className="cookies-body__toc-title">Contents</h2>
          <ol className="cookies-body__toc-list">
            <li>
              <a href="#what-are-cookies" onClick={(e) => handleAnchorClick(e, 'what-are-cookies')}>
                What Are Cookies
              </a>
            </li>
            <li>
              <a href="#cookies-we-use" onClick={(e) => handleAnchorClick(e, 'cookies-we-use')}>
                Cookies We Use
              </a>
            </li>
            <li>
              <a href="#manage-cookies" onClick={(e) => handleAnchorClick(e, 'manage-cookies')}>
                How to Manage Cookies
              </a>
            </li>
            <li>
              <a href="#cookie-preferences" onClick={(e) => handleAnchorClick(e, 'cookie-preferences')}>
                Your Cookie Preferences
              </a>
            </li>
            <li>
              <a href="#cookies-contact" onClick={(e) => handleAnchorClick(e, 'cookies-contact')}>
                Contact Us
              </a>
            </li>
          </ol>
        </nav>

        <section id="what-are-cookies" className="cookies-section cookies-section--left">
          <h2 className="cookies-section__heading">1. What Are Cookies</h2>
          <p>
            Cookies are small text files that are placed on your computer or mobile device when
            you visit a website. They are widely used to make websites work more efficiently, as
            well as to provide information to the website owners.
          </p>
          <p>
            Cookies allow a website to recognise your device and remember information about your
            visit, such as your preferred language, login details, and other settings. This can
            make your next visit easier and the site more useful to you.
          </p>
          <p>
            Cookies can be "persistent" or "session" cookies. Persistent cookies remain on your
            device after you close your browser until they expire or are manually deleted. Session
            cookies are temporary and are deleted from your device when you close your browser.
          </p>
          <p>
            Cookies can be set by the website you are visiting ("first-party cookies") or by
            third-party services that the website uses, such as analytics or advertising
            providers ("third-party cookies").
          </p>
        </section>

        <section id="cookies-we-use" className="cookies-section cookies-section--right">
          <h2 className="cookies-section__heading">2. Cookies We Use</h2>
          <p>
            We use the following categories of cookies on our website. The table below provides
            details of each cookie, its purpose, and its duration.
          </p>

          <div className="cookies-section__category">
            <div className="cookies-section__category-header">
              <div className="cookies-section__category-info">
                <h3>Essential Cookies</h3>
                <span className="cookies-section__badge cookies-section__badge--required">Always Active</span>
              </div>
            </div>
            <p>
              These cookies are strictly necessary for the website to function and cannot be
              switched off. They are usually set in response to actions made by you, such as
              setting your privacy preferences, logging in, or filling in forms.
            </p>
            <div className="cookies-section__table-wrap">
              <table className="cookies-section__table">
                <thead>
                  <tr>
                    <th>Cookie Name</th>
                    <th>Purpose</th>
                    <th>Duration</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>session_id</code></td>
                    <td>Maintains your session while browsing our website</td>
                    <td>Session</td>
                    <td>First-party</td>
                  </tr>
                  <tr>
                    <td><code>csrf_token</code></td>
                    <td>Protects against cross-site request forgery attacks</td>
                    <td>Session</td>
                    <td>First-party</td>
                  </tr>
                  <tr>
                    <td><code>cookie_consent</code></td>
                    <td>Stores your cookie consent preferences</td>
                    <td>1 year</td>
                    <td>First-party</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="cookies-section__category">
            <div className="cookies-section__category-header">
              <div className="cookies-section__category-info">
                <h3>Analytics Cookies</h3>
                <span className="cookies-section__badge cookies-section__badge--optional">Can Be Disabled</span>
              </div>
            </div>
            <p>
              These cookies allow us to count visits and traffic sources so we can measure and
              improve the performance of our website. They help us to know which pages are the
              most and least popular and see how visitors move around the site.
            </p>
            <div className="cookies-section__table-wrap">
              <table className="cookies-section__table">
                <thead>
                  <tr>
                    <th>Cookie Name</th>
                    <th>Purpose</th>
                    <th>Duration</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>_ga</code></td>
                    <td>Google Analytics - distinguishes unique users</td>
                    <td>2 years</td>
                    <td>Third-party</td>
                  </tr>
                  <tr>
                    <td><code>_ga_*</code></td>
                    <td>Google Analytics 4 - maintains session state</td>
                    <td>2 years</td>
                    <td>Third-party</td>
                  </tr>
                  <tr>
                    <td><code>_gid</code></td>
                    <td>Google Analytics - distinguishes unique users</td>
                    <td>24 hours</td>
                    <td>Third-party</td>
                  </tr>
                  <tr>
                    <td><code>_gat</code></td>
                    <td>Google Analytics - throttles request rate</td>
                    <td>1 minute</td>
                    <td>Third-party</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="cookies-section__category">
            <div className="cookies-section__category-header">
              <div className="cookies-section__category-info">
                <h3>Marketing Cookies</h3>
                <span className="cookies-section__badge cookies-section__badge--optional">Can Be Disabled</span>
              </div>
            </div>
            <p>
              These cookies are used to deliver advertisements that are more relevant to you and
              your interests. They may also be used to limit the number of times you see an
              advertisement and measure the effectiveness of advertising campaigns.
            </p>
            <div className="cookies-section__table-wrap">
              <table className="cookies-section__table">
                <thead>
                  <tr>
                    <th>Cookie Name</th>
                    <th>Purpose</th>
                    <th>Duration</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>_fbp</code></td>
                    <td>Facebook Pixel - tracks visits across websites for ad targeting</td>
                    <td>3 months</td>
                    <td>Third-party</td>
                  </tr>
                  <tr>
                    <td><code>_fbc</code></td>
                    <td>Facebook Pixel - stores last visit information</td>
                    <td>2 years</td>
                    <td>Third-party</td>
                  </tr>
                  <tr>
                    <td><code>fr</code></td>
                    <td>Facebook - delivers advertising products</td>
                    <td>3 months</td>
                    <td>Third-party</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="cookies-section__category">
            <div className="cookies-section__category-header">
              <div className="cookies-section__category-info">
                <h3>Functional Cookies</h3>
                <span className="cookies-section__badge cookies-section__badge--optional">Can Be Disabled</span>
              </div>
            </div>
            <p>
              These cookies enable the website to provide enhanced functionality and
              personalisation. They may be set by us or by third-party providers whose services
              we have added to our pages.
            </p>
            <div className="cookies-section__table-wrap">
              <table className="cookies-section__table">
                <thead>
                  <tr>
                    <th>Cookie Name</th>
                    <th>Purpose</th>
                    <th>Duration</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>locale</code></td>
                    <td>Remembers your language and region preferences</td>
                    <td>1 year</td>
                    <td>First-party</td>
                  </tr>
                  <tr>
                    <td><code>theme_pref</code></td>
                    <td>Stores your display preferences</td>
                    <td>1 year</td>
                    <td>First-party</td>
                  </tr>
                  <tr>
                    <td><code>recent_views</code></td>
                    <td>Remembers recently viewed products for a better experience</td>
                    <td>30 days</td>
                    <td>First-party</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section id="manage-cookies" className="cookies-section cookies-section--left">
          <h2 className="cookies-section__heading">3. How to Manage Cookies</h2>
          <p>
            Most web browsers allow you to control cookies through their settings. You can
            usually find these settings in the "Options" or "Preferences" menu of your browser.
            Below are links to instructions for managing cookies in common browsers:
          </p>

          <div className="cookies-section__browsers">
            <div className="cookies-section__browser-item">
              <h3>Google Chrome</h3>
              <p>
                Settings &gt; Privacy and Security &gt; Cookies and other site data. You can block
                third-party cookies, clear cookies on exit, or block all cookies.
              </p>
            </div>
            <div className="cookies-section__browser-item">
              <h3>Mozilla Firefox</h3>
              <p>
                Settings &gt; Privacy &amp; Security &gt; Cookies and Site Data. Firefox offers
                Standard, Strict, and Custom tracking protection levels.
              </p>
            </div>
            <div className="cookies-section__browser-item">
              <h3>Safari</h3>
              <p>
                Preferences &gt; Privacy &gt; Manage Website Data. Safari blocks cross-site
                tracking cookies by default.
              </p>
            </div>
            <div className="cookies-section__browser-item">
              <h3>Microsoft Edge</h3>
              <p>
                Settings &gt; Cookies and site permissions &gt; Manage and delete cookies and
                site data. Edge allows you to block third-party cookies or all cookies.
              </p>
            </div>
          </div>

          <p>
            Please note that blocking or deleting cookies may affect the functionality of our
            website. Some features may not work as intended if cookies are disabled.
          </p>
          <p>
            You can also opt out of Google Analytics tracking across all websites by installing
            the{' '}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Analytics Opt-out Browser Add-on
            </a>.
          </p>
        </section>

        <section id="cookie-preferences" className="cookies-section cookies-section--right">
          <h2 className="cookies-section__heading">4. Your Cookie Preferences</h2>
          <p>
            Use the toggles below to manage your cookie preferences. Essential cookies cannot be
            disabled as they are required for the website to function properly.
          </p>

          <div className="cookies-section__prefs-panel">
            <div className="cookies-section__pref-row">
              <div className="cookies-section__pref-info">
                <h3>Essential Cookies</h3>
                <p>Required for core website functionality. These cannot be disabled.</p>
              </div>
              <div className="cookies-section__toggle-wrap">
                <button
                  className="cookies-section__toggle cookies-section__toggle--active cookies-section__toggle--disabled"
                  disabled
                  aria-label="Essential cookies - always active"
                >
                  <span className="cookies-section__toggle-slider" />
                </button>
                <span className="cookies-section__toggle-label">Always On</span>
              </div>
            </div>

            <div className="cookies-section__pref-row">
              <div className="cookies-section__pref-info">
                <h3>Analytics Cookies</h3>
                <p>Help us understand how visitors interact with our website using Google Analytics.</p>
              </div>
              <div className="cookies-section__toggle-wrap">
                <button
                  className={`cookies-section__toggle ${preferences.analytics ? 'cookies-section__toggle--active' : ''}`}
                  onClick={() => handleToggle('analytics')}
                  aria-label={`Analytics cookies - ${preferences.analytics ? 'enabled' : 'disabled'}`}
                  role="switch"
                  aria-checked={preferences.analytics}
                >
                  <span className="cookies-section__toggle-slider" />
                </button>
                <span className="cookies-section__toggle-label">
                  {preferences.analytics ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>

            <div className="cookies-section__pref-row">
              <div className="cookies-section__pref-info">
                <h3>Marketing Cookies</h3>
                <p>Used for targeted advertising through platforms like Facebook Pixel.</p>
              </div>
              <div className="cookies-section__toggle-wrap">
                <button
                  className={`cookies-section__toggle ${preferences.marketing ? 'cookies-section__toggle--active' : ''}`}
                  onClick={() => handleToggle('marketing')}
                  aria-label={`Marketing cookies - ${preferences.marketing ? 'enabled' : 'disabled'}`}
                  role="switch"
                  aria-checked={preferences.marketing}
                >
                  <span className="cookies-section__toggle-slider" />
                </button>
                <span className="cookies-section__toggle-label">
                  {preferences.marketing ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>

            <div className="cookies-section__pref-row">
              <div className="cookies-section__pref-info">
                <h3>Functional Cookies</h3>
                <p>Enable enhanced functionality and personalisation such as remembering your preferences.</p>
              </div>
              <div className="cookies-section__toggle-wrap">
                <button
                  className={`cookies-section__toggle ${preferences.functional ? 'cookies-section__toggle--active' : ''}`}
                  onClick={() => handleToggle('functional')}
                  aria-label={`Functional cookies - ${preferences.functional ? 'enabled' : 'disabled'}`}
                  role="switch"
                  aria-checked={preferences.functional}
                >
                  <span className="cookies-section__toggle-slider" />
                </button>
                <span className="cookies-section__toggle-label">
                  {preferences.functional ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>

            <div className="cookies-section__pref-actions">
              <button
                className="cookies-section__save-btn"
                onClick={handleSavePreferences}
              >
                {saved ? 'Preferences Saved' : 'Save Preferences'}
              </button>
              {saved && (
                <p className="cookies-section__save-confirm">
                  Your cookie preferences have been saved successfully.
                </p>
              )}
            </div>
          </div>
        </section>

        <section id="cookies-contact" className="cookies-section cookies-section--left">
          <h2 className="cookies-section__heading">5. Contact Us</h2>
          <p>
            If you have any questions about our use of cookies or this Cookie Policy, please
            contact us:
          </p>
          <div className="cookies-section__contact">
            <p><strong>The Quartz Company Ltd</strong></p>
            <p>Northampton</p>
            <p>Northamptonshire</p>
            <p>
              Email:{' '}
              <a href="mailto:privacy@thequartzcompany.co.uk">privacy@thequartzcompany.co.uk</a>
            </p>
            <p>
              Telephone:{' '}
              <a href="tel:+442012345678">020 1234 5678</a>
            </p>
          </div>
          <p>
            For more information about how we handle your personal data, please see our{' '}
            <Link to="/privacy">Privacy Policy</Link>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default CookiesPage;
