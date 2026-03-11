import { useMemo, useState } from 'react';
import './ReceiptPanel.css';

function getPricingCategory(category) {
  if (category === 'stones') return 'materials';
  if (category === 'processes') return 'processes';
  return 'products';
}

export default function ReceiptPanel({
  items,
  depositAmount,
  onDepositChange,
  onSave,
  onSend,
  saving,
}) {
  const [showVat, setShowVat] = useState(true);

  const totals = useMemo(() => {
    const materials = items
      .filter((i) => getPricingCategory(i.category) === 'materials')
      .reduce((sum, i) => sum + i.line_total, 0);
    const processes = items
      .filter((i) => getPricingCategory(i.category) === 'processes')
      .reduce((sum, i) => sum + i.line_total, 0);
    const products = items
      .filter((i) => getPricingCategory(i.category) === 'products')
      .reduce((sum, i) => sum + i.line_total, 0);

    const subtotal = materials + processes + products;
    const vat = subtotal * 0.2;
    const grandTotal = subtotal + vat;

    return { materials, processes, products, subtotal, vat, grandTotal };
  }, [items]);

  const fmt = (n) => `£${Number(n).toFixed(2)}`;

  return (
    <div className="receipt-panel">
      <div className="receipt-panel__header">
        <h3 className="receipt-panel__title">Totals</h3>
        <button
          className={`receipt-panel__vat-toggle ${showVat ? 'active' : ''}`}
          onClick={() => setShowVat(!showVat)}
        >
          {showVat ? 'Inc. VAT' : 'Exc. VAT'}
        </button>
      </div>

      <div className="receipt-panel__lines">
        <div className="receipt-panel__line">
          <span className="receipt-panel__line-label">Materials</span>
          <span className="receipt-panel__line-value">{fmt(totals.materials)}</span>
        </div>
        <div className="receipt-panel__line">
          <span className="receipt-panel__line-label">Processes</span>
          <span className="receipt-panel__line-value">{fmt(totals.processes)}</span>
        </div>
        <div className="receipt-panel__line">
          <span className="receipt-panel__line-label">Products</span>
          <span className="receipt-panel__line-value">{fmt(totals.products)}</span>
        </div>

        <div className="receipt-panel__divider" />

        <div className="receipt-panel__line receipt-panel__line--bold">
          <span className="receipt-panel__line-label">Total</span>
          <span className="receipt-panel__line-value">{fmt(totals.subtotal)}</span>
        </div>

        {showVat && (
          <div className="receipt-panel__line">
            <span className="receipt-panel__line-label">VAT @20%</span>
            <span className="receipt-panel__line-value">{fmt(totals.vat)}</span>
          </div>
        )}

        <div className="receipt-panel__line receipt-panel__line--grand">
          <span className="receipt-panel__line-label">Grand Total</span>
          <span className="receipt-panel__line-value">
            {showVat ? fmt(totals.grandTotal) : fmt(totals.subtotal)}
          </span>
        </div>

        <div className="receipt-panel__divider" />

        <div className="receipt-panel__deposit">
          <label className="receipt-panel__deposit-label">Deposit</label>
          <div className="receipt-panel__deposit-input-wrap">
            <span className="receipt-panel__deposit-prefix">£</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={depositAmount}
              onChange={(e) => onDepositChange(parseFloat(e.target.value) || 0)}
              className="receipt-panel__deposit-input"
            />
          </div>
        </div>
      </div>

      <div className="receipt-panel__actions">
        <button
          className="receipt-panel__btn receipt-panel__btn--draft"
          onClick={onSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Draft'}
        </button>
        <button
          className="receipt-panel__btn receipt-panel__btn--send"
          onClick={onSend}
          disabled={saving || items.length === 0}
        >
          Send Quote
        </button>
      </div>
    </div>
  );
}
