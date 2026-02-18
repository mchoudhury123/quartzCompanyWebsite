import React from 'react';
import { Link } from 'react-router-dom';
import './DesignOptionsPage.css';

const designCategories = [
  {
    id: 'edge-profiles',
    title: 'Edge Profiles',
    description:
      'The edge profile defines the character of your worktop. From subtle and modern to ornate and traditional, the right edge transforms the look and feel of your kitchen.',
    options: [
      {
        name: 'Pencil Round',
        desc: 'A subtle, gently rounded edge. The most popular choice for contemporary kitchens.',
      },
      {
        name: 'Bullnose',
        desc: 'A fully rounded half-circle profile. Soft to the touch and elegant.',
      },
      {
        name: 'Chamfer',
        desc: 'A flat angled cut at 45 degrees. Clean, architectural and modern.',
      },
      {
        name: 'Ogee',
        desc: 'An S-shaped decorative curve. Classic and traditional, ideal for period kitchens.',
      },
      {
        name: 'Waterfall',
        desc: 'A squared, sharp edge that continues down the side of the cabinet. Bold and statement-making.',
      },
    ],
  },
  {
    id: 'drainage-grooves',
    title: 'Drainage Grooves',
    description:
      'Integrated drainage grooves are machined directly into the stone surface next to your sink, creating a sleek, seamless draining area without the need for a separate draining board.',
    options: [
      {
        name: 'Standard Grooves',
        desc: 'Evenly spaced parallel channels angled toward the sink for efficient water drainage.',
      },
      {
        name: 'Wide-Spaced Grooves',
        desc: 'Fewer, wider-apart channels for a more subtle, understated look.',
      },
      {
        name: 'Custom Layout',
        desc: 'Bespoke groove patterns tailored to your worktop layout and sink position.',
      },
    ],
  },
  {
    id: 'sink-cut-outs',
    title: 'Sink Cut-Outs',
    description:
      'The sink installation method dramatically affects both aesthetics and practicality. We offer three main approaches to suit every kitchen style.',
    options: [
      {
        name: 'Undermount',
        desc: 'The sink is fixed beneath the worktop, creating a smooth, uninterrupted surface. Easy to clean and visually seamless.',
      },
      {
        name: 'Flush-Mount',
        desc: 'The sink sits perfectly level with the worktop surface. A precision finish for a truly integrated look.',
      },
      {
        name: 'Belfast / Butler',
        desc: 'A traditional farmhouse-style sink that sits proud of the cabinetry. The worktop is cut to fit around the sink rim.',
      },
    ],
  },
  {
    id: 'hob-cut-outs',
    title: 'Hob Cut-Outs',
    description:
      'Precision hob cut-outs ensure your cooking appliance fits perfectly. We work with all major hob types and brands.',
    options: [
      {
        name: 'Induction Hob',
        desc: 'Rectangular cut-outs for standard induction or ceramic hobs. We use the manufacturer template for an exact fit.',
      },
      {
        name: 'Gas Hob',
        desc: 'Cut-outs for gas hobs, including allowances for gas pipe access and ventilation requirements.',
      },
      {
        name: 'Domino Hob',
        desc: 'Smaller, modular cut-outs for domino-style hobs. Multiple cut-outs can be placed side by side.',
      },
    ],
  },
  {
    id: 'corner-treatments',
    title: 'Corner Treatments',
    description:
      'How corners are handled affects both the structural integrity and appearance of your worktops. We offer several solutions for internal and external corners.',
    options: [
      {
        name: 'Radius Corners',
        desc: 'Softly rounded external corners for a smooth, contemporary finish. Available in various radii from 5mm to 50mm.',
      },
      {
        name: 'Mitre Joints',
        desc: 'A precision 45-degree joint creating the illusion of a single continuous piece around corners. The premium choice for L-shaped layouts.',
      },
    ],
  },
  {
    id: 'breakfast-bars',
    title: 'Breakfast Bars',
    description:
      'A breakfast bar extends your worktop into a social and functional space. We can create cantilevered or supported designs to suit your layout.',
    options: [
      {
        name: 'Cantilevered',
        desc: 'The bar section overhangs with no visible support — clean, modern and space-efficient. Suitable for overhangs up to 300mm.',
      },
      {
        name: 'Supported',
        desc: 'For larger overhangs, we recommend steel support brackets or a feature leg. This allows overhangs of 500mm or more.',
      },
    ],
  },
  {
    id: 'waterfall-edges',
    title: 'Waterfall Edges',
    description:
      'A waterfall edge is where the worktop material continues vertically down the side of a cabinet or island, creating a dramatic cascading effect.',
    options: [
      {
        name: 'Full Waterfall',
        desc: 'The stone flows from the worktop surface down one or both sides to the floor. A striking statement feature.',
      },
      {
        name: 'Bookmatched',
        desc: 'Two slabs are mirror-matched at the corner so the veining creates a symmetrical pattern. The ultimate luxury detail.',
      },
    ],
  },
  {
    id: 'wall-cladding',
    title: 'Wall Cladding & Splashbacks',
    description:
      'Stone wall cladding and splashbacks create a seamless, luxurious finish between your worktop and wall cabinets. Easier to clean than tiles and far more elegant.',
    options: [
      {
        name: 'Full-Height Splashback',
        desc: 'Stone cladding from worktop to underside of wall cabinets. Creates a unified, premium look.',
      },
      {
        name: 'Partial Splashback',
        desc: 'A shorter section of stone behind key areas such as the hob or sink. A cost-effective way to add stone detailing.',
      },
    ],
  },
  {
    id: 'accessories',
    title: 'Accessories',
    description:
      'Complete your kitchen with matching stone accessories. These finishing touches bring the entire design together for a cohesive, high-end result.',
    options: [
      {
        name: 'Upstands',
        desc: 'A narrow strip of stone at the back of the worktop where it meets the wall. Typically 100mm high.',
      },
      {
        name: 'Window Cills',
        desc: 'Matching stone window sills that integrate beautifully with your worktops and splashbacks.',
      },
      {
        name: 'Hearths',
        desc: 'Custom-cut stone hearths for fireplaces, matching your kitchen worktops for a unified interior design.',
      },
    ],
  },
];

export default function DesignOptionsPage() {
  return (
    <div className="design-options-page">
      {/* Hero */}
      <section className="do-hero">
        <div className="do-hero__overlay" />
        <div className="do-hero__content container">
          <span className="do-hero__badge">Customisation</span>
          <h1 className="do-hero__title">Design Options &amp; Customisation</h1>
          <p className="do-hero__subtitle">
            Every worktop we create is made to your exact specifications. Explore the range of
            design options available to make your kitchen truly yours.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="do-intro section">
        <div className="container">
          <div className="do-intro__content">
            <h2 className="do-intro__heading">Tailored to You</h2>
            <p className="do-intro__text">
              From the edge profile to the sink cut-out method, every detail of your worktop can be
              customised. Browse our design options below and let us know what catches your eye — our
              team will guide you through every decision.
            </p>
          </div>
        </div>
      </section>

      {/* Design Categories Grid */}
      <section className="do-categories section section--cream">
        <div className="container">
          <div className="do-categories__grid">
            {designCategories.map((cat) => (
              <div key={cat.id} className="do-card" id={cat.id}>
                <div className="do-card__header">
                  <h2 className="do-card__title">{cat.title}</h2>
                </div>
                <div className="do-card__body">
                  <p className="do-card__description">{cat.description}</p>

                  <div className="do-card__options">
                    {cat.options.map((option, idx) => (
                      <div key={idx} className="do-option">
                        {/* Diagram placeholder */}
                        <div className="do-option__diagram">
                          <div className="do-option__diagram-inner">
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                              <rect x="2" y="2" width="28" height="28" rx="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
                              <path d="M8 24L14 16L18 20L24 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        </div>
                        <div className="do-option__info">
                          <h4 className="do-option__name">{option.name}</h4>
                          <p className="do-option__desc">{option.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mid-page CTA */}
      <section className="do-mid-cta section">
        <div className="container">
          <div className="do-mid-cta__inner">
            <h2 className="do-mid-cta__heading">Not Sure Which Options to Choose?</h2>
            <p className="do-mid-cta__text">
              Our design team is here to help. We'll talk you through every option, show you
              real samples, and help you create the perfect worktop for your kitchen.
            </p>
            <Link to="/contact" className="btn btn--gold btn--lg">
              Discuss Your Design With Our Team
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="do-cta section">
        <div className="container">
          <div className="do-cta__inner">
            <div className="do-cta__text-block">
              <h2 className="do-cta__heading">Ready to Design Your Dream Kitchen?</h2>
              <p className="do-cta__text">
                Combine any of these options to create a worktop that's uniquely yours. Start with a
                free quote and we'll guide you through every choice.
              </p>
            </div>
            <div className="do-cta__actions">
              <Link to="/contact" className="btn btn--primary btn--lg">
                Get a Free Quote
              </Link>
              <Link to="/measuring-guide" className="btn btn--outline btn--lg">
                Measuring Guide
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
