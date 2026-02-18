import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './InstallationCoveragePage.css';

const regions = [
  {
    area: 'Northamptonshire',
    cities: ['Northampton', 'Kettering', 'Corby', 'Wellingborough', 'Rushden', 'Daventry', 'Towcester', 'Brackley', 'Oundle', 'Rothwell'],
    leadTime: '5-7 working days',
  },
  {
    area: 'Surrounding Counties',
    cities: ['Milton Keynes', 'Bedford', 'Buckingham', 'Banbury', 'Rugby', 'Market Harborough', 'Stamford', 'Peterborough', 'Huntingdon', 'Bicester'],
    leadTime: '7-10 working days',
  },
];

export default function InstallationCoveragePage() {
  const [postcode, setPostcode] = useState('');
  const [postcodeResult, setPostcodeResult] = useState(null);
  const [activeRegion, setActiveRegion] = useState(null);

  const handlePostcodeCheck = (e) => {
    e.preventDefault();
    if (postcode.trim().length >= 2) {
      setPostcodeResult('covered');
    }
  };

  const toggleRegion = (area) => {
    setActiveRegion(activeRegion === area ? null : area);
  };

  return (
    <div className="coverage-page">
      {/* Hero */}
      <section className="cov-hero">
        <div className="cov-hero__overlay" />
        <div className="cov-hero__content container">
          <span className="cov-hero__badge">Installation</span>
          <h1 className="cov-hero__title">Installation Coverage</h1>
          <p className="cov-hero__subtitle">
            We install worktops across England, Scotland and Wales. Professional fitting by our
            own experienced teams — never subcontracted.
          </p>
        </div>
      </section>

      {/* Postcode Checker */}
      <section className="cov-checker section">
        <div className="container">
          <div className="cov-checker__card">
            <h2 className="cov-checker__heading">Check Your Postcode</h2>
            <p className="cov-checker__text">
              Enter your postcode below to confirm we cover your area and see estimated lead times.
            </p>
            <form className="cov-checker__form" onSubmit={handlePostcodeCheck}>
              <div className="cov-checker__input-group">
                <input
                  type="text"
                  className="cov-checker__input"
                  placeholder="e.g. SW1A 1AA"
                  value={postcode}
                  onChange={(e) => {
                    setPostcode(e.target.value.toUpperCase());
                    setPostcodeResult(null);
                  }}
                  aria-label="Enter your postcode"
                  maxLength={8}
                />
                <button type="submit" className="btn btn--gold">
                  Check Coverage
                </button>
              </div>
            </form>
            {postcodeResult === 'covered' && (
              <div className="cov-checker__result cov-checker__result--success">
                <div className="cov-checker__result-icon">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <circle cx="14" cy="14" r="13" stroke="currentColor" strokeWidth="2" fill="none" />
                    <path d="M8 14L12 18L20 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p className="cov-checker__result-title">
                    Great news! We cover your area.
                  </p>
                  <p className="cov-checker__result-text">
                    Get in touch for a free quote and we will confirm your estimated installation date.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="cov-map section section--cream">
        <div className="container">
          <h2 className="section-title">Our Coverage Area</h2>
          <p className="section-subtitle">
            We operate across Great Britain with dedicated installation teams in every region.
          </p>
          <div className="cov-map__placeholder">
            <div className="cov-map__placeholder-inner">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="cov-map__icon">
                <circle cx="32" cy="24" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M32 56C32 56 48 38 48 24C48 15.16 40.84 8 32 8C23.16 8 16 15.16 16 24C16 38 32 56 32 56Z" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
              <h3 className="cov-map__placeholder-title">Coverage Map</h3>
              <p className="cov-map__placeholder-text">
                We cover Northamptonshire and the surrounding counties.
                Interactive map coming soon.
              </p>
              <div className="cov-map__regions-visual">
                <span className="cov-map__region-dot" style={{ top: '58%', left: '48%' }} title="Northampton" />
                <span className="cov-map__region-dot" style={{ top: '55%', left: '42%' }} title="Daventry" />
                <span className="cov-map__region-dot" style={{ top: '52%', left: '52%' }} title="Wellingborough" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Regions List */}
      <section className="cov-regions section">
        <div className="container">
          <h2 className="section-title">Regions We Cover</h2>
          <p className="section-subtitle">
            Click on a region to see the major cities and towns we serve, along with typical lead times.
          </p>

          <div className="cov-regions__grid">
            {regions.map((region) => (
              <div
                key={region.area}
                className={`cov-region ${activeRegion === region.area ? 'cov-region--active' : ''}`}
              >
                <button
                  className="cov-region__header"
                  onClick={() => toggleRegion(region.area)}
                  aria-expanded={activeRegion === region.area}
                  type="button"
                >
                  <h3 className="cov-region__name">{region.area}</h3>
                  <span className="cov-region__count">{region.cities.length} locations</span>
                  <span className={`cov-region__arrow ${activeRegion === region.area ? 'cov-region__arrow--open' : ''}`}>
                    {activeRegion === region.area ? '−' : '+'}
                  </span>
                </button>

                <div className={`cov-region__body ${activeRegion === region.area ? 'cov-region__body--open' : ''}`}>
                  <ul className="cov-region__cities">
                    {region.cities.map((city) => (
                      <li key={city} className="cov-region__city">{city}</li>
                    ))}
                  </ul>
                  <div className="cov-region__lead-time">
                    <span className="cov-region__lead-time-label">Typical lead time:</span>
                    <span className="cov-region__lead-time-value">{region.leadTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lead Times Info Box */}
      <section className="cov-info section section--cream">
        <div className="container">
          <div className="cov-info__box">
            <h2 className="cov-info__heading">Lead Times by Region</h2>
            <p className="cov-info__text">
              Lead times include fabrication and scheduling. Template visits can usually be arranged
              within 5 working days of your cabinets being fitted. These are typical timeframes —
              we will always confirm your specific dates when you place your order.
            </p>
            <div className="cov-info__table">
              <div className="cov-info__row cov-info__row--header">
                <span>Region</span>
                <span>Template to Installation</span>
              </div>
              {regions.map((region) => (
                <div key={region.area} className="cov-info__row">
                  <span>{region.area}</span>
                  <span>{region.leadTime}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cov-cta section">
        <div className="container">
          <div className="cov-cta__inner">
            <h2 className="cov-cta__heading">Ready to Get Started?</h2>
            <p className="cov-cta__text">
              We cover your area and we're ready to help. Get in touch for a free,
              no-obligation quote and let us plan your installation.
            </p>
            <div className="cov-cta__actions">
              <Link to="/contact" className="btn btn--gold btn--lg">
                Get a Free Quote
              </Link>
              <Link to="/how-to-buy" className="btn btn--outline btn--lg">
                See Our Buying Process
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
