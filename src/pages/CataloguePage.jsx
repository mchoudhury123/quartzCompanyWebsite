import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import products from '../data/products.json';
import categories from '../data/categories.json';
import './CataloguePage.css';

/* ── Promotional tiles that appear every 4th position ── */
const PROMO_TILES = [
  {
    id: 'promo-1',
    headline: 'Free Design Consultation',
    cta: 'Book Now',
    link: '/contact',
    variant: 'teal',
  },
  {
    id: 'promo-2',
    headline: 'Order Free Samples',
    cta: 'Delivered in 48hrs',
    link: '/colours',
    variant: 'gold',
  },
  {
    id: 'promo-3',
    headline: '25 Year Warranty',
    cta: 'Peace of Mind',
    link: '/warranty',
    variant: 'teal',
  },
];

/* ── Filter constants ── */
const COLOUR_TONES = ['White', 'Grey', 'Black', 'Beige', 'Cream', 'Green'];
const PATTERN_TYPES = ['Veined', 'Speckled', 'Plain', 'Concrete', 'Fine-grain'];
const BRANDS = ['The Quartz Company'];

const SORT_OPTIONS = [
  { value: 'popular', label: 'Popular' },
  { value: 'price-asc', label: 'Price Low–High' },
  { value: 'price-desc', label: 'Price High–Low' },
  { value: 'rating', label: 'Rating' },
  { value: 'newest', label: 'Newest' },
];

function CataloguePage() {
  const { category } = useParams();
  const navigate = useNavigate();

  /* ── State ── */
  const [activeCategory, setActiveCategory] = useState(category || 'all');
  const [sortBy, setSortBy] = useState('popular');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [colourFilters, setColourFilters] = useState([]);
  const [patternFilters, setPatternFilters] = useState([]);
  const [brandFilters, setBrandFilters] = useState([]);
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');

  /* Sync URL param to local state */
  useEffect(() => {
    setActiveCategory(category || 'all');
  }, [category]);

  /* ── Category navigation ── */
  const handleCategoryChange = useCallback(
    (slug) => {
      setActiveCategory(slug);
      if (slug === 'all') {
        navigate('/colours');
      } else {
        navigate(`/colours/${slug}`);
      }
    },
    [navigate]
  );

  /* ── Checkbox toggle helpers ── */
  const toggle = (arr, setter, value) => {
    setter(arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]);
  };

  /* ── Clear all filters ── */
  const clearFilters = () => {
    setColourFilters([]);
    setPatternFilters([]);
    setBrandFilters([]);
    setPriceMin('');
    setPriceMax('');
  };

  const hasActiveFilters =
    colourFilters.length > 0 ||
    patternFilters.length > 0 ||
    brandFilters.length > 0 ||
    priceMin !== '' ||
    priceMax !== '';

  /* ── Filtered + sorted products ── */
  const filteredProducts = useMemo(() => {
    let list = [...products];

    /* Category */
    if (activeCategory !== 'all') {
      list = list.filter((p) => p.patternType === activeCategory);
    }

    /* Colour tone */
    if (colourFilters.length > 0) {
      const lower = colourFilters.map((c) => c.toLowerCase());
      list = list.filter((p) => lower.includes(p.colorTone));
    }

    /* Pattern type */
    if (patternFilters.length > 0) {
      const lower = patternFilters.map((pt) => pt.toLowerCase());
      list = list.filter((p) => lower.includes(p.patternType));
    }

    /* Brand */
    if (brandFilters.length > 0) {
      list = list.filter((p) => brandFilters.includes(p.brand));
    }

    /* Price range */
    if (priceMin !== '') {
      list = list.filter((p) => p.pricePerSqm >= Number(priceMin));
    }
    if (priceMax !== '') {
      list = list.filter((p) => p.pricePerSqm <= Number(priceMax));
    }

    /* Sort */
    switch (sortBy) {
      case 'price-asc':
        list.sort((a, b) => a.pricePerSqm - b.pricePerSqm);
        break;
      case 'price-desc':
        list.sort((a, b) => b.pricePerSqm - a.pricePerSqm);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        list.sort((a, b) => (b.new === a.new ? 0 : b.new ? 1 : -1));
        break;
      case 'popular':
      default:
        list.sort((a, b) => (b.popular === a.popular ? b.reviewCount - a.reviewCount : b.popular ? 1 : -1));
        break;
    }

    return list;
  }, [activeCategory, colourFilters, patternFilters, brandFilters, priceMin, priceMax, sortBy]);

  /* ── Build the grid with promo tiles injected every 4th slot ── */
  const gridItems = useMemo(() => {
    const items = [];
    let promoIndex = 0;

    filteredProducts.forEach((product, i) => {
      items.push({ type: 'product', data: product, key: `product-${product.id}` });

      /* After every 4th product, insert a promo tile */
      if ((i + 1) % 4 === 0) {
        const promo = PROMO_TILES[promoIndex % PROMO_TILES.length];
        items.push({ type: 'promo', data: promo, key: promo.id + '-' + promoIndex });
        promoIndex++;
      }
    });

    return items;
  }, [filteredProducts]);

  /* ── Active category object ── */
  const activeCategoryObj = categories.find((c) => c.slug === activeCategory) || categories[0];

  /* ── Breadcrumb label ── */
  const breadcrumbLabel = activeCategory !== 'all' ? activeCategoryObj.name : null;

  /* ── Lock body scroll when mobile filters open ── */
  useEffect(() => {
    if (mobileFiltersOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileFiltersOpen]);

  /* ── Filter sidebar JSX (shared between desktop and mobile) ── */
  const renderFilterContent = () => (
    <div className="catalogue__filter-content">
      {/* Colour Tone */}
      <div className="filter-group">
        <h4 className="filter-group__title">Colour Tone</h4>
        {COLOUR_TONES.map((tone) => (
          <label key={tone} className="filter-group__checkbox">
            <input
              type="checkbox"
              checked={colourFilters.includes(tone)}
              onChange={() => toggle(colourFilters, setColourFilters, tone)}
            />
            <span className="filter-group__checkmark" />
            {tone}
          </label>
        ))}
      </div>

      {/* Pattern Type */}
      <div className="filter-group">
        <h4 className="filter-group__title">Pattern Type</h4>
        {PATTERN_TYPES.map((pattern) => (
          <label key={pattern} className="filter-group__checkbox">
            <input
              type="checkbox"
              checked={patternFilters.includes(pattern)}
              onChange={() => toggle(patternFilters, setPatternFilters, pattern)}
            />
            <span className="filter-group__checkmark" />
            {pattern}
          </label>
        ))}
      </div>

      {/* Price Range */}
      <div className="filter-group">
        <h4 className="filter-group__title">Price Range (/m&sup2;)</h4>
        <div className="filter-group__price-inputs">
          <input
            type="number"
            placeholder="Min"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="filter-group__input"
            min="0"
          />
          <span className="filter-group__separator">&ndash;</span>
          <input
            type="number"
            placeholder="Max"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="filter-group__input"
            min="0"
          />
        </div>
      </div>

      {/* Brand */}
      <div className="filter-group">
        <h4 className="filter-group__title">Brand</h4>
        {BRANDS.map((brand) => (
          <label key={brand} className="filter-group__checkbox">
            <input
              type="checkbox"
              checked={brandFilters.includes(brand)}
              onChange={() => toggle(brandFilters, setBrandFilters, brand)}
            />
            <span className="filter-group__checkmark" />
            {brand}
          </label>
        ))}
      </div>

      {/* Clear */}
      {hasActiveFilters && (
        <button className="catalogue__clear-filters" onClick={clearFilters}>
          Clear Filters
        </button>
      )}
    </div>
  );

  return (
    <section className="catalogue">
      {/* ── Page Header ── */}
      <div className="catalogue__header">
        <div className="container">
          <nav className="catalogue__breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span className="catalogue__breadcrumb-sep">/</span>
            <Link to="/colours">Browse Colours</Link>
            {breadcrumbLabel && (
              <>
                <span className="catalogue__breadcrumb-sep">/</span>
                <span className="catalogue__breadcrumb-current">{breadcrumbLabel}</span>
              </>
            )}
          </nav>
          <h1 className="catalogue__title">
            {activeCategory === 'all' ? 'Browse Our Colours' : activeCategoryObj.name}
          </h1>
          <p className="catalogue__description">{activeCategoryObj.description}</p>
        </div>
      </div>

      {/* ── Category Tabs ── */}
      <div className="catalogue__tabs-wrapper">
        <div className="container">
          <div className="catalogue__tabs" role="tablist">
            {categories.map((cat) => (
              <button
                key={cat.slug}
                role="tab"
                aria-selected={activeCategory === cat.slug}
                className={`catalogue__tab${activeCategory === cat.slug ? ' catalogue__tab--active' : ''}`}
                onClick={() => handleCategoryChange(cat.slug)}
              >
                {cat.slug === 'all' ? 'All' : cat.slug.charAt(0).toUpperCase() + cat.slug.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="container">
        <div className="catalogue__layout">
          {/* Desktop Filter Sidebar */}
          <aside className="catalogue__sidebar" aria-label="Filters">
            <h3 className="catalogue__sidebar-title">Filters</h3>
            {renderFilterContent()}
          </aside>

          {/* Mobile filter overlay */}
          {mobileFiltersOpen && (
            <div className="catalogue__filter-overlay" onClick={() => setMobileFiltersOpen(false)} />
          )}

          {/* Mobile filter panel */}
          <aside
            className={`catalogue__mobile-filters${mobileFiltersOpen ? ' catalogue__mobile-filters--open' : ''}`}
            aria-label="Filters"
          >
            <div className="catalogue__mobile-filters-header">
              <h3>Filters</h3>
              <button
                className="catalogue__mobile-filters-close"
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Close filters"
              >
                &#10005;
              </button>
            </div>
            {renderFilterContent()}
          </aside>

          {/* Products area */}
          <div className="catalogue__content">
            {/* Toolbar */}
            <div className="catalogue__toolbar">
              <button
                className="catalogue__filter-toggle"
                onClick={() => setMobileFiltersOpen(true)}
                aria-label="Open filters"
              >
                <span className="catalogue__filter-icon">&#9776;</span> Filters
                {hasActiveFilters && <span className="catalogue__filter-badge" />}
              </button>

              <p className="catalogue__count">
                Showing <strong>{filteredProducts.length}</strong> of{' '}
                <strong>{activeCategory === 'all' ? products.length : products.filter((p) => p.category === activeCategory).length}</strong>{' '}
                products
              </p>

              <div className="catalogue__sort">
                <label htmlFor="sort-select" className="catalogue__sort-label">
                  Sort by
                </label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="catalogue__sort-select"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="catalogue__empty">
                <p>No products match your current filters.</p>
                <button className="btn btn--primary" onClick={clearFilters}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="catalogue__grid">
                {gridItems.map((item) => {
                  if (item.type === 'promo') {
                    return (
                      <Link
                        to={item.data.link}
                        className={`promo-tile promo-tile--${item.data.variant}`}
                        key={item.key}
                      >
                        <div className="promo-tile__content">
                          <span className="promo-tile__icon" aria-hidden="true">
                            {item.data.variant === 'teal' ? '\u2666' : '\u2605'}
                          </span>
                          <h3 className="promo-tile__headline">{item.data.headline}</h3>
                          <span className="promo-tile__cta">
                            {item.data.cta} &rarr;
                          </span>
                        </div>
                      </Link>
                    );
                  }
                  return <ProductCard key={item.key} product={item.data} />;
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CataloguePage;
