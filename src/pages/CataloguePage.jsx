import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import usePageMeta from '../hooks/usePageMeta';
import ProductCard from '../components/ProductCard';
import TrustStrip from '../components/TrustStrip';
import products from '../data/products.json';
import categories from '../data/categories.json';
import { trackSearch } from '../lib/metaTracking';
import './CataloguePage.css';

/* ── Filter constants ── */
const RANGES = [...new Set(products.map((p) => p.range).filter(Boolean))];
const slugifyRange = (s) => s.toLowerCase().replace(/\s+/g, '-');

/* Intro copy shown at the top of the catalogue when a single range is selected */
const RANGE_INFO = {
  'Petra Core': {
    eyebrow: 'Our Worktops',
    description:
      'Our signature engineered quartz range. Hard-wearing, non-porous and virtually maintenance-free, Petra Core surfaces bring timeless marble-inspired and contemporary looks to any kitchen — the everyday luxury our customers know us for.',
  },
  Sculptura: {
    eyebrow: 'Our Worktops',
    description:
      'Our premium full-body printed quartz range. The pattern and veining run right through the entire slab, so mitred edges, waterfall islands and cut-outs match seamlessly for a true natural-stone effect — each backed by a 25-year manufacturer warranty.',
  },
};
const COLOUR_TONES = ['White', 'Cream', 'Grey', 'Black'];
const PATTERN_TYPES = ['Veined', 'Plain', 'Speckled'];
const BRANDS = ['The Quartz Company'];

const SORT_OPTIONS = [
  { value: 'popular', label: 'Popular' },
  { value: 'price-asc', label: 'Price Low–High' },
  { value: 'price-desc', label: 'Price High–Low' },
  { value: 'rating', label: 'Rating' },
  { value: 'newest', label: 'Newest' },
];

/* Render a 5-star rating row (filled/empty) */
const renderStars = (count) => {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <span
        key={i}
        className={
          i < count ? 'cat-review__star--filled' : 'cat-review__star--empty'
        }
      >
        {i < count ? '★' : '☆'}
      </span>
    );
  }
  return stars;
};

/* Reviews shown in the worktops-page carousel.
   NOTE: placeholder copy — replace with genuine customer reviews
   (e.g. exported from Google) before relying on these. */
const CATALOGUE_REVIEWS = [
  {
    id: 'c1',
    name: 'Hannah B.',
    location: 'Coventry',
    rating: 5,
    text: 'The quality of the material is outstanding — it feels far more expensive than what we paid. A flawless finish and beautifully designed.',
  },
  {
    id: 'c2',
    name: 'Daniel O.',
    location: 'Nuneaton',
    rating: 5,
    text: 'We compared quotes everywhere and nothing came close on price for this quality of quartz. The design advice was spot on too.',
  },
  {
    id: 'c3',
    name: 'Sophie L.',
    location: 'Warwick',
    rating: 5,
    text: 'The veining and finish are stunning — genuinely looks like natural marble but without the upkeep. Incredible value for the quality.',
  },
  {
    id: 'c4',
    name: 'The Prentice Family',
    location: 'Solihull',
    rating: 5,
    text: 'From the design consultation to the final worktop, the attention to detail was superb. Premium-quality material at a genuinely fair price.',
  },
  {
    id: 'c5',
    name: 'Raj P.',
    location: 'Hinckley',
    rating: 4,
    text: 'Exceptional materials and a faultless finish. You simply don’t get this level of quality at this price point anywhere else.',
  },
  {
    id: 'c6',
    name: 'Megan F.',
    location: 'Stratford-upon-Avon',
    rating: 5,
    text: 'Beautiful design, top-tier quartz and honest pricing — exactly what they promised.',
  },
];

function CataloguePage() {
  usePageMeta('Quartz Worktop Colours | Browse the Full Range | The Quartz Company', 'Browse our full collection of premium engineered and printed quartz worktop colours, from bright Calacatta whites to bold Nero Sparkle. Free samples, fixed-price quotes and a 25-year warranty.');
  const { category } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rangeParam = searchParams.get('range');

  /* ── State ── */
  const [activeCategory, setActiveCategory] = useState(category || 'all');
  const [sortBy, setSortBy] = useState('popular');

  /* ── Reviews carousel ── */
  const [reviewIndex, setReviewIndex] = useState(0);
  const reviewCount = CATALOGUE_REVIEWS.length;
  const nextReview = () => setReviewIndex((i) => (i + 1) % reviewCount);
  const prevReview = () =>
    setReviewIndex((i) => (i - 1 + reviewCount) % reviewCount);
  const activeReview = CATALOGUE_REVIEWS[reviewIndex];
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [rangeFilters, setRangeFilters] = useState([]);
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

  /* Sync ?range= query param → range filter (from the nav dropdown) */
  useEffect(() => {
    if (!rangeParam) {
      setRangeFilters([]);
      return;
    }
    const match = RANGES.find((r) => slugifyRange(r) === rangeParam.toLowerCase());
    setRangeFilters(match ? [match] : []);
  }, [rangeParam]);

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
    if (type === 'range') setRangeFilters((prev) => prev.filter((v) => v !== value));
    if (type === 'colour') setColourFilters((prev) => prev.filter((v) => v !== value));
    if (type === 'pattern') setPatternFilters((prev) => prev.filter((v) => v !== value));
    if (type === 'brand') setBrandFilters((prev) => prev.filter((v) => v !== value));
    if (type === 'priceMin') setPriceMin('');
    if (type === 'priceMax') setPriceMax('');
  };

  /* ── Clear all filters ── */
  const clearFilters = () => {
    setRangeFilters([]);
    setColourFilters([]);
    setPatternFilters([]);
    setBrandFilters([]);
    setPriceMin('');
    setPriceMax('');
  };

  const hasActiveFilters =
    rangeFilters.length > 0 ||
    colourFilters.length > 0 ||
    patternFilters.length > 0 ||
    brandFilters.length > 0 ||
    priceMin !== '' ||
    priceMax !== '';

  /* ── Meta: Search event when filters/sort change (debounced) ── */
  const searchDebounce = useRef(null);
  const firstFilterRun = useRef(true);
  useEffect(() => {
    // Skip the initial render so landing on the page isn't a "search".
    if (firstFilterRun.current) {
      firstFilterRun.current = false;
      return;
    }
    clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(() => {
      const selected_filters = {
        collection: activeCategory !== 'all' ? activeCategory : undefined,
        range: rangeFilters.length ? rangeFilters : undefined,
        colour: colourFilters.length ? colourFilters : undefined,
        finish: patternFilters.length ? patternFilters : undefined,
        brand: brandFilters.length ? brandFilters : undefined,
        price: priceMin || priceMax ? { min: priceMin || null, max: priceMax || null } : undefined,
        sort: sortBy !== 'popular' ? sortBy : undefined,
      };
      const search_string = [
        activeCategory !== 'all' ? activeCategory : null,
        ...rangeFilters,
        ...colourFilters,
        ...patternFilters,
        ...brandFilters,
        priceMin ? `min £${priceMin}` : null,
        priceMax ? `max £${priceMax}` : null,
      ]
        .filter(Boolean)
        .join(', ');

      trackSearch({ search_string, selected_filters });
    }, 600);

    return () => clearTimeout(searchDebounce.current);
  }, [activeCategory, rangeFilters, colourFilters, patternFilters, brandFilters, priceMin, priceMax, sortBy]);

  /* ── Build active chips ── */
  const activeChips = useMemo(() => {
    const chips = [];
    rangeFilters.forEach((v) => chips.push({ type: 'range', value: v, label: v }));
    colourFilters.forEach((v) => chips.push({ type: 'colour', value: v, label: v }));
    patternFilters.forEach((v) => chips.push({ type: 'pattern', value: v, label: v }));
    brandFilters.forEach((v) => chips.push({ type: 'brand', value: v, label: v }));
    if (priceMin) chips.push({ type: 'priceMin', value: priceMin, label: `Min £${priceMin}` });
    if (priceMax) chips.push({ type: 'priceMax', value: priceMax, label: `Max £${priceMax}` });
    return chips;
  }, [rangeFilters, colourFilters, patternFilters, brandFilters, priceMin, priceMax]);

  /* ── Filtered + sorted products ── */
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (activeCategory !== 'all') {
      list = list.filter((p) => p.patternType === activeCategory);
    }
    if (rangeFilters.length > 0) {
      list = list.filter((p) => rangeFilters.includes(p.range));
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
  }, [activeCategory, rangeFilters, colourFilters, patternFilters, brandFilters, priceMin, priceMax, sortBy]);

  /* ── Build grid (products only) ── */
  const gridItems = useMemo(
    () =>
      filteredProducts.map((product) => ({
        type: 'product',
        data: product,
        key: `product-${product.id}`,
      })),
    [filteredProducts]
  );

  /* ── Active category object ── */
  const activeCategoryObj = categories.find((c) => c.slug === activeCategory) || categories[0];

  /* ── Active range (drives the intro copy at the top) ── */
  const activeRange =
    rangeFilters.length === 1 && RANGE_INFO[rangeFilters[0]] ? rangeFilters[0] : null;

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
        <h4 className="filter-group__title">Range</h4>
        {RANGES.map((r) => (
          <label key={r} className="filter-group__checkbox">
            <input
              type="checkbox"
              checked={rangeFilters.includes(r)}
              onChange={() => toggle(rangeFilters, setRangeFilters, r)}
            />
            <span className="filter-group__checkmark" />
            {r}
          </label>
        ))}
      </div>

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

  /* ── Price formatter ── */
  const formatPrice = (value) =>
    new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <section className="catalogue">
      {/* ── Page Header (cream, not dark) ── */}
      <div className="catalogue__header">
        <div className="container">
          <span className="eyebrow catalogue__eyebrow">
            {activeRange ? RANGE_INFO[activeRange].eyebrow : 'The Collection'}
          </span>
          <h1 className="catalogue__title">
            {activeRange
              ? activeRange
              : activeCategory === 'all'
                ? 'Browse Our Colours'
                : activeCategoryObj.name}
          </h1>
          <p className="catalogue__description">
            {activeRange ? RANGE_INFO[activeRange].description : activeCategoryObj.description}
          </p>
        </div>
      </div>

      {/* ── Top Horizontal Filter Bar (desktop) ── */}
      <div className="cat-filter-bar">
        <div className="container">
          <div className="cat-filter-bar__inner">
            <div className="cat-filter-bar__groups">
              {/* Range filter */}
              <div className="cat-filter-bar__group">
                <button
                  className={`cat-filter-bar__trigger${openFilterPanel === 'range' ? ' cat-filter-bar__trigger--open' : ''}${rangeFilters.length > 0 ? ' cat-filter-bar__trigger--has-active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenFilterPanel(openFilterPanel === 'range' ? null : 'range');
                  }}
                >
                  Range {rangeFilters.length > 0 && <span className="cat-filter-bar__badge">{rangeFilters.length}</span>}
                  <span className="cat-filter-bar__arrow">&#9662;</span>
                </button>
                {openFilterPanel === 'range' && (
                  <div className="cat-filter-bar__dropdown" onClick={(e) => e.stopPropagation()}>
                    {RANGES.map((r) => (
                      <label key={r} className="cat-filter-bar__option">
                        <input
                          type="checkbox"
                          checked={rangeFilters.includes(r)}
                          onChange={() => toggle(rangeFilters, setRangeFilters, r)}
                        />
                        <span className="cat-filter-bar__check" />
                        {r}
                      </label>
                    ))}
                  </div>
                )}
              </div>

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
        {/* Summer sale banner */}
        <div className="cat-sale-banner" role="note">
          <span className="cat-sale-banner__tag">Summer Sale</span>
          <p className="cat-sale-banner__text">
            <strong>40% off</strong> every worktop this summer &mdash; ends 22nd
            July
          </p>
        </div>

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
              const product = item.data;
              return (
                <Link
                  to={`/product/${product.slug}`}
                  className="cat-product"
                  key={item.key}
                >
                  <div className="cat-product__frame">
                    {product.onSale && product.discount > 0 && (
                      <span className="cat-product__badge">{product.discount}% Off</span>
                    )}
                    <img
                      src={product.swatch}
                      alt={product.name}
                      className="cat-product__img"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="cat-product__caption">
                    <h3 className="cat-product__name">{product.name}</h3>
                    <p className="cat-product__sub">
                      {product.range}
                    </p>
                    <p className="cat-product__price">
                      {product.onSale && product.originalPrice ? (
                        <>
                          <span className="cat-product__price-old">
                            {formatPrice(product.originalPrice)}
                          </span>
                          <span className="cat-product__price-sale">
                            From {formatPrice(product.pricePerSqm)} /m&sup2;
                          </span>
                          {product.discount > 0 && (
                            <span className="cat-product__price-off">
                              {product.discount}% off
                            </span>
                          )}
                        </>
                      ) : (
                        <>From {formatPrice(product.pricePerSqm)} /m&sup2;</>
                      )}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Trust reassurance strip */}
      <TrustStrip />

      {/* ── Customer review carousel ── */}
      <div className="cat-reviews">
        <div className="container">
          <span className="cat-reviews__overline">Loved by our customers</span>
          <h2 className="cat-reviews__title">Quality You Can Feel</h2>

          <div className="cat-reviews__carousel">
            <button
              type="button"
              className="cat-reviews__arrow"
              onClick={prevReview}
              aria-label="Previous review"
            >
              &#8249;
            </button>

            <figure className="cat-reviews__card" key={activeReview.id}>
              <span className="cat-reviews__mark" aria-hidden="true">
                &ldquo;
              </span>
              <div
                className="cat-reviews__stars"
                aria-label={`${activeReview.rating} out of 5 stars`}
              >
                {renderStars(activeReview.rating)}
              </div>
              <blockquote className="cat-reviews__text">
                {activeReview.text}
              </blockquote>
              <figcaption className="cat-reviews__author">
                <span className="cat-reviews__name">{activeReview.name}</span>
                <span className="cat-reviews__loc">{activeReview.location}</span>
              </figcaption>
            </figure>

            <button
              type="button"
              className="cat-reviews__arrow"
              onClick={nextReview}
              aria-label="Next review"
            >
              &#8250;
            </button>
          </div>

          <div className="cat-reviews__dots">
            {CATALOGUE_REVIEWS.map((r, i) => (
              <button
                key={r.id}
                type="button"
                className={`cat-reviews__dot${
                  i === reviewIndex ? ' cat-reviews__dot--active' : ''
                }`}
                onClick={() => setReviewIndex(i)}
                aria-label={`Go to review ${i + 1} of ${reviewCount}`}
                aria-current={i === reviewIndex ? 'true' : undefined}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CataloguePage;
