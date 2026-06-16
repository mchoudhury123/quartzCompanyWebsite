import React from 'react';
import { Link } from 'react-router-dom';
import './ColourCard.css';

/**
 * ColourCard – editorial product tile (image + clean caption).
 * Matches the Browse Colours gallery style. Light theme (dark caption
 * on a light background). Use within any light section.
 */
const formatPrice = (value) =>
  new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

function ColourCard({ product }) {
  const {
    slug,
    name,
    material,
    collection,
    swatch,
    pricePerSqm,
    originalPrice,
    onSale,
    discount,
  } = product;

  return (
    <Link to={`/product/${slug}`} className="colour-card">
      <div className="colour-card__frame">
        {onSale && discount > 0 && (
          <span className="colour-card__badge">{discount}% Off</span>
        )}
        <img
          src={swatch}
          alt={name}
          className="colour-card__img"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="colour-card__caption">
        <h3 className="colour-card__name">{name}</h3>
        <p className="colour-card__sub">
          {material} &mdash; {collection}
        </p>
        <p className="colour-card__price">
          {onSale && originalPrice ? (
            <>
              <span className="colour-card__price-old">{formatPrice(originalPrice)}</span>
              <span className="colour-card__price-sale">
                From {formatPrice(pricePerSqm)} /m&sup2;
              </span>
            </>
          ) : (
            <>From {formatPrice(pricePerSqm)} /m&sup2;</>
          )}
        </p>
      </div>
    </Link>
  );
}

export default ColourCard;
