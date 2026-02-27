import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import products from '../data/products.json';
import categories from '../data/categories.json';
import './CataloguePage.css';

/* ── Promotional banners that appear every 8th position ── */
const PROMO_BANNERS = [
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

  /* Which filter dropdown is open (desktop top bar) */
  const [openFilterPanel, setOpenFilterPanel] = useState(null);

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

  /* ── Remove a single active filter chip ── */
  const removeChip = (type, value) => {
    if (type === 'colour') setColourFilters((prev) => prev.filter((v) => v !== value));
    if (type === 'pattern') setPatternFilters((prev) => prev.filter((v) => v !== value));
    if (type === 'brand') setBrandFilters((prev) => prev.filter((v) => v !== value));
    if (type === 'priceMin') setPriceMin('');
    if (type === 'priceMax') setPriceMax('');
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

  /* ── Build active chips ── */
  const activeChips = useMemo(() => {
    const chips = [];
    colourFilters.forEach((v) => chips.push({ type: 'colour', value: v, label: v }));
    patternFilters.forEach((v) => chips.push({ type: 'pattern', value: v, label: v }));
    brandFilters.forEach((v) => chips.push({ type: 'brand', value: v, label: v }));
    if (priceMin) chips.push({ type: 'priceMin', value: priceMin, label: `Min £${priceMin}` });
    if (priceMax) chips.push({ type: 'priceMax', value: priceMax, label: `Max £${priceMax}` });
    return chips;
  }, [colourFilters, patternFilters, brandFilters, priceMin, priceMax]);

  /* ── Filtered + sorted products ── */
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (activeCategory !== 'all') {
      list = list.filter((p) => p.patternType === activeCategory);
    }
    if (colourFilters.length > 0) {
      const lower = colourFilters.map((c) => c.toLowerCase());
      list = list.filter((p) => lower.includes(p.colorTone));
    }
    if (patternFilters.length > 0) {
      const lower = patternFilters.map((pt) => pt.toLowerCase());
      list = list.filter((p) => lower.includes(p.patternType));
    }
    if (brandFilters.length > 0) {
      list = list.filter((p) => brandFilters.includes(p.brand));
    }
    if (priceMin !== '') {
      list = list.filter((p) => p.pricePerSqm >= Number(priceMin));
    }
    if (priceMax !== '') {
      list = list.filter((p) => p.pricePerSqm <= Number(priceMax));
    }

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

  /* ── Build grid with full-width promo banners every 8 products ── */
  const gridItems = useMemo(() => {
    const items = [];
    let promoIndex = 0;

    filteredProducts.forEach((product, i) => {
      items.push({ type: 'product', data: product, key: `product-${product.id}` });

      if ((i + 1) % 8 === 0) {
        const promo = PROMO_BANNERS[promoIndex % PROMO_BANNERS.length];
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

  /* ── Product counts per category ── */
  const categoryCounts = useMemo(() => {
    const counts = { all: products.length };
    categories.forEach((cat) => {
      if (cat.slug !== 'all') {
        counts[cat.slug] = products.filter((p) => p.patternType === cat.slug).length;
      }
    });
    return counts;
  }, []);

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

  /* ── Close filter panel on outside click ── */
  useEffect(() => {
    const handleClick = (e) => {
      if (openFilterPanel && !e.target.closest('.cat-filter-bar__group')) {
        setOpenFilterPanel(null);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [openFilterPanel]);

  /* ── Filter sidebar JSX (mobile) ── */
  const renderFilterContent = () => (
    <div className="catalogue__filter-content">
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

      {hasActiveFilters && (
        <button className="catalogue__clear-filters" onClick={clearFilters}>
          Clear Filters
        </button>
      )}
    </div>
  );

  return (
    <section className="catalogue">
      {/* ── Page Header (cream, not dark) ── */}
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

      {/* ── Category Pills (horizontal chips with counts) ── */}
      <div className="catalogue__tabs-wrapper">
        <div className="container">
          <div className="catalogue__tabs" role="tablist">
            {categories.map((cat) => (
              <button
                key={cat.slug}
                role="tab"
                aria-selected={activeCategory === cat.slug}
                className={`catalogue__pill${activeCategory === cat.slug ? ' catalogue__pill--active' : ''}`}
                onClick={() => handleCategoryChange(cat.slug)}
              >
                {cat.slug === 'all' ? 'All' : cat.slug.charAt(0).toUpperCase() + cat.slug.slice(1)}
                <span className="catalogue__pill-count">{categoryCounts[cat.slug] || 0}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Top Horizontal Filter Bar (desktop) ── */}
      <div className="cat-filter-bar">
        <div className="container">
          <div className="cat-filter-bar__inner">
            <div className="cat-filter-bar__groups">
              {/* Colour filter */}
              <div className="cat-filter-bar__group">
                <button
                  className={`cat-filter-bar__trigger${openFilterPanel === 'colour' ? ' cat-filter-bar__trigger--open' : ''}${colourFilters.length > 0 ? ' cat-filter-bar__trigger--has-active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenFilterPanel(openFilterPanel === 'colour' ? null : 'colour');
                  }}
                >
                  Colour {colourFilters.length > 0 && <span className="cat-filter-bar__badge">{colourFilters.length}</span>}
                  <span className="cat-filter-bar__arrow">&#9662;</span>
                </button>
                {openFilterPanel === 'colour' && (
                  <div className="cat-filter-bar__dropdown" onClick={(e) => e.stopPropagation()}>
                    {COLOUR_TONES.map((tone) => (
                      <label key={tone} className="cat-filter-bar__option">
                        <input
                          type="checkbox"
                          checked={colourFilters.includes(tone)}
                          onChange={() => toggle(colourFilters, setColourFilters, tone)}
                        />
                        <span className="cat-filter-bar__check" />
                        {tone}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Pattern filter */}
              <div className="cat-filter-bar__group">
                <button
                  className={`cat-filter-bar__trigger${openFilterPanel === 'pattern' ? ' cat-filter-bar__trigger--open' : ''}${patternFilters.length > 0 ? ' cat-filter-bar__trigger--has-active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenFilterPanel(openFilterPanel === 'pattern' ? null : 'pattern');
                  }}
                >
                  Pattern {patternFilters.length > 0 && <span className="cat-filter-bar__badge">{patternFilters.length}</span>}
                  <span className="cat-filter-bar__arrow">&#9662;</span>
                </button>
                {openFilterPanel === 'pattern' && (
                  <div className="cat-filter-bar__dropdown" onClick={(e) => e.stopPropagation()}>
                    {PATTERN_TYPES.map((pattern) => (
                      <label key={pattern} className="cat-filter-bar__option">
                        <input
                          type="checkbox"
                          checked={patternFilters.includes(pattern)}
                          onChange={() => toggle(patternFilters, setPatternFilters, pattern)}
                        />
                        <span className="cat-filter-bar__check" />
                        {pattern}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Price filter */}
              <div className="cat-filter-bar__group">
                <button
                  className={`cat-filter-bar__trigger${openFilterPanel === 'price' ? ' cat-filter-bar__trigger--open' : ''}${priceMin || priceMax ? ' cat-filter-bar__trigger--has-active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenFilterPanel(openFilterPanel === 'price' ? null : 'price');
                  }}
                >
                  Price <span className="cat-filter-bar__arrow">&#9662;</span>
                </button>
                {openFilterPanel === 'price' && (
                  <div className="cat-filter-bar__dropdown cat-filter-bar__dropdown--price" onClick={(e) => e.stopPropagation()}>
                    <div className="cat-filter-bar__price-row">
                      <input
                        type="number"
                        placeholder="Min"
                        value={priceMin}
                        onChange={(e) => setPriceMin(e.target.value)}
                        className="cat-filter-bar__price-input"
                        min="0"
                      />
                      <span>&ndash;</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={priceMax}
                        onChange={(e) => setPriceMax(e.target.value)}
                        className="cat-filter-bar__price-input"
                        min="0"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Brand filter */}
              <div className="cat-filter-bar__group">
                <button
                  className={`cat-filter-bar__trigger${openFilterPanel === 'brand' ? ' cat-filter-bar__trigger--open' : ''}${brandFilters.length > 0 ? ' cat-filter-bar__trigger--has-active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenFilterPanel(openFilterPanel === 'brand' ? null : 'brand');
                  }}
                >
                  Brand {brandFilters.length > 0 && <span className="cat-filter-bar__badge">{brandFilters.length}</span>}
                  <span className="cat-filter-bar__arrow">&#9662;</span>
                </button>
                {openFilterPanel === 'brand' && (
                  <div className="cat-filter-bar__dropdown" onClick={(e) => e.stopPropagation()}>
                    {BRANDS.map((brand) => (
                      <label key={brand} className="cat-filter-bar__option">
                        <input
                          type="checkbox"
                          checked={brandFilters.includes(brand)}
                          onChange={() => toggle(brandFilters, setBrandFilters, brand)}
                        />
                        <span className="cat-filter-bar__check" />
                        {brand}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sort + count */}
            <div className="cat-filter-bar__right">
              <span className="cat-filter-bar__count">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
              </span>
              <div className="cat-filter-bar__sort">
                <label htmlFor="sort-select" className="cat-filter-bar__sort-label">Sort:</label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="cat-filter-bar__sort-select"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Active filter chips */}
          {activeChips.length > 0 && (
            <div className="cat-filter-bar__chips">
              {activeChips.map((chip, i) => (
                <button
                  key={`${chip.type}-${chip.value}-${i}`}
                  className="cat-filter-bar__chip"
                  onClick={() => removeChip(chip.type, chip.value)}
                >
                  {chip.label} <span className="cat-filter-bar__chip-x">&times;</span>
                </button>
              ))}
              <button className="cat-filter-bar__clear" onClick={clearFilters}>
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile filter toggle (visible on small screens) ── */}
      <div className="catalogue__mobile-bar container">
        <button
          className="catalogue__filter-toggle"
          onClick={() => setMobileFiltersOpen(true)}
          aria-label="Open filters"
        >
          <span className="catalogue__filter-icon">&#9776;</span> Filters
          {hasActiveFilters && <span className="catalogue__filter-badge" />}
        </button>
        <span className="catalogue__mobile-count">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
        </span>
      </div>

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

      {/* ── Product Grid (full-width 4 col) ── */}
      <div className="container">
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
                    className={`promo-banner promo-banner--${item.data.variant}`}
                    key={item.key}
                  >
                    <span className="promo-banner__icon" aria-hidden="true">
                      {item.data.variant === 'teal' ? '\u2666' : '\u2605'}
                    </span>
                    <h3 className="promo-banner__headline">{item.data.headline}</h3>
                    <span className="promo-banner__cta">
                      {item.data.cta} &rarr;
                    </span>
                  </Link>
                );
              }
              return <ProductCard key={item.key} product={item.data} />;
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default CataloguePage;
