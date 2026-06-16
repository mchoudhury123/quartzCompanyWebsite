import React from 'react';
import { Link } from 'react-router-dom';
import usePageMeta from '../hooks/usePageMeta';
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
  usePageMeta('Worktop Design Options & Customisation | The Quartz Company', 'Explore edge profiles, drainage grooves, sink cut-outs, waterfall edges and more. Every quartz worktop from The Quartz Company is made to your exact specifications.');
  return (
    <div className="design-options-page">
      {/* Hero */}
      <section className="do-hero">
        <div className="do-hero__overlay" />
        <div className="do-hero__content container">
          <span className="eyebrow">Customisation</span>
          <h1 className="do-hero__title">Design Options &amp; Customisation</h1>
          <p className="do-hero__subtitle">
            Every worktop we create is made to your exact specifications &mdash; explore the
            details that make your kitchen unmistakably yours.
          </p>
        </div>
      </section>

      {/* Design Categories */}
      <section className="do-categories section">
        <div className="container">
          {designCategories.map((cat, index) => (
            <div className="do-cat" id={cat.id} key={cat.id}>
              <div className="do-cat__head">
                <span className="do-cat__num">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h2 className="do-cat__title">{cat.title}</h2>
                <p className="do-cat__desc">{cat.description}</p>
              </div>
              <div className="do-cat__options">
                {cat.options.map((option, idx) => (
                  <div key={idx} className="do-opt">
                    <h3 className="do-opt__name">{option.name}</h3>
                    <p className="do-opt__desc">{option.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="do-cta section">
        <div className="container do-cta__inner">
          <span className="eyebrow">Bespoke Worktops</span>
          <h2 className="do-cta__heading">Ready to Design Your Dream Kitchen?</h2>
          <p className="do-cta__text">
            Combine any of these options to create a worktop that&rsquo;s uniquely yours.
            Start with a free quote and we&rsquo;ll guide you through every choice.
          </p>
          <div className="do-cta__actions">
            <Link to="/quote" className="btn btn--gold btn--lg">
              Get a Free Quote
            </Link>
            <Link to="/measuring-guide" className="btn do-cta__btn-outline btn--lg">
              Measuring Guide
            </Link>
            <Link to="/how-to-buy" className="btn do-cta__btn-outline btn--lg">
              How to Buy
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
