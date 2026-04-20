import { useState, useMemo } from 'react';
import { FiSearch, FiX, FiCheck } from 'react-icons/fi';
import './MaterialSelector.css';

export default function MaterialSelector({
  products,
  selectedMaterial,
  thickness,
  onSelectMaterial,
  onThicknessChange,
}) {
  const [search, setSearch] = useState('');

  const stones = useMemo(() => {
    return products
      .filter((p) => p.category === 'stones')
      .filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()));
  }, [products, search]);

  const priceKey = thickness === '30mm' ? 'price_30mm' : 'price_20mm';
  const originalKey = thickness === '30mm' ? 'original_price_30mm' : 'original_price_20mm';

  return (
    <div className="mat-selector">
      {/* Selected material banner */}
      {selectedMaterial && (
        <div className="mat-selector__selected">
          <div className="mat-selector__selected-info">
            <FiCheck className="mat-selector__selected-check" />
            <span className="mat-selector__selected-name">{selectedMaterial.name}</span>
            <span className="mat-selector__selected-thickness">{thickness.toUpperCase()}</span>
            {selectedMaterial.on_sale && selectedMaterial.discount_percent > 0 && (
              <span className="mat-selector__selected-sale">
                {selectedMaterial.discount_percent}% OFF
              </span>
            )}
          </div>
          <button
            className="mat-selector__selected-change"
            onClick={() => onSelectMaterial(null)}
          >
            Change
          </button>
        </div>
      )}

      {/* Material picker (shown when no material selected) */}
      {!selectedMaterial && (
        <>
          <div className="mat-selector__search">
            <FiSearch className="mat-selector__search-icon" />
            <input
              type="text"
              placeholder="Search material..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mat-selector__search-input"
            />
            {search && (
              <button className="mat-selector__search-clear" onClick={() => setSearch('')}>
                <FiX />
              </button>
            )}
          </div>

          <div className="mat-selector__thickness">
            <button
              className={`mat-selector__thickness-btn ${thickness === '20mm' ? 'active' : ''}`}
              onClick={() => onThicknessChange('20mm')}
            >
              20mm
            </button>
            <button
              className={`mat-selector__thickness-btn ${thickness === '30mm' ? 'active' : ''}`}
              onClick={() => onThicknessChange('30mm')}
            >
              30mm
            </button>
          </div>

          <div className="mat-selector__list">
            {stones.length === 0 && (
              <div className="mat-selector__empty">No materials found</div>
            )}
            {stones.map((product) => {
              const showWas = product.on_sale && product[originalKey] && product[originalKey] > product[priceKey];
              return (
                <button
                  key={product.id}
                  className="mat-selector__item"
                  onClick={() => onSelectMaterial(product)}
                >
                  <span className="mat-selector__item-name">
                    {product.name}
                    {product.on_sale && product.discount_percent > 0 && (
                      <span className="mat-selector__item-badge">
                        {product.discount_percent}% OFF
                      </span>
                    )}
                  </span>
                  <span className="mat-selector__item-pricing">
                    {showWas && (
                      <span className="mat-selector__item-was">
                        £{Number(product[originalKey]).toFixed(2)}
                      </span>
                    )}
                    <span className="mat-selector__item-price">
                      £{Number(product[priceKey]).toFixed(2)}/sqm
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
