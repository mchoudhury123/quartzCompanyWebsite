import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import products from '../data/products.json';
import ProductCard from '../components/ProductCard';
import './MaterialPage.css';

/* ── Material-specific content ── */
const materialData = {
  quartz: {
    name: 'Quartz',
    heroTitle: 'Quartz Worktops',
    heroSubtitle: 'Engineered for beauty, built for life',
    introduction:
      'Quartz worktops combine the timeless beauty of natural stone with the superior performance of modern engineering. Composed of approximately 93% natural quartz bound with polymer resins, these surfaces deliver consistent colour and pattern across every slab whilst being virtually maintenance-free. Unlike natural stone, engineered quartz is non-porous, meaning it resists stains, bacteria and scratches without the need for sealing. Whether you favour a classic marble-inspired veining or a bold contemporary colour, our quartz collection offers the widest choice for discerning homeowners who refuse to compromise on either aesthetics or practicality.',
    benefits: [
      {
        title: 'Non-Porous Surface',
        description:
          'Engineered quartz has zero porosity, making it highly resistant to stains, bacteria and mould. No sealing required — ever.',
      },
      {
        title: 'Consistent Patterns',
        description:
          'Unlike natural stone, quartz delivers predictable veining and colour. What you see in our showroom is exactly what you get at home.',
      },
      {
        title: 'Scratch & Impact Resistant',
        description:
          'Rated 7 on the Mohs hardness scale, quartz worktops withstand the rigours of daily kitchen use without chipping or scratching.',
      },
      {
        title: 'Low Maintenance',
        description:
          'Simply wipe clean with warm soapy water. No annual sealing, no specialist cleaners, no fuss — just effortless beauty.',
      },
    ],
    faqs: [
      {
        question: 'Is quartz heat resistant?',
        answer:
          'Quartz worktops can withstand brief contact with moderately hot items, but we recommend always using trivets or heat pads for pans directly from the hob or oven. Prolonged exposure to temperatures above 150\u00b0C may cause thermal shock and discolouration.',
      },
      {
        question: 'Can I cut directly on quartz?',
        answer:
          'While quartz is extremely scratch resistant, we recommend using a chopping board to protect both your worktop and your knives. Direct cutting will not damage the surface easily, but it can dull your blades.',
      },
      {
        question: 'How does quartz compare to marble?',
        answer:
          'Quartz offers the elegant look of marble without the maintenance concerns. Natural marble is porous and prone to etching from acidic substances, whereas quartz is non-porous and acid resistant. Quartz is ideal for busy family kitchens where practicality matters.',
      },
      {
        question: 'What warranty do you offer on quartz worktops?',
        answer:
          'All our quartz worktops come with a comprehensive manufacturer warranty of up to 25 years, covering manufacturing defects in colour, finish and structural integrity. Our installation workmanship carries its own separate guarantee.',
      },
    ],
  },
  'printed-quartz': {
    name: 'Full Body Printed Quartz',
    heroTitle: 'Full Body Printed Quartz Worktops',
    heroSubtitle: 'Through-body beauty — pattern that runs deeper than the surface',
    introduction:
      'Full body printed quartz is the next evolution in engineered stone technology. Unlike conventional quartz where the pattern exists only on the surface, full body printed quartz features a design that penetrates the entire thickness of the slab. This means every mitre joint, waterfall edge and sink cut-out reveals the same beautiful veining and colour — delivering a level of realism and continuity that was previously only possible with natural stone. Our printed quartz collection combines cutting-edge digital printing with premium quartz composition to create surfaces that are as practical as they are breathtaking.',
    benefits: [
      {
        title: 'Through-Body Pattern',
        description:
          'The design runs through the full depth of the slab, so edges, mitres and cut-outs display the same pattern as the surface — no visible white core.',
      },
      {
        title: 'Ultra-Realistic Veining',
        description:
          'Advanced digital printing technology reproduces the depth, movement and organic variation of natural marble with stunning accuracy.',
      },
      {
        title: 'Seamless Edge Continuity',
        description:
          'Waterfall edges, bookmatched islands and mitred returns look flawless because the pattern flows uninterrupted from surface to edge.',
      },
      {
        title: 'All the Benefits of Quartz',
        description:
          'Non-porous, scratch resistant, no sealing required. Full body printed quartz offers the same practical performance as standard engineered quartz.',
      },
    ],
    faqs: [
      {
        question: 'What does "full body" mean in printed quartz?',
        answer:
          'Full body means the printed pattern extends through the entire thickness of the slab, not just the top surface. Standard engineered quartz typically has a uniform core beneath the patterned surface, which becomes visible on exposed edges. With full body printed quartz, every edge and cut reveals the same design as the top.',
      },
      {
        question: 'Is full body printed quartz more expensive than standard quartz?',
        answer:
          'Yes, full body printed quartz sits at a premium over standard engineered quartz due to the advanced printing technology involved. However, it is still typically more affordable than comparable natural stone, and the maintenance savings over the lifetime of the worktop make it exceptional value.',
      },
      {
        question: 'Can I have waterfall edges with printed quartz?',
        answer:
          'Absolutely — this is where full body printed quartz truly excels. Because the pattern runs through the slab, waterfall edges and mitred returns display continuous veining from the surface down to the floor, creating a stunning seamless effect that is impossible with standard quartz.',
      },
      {
        question: 'How durable is full body printed quartz compared to standard quartz?',
        answer:
          'Full body printed quartz offers the same exceptional durability as standard engineered quartz. It is non-porous, scratch resistant, heat resistant up to 150\u00b0C, and requires no sealing. The printing process does not compromise the structural integrity or performance of the surface.',
      },
    ],
  },
};

export default function MaterialPage() {
  const { type } = useParams();
  const [openFaq, setOpenFaq] = useState(null);

  const material = materialData[type];

  const filteredProducts = useMemo(() => {
    if (!type) return [];
    return products.filter(
      (p) => p.category.toLowerCase() === type.toLowerCase()
    );
  }, [type]);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  if (!material) {
    return (
      <div className="material-page">
        <section className="section">
          <div className="container" style={{ textAlign: 'center' }}>
            <h1>Material Not Found</h1>
            <p style={{ color: 'var(--color-text-light)', marginBottom: '1.5rem' }}>
              Sorry, we do not have information for that material type.
            </p>
            <Link to="/colours" className="btn btn--primary">
              Browse All Worktops
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="material-page">
      {/* ── Hero ── */}
      <section className={`material-hero material-hero--${type}`}>
        <div className="container">
          <h1 className="material-hero__title">{material.heroTitle}</h1>
          <p className="material-hero__subtitle">{material.heroSubtitle}</p>
        </div>
      </section>

      {/* ── Introduction ── */}
      <section className="section material-intro-section">
        <div className="container">
          <div className="material-intro">
            <h2 className="material-intro__heading">
              Why Choose {material.name}?
            </h2>
            <p className="material-intro__text">{material.introduction}</p>
          </div>
        </div>
      </section>

      {/* ── Key Benefits ── */}
      <section className="section section--cream material-benefits-section">
        <div className="container">
          <h2 className="section-title">Key Benefits</h2>
          <p className="section-subtitle">
            What makes {material.name.toLowerCase()} a premium choice for your kitchen
          </p>
          <div className="material-benefits-grid">
            {material.benefits.map((benefit, index) => (
              <div key={index} className="material-benefit-card">
                <div className="material-benefit-card__number">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <h3 className="material-benefit-card__title">
                  {benefit.title}
                </h3>
                <p className="material-benefit-card__desc">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Product Range ── */}
      <section className="section material-range-section">
        <div className="container">
          <h2 className="section-title">Our {material.name} Range</h2>
          <p className="section-subtitle">
            Explore our curated selection of {material.name.toLowerCase()} worktops
          </p>
          {filteredProducts.length > 0 ? (
            <div className="grid grid--3 material-products-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="material-range-empty">
              <p>
                No {material.name.toLowerCase()} products are currently available.
                Please check back soon or{' '}
                <Link to="/contact">contact us</Link> for bespoke options.
              </p>
            </div>
          )}
          <div className="material-range-cta">
            <Link to="/colours" className="btn btn--outline">
              Explore Our Full {material.name} Collection
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section section--cream material-faq-section">
        <div className="container">
          <h2 className="section-title">{material.name} FAQs</h2>
          <p className="section-subtitle">
            Common questions about {material.name.toLowerCase()} worktops
          </p>
          <div className="material-faq">
            {material.faqs.map((item, index) => (
              <div
                key={index}
                className={`material-faq__item${
                  openFaq === index ? ' material-faq__item--open' : ''
                }`}
              >
                <button
                  className="material-faq__question"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={openFaq === index}
                >
                  <span>{item.question}</span>
                  <span className="material-faq__icon" aria-hidden="true">
                    {openFaq === index ? '\u2212' : '+'}
                  </span>
                </button>
                <div className="material-faq__answer">
                  <p>{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section material-cta-section">
        <div className="container material-cta">
          <h2>Ready to Transform Your Kitchen?</h2>
          <p>
            Whether you know exactly what you want or need expert guidance, our
            team is here to help you find the perfect {material.name.toLowerCase()} worktop.
          </p>
          <div className="material-cta__buttons">
            <Link to={`/colours/${type}`} className="btn btn--outline btn--lg">
              Explore the {material.name} Collection
            </Link>
            <Link to="/contact" className="btn btn--primary btn--lg">
              Get a Free Quote
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
