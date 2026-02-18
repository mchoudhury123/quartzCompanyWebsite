import React from 'react';
import { useParams, Link } from 'react-router-dom';
import blogPosts from '../data/blogPosts.json';
import './BlogPostPage.css';

const gradients = [
  'linear-gradient(135deg, #3B3B3B 0%, #6B8F71 100%)',
  'linear-gradient(135deg, #1A1A1A 0%, #3B3B3B 100%)',
  'linear-gradient(135deg, #C5A47E 0%, #3B3B3B 100%)',
  'linear-gradient(135deg, #1A1A1A 0%, #C5A47E 100%)',
];

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="blogpost-page">
        <section className="section">
          <div className="container" style={{ textAlign: 'center' }}>
            <h1>Article Not Found</h1>
            <p style={{ color: 'var(--color-text-light)', marginBottom: '1.5rem' }}>
              Sorry, we could not find the article you are looking for.
            </p>
            <Link to="/inspiration" className="btn btn--primary">
              Back to Inspiration
            </Link>
          </div>
        </section>
      </div>
    );
  }

  const postIndex = blogPosts.findIndex((p) => p.id === post.id);
  const paragraphs = post.content.split('\n\n');
  const relatedPosts = blogPosts.filter((p) => p.id !== post.id);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="blogpost-page">
      {/* ── Breadcrumbs ── */}
      <nav className="blogpost-breadcrumbs" aria-label="Breadcrumb">
        <div className="container">
          <ol className="blogpost-breadcrumbs__list">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/inspiration">Inspiration</Link>
            </li>
            <li aria-current="page">{post.title}</li>
          </ol>
        </div>
      </nav>

      {/* ── Hero Image ── */}
      <section
        className="blogpost-hero"
        style={{
          background: gradients[postIndex % gradients.length],
        }}
      >
        <div className="container blogpost-hero__inner">
          <span className="blogpost-hero__category">{post.category}</span>
        </div>
      </section>

      {/* ── Article ── */}
      <article className="section blogpost-article">
        <div className="container">
          <div className="blogpost-article__wrapper">
            {/* Metadata */}
            <div className="blogpost-meta">
              <span className="blogpost-meta__badge">{post.category}</span>
              <span className="blogpost-meta__date">{formatDate(post.date)}</span>
              <span className="blogpost-meta__dot">&middot;</span>
              <span className="blogpost-meta__read">{post.readTime}</span>
            </div>

            {/* Title */}
            <h1 className="blogpost-title">{post.title}</h1>

            {/* Content */}
            <div className="blogpost-content">
              {paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Share */}
            <div className="blogpost-share">
              <span className="blogpost-share__label">Share this article</span>
              <div className="blogpost-share__icons">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    window.location.href
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="blogpost-share__icon"
                  aria-label="Share on Facebook"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    post.title
                  )}&url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="blogpost-share__icon"
                  aria-label="Share on Twitter"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                    window.location.href
                  )}&title=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="blogpost-share__icon"
                  aria-label="Share on LinkedIn"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href={`mailto:?subject=${encodeURIComponent(
                    post.title
                  )}&body=${encodeURIComponent(window.location.href)}`}
                  className="blogpost-share__icon"
                  aria-label="Share via email"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Author Box */}
            <div className="blogpost-author">
              <div className="blogpost-author__avatar">TQC</div>
              <div className="blogpost-author__info">
                <h4 className="blogpost-author__name">The Quartz Company Design Team</h4>
                <p className="blogpost-author__bio">
                  Our design experts share insights from decades of experience in
                  premium kitchen worktops, helping you make informed choices for
                  your home.
                </p>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* ── Related Posts ── */}
      {relatedPosts.length > 0 && (
        <section className="section section--cream blogpost-related">
          <div className="container">
            <h2 className="section-title">You May Also Like</h2>
            <p className="section-subtitle">
              More inspiration from the The Quartz Company journal
            </p>
            <div className="blogpost-related__grid">
              {relatedPosts.slice(0, 3).map((rPost, idx) => (
                <Link
                  to={`/inspiration/${rPost.slug}`}
                  key={rPost.id}
                  className="blogpost-related__card"
                >
                  <div
                    className="blogpost-related__image"
                    style={{
                      background:
                        gradients[
                          (blogPosts.findIndex((p) => p.id === rPost.id)) %
                            gradients.length
                        ],
                    }}
                  >
                    <span className="blogpost-related__category">
                      {rPost.category}
                    </span>
                  </div>
                  <div className="blogpost-related__body">
                    <h3>{rPost.title}</h3>
                    <span className="blogpost-related__meta">
                      {formatDate(rPost.date)} &middot; {rPost.readTime}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA Banner ── */}
      <section className="section blogpost-cta-section">
        <div className="container blogpost-cta">
          <h2>Inspired? Let&rsquo;s Bring Your Vision to Life</h2>
          <p>
            Get a free quote for your project and discover how The Quartz Company
            can transform your kitchen.
          </p>
          <Link to="/contact" className="btn btn--primary btn--lg">
            Get a Free Quote for Your Project
          </Link>
        </div>
      </section>
    </div>
  );
}
