import React from 'react';
import { Link } from 'react-router-dom';
import './AboutPage.css';

const values = [
  {
    icon: '\u2726',
    title: 'Craftsmanship',
    description:
      'We believe in doing things properly, never cutting corners. Every surface is templated, cut and polished with the same care we would give our own homes.',
  },
  {
    icon: '\u2618',
    title: 'Sustainability',
    description:
      'Responsibly sourced materials and minimal waste. We work closely with fabricators who recycle their offcuts and run water-recirculation systems.',
  },
  {
    icon: '\u2691',
    title: 'Transparency',
    description:
      'Honest pricing, clear timelines and no hidden costs. Your quote is your quote \u2014 we never add surprise extras after the fact.',
  },
  {
    icon: '\u2764',
    title: 'Personal Service',
    description:
      'Every project is handled start to finish by a small, dedicated team. No call centres, no handoffs \u2014 just direct access to the people doing the work.',
  },
];

const stats = [
  { figure: '250+', label: 'Kitchens Fitted' },
  { figure: '9', label: 'Premium Colours' },
  { figure: '25 Yr', label: 'Surface Warranty' },
  { figure: '5\u2605', label: 'Average Rating' },
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
    desc: 'Share your rough dimensions and we will return a transparent, fixed-price quote \u2014 usually the same day.',
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

function AboutPage() {
  return (
    <div className="about-page">
      {/* ── Hero with Stats Overlay ── */}
      <section className="about-hero">
        <div className="about-hero__body">
          <div className="container">
            <h1 className="about-hero__title">Our Story</h1>
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

      {/* ── Story Section ── */}
      <section className="about-story section">
        <div className="container">
          <div className="about-story__body">
            <h2 className="about-story__heading">
              Premium Quartz, Without the Premium Fuss
            </h2>
            <p>
              The Quartz Company was founded on a simple idea: that ordering a
              premium worktop shouldn't feel like a chore. Too many homeowners
              told us the same story &mdash; pushy sales, vague pricing,
              weeks of chasing for a quote, then a surprise bill at the end.
              We knew it could be done differently.
            </p>
            <p>
              So we built a boutique operation based in Northampton: a tightly
              curated range of nine of the most beautiful quartz colours on
              the market, honest fixed-price quotes, and a small team that
              handles every project personally from the first enquiry through
              to the final installed slab. No middlemen, no upsells, no
              surprises.
            </p>

            <blockquote className="about-story__pullquote">
              Quality is not just a department; it is the entire company.
            </blockquote>

            <p>
              We work alongside experienced fabricators and installers across
              the Midlands who share our standards, and we never hand a
              customer over to a faceless call centre. When you call us, you
              speak to the person who will be looking after your project.
              That's something a lot of big surface brands have lost along the
              way &mdash; and it's the single thing we refuse to compromise on.
            </p>
            <p>
              Whether you're planning a full kitchen refit, a compact utility
              worktop or an island with a waterfall edge, we would love to
              help. Our aim is simple: you should enjoy the process as much
              as you enjoy the finished result.
            </p>
          </div>
        </div>
      </section>

      {/* ── Our Values ── */}
      <section className="about-values section section--cream">
        <div className="container">
          <h2 className="about-values__title">What We Stand For</h2>
          <p className="about-values__subtitle">
            Four principles that guide every quote, template and installation.
          </p>
          <div className="about-values__list">
            {values.map((value, index) => (
              <div key={value.title} className="about-values__item">
                <div className="about-values__item-number">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className="about-values__item-content">
                  <h3 className="about-values__item-title">
                    <span className="about-values__item-icon" aria-hidden="true">
                      {value.icon}
                    </span>
                    {value.title}
                  </h3>
                  <p className="about-values__item-text">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Process ── */}
      <section className="about-process section">
        <div className="container">
          <h2 className="about-process__title">How We Work</h2>
          <p className="about-process__subtitle">
            Four simple steps from first enquiry to fitted worktop.
          </p>
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
        <div className="container">
          <div className="about-cta__card">
            <h2 className="about-cta__heading">
              Ready to Start Your Project?
            </h2>
            <p className="about-cta__text">
              Request free samples, a fixed-price quote or a chat with the
              team &mdash; whichever is most useful. We'll reply the same day.
            </p>
            <Link to="/quote" className="btn btn--gold btn--lg">
              Get a Free Quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
