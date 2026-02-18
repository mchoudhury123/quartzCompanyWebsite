import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HowToBuyPage.css';

const stages = [
  {
    id: 1,
    title: 'Get Your Quote',
    description:
      'Request a quote online or call us. We\'ll discuss your project and provide pricing within 24 hours. Free, no obligation.',
    timeframe: 'Same day - 24 hours',
    whatToExpect: [
      'Tell us your worktop dimensions, material preference and any design options.',
      'We\'ll prepare a detailed, itemised quote including all cut-outs, edges and accessories.',
      'No pushy sales — just honest pricing. We\'re happy to revise the quote as your plans evolve.',
      'Samples can be sent free of charge so you can see and feel the material in your home.',
    ],
  },
  {
    id: 2,
    title: 'Place Your Order',
    description:
      'Secure your order with a 50% deposit. We\'ll confirm your colour, edge profile and design options.',
    timeframe: 'Whenever you are ready',
    whatToExpect: [
      'A 50% deposit secures your order and locks in your pricing.',
      'We\'ll send an order confirmation detailing every specification — colour, thickness, edge profile, cut-outs and accessories.',
      'Your dedicated project coordinator will be your single point of contact from this point onwards.',
      'You can pay by bank transfer, credit card or through our finance options.',
    ],
  },
  {
    id: 3,
    title: 'Template Visit',
    description:
      'Our templater visits your home to laser-measure every detail. This happens once your cabinets are fitted.',
    timeframe: 'Typically within 5 working days of booking',
    whatToExpect: [
      'Our professional templater will visit your home at a time that suits you.',
      'Using digital laser-measuring equipment, they capture every dimension to sub-millimetre accuracy.',
      'The visit typically takes 30-60 minutes depending on the complexity of your layout.',
      'The templater will confirm joint positions, cut-out locations and any special requirements.',
      'Your cabinets and base units must be fully fitted and level before the template visit.',
    ],
  },
  {
    id: 4,
    title: 'Fabrication',
    description:
      'Your worktops are precision-cut and finished in our workshop. Typical turnaround: 7-10 working days.',
    timeframe: '7-10 working days',
    whatToExpect: [
      'Your worktops are cut from the slab using CNC machinery guided by the laser-template data.',
      'Edge profiles, drainage grooves and cut-outs are all machined to exact specifications.',
      'Every piece is quality-checked and hand-finished by our craftsmen.',
      'We\'ll contact you to arrange your installation date once fabrication is complete.',
    ],
  },
  {
    id: 5,
    title: 'Installation Day',
    description:
      'Our fitters arrive on your chosen date and install your worktops. Most kitchens are completed in a single day.',
    timeframe: 'Usually 1 day (half day for smaller kitchens)',
    whatToExpect: [
      'Our installation team will arrive at the agreed time with all materials and equipment.',
      'Existing worktops will be carefully removed if required.',
      'New worktops are fitted, levelled and bonded. Joints are colour-matched and polished.',
      'Sinks, hobs and taps are fitted and connected (plumbing and electrical by your contractor).',
      'The remaining 50% balance is due on completion of the installation.',
    ],
  },
  {
    id: 6,
    title: 'After-Care',
    description:
      'We\'ll follow up to ensure you\'re delighted. Plus our warranty and support team are always on hand.',
    timeframe: 'Ongoing',
    whatToExpect: [
      'We\'ll follow up within a week of installation to ensure everything is perfect.',
      'You\'ll receive a care and maintenance guide specific to your material.',
      'Your 25-year material warranty and 5-year installation warranty begin from the date of installation.',
      'Our support team is always available by phone or email if you have any questions.',
    ],
  },
];

export default function HowToBuyPage() {
  const [expandedStage, setExpandedStage] = useState(1);

  const toggleStage = (id) => {
    setExpandedStage(expandedStage === id ? null : id);
  };

  return (
    <div className="how-to-buy-page">
      {/* Hero */}
      <section className="htb-hero">
        <div className="htb-hero__overlay" />
        <div className="htb-hero__content container">
          <span className="htb-hero__badge">Buying Guide</span>
          <h1 className="htb-hero__title">How to Buy Your Worktops</h1>
          <p className="htb-hero__subtitle">
            From your first enquiry to installation day and beyond — here is exactly what to
            expect when you choose The Quartz Company.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="htb-intro section">
        <div className="container">
          <div className="htb-intro__content">
            <h2 className="htb-intro__heading">A Simple, Transparent Process</h2>
            <p className="htb-intro__text">
              Buying stone worktops should be straightforward and enjoyable. We've refined our
              process over thousands of installations to make it as smooth as possible. Here are the
              six stages from quote to completion.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="htb-timeline section section--cream">
        <div className="container">
          <div className="htb-timeline__track">
            {/* Horizontal connector line (desktop) */}
            <div className="htb-timeline__connector" aria-hidden="true" />

            <div className="htb-timeline__stages">
              {stages.map((stage) => (
                <div
                  key={stage.id}
                  className={`htb-stage ${expandedStage === stage.id ? 'htb-stage--active' : ''}`}
                >
                  {/* Stage marker */}
                  <button
                    className="htb-stage__marker"
                    onClick={() => toggleStage(stage.id)}
                    aria-expanded={expandedStage === stage.id}
                    aria-controls={`stage-panel-${stage.id}`}
                    type="button"
                  >
                    <span className="htb-stage__number">{stage.id}</span>
                  </button>

                  <div className="htb-stage__summary">
                    <h3
                      className="htb-stage__title"
                      onClick={() => toggleStage(stage.id)}
                    >
                      {stage.title}
                    </h3>
                    <p className="htb-stage__description">{stage.description}</p>
                    <span className="htb-stage__timeframe">{stage.timeframe}</span>
                  </div>

                  {/* Expandable detail panel */}
                  <div
                    id={`stage-panel-${stage.id}`}
                    className={`htb-stage__panel ${expandedStage === stage.id ? 'htb-stage__panel--open' : ''}`}
                  >
                    <div className="htb-stage__expect">
                      <h4 className="htb-stage__expect-heading">What to Expect</h4>
                      <ul className="htb-stage__expect-list">
                        {stage.whatToExpect.map((item, idx) => (
                          <li key={idx} className="htb-stage__expect-item">{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Summary bar */}
      <section className="htb-summary section">
        <div className="container">
          <div className="htb-summary__grid">
            <div className="htb-summary__card">
              <span className="htb-summary__value">24hrs</span>
              <span className="htb-summary__label">Quote turnaround</span>
            </div>
            <div className="htb-summary__card">
              <span className="htb-summary__value">50%</span>
              <span className="htb-summary__label">Deposit to order</span>
            </div>
            <div className="htb-summary__card">
              <span className="htb-summary__value">7-10</span>
              <span className="htb-summary__label">Working days fabrication</span>
            </div>
            <div className="htb-summary__card">
              <span className="htb-summary__value">1 Day</span>
              <span className="htb-summary__label">Typical installation</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="htb-cta section">
        <div className="container">
          <div className="htb-cta__inner">
            <h2 className="htb-cta__heading">Ready to Start?</h2>
            <p className="htb-cta__text">
              Get your free, no-obligation quote today. Tell us about your project and we'll have
              pricing back to you within 24 hours.
            </p>
            <div className="htb-cta__actions">
              <Link to="/contact" className="btn btn--gold btn--lg">
                Get Your Free Quote Today
              </Link>
              <Link to="/design-options" className="btn btn--outline btn--lg">
                Explore Design Options
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
