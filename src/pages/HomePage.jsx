import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import products from '../data/products.json';
import testimonials from '../data/testimonials.json';
import './HomePage.css';

/* ── Intersection Observer hook ── */
function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { threshold: 0.1, ...options }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return [ref, inView];
}

function AnimatedSection({ children, className = '', id }) {
  const [ref, inView] = useInView();
  return (
    <section id={id} ref={ref} className={`${className} ${inView ? 'hp-visible' : 'hp-hidden'}`}>
      {children}
    </section>
  );
}

export default function HomePage() {
  /* ── Featured products ── */
  const featuredProducts = products.filter((p) => p.popular).slice(0, 6);
  if (featuredProducts.length < 6) {
    const remaining = products.filter((p) => !p.popular);
    featuredProducts.push(...remaining.slice(0, 6 - featuredProducts.length));
  }

  /* ── Testimonials: show 3 or all ── */
  const [showAllTestimonials, setShowAllTestimonials] = useState(false);
  const visibleTestimonials = showAllTestimonials ? testimonials : testimonials.slice(0, 3);

  /* ── FAQ state ── */
  const [openFaq, setOpenFaq] = useState(null);
  const toggleFaq = (index) => setOpenFaq((prev) => (prev === index ? null : index));

  const faqData = [
    { q: 'What materials do you offer?', a: 'We specialise in two types of premium worktop: engineered quartz and full body printed quartz. Our standard engineered quartz offers over 60 colours with virtually zero maintenance. Our full body printed quartz takes it further \u2014 the veining pattern runs through the entire slab thickness, so waterfall edges and mitres look flawless. Both are non-porous, scratch resistant and incredibly durable. Visit our Colours page to explore the full range or order free samples.' },
    { q: 'How much do worktops cost?', a: 'Prices vary depending on colour, thickness, edge profile and kitchen complexity. Our engineered quartz starts from \u00a3245 per square metre (inc. VAT). Most kitchens fall between \u00a32,000 and \u00a35,000 fully fitted. Request a free quote for an accurate price tailored to your project.' },
    { q: 'Do you offer free samples?', a: 'Absolutely. We will post up to five free samples directly to your door so you can see and feel the surface in your own kitchen lighting. Simply add your favourite colours to the sample basket or request them as part of your free quote.' },
    { q: 'What areas do you cover for installation?', a: 'We offer professional installation across the whole of England, Scotland and Wales. Our network of certified fitting teams covers all major cities and most rural areas. Enter your postcode during the quote process and we will confirm coverage and estimated lead times for your area.' },
    { q: 'How long does installation take?', a: 'A typical kitchen worktop installation takes between 2 and 4 hours. Larger or more complex projects (e.g. islands, waterfall edges, integrated sinks) may take a full day. From placing your order, the total lead time is usually 10\u201320 working days depending on the material chosen.' },
  ];

  /* ── Why Choose data ── */
  const whyChooseData = [
    { icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="hp-why__icon-svg"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10"/><path d="M17 8c-1.5-1-3-1.5-5-1.5"/><path d="M8 3.5c1 2 1.5 4.5.5 7"/><path d="M14 10.5c-1 2.5-3 4-5.5 4.5"/><path d="M20 4l-2 2"/><path d="M22 2l-6 6"/></svg>), title: 'Sustainable Sourcing', desc: 'Responsibly sourced quartz and low-waste engineered manufacturing' },
    { icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="hp-why__icon-svg"><circle cx="13.5" cy="6.5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="12" r="2.5"/><circle cx="8" cy="18.5" r="2.5"/><circle cx="16" cy="18.5" r="2.5"/></svg>), title: 'Personalised Design', desc: 'Free consultations with our in-house kitchen designers' },
    { icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="hp-why__icon-svg"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>), title: 'Lifetime Support', desc: 'Industry-leading warranties and dedicated after-care' },
    { icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="hp-why__icon-svg"><path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>), title: 'Local Fitting', desc: 'Professional installation across Northamptonshire and surrounding areas' },
  ];

  /* ── Comparison data ── */
  const comparisonData = [
    { attribute: 'Consistency', quartz: { text: 'Perfect slab-to-slab', icon: 'check' }, granite: { text: 'Varies by slab', icon: 'cross' }, laminate: { text: 'Consistent print', icon: 'check' } },
    { attribute: 'Pattern Variety', quartz: { text: '60+ designs', icon: 'check' }, granite: { text: 'Natural only', icon: 'neutral' }, laminate: { text: 'Wide range', icon: 'check' } },
    { attribute: 'Stain Resistance', quartz: { text: 'Non-porous', icon: 'check' }, granite: { text: 'Requires sealing', icon: 'neutral' }, laminate: { text: 'Good', icon: 'check' } },
    { attribute: 'Heat Resistance', quartz: { text: 'Up to 150\u00b0C', icon: 'check' }, granite: { text: 'Excellent', icon: 'check' }, laminate: { text: 'Poor', icon: 'cross' } },
    { attribute: 'Maintenance', quartz: { text: 'Wipe clean', icon: 'check' }, granite: { text: 'Annual sealing', icon: 'neutral' }, laminate: { text: 'Wipe clean', icon: 'check' } },
    { attribute: 'Scratch Resistance', quartz: { text: 'Excellent', icon: 'check' }, granite: { text: 'Very good', icon: 'check' }, laminate: { text: 'Fair', icon: 'neutral' } },
    { attribute: 'Cost', quartz: { text: 'From \u00a3245/m\u00b2', icon: 'check' }, granite: { text: 'From \u00a3380/m\u00b2', icon: 'neutral' }, laminate: { text: 'From \u00a350/m\u00b2', icon: 'check' } },
  ];

  const renderIcon = (type) => {
    if (type === 'check') return <span className="hp-compare__icon hp-compare__icon--check">{'\u2713'}</span>;
    if (type === 'cross') return <span className="hp-compare__icon hp-compare__icon--cross">{'\u2717'}</span>;
    return <span className="hp-compare__icon hp-compare__icon--neutral">{'\u25CB'}</span>;
  };

  /* ── Steps data ── */
  const stepsData = [
    { num: 1, title: 'Choose Your Surface', desc: 'Browse our collection and order free samples' },
    { num: 2, title: 'Design Consultation', desc: 'Speak with our designers about your project' },
    { num: 3, title: 'Template & Quote', desc: 'We measure precisely and provide a fixed-price quote' },
    { num: 4, title: 'Expert Installation', desc: 'Our craftspeople fit your worktop to perfection' },
  ];

  /* ── Instagram gradients ── */
  const instaGradients = [
    'linear-gradient(135deg, #e8ddd3 0%, #c5a47e 100%)',
    'linear-gradient(135deg, #2a2a2a 0%, #4a4a4a 100%)',
    'linear-gradient(135deg, #f8f6f3 0%, #d5cdc4 100%)',
    'linear-gradient(135deg, #3b3b3b 0%, #6b8f71 100%)',
    'linear-gradient(135deg, #c5a47e 0%, #8b7355 100%)',
    'linear-gradient(135deg, #333 0%, #1a1a1a 100%)',
  ];

  /* ── Star rating helper ── */
  const renderStars = (count) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < count ? 'hp-test__star--filled' : 'hp-test__star--empty'}>
          {i < count ? '\u2605' : '\u2606'}
        </span>
      );
    }
    return stars;
  };

  /* ── Trust bar data ── */
  const trustItems = [
    { icon: '\u2605', text: '4.8 Trustpilot' },
    { icon: '\uD83D\uDEE1\uFE0F', text: '25 Year Warranty' },
    { icon: '\uD83D\uDE9A', text: 'Free Local Delivery' },
  ];

  return (
    <div className="hp">
      {/* ═══════════════════════════════════════
          1. SPLIT-SCREEN HERO
          ═══════════════════════════════════════ */}
      <section className="hp-hero">
        <div className="hp-hero__left">
          <div className="hp-hero__content">
            <h1 className="hp-hero__title">
              Premium Quartz Worktops, Delivered Direct to Your Door
            </h1>
            <p className="hp-hero__subtitle">
              Engineered quartz &amp; full body printed quartz &mdash; up to 40% off this spring
            </p>
            <div className="hp-hero__ctas">
              <Link to="/quote" className="btn btn--gold btn--lg hp-hero__btn">
                Get Quote &amp; Free Samples
              </Link>
              <Link to="/colours" className="btn btn--lg hp-hero__btn hp-hero__btn--outline">
                Browse Colours
              </Link>
            </div>
          </div>
        </div>
        <div className="hp-hero__right">
          <div className="hp-hero__visual" />
        </div>

        {/* Floating Trust Bar */}
        <div className="hp-trust">
          <div className="hp-trust__inner container">
            {trustItems.map((item, i) => (
              <div className="hp-trust__item" key={i}>
                <span className="hp-trust__icon" aria-hidden="true">{item.icon}</span>
                <span className="hp-trust__text">{item.text}</span>
              </div>
            ))}
          </div>
          {/* Mobile scrolling version */}
          <div className="hp-trust__track">
            <div className="hp-trust__track-content">
              {trustItems.map((item, i) => (
                <div className="hp-trust__item" key={i}>
                  <span className="hp-trust__icon" aria-hidden="true">{item.icon}</span>
                  <span className="hp-trust__text">{item.text}</span>
                </div>
              ))}
            </div>
            <div className="hp-trust__track-content" aria-hidden="true">
              {trustItems.map((item, i) => (
                <div className="hp-trust__item" key={`dup-${i}`}>
                  <span className="hp-trust__icon" aria-hidden="true">{item.icon}</span>
                  <span className="hp-trust__text">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          2. FEATURED PRODUCTS (horizontal scroll)
          ═══════════════════════════════════════ */}
      <AnimatedSection className="section hp-featured" id="featured">
        <div className="container">
          <h2 className="section-title">Trending This Season</h2>
          <p className="section-subtitle">
            Our most-loved surfaces, chosen by thousands of homeowners
          </p>
          <div className="hp-featured__scroll">
            {featuredProducts.map((product) => (
              <div className="hp-featured__scroll-item" key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
            <Link to="/colours" className="hp-featured__view-all">
              <span className="hp-featured__view-all-text">View All Colours &rarr;</span>
            </Link>
          </div>
        </div>
      </AnimatedSection>

      {/* ═══════════════════════════════════════
          3. TESTIMONIALS (staggered 3-column grid)
          ═══════════════════════════════════════ */}
      <AnimatedSection className="section section--cream hp-test" id="testimonials">
        <div className="container">
          <h2 className="section-title">What Our Customers Say</h2>
          <div className="hp-test__grid">
            {visibleTestimonials.map((t, i) => (
              <div className="hp-test__card" key={t.id} style={{ '--stagger': i }}>
                <blockquote className="hp-test__quote">
                  &ldquo;{t.text}&rdquo;
                </blockquote>
                <div className="hp-test__stars">{renderStars(t.rating)}</div>
                <p className="hp-test__author">{t.name}</p>
                <p className="hp-test__location">{t.location}</p>
                <p className="hp-test__product">Purchased: {t.product}</p>
              </div>
            ))}
          </div>
          {testimonials.length > 3 && (
            <div className="hp-test__more">
              <button
                className="btn btn--outline"
                onClick={() => setShowAllTestimonials((p) => !p)}
              >
                {showAllTestimonials ? 'Show Less' : 'Show More Reviews'}
              </button>
            </div>
          )}
        </div>
      </AnimatedSection>

      {/* ═══════════════════════════════════════
          4. COMPARISON TABLE (premium 3-column)
          ═══════════════════════════════════════ */}
      <AnimatedSection className="section hp-compare" id="compare">
        <div className="container">
          <h2 className="section-title">Engineered Quartz vs The Rest</h2>
          <p className="section-subtitle">
            See how our quartz worktops compare across the attributes that matter most
          </p>
          <div className="hp-compare__table">
            {/* Column headers */}
            <div className="hp-compare__header">
              <div className="hp-compare__header-cell hp-compare__header-cell--attr" />
              <div className="hp-compare__header-cell hp-compare__header-cell--quartz">
                <span className="hp-compare__header-badge">Our Pick</span>
                <span className="hp-compare__header-label">Quartz</span>
              </div>
              <div className="hp-compare__header-cell">
                <span className="hp-compare__header-label">Granite</span>
              </div>
              <div className="hp-compare__header-cell">
                <span className="hp-compare__header-label">Laminate</span>
              </div>
            </div>
            {/* Attribute rows */}
            {comparisonData.map((row, i) => (
              <div className={`hp-compare__row${i % 2 === 0 ? ' hp-compare__row--alt' : ''}`} key={i}>
                <div className="hp-compare__cell hp-compare__cell--attr">
                  {row.attribute}
                </div>
                <div className="hp-compare__cell hp-compare__cell--quartz">
                  {renderIcon(row.quartz.icon)}
                  <span className="hp-compare__cell-text">{row.quartz.text}</span>
                </div>
                <div className="hp-compare__cell">
                  {renderIcon(row.granite.icon)}
                  <span className="hp-compare__cell-text">{row.granite.text}</span>
                </div>
                <div className="hp-compare__cell">
                  {renderIcon(row.laminate.icon)}
                  <span className="hp-compare__cell-text">{row.laminate.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ═══════════════════════════════════════
          5. VERTICAL TIMELINE STEPS
          ═══════════════════════════════════════ */}
      <AnimatedSection className="section section--cream hp-steps" id="how-it-works">
        <div className="container">
          <h2 className="section-title">Four Simple Steps to Your Dream Kitchen</h2>
          <div className="hp-steps__timeline">
            {stepsData.map((step, i) => (
              <div className={`hp-steps__item ${i % 2 === 0 ? 'hp-steps__item--left' : 'hp-steps__item--right'}`} key={i}>
                <div className="hp-steps__content">
                  <div className="hp-steps__number">{step.num}</div>
                  <h3 className="hp-steps__title">{step.title}</h3>
                  <p className="hp-steps__desc">{step.desc}</p>
                </div>
                <div className="hp-steps__marker" />
              </div>
            ))}
          </div>
          <div className="hp-steps__cta">
            <Link to="/quote" className="btn btn--gold btn--lg">
              Start Your Journey
            </Link>
          </div>
        </div>
      </AnimatedSection>

      {/* ═══════════════════════════════════════
          6. WHY CHOOSE (2-column editorial)
          ═══════════════════════════════════════ */}
      <AnimatedSection className="section hp-why" id="why-choose">
        <div className="container">
          <div className="hp-why__layout">
            <div className="hp-why__intro">
              <h2 className="hp-why__heading">Why Choose The Quartz Company</h2>
              <p className="hp-why__intro-text">
                We combine premium materials, expert craftsmanship and personal service to deliver worktops that transform your kitchen. Here&rsquo;s what sets us apart.
              </p>
            </div>
            <div className="hp-why__features">
              {whyChooseData.map((card, i) => (
                <div className="hp-why__feature" key={i}>
                  <div className="hp-why__icon">{card.icon}</div>
                  <div className="hp-why__feature-text">
                    <h3 className="hp-why__feature-title">{card.title}</h3>
                    <p className="hp-why__feature-desc">{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* ═══════════════════════════════════════
          7. INSTAGRAM MOSAIC
          ═══════════════════════════════════════ */}
      <AnimatedSection className="section section--cream hp-insta" id="gallery">
        <div className="container">
          <h2 className="section-title">Get Inspired &mdash; @TheQuartzCompany</h2>
          <div className="hp-insta__mosaic">
            {instaGradients.map((gradient, i) => (
              <Link
                to="/inspiration"
                className={`hp-insta__item ${i === 0 ? 'hp-insta__item--featured' : ''}`}
                key={i}
                aria-label={`Instagram inspiration ${i + 1}`}
              >
                <div className="hp-insta__image" style={{ background: gradient }} />
                <div className="hp-insta__overlay">
                  <span className="hp-insta__overlay-text">View on Instagram</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ═══════════════════════════════════════
          8. FAQ (two-column split)
          ═══════════════════════════════════════ */}
      <AnimatedSection className="section hp-faq" id="faq">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="hp-faq__columns">
            {faqData.map((faq, i) => (
              <div className={`hp-faq__item ${openFaq === i ? 'hp-faq__item--open' : ''}`} key={i}>
                <button
                  className="hp-faq__question"
                  onClick={() => toggleFaq(i)}
                  aria-expanded={openFaq === i}
                  aria-controls={`faq-answer-${i}`}
                >
                  <span className="hp-faq__question-text">{faq.q}</span>
                  <span className="hp-faq__toggle" aria-hidden="true">
                    {openFaq === i ? '\u2212' : '+'}
                  </span>
                </button>
                <div id={`faq-answer-${i}`} className="hp-faq__answer" role="region">
                  <div className="hp-faq__answer-inner">
                    <p>{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ═══════════════════════════════════════
          9. SPLIT CTA BANNER
          ═══════════════════════════════════════ */}
      <section className="hp-cta-banner">
        <div className="hp-cta-banner__left">
          <div className="hp-cta-banner__content">
            <h2 className="hp-cta-banner__title">
              Ready to Transform Your Kitchen?
            </h2>
            <p className="hp-cta-banner__text">
              Get a free, no-obligation quote and we&rsquo;ll post you free samples
              of your favourite colours
            </p>
            <div className="hp-cta-banner__buttons">
              <Link to="/quote" className="btn btn--gold btn--lg">
                Get Free Quote
              </Link>
              <a href="tel:+447375303416" className="btn btn--lg hp-cta-banner__btn--outline">
                Call Us: 07375 303 416
              </a>
            </div>
          </div>
        </div>
        <div className="hp-cta-banner__right" />
      </section>
    </div>
  );
}
