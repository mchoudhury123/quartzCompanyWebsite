'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import products from '../../src/data/products.json';
import ProductCard from './ProductCard';
import { materialData } from '../_lib/material-data';
import '../../src/pages/MaterialPage.css';

export default function MaterialContent({ type }) {
  const [openFaq, setOpenFaq] = useState(null);
  const material = materialData[type];

  const filteredProducts = useMemo(() => {
    if (!type) return [];
    return products.filter((p) => p.category.toLowerCase() === type.toLowerCase());
  }, [type]);

  if (!material) {
    return (
      <div className="material-page">
        <section className="section">
          <div className="container" style={{ textAlign: 'center' }}>
            <h1>Material Not Found</h1>
            <p style={{ color: 'var(--color-text-light)', marginBottom: '1.5rem' }}>Sorry, we do not have information for that material type.</p>
            <Link href="/colours" className="btn btn--primary">Browse All Worktops</Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="material-page">
      <section className={`material-hero material-hero--${type}`}>
        <div className="material-hero__accent" aria-hidden="true" />
        <div className="container material-hero__inner">
          <h1 className="material-hero__title">{material.heroTitle}</h1>
          <p className="material-hero__subtitle">{material.heroSubtitle}</p>
        </div>
      </section>

      <section className="section material-intro-section">
        <div className="container">
          <div className="material-offset material-offset--left">
            <h2 className="material-offset__heading">Why Choose {material.name}?</h2>
            <p className="material-offset__text">{material.introduction}</p>
          </div>
        </div>
      </section>

      <section className="section section--cream material-benefits-section">
        <div className="container">
          <div className="material-offset material-offset--right">
            <h2 className="material-offset__heading">Key Benefits</h2>
            <p className="material-offset__subtitle">What makes {material.name.toLowerCase()} a premium choice for your kitchen</p>
            <div className="material-benefits-grid">
              {material.benefits.map((benefit, index) => (
                <div key={index} className="material-benefit-card">
                  <div className="material-benefit-card__number">{String(index + 1).padStart(2, '0')}</div>
                  <h3 className="material-benefit-card__title">{benefit.title}</h3>
                  <p className="material-benefit-card__desc">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section material-range-section">
        <div className="container">
          <div className="material-offset material-offset--left">
            <h2 className="material-offset__heading">Our {material.name} Range</h2>
            <p className="material-offset__subtitle">Explore our curated selection of {material.name.toLowerCase()} worktops</p>
          </div>
          {filteredProducts.length > 0 ? (
            <div className="grid grid--3 material-products-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="material-range-empty">
              <p>No {material.name.toLowerCase()} products are currently available. Please check back soon or <Link href="/contact">contact us</Link> for bespoke options.</p>
            </div>
          )}
          <div className="material-range-cta">
            <Link href="/colours" className="btn btn--outline">Explore Our Full {material.name} Collection</Link>
          </div>
        </div>
      </section>

      <section className="section section--cream material-faq-section">
        <div className="container">
          <div className="material-offset material-offset--right">
            <h2 className="material-offset__heading">{material.name} FAQs</h2>
            <p className="material-offset__subtitle">Common questions about {material.name.toLowerCase()} worktops</p>
            <div className="material-faq">
              {material.faqs.map((item, index) => (
                <div key={index} className={`material-faq__item${openFaq === index ? ' material-faq__item--open' : ''}`}>
                  <button className="material-faq__question" onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index}>
                    <span>{item.question}</span>
                    <span className="material-faq__icon" aria-hidden="true">{openFaq === index ? '−' : '+'}</span>
                  </button>
                  <div className="material-faq__answer"><p>{item.answer}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section material-cta-section">
        <div className="container">
          <div className="material-cta__card">
            <h2 className="material-cta__heading">Ready to Transform Your Kitchen?</h2>
            <p className="material-cta__text">Whether you know exactly what you want or need expert guidance, our team is here to help you find the perfect {material.name.toLowerCase()} worktop.</p>
            <div className="material-cta__buttons">
              <Link href={`/colours/${type}`} className="btn btn--outline btn--lg">Explore the {material.name} Collection</Link>
              <Link href="/contact" className="btn btn--gold btn--lg">Get a Free Quote</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
