import { useState, useMemo } from 'react';
import { FiPlus } from 'react-icons/fi';
import './ProductPicker.css';

const CATEGORY_OPTIONS = [
  { value: '', label: 'All Categories' },
  { value: 'stones', label: 'Stones' },
  { value: 'worktop', label: 'Worktop' },
  { value: 'upstand', label: 'Upstand' },
  { value: 'splashback', label: 'Splashback' },
  { value: 'cladding', label: 'Cladding' },
  { value: 'cill', label: 'Cill' },
  { value: 'processes', label: 'Processes' },
];

export default function ProductPicker({ products, thickness, onAddItem }) {
  const [category, setCategory] = useState('');
  const [selectedId, setSelectedId] = useState('');

  const filtered = useMemo(() => {
    if (!category) return products;
    return products.filter((p) => p.category === category);
  }, [products, category]);

  const selectedProduct = products.find((p) => p.id === selectedId);
  const priceKey = thickness === '30mm' ? 'price_30mm' : 'price_20mm';

  const handleAdd = () => {
    if (!selectedProduct) return;
    onAddItem(selectedProduct);
    setSelectedId('');
  };

  return (
    <div className="product-picker">
      <h3 className="product-picker__title">Products &amp; Accessories</h3>
      <div className="product-picker__row">
        <select
          className="product-picker__select"
          value={category}
          onChange={(e) => { setCategory(e.target.value); setSelectedId(''); }}
        >
          {CATEGORY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <select
          className="product-picker__select product-picker__select--wide"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          <option value="">Select product...</option>
          {filtered.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} — £{Number(p[priceKey]).toFixed(2)} {p.unit}
            </option>
          ))}
        </select>

        <button
          className="product-picker__add"
          onClick={handleAdd}
          disabled={!selectedId}
        >
          <FiPlus />
        </button>
      </div>
    </div>
  );
}
