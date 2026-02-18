import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './WarrantyPage.css';

const claimSteps = [
  {
    step: 1,
    title: 'Contact Us',
    description: 'Call our support team on 0800 234 567 or email warranty@thequartzcompany.co.uk. Have your order number and installation date ready.',
  },
  {
    step: 2,
    title: 'Provide Evidence',
    description: 'Send us clear photographs of the issue along with a brief description. Include close-up and wide-angle shots.',
  },
  {
    step: 3,
    title: 'Assessment',
    description: 'Our team will review your claim within 48 hours. If needed, we\'ll arrange an on-site inspection at a time that suits you.',
  },
  {
    step: 4,
    title: 'Resolution',
    description: 'We\'ll repair, replace or compensate as appropriate under the terms of your warranty. We aim to resolve all claims within 14 working days.',
  },
];

export default function WarrantyPage() {
  const [activeTab, setActiveTab] = useState('material');

  return (
    <div className="warranty-page">
      {/* Hero */}
      <section className="war-hero">
        <div className="war-hero__overlay" />
        <div className="war-hero__content container">
          <span className="war-hero__badge">Peace of Mind</span>
          <h1 className="war-hero__title">Our Warranty Promise</h1>
          <p className="war-hero__subtitle">
            We stand behind every worktop we fabricate and install. Our comprehensive warranty
            gives you complete confidence in your investment.
          </p>
        </div>
      </section>

      {/* Warranty Cards */}
      <section className="war-cards section">
        <div className="container">
          <div className="war-cards__grid">
            {/* Material Warranty */}
            <div className="war-card">
              <div className="war-card__header">
                <div className="war-card__years">25</div>
                <div className="war-card__header-text">
                  <span className="war-card__years-label">Year</span>
                  <h2 className="war-card__title">Material Warranty</h2>
                </div>
              </div>
              <div className="war-card__body">
                <p className="war-card__description">
                  Our 25-year material warranty covers manufacturing defects in the stone itself.
                  This warranty is provided by the material manufacturer and administered by
                  The Quartz Company on your behalf.
                </p>

                <div className="war-card__section">
                  <h3 className="war-card__section-title war-card__section-title--covered">
                    What's Covered
                  </h3>
                  <ul className="war-card__list war-card__list--covered">
                    <li>Manufacturing defects in the stone slab</li>
                    <li>Colour fading under normal indoor conditions</li>
                    <li>Structural cracking not caused by impact or misuse</li>
                    <li>Delamination or separation of surface layers</li>
                    <li>Staining from normal household substances (quartz only)</li>
                  </ul>
                </div>

                <div className="war-card__section">
                  <h3 className="war-card__section-title war-card__section-title--not-covered">
                    What's Not Covered
                  </h3>
                  <ul className="war-card__list war-card__list--not-covered">
                    <li>Damage caused by impact, misuse or abuse</li>
                    <li>Heat damage from hot pans placed directly on the surface</li>
                    <li>Damage from harsh chemicals or abrasive cleaners</li>
                    <li>Natural variation in colour, pattern and veining</li>
                    <li>Outdoor installations or commercial use</li>
                    <li>Staining from substances not cleaned promptly — regular cleaning recommended</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Installation Warranty */}
            <div className="war-card">
              <div className="war-card__header war-card__header--installation">
                <div className="war-card__years">5</div>
                <div className="war-card__header-text">
                  <span className="war-card__years-label">Year</span>
                  <h2 className="war-card__title">Installation Warranty</h2>
                </div>
              </div>
              <div className="war-card__body">
                <p className="war-card__description">
                  Our 5-year installation warranty covers the workmanship of our fitting team.
                  This warranty is provided directly by The Quartz Company and covers all work
                  carried out by our installers.
                </p>

                <div className="war-card__section">
                  <h3 className="war-card__section-title war-card__section-title--covered">
                    What's Covered
                  </h3>
                  <ul className="war-card__list war-card__list--covered">
                    <li>Joint separation or discolouration at seams</li>
                    <li>Poor fitting causing movement or instability</li>
                    <li>Cut-out defects (sink, hob, tap holes)</li>
                    <li>Edge profile defects caused during fabrication</li>
                    <li>Adhesion failure of splashbacks or upstands</li>
                  </ul>
                </div>

                <div className="war-card__section">
                  <h3 className="war-card__section-title war-card__section-title--not-covered">
                    What's Not Covered
                  </h3>
                  <ul className="war-card__list war-card__list--not-covered">
                    <li>Damage from subsequent building work by others</li>
                    <li>Movement caused by cabinet settling or structural issues</li>
                    <li>Plumbing or electrical work (not carried out by us)</li>
                    <li>Damage from misuse, impact or neglect</li>
                    <li>Normal wear of sealants and silicone (can be reapplied)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Claim */}
      <section className="war-claims section section--cream">
        <div className="container">
          <h2 className="section-title">How to Make a Claim</h2>
          <p className="section-subtitle">
            If something isn't right, we want to know. Making a warranty claim is simple
            and straightforward.
          </p>

          <div className="war-claims__steps">
            {claimSteps.map((item) => (
              <div key={item.step} className="war-claim-step">
                <div className="war-claim-step__number">{item.step}</div>
                <h3 className="war-claim-step__title">{item.title}</h3>
                <p className="war-claim-step__desc">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="war-certs section">
        <div className="container">
          <h2 className="section-title">Certifications &amp; Accreditations</h2>
          <p className="section-subtitle">
            Our materials are tested and certified to the highest international standards.
          </p>

          <div className="war-certs__grid">
            <div className="war-cert">
              <div className="war-cert__logo">
                <span className="war-cert__logo-text">NSF</span>
              </div>
              <h4 className="war-cert__name">NSF Certified</h4>
              <p className="war-cert__desc">Tested for food safety and hygiene standards.</p>
            </div>
            <div className="war-cert">
              <div className="war-cert__logo">
                <span className="war-cert__logo-text">GG</span>
              </div>
              <h4 className="war-cert__name">Greenguard Gold</h4>
              <p className="war-cert__desc">Certified for low chemical emissions and indoor air quality.</p>
            </div>
            <div className="war-cert">
              <div className="war-cert__logo">
                <span className="war-cert__logo-text">MiB</span>
              </div>
              <h4 className="war-cert__name">Made in Britain</h4>
              <p className="war-cert__desc">Fabricated in our UK workshop to the highest standards.</p>
            </div>
            <div className="war-cert">
              <div className="war-cert__logo">
                <span className="war-cert__logo-text">ISO</span>
              </div>
              <h4 className="war-cert__name">ISO 9001</h4>
              <p className="war-cert__desc">Quality management system certified for consistent excellence.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Download */}
      <section className="war-download section section--cream">
        <div className="container">
          <div className="war-download__card">
            <div className="war-download__info">
              <h2 className="war-download__heading">Warranty Documentation</h2>
              <p className="war-download__text">
                Download the full terms and conditions of our material and installation warranties.
                Your specific warranty certificate will be provided upon completion of your installation.
              </p>
            </div>
            <div className="war-download__actions">
              <a
                href="#download-material"
                className="btn btn--primary"
                onClick={(e) => { e.preventDefault(); alert('Download placeholder — Material warranty PDF would be here.'); }}
              >
                Material Warranty (PDF)
              </a>
              <a
                href="#download-installation"
                className="btn btn--outline"
                onClick={(e) => { e.preventDefault(); alert('Download placeholder — Installation warranty PDF would be here.'); }}
              >
                Installation Warranty (PDF)
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="war-cta section">
        <div className="container">
          <div className="war-cta__inner">
            <h2 className="war-cta__heading">Questions About Our Warranty?</h2>
            <p className="war-cta__text">
              Our team is happy to explain every detail of our warranty coverage.
              Get in touch and we'll put your mind at ease.
            </p>
            <div className="war-cta__actions">
              <Link to="/contact" className="btn btn--gold btn--lg">
                Contact Us
              </Link>
              <Link to="/how-to-buy" className="btn btn--outline btn--lg">
                How to Buy
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
