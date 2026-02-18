import React from 'react';
import { Link } from 'react-router-dom';
import products from '../data/products.json';
import ProductCard from '../components/ProductCard';
import './SalePage.css';

const offers = [
  {
    id: 1,
    badge: 'Up to 35% Off',
    title: 'Up to 35% Off Quartz Worktops',
    description:
      'Our entire quartz collection is reduced this spring. From classic whites to bold statement colours, find your perfect surface at an exceptional price. Engineered for durability, designed for beauty.',
    link: '/colours/quartz',
    linkText: 'Shop Quartz',
  },
  {
    id: 2,
    badge: '20% Off',
    title: '20% Off Premium Quartz Collection',
    description:
      'Discover the timeless beauty of premium engineered quartz at 20% off. Each surface is expertly crafted and ready to bring character and prestige to your kitchen.',
    link: '/colours/quartz',
    linkText: 'Shop Premium Quartz',
  },
  {
    id: 3,
    badge: 'Free Gift',
    title: 'Free Undermount Sink',
    description:
      'Place any worktop order over \u00a32,000 and receive a premium stainless steel undermount sink completely free. A seamless addition worth up to \u00a3450 — on us.',
    link: null,
    linkText: null,
  },
  {
    id: 4,
    badge: '10% Off',
    title: '10% Off Accessories',
    description:
      'Complete your kitchen with matching upstands, splashbacks and window cills at 10% off. Coordinated finishes for a polished, professional result throughout your space.',
    link: '/design-options',
    linkText: 'View Accessories',
  },
];

export default function SalePage() {
  const saleProducts = products.filter((p) => p.onSale);

  return (
    <div className="sale-page">
      {/* ── Hero ── */}
      <section className="sale-hero">
        <div className="container">
          <span className="sale-hero__badge">Limited Time</span>
          <h1 className="sale-hero__title">
            Spring Sale &mdash; Up to <span className="sale-hero__highlight">35% Off</span>
          </h1>
          <p className="sale-hero__subtitle">
            Premium kitchen worktops at exceptional prices. Transform your kitchen for less this spring.
          </p>
          <div className="sale-hero__countdown">
            <span className="sale-hero__countdown-label">Offer ends 30th April 2025</span>
          </div>
        </div>
      </section>

      {/* ── Current Offers ── */}
      <section className="section sale-offers-section">
        <div className="container">
          <h2 className="section-title">Current Offers</h2>
          <p className="section-subtitle">
            Exclusive spring savings across our entire range
          </p>
          <div className="sale-offers-grid">
            {offers.map((offer) => (
              <div key={offer.id} className="sale-offer-card">
                <div className="sale-offer-card__accent" aria-hidden="true" />
                <span className="sale-offer-card__badge">{offer.badge}</span>
                <h3 className="sale-offer-card__title">{offer.title}</h3>
                <p className="sale-offer-card__desc">{offer.description}</p>
                {offer.link && (
                  <Link to={offer.link} className="sale-offer-card__link">
                    {offer.linkText} &rarr;
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Sale Products ── */}
      <section className="section section--cream sale-products-section">
        <div className="container">
          <h2 className="section-title">Featured Sale Products</h2>
          <p className="section-subtitle">
            Hand-picked worktops at their lowest ever prices
          </p>
          <div className="grid grid--3 sale-products-grid">
            {saleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section sale-cta-section">
        <div className="container sale-cta">
          <h2>Don&rsquo;t Miss Out</h2>
          <p>
            Our spring sale prices are available for a limited time only. Get a
            personalised quote today and lock in your savings.
          </p>
          <Link to="/quote" className="btn btn--gold btn--lg">
            Get Your Sale Quote
          </Link>
        </div>
      </section>

      {/* ── Terms ── */}
      <section className="sale-terms">
        <div className="container">
          <h4 className="sale-terms__heading">Terms &amp; Conditions</h4>
          <ul className="sale-terms__list">
            <li>
              Sale prices apply to new orders placed between 1st March 2025 and
              30th April 2025 inclusive.
            </li>
            <li>
              Discounts are calculated from the standard retail price and cannot
              be combined with other promotions, voucher codes or trade pricing.
            </li>
            <li>
              Free undermount sink offer applies to orders with a total value of
              &pound;2,000 or more before VAT. Sink model at The Quartz Company's
              discretion.
            </li>
            <li>
              10% accessories discount applies to upstands, splashbacks and
              window cills ordered alongside a worktop purchase.
            </li>
            <li>
              All prices include VAT at the current rate. Installation and
              templating are charged separately unless otherwise stated.
            </li>
            <li>
              The Quartz Company reserves the right to withdraw or amend any offer
              at any time without prior notice.
            </li>
            <li>
              Offers are subject to availability. Some colours and finishes may
              have limited stock during the sale period.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
