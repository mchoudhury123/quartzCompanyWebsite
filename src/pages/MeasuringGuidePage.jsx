import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './MeasuringGuidePage.css';

const measuringSteps = [
  {
    id: 1,
    title: 'Measuring Straight Runs',
    intro: 'Straight runs are the simplest worktop measurements. Follow these steps carefully to ensure accuracy.',
    steps: [
      'Measure the total length of the run along the back wall, from one end to the other.',
      'Measure the depth from the back wall to the front edge of your cabinets.',
      'Standard worktop depth is 620mm, but always verify your specific cabinets.',
      'If the worktop needs to overhang past the end of a cabinet run, add the overhang to your length.',
      'Note the thickness you require — 20mm or 30mm are the most common options.',
    ],
    tips: [
      'Always measure in millimetres for the greatest accuracy.',
      'Measure twice, note once — double-check every measurement before writing it down.',
      'Use a steel tape measure rather than a fabric one for rigidity.',
    ],
    diagramLabel: 'Straight Run Measurement Diagram',
    diagramDesc: 'A simple rectangle showing length (L) along the top and depth (D) on the side, with measurement arrows.',
  },
  {
    id: 2,
    title: 'Measuring L-Shapes & U-Shapes',
    intro: 'Corner layouts require multiple measurements and careful notation of which dimensions belong to which section.',
    steps: [
      'Break the shape into individual rectangular sections — an L-shape becomes two rectangles, a U-shape becomes three.',
      'For each section, measure the length along the back wall and the depth from wall to front edge.',
      'Measure into the corner from each direction to determine where the joint will fall.',
      'Note any difference in depth between adjoining sections.',
      'Sketch the layout and label each measurement clearly.',
    ],
    tips: [
      'Check that your walls are square using a builder\'s square or the 3-4-5 triangle method.',
      'If walls are not square, measure the depth at both ends of each run.',
      'Joints in L-shapes typically use a mason\'s mitre — our templater will confirm the best position.',
    ],
    diagramLabel: 'L-Shape & U-Shape Measurement Diagram',
    diagramDesc: 'An L-shaped layout showing two sections (A and B) with length and depth measurements for each, plus the corner overlap area.',
  },
  {
    id: 3,
    title: 'Accounting for Cut-Outs',
    intro: 'Cut-outs for hobs, sinks and tap holes must be positioned precisely. Here is how to provide the information we need.',
    steps: [
      'Determine the position of your hob or sink by measuring from the back wall to the centre of the cut-out.',
      'Measure from the nearest end of the worktop run to the centre of the cut-out.',
      'Note the exact make and model of your hob, sink and taps — we will source the cut-out templates.',
      'For undermount sinks, confirm whether the sink will be supplied with the worktop or separately.',
      'Mark any tap hole positions — measure from the back edge and from the centre of the sink.',
    ],
    tips: [
      'Providing the appliance make and model is more accurate than measuring the cut-out yourself.',
      'If you haven\'t chosen your appliances yet, let us know — we can advise on sizing.',
      'Remember to account for minimum stone thickness around cut-outs (typically 50mm from any edge).',
    ],
    diagramLabel: 'Cut-Out Positioning Diagram',
    diagramDesc: 'A worktop rectangle with a hob cut-out and sink cut-out shown as dashed rectangles, with distance measurements from edges.',
  },
  {
    id: 4,
    title: 'Upstands & Splashbacks',
    intro: 'Upstands and splashbacks protect your walls and add a seamless design finish. Measuring them correctly ensures a perfect fit.',
    steps: [
      'Measure the total length required — this usually matches the worktop length along the wall.',
      'For upstands, the standard height is 100mm, but confirm if you need a different size.',
      'For full splashbacks, measure from the top of the worktop to the underside of wall cabinets or desired height.',
      'Note any socket cut-outs needed — measure their position from the worktop surface and from the nearest end.',
      'If the splashback runs behind a hob, check clearance requirements for your specific appliance.',
    ],
    tips: [
      'Upstands are typically the same thickness as the worktop (20mm or 30mm).',
      'Full splashbacks are usually 20mm thick regardless of worktop thickness.',
      'Consider whether window cills will intersect with your splashback — measure accordingly.',
    ],
    diagramLabel: 'Upstand & Splashback Diagram',
    diagramDesc: 'A side-profile view showing the worktop with an upstand sitting on top at the back, and a full-height splashback option shown as a taller alternative.',
  },
  {
    id: 5,
    title: 'Window Cills',
    intro: 'Stone window cills create an elegant continuation of your worktops. They require careful measurement to fit your window reveal.',
    steps: [
      'Measure the width of the window reveal (the inside opening) from left to right.',
      'Measure the depth from the window frame to the front of the wall or desired overhang point.',
      'Note if you want the cill to sit flush with the wall or project forward with an overhang (typically 20-30mm).',
      'Measure the depth of the existing cill or reveal to determine if the new cill needs scribing to fit.',
      'Check whether the cill needs to extend into the wall at each side (called "ears" or "lugs") and by how much.',
    ],
    tips: [
      'Standard cill thickness is 20mm.',
      'If the cill will meet an upstand or splashback, note this so we can plan the junction.',
      'Ear/lug extensions into the wall are typically 25-30mm each side.',
    ],
    diagramLabel: 'Window Cill Diagram',
    diagramDesc: 'A front-on view of a window with the cill shown below, indicating width, depth, overhang, and optional ear/lug extensions into the wall on each side.',
  },
];

export default function MeasuringGuidePage() {
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (id) => {
    setActiveSection(activeSection === id ? null : id);
  };

  return (
    <div className="measuring-guide-page">
      {/* Hero Banner */}
      <section className="mg-hero">
        <div className="mg-hero__overlay" />
        <div className="mg-hero__content container">
          <span className="mg-hero__badge">Resources</span>
          <h1 className="mg-hero__title">How to Measure Your Worktops</h1>
          <p className="mg-hero__subtitle">
            A comprehensive guide to measuring your kitchen for stone worktops.
            Accurate measurements help us provide an exact quote and ensure a flawless fit.
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="mg-intro section">
        <div className="container">
          <div className="mg-intro__content">
            <h2 className="mg-intro__heading">Why Accurate Measurements Matter</h2>
            <p className="mg-intro__text">
              Stone worktops are precision-cut to your exact specifications. Unlike timber or laminate,
              stone cannot be trimmed on site, so every millimetre counts. Providing accurate initial
              measurements allows us to give you a reliable quote and plan your project efficiently.
            </p>
            <p className="mg-intro__text">
              Don't worry if you're not confident measuring — these guidelines will walk you through
              the process step by step. And remember, we always carry out a professional laser-template
              visit before fabrication begins, so your measurements are verified by our experts.
            </p>
            <div className="mg-intro__tools">
              <h3 className="mg-intro__tools-title">What You Will Need</h3>
              <ul className="mg-intro__tools-list">
                <li>A steel tape measure (at least 5 metres)</li>
                <li>A pen or pencil and paper</li>
                <li>A spirit level (helpful for checking walls)</li>
                <li>Your appliance specifications (hob, sink, taps)</li>
                <li>A smartphone camera to photograph your layout</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="mg-nav section section--cream">
        <div className="container">
          <h2 className="section-title">Jump to a Section</h2>
          <div className="mg-nav__grid">
            {measuringSteps.map((step) => (
              <a
                key={step.id}
                href={`#step-${step.id}`}
                className="mg-nav__card"
                onClick={() => setActiveSection(step.id)}
              >
                <span className="mg-nav__number">{step.id}</span>
                <span className="mg-nav__label">{step.title}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Step-by-Step Sections */}
      <section className="mg-steps section">
        <div className="container">
          {measuringSteps.map((step) => (
            <div
              key={step.id}
              id={`step-${step.id}`}
              className="mg-step"
            >
              <div className="mg-step__header" onClick={() => toggleSection(step.id)}>
                <div className="mg-step__number-circle">{step.id}</div>
                <h2 className="mg-step__title">{step.title}</h2>
                <span className={`mg-step__toggle ${activeSection === step.id ? 'mg-step__toggle--open' : ''}`}>
                  {activeSection === step.id ? '−' : '+'}
                </span>
              </div>

              <div className={`mg-step__body ${activeSection === step.id ? 'mg-step__body--open' : ''}`}>
                <p className="mg-step__intro">{step.intro}</p>

                <div className="mg-step__columns">
                  <div className="mg-step__instructions">
                    <h3 className="mg-step__list-heading">Step-by-Step Instructions</h3>
                    <ol className="mg-step__list">
                      {step.steps.map((instruction, idx) => (
                        <li key={idx} className="mg-step__list-item">
                          {instruction}
                        </li>
                      ))}
                    </ol>

                    {/* Tips Box */}
                    <div className="mg-tip-box">
                      <h4 className="mg-tip-box__heading">Top Tips</h4>
                      <ul className="mg-tip-box__list">
                        {step.tips.map((tip, idx) => (
                          <li key={idx} className="mg-tip-box__item">{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Diagram Placeholder */}
                  <div className="mg-step__diagram">
                    <div className="mg-diagram-placeholder">
                      <div className="mg-diagram-placeholder__icon">
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                          <rect x="4" y="8" width="40" height="28" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
                          <line x1="4" y1="36" x2="44" y2="36" stroke="currentColor" strokeWidth="2" />
                          <line x1="4" y1="8" x2="24" y2="24" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
                          <line x1="44" y1="8" x2="24" y2="24" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
                          <text x="24" y="44" textAnchor="middle" fontSize="6" fill="currentColor">DIAGRAM</text>
                        </svg>
                      </div>
                      <p className="mg-diagram-placeholder__label">{step.diagramLabel}</p>
                      <p className="mg-diagram-placeholder__desc">{step.diagramDesc}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reassurance Box */}
      <section className="mg-reassurance section section--cream">
        <div className="container">
          <div className="mg-reassurance__box">
            <div className="mg-reassurance__icon">
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                <circle cx="28" cy="28" r="26" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M18 28L25 35L38 22" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="mg-reassurance__content">
              <h2 className="mg-reassurance__heading">
                Don't worry — we'll verify all measurements during our professional template visit
              </h2>
              <p className="mg-reassurance__text">
                Your initial measurements help us provide an accurate quote and plan your project.
                Before we cut any stone, our professional templater will visit your home with a
                laser-measuring device to capture every detail to sub-millimetre accuracy. This
                ensures a perfect fit every time.
              </p>
              <p className="mg-reassurance__text">
                The template visit typically takes 30-60 minutes and is arranged once your base
                units and cabinets are fully fitted and level.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="mg-download section">
        <div className="container">
          <div className="mg-download__card">
            <div className="mg-download__info">
              <h2 className="mg-download__heading">Printable Measuring Sheet</h2>
              <p className="mg-download__text">
                Download our free measuring template to record your dimensions neatly.
                It includes a grid for sketching your layout and spaces for all the measurements
                we need to provide your quote.
              </p>
            </div>
            <div className="mg-download__action">
              <a href="#download" className="btn btn--primary btn--lg" onClick={(e) => { e.preventDefault(); alert('Download link placeholder — PDF measuring sheet would be here.'); }}>
                Download Measuring Sheet (PDF)
              </a>
              <span className="mg-download__meta">Free download — No sign-up required</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mg-cta section">
        <div className="container">
          <div className="mg-cta__inner">
            <h2 className="mg-cta__heading">Prefer Us to Measure?</h2>
            <p className="mg-cta__text">
              If you'd rather leave the measuring to the professionals, we're happy to help.
              Book a free template visit and our expert templater will come to your home to take
              laser-precise measurements — no obligation.
            </p>
            <div className="mg-cta__actions">
              <Link to="/contact" className="btn btn--gold btn--lg">
                Book a Free Template Visit
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
