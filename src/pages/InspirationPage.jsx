import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import blogPosts from '../data/blogPosts.json';
import './InspirationPage.css';

const categories = ['All', 'Trends', 'Guides', 'Case Studies'];

const popularTags = [
  'trends',
  'quartz',
  'engineered quartz',
  'kitchen',
  'design',
  'maintenance',
  'worktops',
];

const gradients = [
  'linear-gradient(135deg, #3B3B3B 0%, #6B8F71 100%)',
  'linear-gradient(135deg, #1A1A1A 0%, #3B3B3B 100%)',
  'linear-gradient(135deg, #C5A47E 0%, #3B3B3B 100%)',
  'linear-gradient(135deg, #1A1A1A 0%, #C5A47E 100%)',
];

export default function InspirationPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = useMemo(() => {
    let result = [...blogPosts];

    if (activeCategory !== 'All') {
      result = result.filter(
        (post) =>
          post.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return result;
  }, [activeCategory, searchQuery]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="inspiration-page">
      {/* ── Hero ── */}
      <section className="inspiration-hero">
        <div className="inspiration-hero__accent" aria-hidden="true"></div>
        <div className="container">
          <div className="inspiration-hero__body">
            <h1 className="inspiration-hero__title">Inspiration &amp; Ideas</h1>
            <p className="inspiration-hero__subtitle">
              Design tips, trend reports and real kitchen transformations
            </p>
          </div>
        </div>
      </section>

      {/* ── Filters Section (odd = left-aligned) ── */}
      <section className="section inspiration-filters-section">
        <div className="container">
          <div className="inspiration-block inspiration-block--left">
            <div className="inspiration-filters">
              <div className="inspiration-tabs">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`inspiration-tab${
                      activeCategory === cat ? ' inspiration-tab--active' : ''
                    }`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="inspiration-search">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="inspiration-search__input"
                  aria-label="Search articles"
                />
                <span className="inspiration-search__icon" aria-hidden="true">
                  &#128269;
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Articles Section (even = right-aligned) ── */}
      <section className="section section--cream inspiration-articles-section">
        <div className="container">
          <div className="inspiration-block inspiration-block--right">
            {filteredPosts.length > 0 ? (
              <div className="inspiration-grid">
                {filteredPosts.map((post, index) => (
                  <Link
                    to={`/inspiration/${post.slug}`}
                    key={post.id}
                    className="inspiration-card"
                  >
                    <div
                      className="inspiration-card__image"
                      style={{
                        background: gradients[index % gradients.length],
                      }}
                    >
                      <span className="inspiration-card__category">
                        {post.category}
                      </span>
                    </div>
                    <div className="inspiration-card__body">
                      <h3 className="inspiration-card__title">
                        {post.title}
                      </h3>
                      <p className="inspiration-card__excerpt">
                        {post.excerpt}
                      </p>
                      <div className="inspiration-card__meta">
                        <span>{formatDate(post.date)}</span>
                        <span className="inspiration-card__dot">&middot;</span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="inspiration-empty">
                <p>No articles found matching your search.</p>
                <button
                  className="btn btn--outline btn--sm"
                  onClick={() => {
                    setActiveCategory('All');
                    setSearchQuery('');
                  }}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Sidebar Section (odd = left-aligned) ── */}
      <section className="section inspiration-sidebar-section">
        <div className="container">
          <div className="inspiration-block inspiration-block--left">
            <aside className="inspiration-sidebar">
              {/* Popular Tags */}
              <div className="inspiration-sidebar__section">
                <h4 className="inspiration-sidebar__heading">Popular Tags</h4>
                <div className="inspiration-tags">
                  {popularTags.map((tag) => (
                    <button
                      key={tag}
                      className="inspiration-tag"
                      onClick={() => setSearchQuery(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Our Story */}
              <div className="inspiration-sidebar__section">
                <div className="inspiration-sidebar__story-card">
                  <h4>Our Story</h4>
                  <p>
                    Discover how The Quartz Company became one of the UK's most
                    trusted names in premium kitchen worktops.
                  </p>
                  <Link to="/about" className="btn btn--outline btn--sm">
                    About Us
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ── CTA Section (right-aligned bordered card) ── */}
      <section className="section inspiration-cta-section">
        <div className="container">
          <div className="inspiration-cta__card">
            <h2 className="inspiration-cta__heading">Need Help Choosing?</h2>
            <p className="inspiration-cta__text">
              Book a free design consultation with our expert team. We
              will help you find the perfect worktop for your space.
            </p>
            <Link to="/contact" className="btn btn--gold btn--lg">
              Book a Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
