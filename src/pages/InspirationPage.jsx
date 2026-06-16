import React from 'react';
import { Link } from 'react-router-dom';
import usePageMeta from '../hooks/usePageMeta';
import './InspirationPage.css';

/* The Quartz Edit — magazine issues (public folder) mapped to colours */
const issues = [
  {
    n: '01',
    src: '/ISSUE%201.jpg',
    name: 'Bianco Galaxy',
    slug: 'bianco-galaxy',
    blurb:
      'Clean white tones enriched by delicate black mineral flecks — a surface that feels both modern and effortlessly elegant.',
  },
  {
    n: '02',
    src: '/ISSUE%202.jpg',
    name: 'Bianco Merino',
    slug: 'bianco-merino',
    blurb:
      'Graceful grey veining flows across a crisp white canvas — timeless, yet distinctly contemporary.',
  },
  {
    n: '03',
    src: '/ISSUE%203.jpg',
    name: 'Blanco White',
    slug: 'blanco-white',
    blurb:
      'A perfectly balanced white with no dramatic veining — designed to elevate every element around it.',
  },
  {
    n: '04',
    src: '/ISSUE%204.jpg',
    name: 'Nero Sparkle',
    slug: 'nero-sparkle',
    blurb:
      'Inspired by the night sky — rich black tones meet shimmering reflective details for a surface that feels effortlessly refined.',
  },
  {
    n: '05',
    src: '/ISSUE%205.jpg',
    name: 'Calacatta Classico',
    slug: 'calacatta-classico',
    blurb:
      'Bold gold veining meets a luminous white backdrop — defined by elegance and timeless luxury.',
  },
  {
    n: '06',
    src: '/ISSUE%206.jpg',
    name: 'Calacatta Lusso',
    slug: 'calacatta-lusso',
    blurb:
      'Where elegance meets impact. Sophisticated veining and unmistakable presence.',
  },
  {
    n: '07',
    src: '/ISSUE%207.jpg',
    name: 'Lincoln',
    slug: 'lincoln',
    blurb:
      'An elegant balance of simplicity and sophistication, designed to elevate every kitchen it inhabits.',
  },
  {
    n: '08',
    src: '/ISSUE%208.jpg',
    name: 'Carrara Extra',
    slug: 'carrara-extra',
    blurb:
      'Inspired by natural Carrara marble — a refined surface offering a perfect balance of sophistication and simplicity.',
  },
  {
    n: '09',
    src: '/ISSUE%209.jpg',
    name: 'Statuario Gold',
    slug: 'statuario-gold',
    blurb:
      'Soft golden detailing meets a radiant white backdrop, bringing warmth, sophistication and timeless appeal.',
  },
];

export default function InspirationPage() {
  usePageMeta(
    'Quartz Worktop Inspiration | The Quartz Edit | The Quartz Company',
    'Browse The Quartz Edit — our editorial lookbook of premium engineered and printed quartz worktops styled in real kitchens. Inspiration for Calacatta, Carrara, Statuario, Nero Sparkle and more.'
  );

  return (
    <div className="inspiration-page">
      {/* Hero */}
      <section className="insp-hero">
        <div className="container">
          <span className="eyebrow">The Quartz Edit</span>
          <h1 className="insp-hero__title">Worktop Inspiration</h1>
          <p className="insp-hero__subtitle">
            A curated lookbook of our quartz surfaces, styled in beautiful
            kitchens. Browse each issue of The Quartz Edit for inspiration
            &mdash; then make it yours.
          </p>
        </div>
      </section>

      {/* Gallery */}
      <section className="insp-gallery section">
        <div className="container">
          <div className="insp-grid">
            {issues.map((issue) => (
              <article className="insp-card" key={issue.n}>
                <Link to={`/product/${issue.slug}`} className="insp-card__cover">
                  <img
                    src={issue.src}
                    alt={`The Quartz Edit, Issue ${issue.n} — ${issue.name} quartz worktop styled in a kitchen`}
                    className="insp-card__img"
                    loading="lazy"
                  />
                </Link>
                <div className="insp-card__body">
                  <span className="insp-card__issue">Issue {issue.n}</span>
                  <h2 className="insp-card__name">{issue.name}</h2>
                  <p className="insp-card__blurb">{issue.blurb}</p>
                  <Link to={`/product/${issue.slug}`} className="insp-card__link">
                    Explore {issue.name} &rarr;
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="insp-cta section">
        <div className="container insp-cta__inner">
          <span className="eyebrow">Make It Yours</span>
          <h2 className="insp-cta__heading">Found Something You Love?</h2>
          <p className="insp-cta__text">
            Order free samples or request a fixed-price quote, and bring The
            Quartz Edit into your own home.
          </p>
          <div className="insp-cta__actions">
            <Link to="/colours" className="btn btn--gold btn--lg">
              Browse the Collection
            </Link>
            <Link to="/quote" className="btn insp-cta__btn-outline btn--lg">
              Get a Free Quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
