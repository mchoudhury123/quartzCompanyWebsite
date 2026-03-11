import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useProducts from '../hooks/useProducts';
import useQuotes from '../hooks/useQuotes';
import MaterialSelector from '../components/quote-builder/MaterialSelector';
import ProductPicker from '../components/quote-builder/ProductPicker';
import LineItemRow from '../components/quote-builder/LineItemRow';
import ReceiptPanel from '../components/quote-builder/ReceiptPanel';
import { FiArrowLeft } from 'react-icons/fi';
import './QuoteBuilderPage.css';

function getPricingCategory(category) {
  if (category === 'stones') return 'materials';
  if (category === 'processes') return 'processes';
  return 'products';
}

export default function QuoteBuilderPage() {
  const { id: leadId } = useParams();
  const navigate = useNavigate();
  const { products, loading: productsLoading } = useProducts();
  const { createQuote } = useQuotes(leadId);

  const [thickness, setThickness] = useState('20mm');
  const [items, setItems] = useState([]);
  const [depositAmount, setDepositAmount] = useState(0);
  const [saving, setSaving] = useState(false);

  const priceKey = thickness === '30mm' ? 'price_30mm' : 'price_20mm';

  const handleAddItem = useCallback((product) => {
    setItems((prev) => {
      const existing = prev.findIndex(
        (i) => i.product_id === product.id && i.thickness === thickness
      );
      if (existing >= 0) {
        const updated = [...prev];
        const item = { ...updated[existing] };
        item.quantity += 1;
        item.line_total = item.quantity * item.unit_price;
        updated[existing] = item;
        return updated;
      }
      return [
        ...prev,
        {
          product_id: product.id,
          product_name: product.name,
          category: product.category,
          thickness,
          quantity: 1,
          unit_price: Number(product[priceKey]),
          unit: product.unit,
          line_total: Number(product[priceKey]),
          pricing_category: getPricingCategory(product.category),
        },
      ];
    });
  }, [thickness, priceKey]);

  const handleQuantityChange = useCallback((index, qty) => {
    setItems((prev) => {
      const updated = [...prev];
      const item = { ...updated[index] };
      item.quantity = qty;
      item.line_total = item.quantity * item.unit_price;
      updated[index] = item;
      return updated;
    });
  }, []);

  const handleRemoveItem = useCallback((index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleThicknessChange = useCallback((newThickness) => {
    const newPriceKey = newThickness === '30mm' ? 'price_30mm' : 'price_20mm';
    setThickness(newThickness);
    setItems((prev) =>
      prev.map((item) => {
        const product = products.find((p) => p.id === item.product_id);
        if (!product) return item;
        const newPrice = Number(product[newPriceKey]);
        return {
          ...item,
          thickness: newThickness,
          unit_price: newPrice,
          line_total: item.quantity * newPrice,
        };
      })
    );
  }, [products]);

  const computeTotals = () => {
    const subtotal = items.reduce((sum, i) => sum + i.line_total, 0);
    const vat = subtotal * 0.2;
    const total = subtotal + vat;
    return { subtotal, vat, total };
  };

  const handleSave = async (status = 'draft') => {
    if (saving) return;
    setSaving(true);
    const { subtotal, vat, total } = computeTotals();
    const { error } = await createQuote({
      title: `Quote — ${items.length} item${items.length !== 1 ? 's' : ''}`,
      description: items.map((i) => `${i.product_name} x${i.quantity}`).join(', '),
      items,
      subtotal,
      vat,
      total,
      validUntil: null,
      depositAmount,
      selectedThickness: thickness,
    });
    setSaving(false);
    if (!error) {
      navigate(`/admin/leads/${leadId}?tab=quotes`);
    }
  };

  if (productsLoading) {
    return <div className="admin-page-loading">Loading products...</div>;
  }

  const today = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <div className="quote-builder">
      <div className="quote-builder__topbar">
        <button
          className="quote-builder__back"
          onClick={() => navigate(`/admin/leads/${leadId}?tab=quotes`)}
        >
          <FiArrowLeft /> Back to Client
        </button>
        <div className="quote-builder__topbar-right">
          <span className="quote-builder__date">{today}</span>
        </div>
      </div>

      <div className="quote-builder__layout">
        <div className="quote-builder__left">
          <MaterialSelector
            products={products}
            thickness={thickness}
            onThicknessChange={handleThicknessChange}
            onAddItem={handleAddItem}
          />

          <ProductPicker
            products={products}
            thickness={thickness}
            onAddItem={handleAddItem}
          />

          {items.length > 0 && (
            <div className="quote-builder__items">
              <h3 className="quote-builder__items-title">
                Line Items ({items.length})
              </h3>
              <div className="quote-builder__items-list">
                {items.map((item, i) => (
                  <LineItemRow
                    key={`${item.product_id}-${item.thickness}-${i}`}
                    item={item}
                    index={i}
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="quote-builder__right">
          <ReceiptPanel
            items={items}
            depositAmount={depositAmount}
            onDepositChange={setDepositAmount}
            onSave={() => handleSave('draft')}
            onSend={() => handleSave('sent')}
            saving={saving}
          />
        </div>
      </div>
    </div>
  );
}
