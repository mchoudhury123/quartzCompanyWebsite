import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import products from '../data/products.json';
import './ProductDetailPage.css';

/* ── Feature icon map (unicode) ── */
const FEATURE_ICONS = [
  '\u2726',  /* four-pointed star   */
  '\u2699',  /* gear / engineering  */
  '\u2714',  /* check mark          */
  '\u2618',  /* shamrock / natural  */
  '\u2605',  /* star                */
];

/* ── Static FAQ builder ── */
function buildFaqs(name) {
  return [
    {
      q: `Is ${name} suitable for kitchens and bathrooms?`,
      a: `Absolutely. ${name} is engineered to perform beautifully in both kitchens and bathrooms. Its non-porous surface is resistant to moisture, bacteria and common household chemicals, making it an ideal choice for any room that combines style with heavy daily use. We recommend our standard edge-profile finish for kitchen islands and a pencil-round edge for bathroom vanity tops.`,
    },
    {
      q: `What is ${name} made from?`,
      a: `${name} is composed of natural minerals bound with advanced polymer resins. This combination produces a surface that retains the beauty and cool touch of natural stone while offering superior strength, consistency and hygiene. Every slab is manufactured under strict quality controls and independently tested to meet European and international safety standards.`,
    },
    {
      q: 'How do I care for this surface?',
      a: 'Day-to-day maintenance is effortless. Simply wipe down with warm, soapy water and a soft cloth. For tougher marks, a non-abrasive cream cleaner works perfectly. Avoid bleach-based products and abrasive pads. We supply a complimentary care kit with every installation that includes a specialist cleaner and microfibre cloth.',
    },
    {
      q: 'What edge profiles are available?',
      a: 'We offer a comprehensive range of edge profiles at no extra charge, including pencil round, bevelled, bullnose, ogee and mitre. Premium profiles such as waterfall and recessed drainer grooves are available at a small additional cost. Your surveyor will bring edge-profile samples to your home visit so you can see and feel each option before deciding.',
    },
    {
      q: 'Can I see this surface before ordering?',
      a: 'Of course. We strongly recommend viewing a physical sample before committing. You can order up to three free samples delivered to your door within 48 hours, or visit our Northampton showroom where full slabs are on display. Our design consultants are available in-showroom to help you pair your surface with cabinetry and splashback options.',
    },
  ];
}

function ProductDetailPage() {
  const { slug } = useParams();
  const product = products.find((p) => p.slug === slug);

  /* ── Image gallery state ── */
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [slabModalOpen, setSlabModalOpen] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({});
  const galleryRef = useRef(null);

  /* ── Tabbed interface state (Specifications / FAQs) ── */
  const [activeTab, setActiveTab] = useState('specs');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  /* ── Thickness selector ── */
  const [thickness, setThickness] = useState('20mm');

  /* ── Related products scroll ── */
  const relatedScrollRef = useRef(null);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 8);
  }, [product]);

  /* ── FAQs ── */
  const faqs = useMemo(() => (product ? buildFaqs(product.name) : []), [product]);

  /* ── Gallery helpers ── */
  const images = product ? product.images : [];

  const goToImage = useCallback(
    (index) => {
      if (index < 0) {
        setActiveImageIndex(images.length - 1);
      } else if (index >= images.length) {
        setActiveImageIndex(0);
      } else {
        setActiveImageIndex(index);
      }
    },
    [images.length]
  );

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomStyle({ transformOrigin: `${x}% ${y}%`, transform: 'scale(1.6)' });
  };

  const handleMouseLeave = () => {
    setZoomStyle({});
  };

  /* ── Related products scroll ── */
  const scrollRelated = (dir) => {
    if (relatedScrollRef.current) {
      const amount = 320;
      relatedScrollRef.current.scrollBy({ left: dir * amount, behavior: 'smooth' });
    }
  };

  /* ── Category label for breadcrumb ── */
  const categoryLabel = product
    ? product.category.charAt(0).toUpperCase() + product.category.slice(1)
    : '';

  /* ── Price helpers ── */
  const formatPrice = (val) =>
    new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);

  /* ── Star rating ── */
  const renderStars = (score) => {
    const full = Math.floor(score);
    const hasHalf = score - full >= 0.5;
    const empty = 5 - full - (hasHalf ? 1 : 0);
    const stars = [];
    for (let i = 0; i < full; i++) {
      stars.push(
        <span key={`f${i}`} className="pdp__star pdp__star--filled" aria-hidden="true">
          &#9733;
        </span>
      );
    }
    if (hasHalf) {
      stars.push(
        <span key="h" className="pdp__star pdp__star--filled" aria-hidden="true">
          &#9733;
        </span>
      );
    }
    for (let i = 0; i < empty; i++) {
      stars.push(
        <span key={`e${i}`} className="pdp__star pdp__star--empty" aria-hidden="true">
          &#9734;
        </span>
      );
    }
    return stars;
  };

  /* ── Image loading state ── */
  const [mainImageLoaded, setMainImageLoaded] = useState(false);

  /* Reset image loaded state when switching images */
  useEffect(() => {
    setMainImageLoaded(false);
  }, [activeImageIndex]);

  /* ── 404 fallback ── */
  if (!product) {
    return (
      <section className="pdp pdp--not-found">
        <div className="container">
          <h1>Product Not Found</h1>
          <p>Sorry, we could not find the surface you were looking for.</p>
          <Link to="/colours" className="btn btn--primary">
            Browse All Colours
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="pdp">
      {/* ── Breadcrumbs ── */}
      <div className="pdp__breadcrumb-bar">
        <div className="container">
          <nav className="pdp__breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span className="pdp__breadcrumb-sep">/</span>
            <Link to="/colours">Browse Colours</Link>
            <span className="pdp__breadcrumb-sep">/</span>
            <Link to={`/colours/${product.category}`}>{categoryLabel}</Link>
            <span className="pdp__breadcrumb-sep">/</span>
            <span className="pdp__breadcrumb-current">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          TOP SECTION – Sticky gallery left, info scrolls right
         ══════════════════════════════════════════ */}
      <div className="container">
        <div className="pdp__top">
          {/* ── Left: Image Gallery (sticky) ── */}
          <div className="pdp__gallery" ref={galleryRef}>
            <div
              className="pdp__main-image"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={images[activeImageIndex]}
                alt={`${product.name} - image ${activeImageIndex + 1}`}
                className={`pdp__main-image-inner${mainImageLoaded ? ' pdp__main-image-inner--loaded' : ''}`}
                style={zoomStyle}
                onLoad={() => setMainImageLoaded(true)}
                decoding="async"
                fetchpriority="high"
              />

              {images.length > 1 && (
                <>
                  <button
                    className="pdp__gallery-arrow pdp__gallery-arrow--prev"
                    onClick={() => goToImage(activeImageIndex - 1)}
                    aria-label="Previous image"
                  >
                    &#8249;
                  </button>
                  <button
                    className="pdp__gallery-arrow pdp__gallery-arrow--next"
                    onClick={() => goToImage(activeImageIndex + 1)}
                    aria-label="Next image"
                  >
                    &#8250;
                  </button>
                </>
              )}
            </div>

            <div className="pdp__thumbnails">
              {images.map((img, i) => (
                <button
                  key={i}
                  className={`pdp__thumb${i === activeImageIndex ? ' pdp__thumb--active' : ''}`}
                  onClick={() => setActiveImageIndex(i)}
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={img} alt={`${product.name} thumbnail ${i + 1}`} className="pdp__thumb-img" loading="lazy" decoding="async" />
                </button>
              ))}
            </div>

            <button
              className="pdp__view-slab-btn"
              onClick={() => setSlabModalOpen(true)}
            >
              &#x26F6; View Full Slab
            </button>
          </div>

          {/* ── Right: Product Info (scrolls) ── */}
          <div className="pdp__info">
            <h1 className="pdp__name">{product.name}</h1>

            <span className="pdp__collection-badge">
              {categoryLabel} Collection &mdash; {product.collection}
            </span>

            <div className="pdp__rating">
              <span className="pdp__stars">{renderStars(product.rating)}</span>
              <span className="pdp__review-count">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            {(product.price20mm || product.price30mm) && (
              <div className="pdp__thickness" role="radiogroup" aria-label="Select thickness">
                <button
                  type="button"
                  role="radio"
                  aria-checked={thickness === '20mm'}
                  className={`pdp__thickness-btn${thickness === '20mm' ? ' pdp__thickness-btn--active' : ''}`}
                  onClick={() => setThickness('20mm')}
                >
                  20mm
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={thickness === '30mm'}
                  className={`pdp__thickness-btn${thickness === '30mm' ? ' pdp__thickness-btn--active' : ''}`}
                  onClick={() => setThickness('30mm')}
                >
                  30mm
                </button>
              </div>
            )}

            <div className="pdp__price-block">
              {(() => {
                const current =
                  thickness === '30mm'
                    ? product.price30mm || product.pricePerSqm
                    : product.price20mm || product.pricePerSqm;
                const ratio = product.pricePerSqm ? current / product.pricePerSqm : 1;
                const original = product.originalPrice ? Math.round(product.originalPrice * ratio) : null;
                return (
                  <>
                    {product.onSale && original && (
                      <span className="pdp__price-original">
                        {formatPrice(original)} /m&sup2;
                      </span>
                    )}
                    <span className="pdp__price-sale">
                      {formatPrice(current)} /m&sup2;
                    </span>
                  </>
                );
              })()}
            </div>

            <p className="pdp__short-desc">{product.shortDesc}</p>

            <Link
              to={`/quote?product=${product.slug}`}
              className="btn btn--gold btn--lg pdp__cta"
            >
              Get Prices &amp; Free Samples
            </Link>

            <div className="pdp__social-proof">
              <div className="pdp__proof-item">
                <span className="pdp__proof-icon" aria-hidden="true">&#9878;</span>
                <span>25yr Warranty</span>
              </div>
              <div className="pdp__proof-item">
                <span className="pdp__proof-icon" aria-hidden="true">&#9742;</span>
                <span>Free Consultation</span>
              </div>
              <div className="pdp__proof-item">
                <span className="pdp__proof-icon" aria-hidden="true">&#9829;</span>
                <span>15,000+ Happy Customers</span>
              </div>
              <div className="pdp__proof-item">
                <span className="pdp__proof-icon" aria-hidden="true">&#9872;</span>
                <span>Local Fitting</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          WHY WE LOVE – Alternating horizontal strips
         ══════════════════════════════════════════ */}
      <div className="pdp__why-section section section--cream">
        <div className="container">
          <h2 className="section-title">Why We Love {product.name}</h2>
          <div className="pdp__features-strips">
            {product.features.map((feature, i) => (
              <div
                className={`pdp__feature-strip${i % 2 === 1 ? ' pdp__feature-strip--alt' : ''}`}
                key={i}
              >
                <div className="pdp__feature-strip-accent" />
                <div className="pdp__feature-strip-content">
                  <span className="pdp__feature-strip-icon" aria-hidden="true">
                    {FEATURE_ICONS[i % FEATURE_ICONS.length]}
                  </span>
                  <div>
                    <h4 className="pdp__feature-strip-title">{feature}</h4>
                    <p className="pdp__feature-strip-desc">
                      {getFeatureDescription(feature)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          TABBED INTERFACE – Specifications | FAQs
         ══════════════════════════════════════════ */}
      <div className="pdp__tabs-section section">
        <div className="container">
          <div className="pdp__tab-bar">
            <button
              className={`pdp__tab-btn${activeTab === 'specs' ? ' pdp__tab-btn--active' : ''}`}
              onClick={() => setActiveTab('specs')}
            >
              Specifications
            </button>
            <button
              className={`pdp__tab-btn${activeTab === 'faqs' ? ' pdp__tab-btn--active' : ''}`}
              onClick={() => setActiveTab('faqs')}
            >
              FAQs
            </button>
          </div>

          {/* Specs tab */}
          {activeTab === 'specs' && (
            <div className="pdp__tab-content">
              <table className="pdp__specs-table">
                <tbody>
                  <tr>
                    <th>Material</th>
                    <td>{product.specifications.material}</td>
                  </tr>
                  <tr>
                    <th>Finish</th>
                    <td>{product.specifications.finish}</td>
                  </tr>
                  <tr>
                    <th>Collection</th>
                    <td>{product.collection}</td>
                  </tr>
                  <tr>
                    <th>Thicknesses</th>
                    <td>{product.specifications.thicknesses.join(', ')}</td>
                  </tr>
                  <tr>
                    <th>Slab Size</th>
                    <td>{product.specifications.slabSize}</td>
                  </tr>
                  <tr>
                    <th>Weight</th>
                    <td>{product.specifications.weight}</td>
                  </tr>
                  <tr>
                    <th>Lead Time</th>
                    <td>{product.specifications.leadTime}</td>
                  </tr>
                </tbody>
              </table>

              <div className="pdp__specs-links">
                <Link to="/design-options" className="pdp__specs-link">
                  Design Options &rarr;
                </Link>
                <Link to="/measuring-guide" className="pdp__specs-link">
                  Measuring Guide &rarr;
                </Link>
                <Link to="/how-to-buy" className="pdp__specs-link">
                  How to Buy &rarr;
                </Link>
              </div>
            </div>
          )}

          {/* FAQs tab */}
          {activeTab === 'faqs' && (
            <div className="pdp__tab-content">
              <div className="pdp__faq-list">
                {faqs.map((faq, i) => (
                  <div
                    className={`pdp__faq-item${openFaqIndex === i ? ' pdp__faq-item--open' : ''}`}
                    key={i}
                  >
                    <button
                      className="pdp__faq-question"
                      onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                      aria-expanded={openFaqIndex === i}
                    >
                      <span>{faq.q}</span>
                      <span className="pdp__faq-icon" aria-hidden="true">
                        {openFaqIndex === i ? '\u2212' : '\u002B'}
                      </span>
                    </button>
                    <div className={`pdp__faq-answer${openFaqIndex === i ? ' pdp__faq-answer--open' : ''}`}>
                      <p>{faq.a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          RELATED PRODUCTS – Horizontal scroll carousel
         ══════════════════════════════════════════ */}
      {relatedProducts.length > 0 && (
        <div className="pdp__related section section--cream">
          <div className="container">
            <div className="pdp__related-header">
              <div>
                <h2 className="section-title" style={{ marginBottom: 0 }}>You Might Also Like</h2>
                <p className="section-subtitle" style={{ marginTop: '0.5rem' }}>
                  Explore more surfaces from the {categoryLabel} collection.
                </p>
              </div>
              <div className="pdp__related-nav">
                <button
                  className="pdp__related-arrow"
                  onClick={() => scrollRelated(-1)}
                  aria-label="Scroll left"
                >
                  &#8249;
                </button>
                <button
                  className="pdp__related-arrow"
                  onClick={() => scrollRelated(1)}
                  aria-label="Scroll right"
                >
                  &#8250;
                </button>
              </div>
            </div>
            <div className="pdp__related-scroll" ref={relatedScrollRef}>
              {relatedProducts.map((p) => (
                <div className="pdp__related-card" key={p.id}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          FULL SLAB MODAL
         ══════════════════════════════════════════ */}
      {slabModalOpen && (
        <div className="pdp__slab-modal" onClick={() => setSlabModalOpen(false)}>
          <div
            className="pdp__slab-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="pdp__slab-modal-close"
              onClick={() => setSlabModalOpen(false)}
              aria-label="Close full slab view"
            >
              &#10005;
            </button>
            <div className="pdp__slab-modal-image">
              <img
                src={product.fullSlabImage || images[images.length - 1]}
                alt={`${product.name} \u2014 Full Slab View`}
                className="pdp__slab-modal-img"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ── Feature description generator ── */
function getFeatureDescription(featureTitle) {
  const descriptions = {
    'Authentic natural appearance':
      'Every surface captures the organic beauty of natural stone, with patterns that feel genuine and never repetitive.',
    'Customisable edge profiles':
      'Choose from over ten edge profiles, from sleek pencil-round to ornate ogee, all crafted to your specification.',
    'Scratch & stain resistant':
      'Engineered to withstand the demands of a busy kitchen without showing scratches, stains or watermarks.',
    'Easy daily maintenance':
      'A quick wipe with warm soapy water is all it takes to keep your surface looking pristine, day after day.',
    'NSF certified hygienic':
      'Independently certified to meet stringent hygiene standards, making it safe for food preparation areas.',
    'Dramatic veining pattern':
      'Bold, sweeping veins create a gallery-worthy focal point that draws the eye and elevates any kitchen design.',
    'Heat resistant up to 150\u00B0C':
      'Place hot pans briefly without worry. The surface resists heat damage up to 150\u00B0C for everyday confidence.',
    'Non-porous surface':
      'Zero porosity means liquids, bacteria and odours cannot penetrate the surface, keeping your kitchen hygienic.',
    'UV stable colouring':
      'Advanced pigment technology ensures colours remain true and vibrant, even in sun-drenched kitchens.',
    'Lifetime manufacturer warranty':
      'We stand behind our surfaces with a comprehensive lifetime warranty, giving you lasting peace of mind.',
    'Rich, deep colour saturation':
      'Intense pigments create a depth of colour that adds drama and sophistication to contemporary interiors.',
    'Metallic particle detail':
      'Subtle metallic flecks catch the light from every angle, adding a layer of theatrical elegance.',
    'Fingerprint resistant finish':
      'A specially treated finish minimises visible fingerprints, keeping dark surfaces looking immaculate.',
    'Impact resistant core':
      'Reinforced composition absorbs everyday knocks and impacts without chipping or cracking.',
    '10-year stain warranty':
      'Our 10-year stain warranty guarantees your surface will resist permanent discolouration from everyday spills.',
    'Warm, neutral palette':
      'Soft, earthy tones that complement any cabinetry style, from rustic farmhouse to sleek handleless.',
    'Versatile design pairing':
      'A chameleon surface that adapts to countless design schemes, making it a safe yet stylish choice.',
    'Chip resistant surface':
      'Durable engineering ensures edges and corners resist chipping, even in high-traffic kitchen environments.',
    'Seamless joint capability':
      'Precision cutting and colour-matched adhesives create virtually invisible joins for a flowing surface.',
    'Food-safe certified':
      'Certified for direct food contact, so you can prep and serve with confidence on a surface that meets the highest safety standards.',
    'Industrial aesthetic':
      'Captures the raw, tactile beauty of polished concrete without any of the practical drawbacks.',
    'Concrete-effect texture':
      'A honed matte finish creates an authentic cement-like texture that architects and designers love.',
    'Zero porosity':
      'Nothing gets in. The completely non-porous surface repels liquids, bacteria and staining agents.',
    'Thermal shock resistant':
      'Engineered to handle sudden temperature changes without cracking or surface damage.',
    '25-year surface warranty':
      'Our quarter-century warranty reflects our confidence in the lasting performance of this surface.',
    'Classic marble aesthetic':
      'Captures the timeless elegance of genuine marble while delivering the practicality of engineered quartz.',
    'Consistent veining':
      'Unlike natural marble, our veining pattern is consistent slab to slab, eliminating colour-matching headaches.',
    'Acid & etch resistant':
      'Where natural marble etches from lemon juice and vinegar, this surface laughs in the face of acidic spills.',
    'Low maintenance':
      'No sealing, no special products, no fuss. Just wipe clean and enjoy a surface that stays beautiful effortlessly.',
    'Greenguard Gold certified':
      'Meets the world\'s most rigorous standards for low chemical emissions, contributing to healthier indoor air quality.',
    '100% natural stone':
      'Quarried directly from the earth, each slab carries millions of years of geological history in its veins.',
    'Unique slab variation':
      'No two slabs are identical. Each installation is a genuine one-of-a-kind work of natural art.',
    'Professional sealing included':
      'Every slab is sealed in our workshop using premium impregnating sealers for lasting stain protection.',
    'Heat proof surface':
      'Natural granite is forged in volcanic heat. Hot pans and dishes pose no threat whatsoever to this surface.',
    'Timeless investment piece':
      'Natural stone appreciates in character over time, making it both a practical and an investment choice.',
    'Rare premium marble':
      'Sourced from carefully selected quarries, this marble represents the very finest that nature has to offer.',
    'Hand-selected slabs':
      'Our stone buyers personally inspect and hand-pick every block, ensuring only the most beautiful slabs reach your home.',
    'Professional sealing & finishing':
      'Each slab is sealed, polished and finished by our master craftsmen to meet the demands of modern living.',
    'Unique natural beauty':
      'Every vein, every tonal shift is nature\'s own brushstroke, creating a surface of extraordinary depth and character.',
    'Certificate of authenticity':
      'Each slab comes with a certificate of authenticity documenting its origin, grade and individual characteristics.',
    'Warm grey tone':
      'A sophisticated mid-grey with warm undertones that brings depth and character to any kitchen design.',
    'Bold veining character':
      'Broad, sweeping veins create dramatic visual interest that makes every kitchen island a focal point.',
    'Bookmatching available':
      'Adjacent slabs can be mirror-matched to create a stunning symmetrical veining effect on large surfaces.',
    'Impact resistant':
      'Engineered for strength and resilience, standing up to the everyday demands of busy family kitchens.',
    '15-year warranty':
      'Our 15-year warranty reflects our confidence in the lasting quality and performance of this surface.',
    'Bold statement colour':
      'A daring choice for the design-confident, bringing nature\'s most luxurious colour palette into your kitchen.',
    'Nature-inspired palette':
      'Deep emerald tones channel the lush richness of malachite and tropical foliage for a truly distinctive surface.',
    'UV colour stability':
      'Advanced colour technology ensures this bold surface maintains its vibrancy, even in brightly lit spaces.',
    'Seamless joint technology':
      'Precision-engineered joints and colour-matched adhesives create a flowing, uninterrupted surface.',
    'Stain proof guarantee':
      'We guarantee this surface against permanent staining from any household substance, giving you total confidence.',
    'Natural mineral character':
      'Delicate natural mineral inclusions create subtle sparkle and depth that synthetic surfaces cannot replicate.',
    'Exceptional hardness':
      'Granite ranks 6-7 on the Mohs hardness scale, making it one of the most durable kitchen surfaces available.',
    'Heat proof to any temperature':
      'Formed in extreme geological heat, granite is impervious to any temperature your kitchen can produce.',
    'Sealed for stain protection':
      'Professional-grade impregnating sealers protect against oil, wine and everyday spills for years to come.',
    'Unique slab individuality':
      'Each slab tells its own geological story, with mineral patterns and tonal variations that are uniquely yours.',
    'Bright, clean white':
      'A luminous, pure white that maximises light reflection and makes even compact kitchens feel spacious.',
    'Uniform particle structure':
      'Fine, consistent particles create a clean, modern aesthetic that pairs with every design style.',
    'Budget-friendly option':
      'Premium quality at an accessible price point, making engineered quartz available to every homeowner.',
    'Highly durable':
      'Built to last through decades of daily use without losing its beauty or structural integrity.',
    'Easy to clean':
      'Non-porous and smooth, the surface wipes clean in seconds with just warm water and a soft cloth.',
  };

  return (
    descriptions[featureTitle] ||
    'This premium feature ensures your worktop delivers exceptional performance and lasting beauty for years to come.'
  );
}

export default ProductDetailPage;
