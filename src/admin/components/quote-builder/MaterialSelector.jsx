import { useState, useMemo } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import './MaterialSelector.css';

const CATEGORIES = [
  { key: 'stones', label: 'Stones' },
  { key: 'worktop', label: 'Worktop' },
  { key: 'upstand', label: 'Upstand' },
  { key: 'splashback', label: 'Splashback' },
  { key: 'cladding', label: 'Cladding' },
  { key: 'cill', label: 'Cill' },
  { key: 'processes', label: 'Processes' },
];

export default function MaterialSelector({
  products,
  thickness,
  onThicknessChange,
  onAddItem,
}) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('stones');

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = p.category === activeCategory;
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [products, activeCategory, search]);

  const priceKey = thickness === '30mm' ? 'price_30mm' : 'price_20mm';

  return (
    <div className="mat-selector">
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

      <div className="mat-selector__categories">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            className={`mat-selector__cat-btn ${activeCategory === cat.key ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.key)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="mat-selector__list">
        {filtered.length === 0 && (
          <div className="mat-selector__empty">No products found</div>
        )}
        {filtered.map((product) => (
          <div key={product.id} className="mat-selector__item">
            <div className="mat-selector__item-info">
              <span className="mat-selector__item-name">{product.name}</span>
              <span className="mat-selector__item-unit">{product.unit}</span>
            </div>
            <div className="mat-selector__item-actions">
              <span className="mat-selector__item-price">
                £{Number(product[priceKey]).toFixed(2)}
              </span>
              <button
                className="mat-selector__item-add"
                onClick={() => onAddItem(product)}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
