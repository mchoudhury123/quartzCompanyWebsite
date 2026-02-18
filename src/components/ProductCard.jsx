import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

/**
 * ProductCard – Reusable product card for the The Quartz Company catalogue.
 *
 * Props:
 *   product  – product object from products.json
 *
 * Expected product shape:
 *   { id, slug, name, material, collection, swatch, pricePerSqm,
 *     originalPrice, onSale, discount, rating, reviewCount,
 *     popular, new: isNew }
 */
function ProductCard({ product }) {
  const {
    slug,
    name,
    material,
    collection,
    swatch,
    images,
    pricePerSqm,
    originalPrice,
    onSale,
    discount,
    rating,
    reviewCount,
    popular,
  } = product;

  const isNew = product.new;
  const hoverImage = images && images.length > 1 ? images[1] : null;

  /* ── Lazy-load swatch image with IntersectionObserver ── */
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hoverLoaded, setHoverLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [hoverSrc, setHoverSrc] = useState(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const node = imgRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImageSrc(swatch);
          if (hoverImage) setHoverSrc(hoverImage);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [swatch, hoverImage]);

  /* ── Star rating helper ── */
  const renderStars = (score) => {
    const fullStars = Math.floor(score);
    const hasHalf = score - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

    const stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={`full-${i}`} className="product-card__star product-card__star--filled" aria-hidden="true">
          &#9733;
        </span>
      );
    }
    if (hasHalf) {
      // Show a full star for half (visually acceptable at this size)
      stars.push(
        <span key="half" className="product-card__star product-card__star--filled" aria-hidden="true">
          &#9733;
        </span>
      );
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="product-card__star product-card__star--empty" aria-hidden="true">
          &#9734;
        </span>
      );
    }
    return stars;
  };

  /* ── Format price ── */
  const formatPrice = (value) =>
    new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <article className="product-card" aria-label={`${name} worktop`}>
      {/* Image container */}
      <div className="product-card__image-wrapper" ref={imgRef}>
        {/* Placeholder gradient shown until image loads */}
        <div
          className={`product-card__placeholder${imageLoaded ? ' product-card__placeholder--hidden' : ''}`}
          aria-hidden="true"
        />

        {imageSrc && (
          <img
            src={imageSrc}
            alt={`${name} swatch`}
            className={`product-card__image${imageLoaded ? ' product-card__image--loaded' : ''}`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
          />
        )}

        {hoverSrc && (
          <img
            src={hoverSrc}
            alt={`${name} in kitchen`}
            className={`product-card__image product-card__image--hover${hoverLoaded ? ' product-card__image--hover-ready' : ''}`}
            loading="lazy"
            onLoad={() => setHoverLoaded(true)}
          />
        )}

        {/* Badges */}
        <div className="product-card__badges">
          {onSale && discount > 0 && (
            <span className="badge badge--sale">{discount}% Off</span>
          )}
          {isNew && (
            <span className="badge badge--new">New</span>
          )}
          {popular && !isNew && (
            <span className="badge badge--popular">
              <span className="product-card__fire" aria-hidden="true">&#128293;</span> Popular
            </span>
          )}
        </div>
      </div>

      {/* Card body */}
      <div className="product-card__body">
        {/* Name */}
        <h3 className="product-card__name">
          <Link to={`/product/${slug}`}>{name}</Link>
        </h3>

        {/* Subtitle: material / collection */}
        <p className="product-card__subtitle">
          {material} &mdash; {collection}
        </p>

        {/* Rating */}
        <div className="product-card__rating" aria-label={`Rated ${rating} out of 5 from ${reviewCount} reviews`}>
          <span className="product-card__stars">
            {renderStars(rating)}
          </span>
          <span className="product-card__review-count">({reviewCount})</span>
        </div>

        {/* Price */}
        <div className="product-card__price">
          {onSale && originalPrice ? (
            <>
              <span className="product-card__price-original">
                From {formatPrice(originalPrice)} /m&sup2;
              </span>
              <span className="product-card__price-sale">
                From {formatPrice(pricePerSqm)} /m&sup2;
              </span>
            </>
          ) : (
            <span className="product-card__price-current">
              From {formatPrice(pricePerSqm)} /m&sup2;
            </span>
          )}
        </div>

        {/* CTA */}
        <Link to={`/product/${slug}`} className="btn btn--outline btn--sm product-card__cta">
          View Details
        </Link>
      </div>
    </article>
  );
}

export default ProductCard;
