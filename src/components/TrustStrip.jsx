import React from 'react';
import './TrustStrip.css';

/**
 * TrustStrip – reusable row of key reassurance points.
 * Leads with the 25-year warranty and quick turnaround, plus free
 * samples/quotes and expert fitting. Drop it on any page for consistent
 * trust messaging.
 *
 * Props:
 *   variant – 'light' (default, for cream/white sections) or 'dark'
 */
const PILLARS = [
  {
    title: '25-Year Warranty',
    desc: 'Guaranteed on every quartz worktop',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
  {
    title: 'Quick Turnaround',
    desc: 'Fitted in 10–20 working days',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <polyline points="12 7 12 12 15.5 14" />
      </svg>
    ),
  },
  {
    title: 'Free Samples & Quotes',
    desc: 'No-obligation, fixed pricing',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0l-7.2-7.2A2 2 0 0 1 2.8 12V4.8A2 2 0 0 1 4.8 2.8H12a2 2 0 0 1 1.4.6l7.2 7.2a2 2 0 0 1 0 2.8z" />
        <circle cx="7.5" cy="7.5" r="1.2" />
      </svg>
    ),
  },
  {
    title: 'Expert UK Fitting',
    desc: 'Precision templating & installation',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a4 4 0 0 0-5.2 5.2l-6 6a1.8 1.8 0 0 0 2.5 2.5l6-6a4 4 0 0 0 5.2-5.2l-2.5 2.5-2-2 2.5-2.5z" />
      </svg>
    ),
  },
];

function TrustStrip({ variant = 'light' }) {
  return (
    <div className={`trust-strip trust-strip--${variant}`}>
      <div className="container trust-strip__inner">
        {PILLARS.map((p) => (
          <div className="trust-strip__item" key={p.title}>
            <span className="trust-strip__icon" aria-hidden="true">
              {p.icon}
            </span>
            <span className="trust-strip__text">
              <span className="trust-strip__title">{p.title}</span>
              <span className="trust-strip__desc">{p.desc}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrustStrip;
