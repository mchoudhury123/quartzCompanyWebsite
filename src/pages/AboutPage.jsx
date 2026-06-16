import React from 'react';
import { Link } from 'react-router-dom';
import usePageMeta from '../hooks/usePageMeta';
import './AboutPage.css';

const values = [
  {
    title: 'Craftsmanship',
    description:
      'We believe in doing things properly, never cutting corners. Every surface is templated, cut and polished with the same care we would give our own homes.',
  },
  {
    title: 'Sustainability',
    description:
      'Responsibly sourced materials and minimal waste. We work closely with fabricators who recycle their offcuts and run water-recirculation systems.',
  },
  {
    title: 'Transparency',
    description:
      'Honest pricing, clear timelines and no hidden costs. Your quote is your quote — we never add surprise extras after the fact.',
  },
  {
    title: 'Personal Service',
    description:
      'Every project is handled start to finish by a small, dedicated team. No call centres, no handoffs — just direct access to the people doing the work.',
  },
];

const stats = [
  { figure: '250+', label: 'Kitchens Fitted' },
  { figure: '9', label: 'Premium Colours' },
  { figure: '25 Yr', label: 'Surface Warranty' },
  { figure: '5★', label: 'Average Rating' },
];

const processSteps = [
  {
    num: '01',
    title: 'Choose Your Surface',
    desc: 'Browse our nine confirmed quartz colours online or request free samples posted to your door within a few working days.',
  },
  {
    num: '02',
    title: 'Free Quote & Consultation',
    desc: 'Share your rough dimensions and we will return a transparent, fixed-price quote — usually the same day.',
  },
  {
    num: '03',
    title: 'Precision Template',
    desc: 'Once your cabinets are fitted, our templater visits with digital laser equipment to capture every dimension to sub-millimetre accuracy.',
  },
  {
    num: '04',
    title: 'Expert Installation',
    desc: 'Your worktop is cut, polished and fitted by experienced installers, and we personally inspect the finished job before we leave.',
  },
];

/* Material visualisations shown in a kitchen setting (public folder) */
const gallery = [
  {
    src: '/Calacatta%20Classico/Calacatta%20Classico%20Fitted.jpg',
    name: 'Calacatta Classico',
    alt: 'Calacatta Classico engineered quartz worktop shown in a kitchen setting',
  },
  {
    src: '/Statuario%20Gold/Statuario%20Gold%20Fitted.jpg',
    name: 'Statuario Gold',
    alt: 'Statuario Gold quartz worktop with warm gold veining shown in a modern kitchen',
  },
  {
    src: '/Calacatta%20Lusso/Calacatta%20Lusso%20Fitted%202.jpg',
    name: 'Calacatta Lusso',
    alt: 'Calacatta Lusso quartz island worktop shown in a contemporary kitchen',
  },
  {
    src: '/Nero%20Sparkle/nero%20sparkle%20example.jpg',
    name: 'Nero Sparkle',
    alt: 'Nero Sparkle black quartz worktop with reflective flecks shown in a kitchen',
  },
  {
    src: '/Carrara%20Extra/carrara%20extra%20example.jpg',
    name: 'Carrara Extra',
    alt: 'Carrara Extra white quartz worktop with soft grey veining shown in a kitchen',
  },
  {
    src: '/Bianco%20Galaxy/bianco%20galaxy%20example.jpg',
    name: 'Bianco Galaxy',
    alt: 'Bianco Galaxy speckled quartz worktop shown in a bright kitchen',
  },
];

/* Structured data (schema.org) for the About page */
const ABOUT_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About The Quartz Company',
  url: 'https://www.thequartzcompany.co.uk/about',
  description:
    'The Quartz Company is a Northampton-based specialist in premium engineered and printed quartz kitchen worktops.',
  mainEntity: {
    '@type': 'Organization',
    name: 'The Quartz Company',
    legalName: 'Quartz Company SP Ltd',
    url: 'https://www.thequartzcompany.co.uk',
    logo: 'https://www.thequartzcompany.co.uk/logo.png',
    description:
      'Premium engineered and printed quartz kitchen worktops, handcrafted in Britain with honest fixed-price quotes and a 25-year warranty.',
    telephone: '+44 7375 303416',
    email: 'sales@thequartzcompany.co.uk',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Unit 303/2, K2 House Business Centre, Heathfield Way',
      addressLocality: 'Northampton',
      addressRegion: 'Northamptonshire',
      postalCode: 'NN5 7QP',
      addressCountry: 'GB',
    },
    areaServed: [
      'Northamptonshire',
      'Warwickshire',
      'Leicestershire',
      'Buckinghamshire',
      'Bedfordshire',
      'Oxfordshire',
      'Cambridgeshire',
      'West Midlands',
    ],
  },
};

function AboutPage() {
  usePageMeta(
    'About The Quartz Company | Premium Quartz Worktops in Northampton',
    'Meet The Quartz Company — a Northampton-based team crafting premium engineered & printed quartz kitchen worktops with honest fixed-price quotes, free samples, expert local fitting and a 25-year warranty.',
    ABOUT_JSONLD
  );

  return (
    <div className="about-page">
      {/* ── Hero with Stats Overlay ── */}
      <section className="about-hero">
        <div className="about-hero__body">
          <div className="container">
            <span className="eyebrow">Our Story</span>
            <h1 className="about-hero__title">
              Premium Quartz Worktops, Crafted in Northampton
            </h1>
            <p className="about-hero__subtitle">
              A small Northampton team with one aim &mdash; making premium
              quartz worktops feel effortless to buy, fit and live with.
            </p>
          </div>
        </div>
        <div className="about-hero__stats">
          <div className="container">
            <div className="about-hero__stats-row">
              {stats.map((stat) => (
                <div key={stat.label} className="about-hero__stat">
                  <span className="about-hero__stat-figure">{stat.figure}</span>
                  <span className="about-hero__stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Story Section (two-column editorial) ── */}
      <section className="about-story section">
        <div className="container">
          <div className="about-story__layout">
            <div className="about-story__media">
              <img
                src="/Calacatta%20Lusso/Calacatta%20Lusso%20Fitted%201.jpg"
                alt="Calacatta Lusso quartz worktop and island shown in a modern Northamptonshire kitchen"
                className="about-story__img"
                loading="lazy"
              />
            </div>
            <div className="about-story__body">
              <span className="eyebrow">Why The Quartz Company</span>
              <h2 className="about-story__heading">
                Premium Quartz, Without the Premium Fuss
              </h2>
              <p>
                The Quartz Company was founded on a simple idea: that ordering a
                premium kitchen worktop shouldn&rsquo;t feel like a chore. Too
                many homeowners told us the same story &mdash; pushy sales,
                vague pricing, weeks of chasing for a quote, then a surprise
                bill at the end. We knew it could be done differently.
              </p>
              <p>
                So we built a boutique operation based in Northampton: a tightly
                curated range of nine of the most beautiful engineered and
                printed quartz colours on the market, honest fixed-price quotes,
                and a small team that handles every project personally &mdash;
                from the first enquiry through to the final installed slab.
              </p>

              <blockquote className="about-story__pullquote">
                Quality is not just a department; it is the entire company.
              </blockquote>

              <p>
                When you call us, you speak to the person who will be looking
                after your project &mdash; no middlemen, no upsells, no
                surprises. That personal standard is the single thing we refuse
                to compromise on, and it&rsquo;s why our customers recommend us.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Our Work Gallery ── */}
      <section className="about-work section section--cream">
        <div className="container">
          <div className="about-work__head">
            <span className="eyebrow">Gallery</span>
            <h2 className="about-work__title">See Our Quartz in the Kitchen</h2>
            <p className="about-work__subtitle">
              Visualisations showing how our engineered and printed quartz
              colours look across a range of kitchen styles.
            </p>
          </div>
          <div className="about-work__grid">
            {gallery.map((item) => (
              <Link to="/colours" className="about-work__item" key={item.name}>
                <img
                  src={item.src}
                  alt={item.alt}
                  className="about-work__img"
                  loading="lazy"
                />
                <span className="about-work__caption">{item.name}</span>
              </Link>
            ))}
          </div>
          <div className="about-work__cta">
            <Link to="/colours" className="btn btn--outline btn--lg">
              Explore the Full Collection
            </Link>
          </div>
        </div>
      </section>

      {/* ── Our Values ── */}
      <section className="about-values section">
        <div className="container">
          <div className="about-values__head">
            <span className="eyebrow">What We Stand For</span>
            <h2 className="about-values__title">Four Principles, Every Project</h2>
            <p className="about-values__subtitle">
              The standards that guide every quote, template and installation.
            </p>
          </div>
          <div className="about-values__list">
            {values.map((value, index) => (
              <div key={value.title} className="about-values__item">
                <div className="about-values__item-number">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className="about-values__item-content">
                  <h3 className="about-values__item-title">{value.title}</h3>
                  <p className="about-values__item-text">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Process ── */}
      <section className="about-process section section--cream">
        <div className="container">
          <div className="about-process__head">
            <span className="eyebrow">How We Work</span>
            <h2 className="about-process__title">From First Enquiry to Fitted Worktop</h2>
            <p className="about-process__subtitle">
              Four simple steps, handled personally by our team.
            </p>
          </div>
          <div className="about-process__grid">
            {processSteps.map((step) => (
              <div key={step.num} className="about-process__card">
                <span className="about-process__num">{step.num}</span>
                <h3 className="about-process__step-title">{step.title}</h3>
                <p className="about-process__step-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="about-cta section">
        <div className="container about-cta__inner">
          <span className="eyebrow">Start Your Project</span>
          <h2 className="about-cta__heading">Ready to Transform Your Kitchen?</h2>
          <p className="about-cta__text">
            Request free samples, a fixed-price quote or a chat with the team
            &mdash; whichever is most useful. We&rsquo;ll reply the same day.
          </p>
          <Link to="/quote" className="btn btn--gold btn--lg">
            Get a Free Quote
          </Link>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
