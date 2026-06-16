import React from 'react';
import { Link } from 'react-router-dom';
import usePageMeta from '../hooks/usePageMeta';
import products from '../data/products.json';
import ColourCard from '../components/ColourCard';
import './SalePage.css';

const offers = [
  {
    id: 1,
    badge: '40% Off',
    title: '40% Off All Worktops',
    description:
      'As part of our summer sale, every worktop in our collection is 40% off. From classic whites to bold statement colours, find your perfect surface at an exceptional price — engineered for durability, designed for beauty.',
    link: '/colours',
    linkText: 'Shop All Worktops',
  },
];

export default function SalePage() {
  usePageMeta('Summer Sale — 40% Off All Quartz Worktops | The Quartz Company', 'Our summer sale is on — 40% off every engineered and printed quartz kitchen worktop. Premium surfaces at exceptional prices, with free samples and fixed-price quotes.');
  const saleProducts = products.filter((p) => p.onSale);

  return (
    <div className="sale-page">
      {/* ── Hero ── */}
      <section className="sale-hero">
        <div className="container">
          <div className="sale-hero__grid">
            <div className="sale-hero__left">
              <span className="sale-hero__badge">Limited Time</span>
              <h1 className="sale-hero__title">
                Summer Sale &mdash; <span className="sale-hero__highlight">40% Off</span> All Worktops
              </h1>
              <p className="sale-hero__subtitle">
                As part of our summer sale, every worktop in our collection is 40% off &mdash; transform your kitchen for less.
              </p>
            </div>
            <div className="sale-hero__right">
              <div className="sale-hero__countdown">
                <span className="sale-hero__countdown-label">Summer Sale</span>
                <span className="sale-hero__countdown-date">Now On</span>
                <span className="sale-hero__countdown-note">Limited time only &mdash; don&rsquo;t miss out</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Current Offers ── */}
      <section className="section sale-offers">
        <div className="container">
          <h2 className="section-title">Current Offers</h2>
          <p className="section-subtitle">
            Celebrating our summer sale
          </p>
          <div className="sale-offers__list">
            {offers.map((offer) => (
              <div key={offer.id} className="sale-offer-strip">
                <div className="sale-offer-strip__badge-col">
                  <span className="sale-offer-strip__badge">{offer.badge}</span>
                </div>
                <div className="sale-offer-strip__body">
                  <h3 className="sale-offer-strip__title">{offer.title}</h3>
                  <p className="sale-offer-strip__desc">{offer.description}</p>
                </div>
                <div className="sale-offer-strip__cta-col">
                  {offer.link && (
                    <Link to={offer.link} className="sale-offer-strip__link">
                      {offer.linkText} &rarr;
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Sale Products ── */}
      <section className="section section--cream sale-products">
        <div className="container">
          <h2 className="section-title">Featured Sale Products</h2>
          <p className="section-subtitle">
            Hand-picked worktops at their lowest ever prices
          </p>
          <div className="sale-products__grid">
            {saleProducts.map((product) => (
              <ColourCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section sale-cta">
        <div className="container sale-cta__inner">
          <h2>Don&rsquo;t Miss Out</h2>
          <p>
            Our summer sale prices are available for a limited time only. Get a
            personalised quote today and lock in your 40% saving.
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
              Sale prices apply to new orders placed during the summer sale
              promotional period.
            </li>
            <li>
              The 40% discount is calculated from the standard retail price and
              cannot be combined with other promotions, voucher codes or trade
              pricing.
            </li>
            <li>
              All prices include VAT at the current rate. Installation and
              templating are charged separately unless otherwise stated.
            </li>
            <li>
              The Quartz Company reserves the right to withdraw or amend this offer
              at any time without prior notice.
            </li>
            <li>
              This offer is subject to availability. Some colours and finishes may
              have limited stock during the promotional period.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
