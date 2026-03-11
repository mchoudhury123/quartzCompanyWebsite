import { useMemo, useState } from 'react';
import { FiSave, FiDownload, FiMail } from 'react-icons/fi';
import './ReceiptPanel.css';

function getCategoryLabel(cat) {
  if (cat === 'stones') return 'Materials';
  if (cat === 'processes') return 'Processes';
  if (cat === 'worktop') return 'Products';
  if (cat === 'upstand') return 'Products';
  if (cat === 'splashback') return 'Products';
  if (cat === 'cladding') return 'Products';
  if (cat === 'cill') return 'Products';
  return 'Products';
}

function getPricingGroup(cat) {
  if (cat === 'stones') return 'materials';
  if (cat === 'processes') return 'processes';
  return 'products';
}

export default function ReceiptPanel({
  items,
  onSaveDraft,
  onDownloadPDF,
  onSendEmail,
  saving,
}) {
  const [detailed, setDetailed] = useState(false);
  const [showVat, setShowVat] = useState(true);

  const totals = useMemo(() => {
    const groups = { materials: { price: 0, discount: 0, sale: 0 }, processes: { price: 0, discount: 0, sale: 0 }, products: { price: 0, discount: 0, sale: 0 } };

    items.forEach((i) => {
      const g = getPricingGroup(i.category);
      groups[g].price += i.original_price || 0;
      groups[g].discount += i.discount || 0;
      groups[g].sale += i.line_total || 0;
    });

    const totalPrice = groups.materials.price + groups.processes.price + groups.products.price;
    const totalDiscount = groups.materials.discount + groups.processes.discount + groups.products.discount;
    const totalSale = groups.materials.sale + groups.processes.sale + groups.products.sale;
    const vat = totalSale * 0.2;
    const grandTotal = totalSale + vat;
    const deposit = grandTotal * 0.2;

    return { groups, totalPrice, totalDiscount, totalSale, vat, grandTotal, deposit };
  }, [items]);

  const fmt = (n) => `£${Number(n).toFixed(2)}`;

  const renderLine = (label, price, discount, sale, bold) => (
    <div className={`rp__row ${bold ? 'rp__row--bold' : ''}`}>
      <span className="rp__row-label">{label}</span>
      {detailed ? (
        <>
          <span className="rp__row-val">{fmt(price)}</span>
          <span className="rp__row-val rp__row-val--discount">{fmt(discount)}</span>
          <span className="rp__row-val rp__row-val--sale">{fmt(sale)}</span>
        </>
      ) : (
        <span className="rp__row-val rp__row-val--sale">{fmt(sale)}</span>
      )}
    </div>
  );

  return (
    <div className={`receipt-panel ${detailed ? 'receipt-panel--detailed' : ''}`}>
      {/* Header toggles */}
      <div className="rp__header">
        <h3 className="rp__title">Totals</h3>
        <div className="rp__toggles">
          <button
            className={`rp__toggle ${detailed ? 'active' : ''}`}
            onClick={() => setDetailed(!detailed)}
          >
            Detailed
          </button>
          <button
            className={`rp__toggle ${showVat ? 'active' : ''}`}
            onClick={() => setShowVat(!showVat)}
          >
            Inc. VAT
          </button>
        </div>
      </div>

      {/* Column headers (detailed mode) */}
      {detailed && (
        <div className="rp__col-headers">
          <span></span>
          <span>Price</span>
          <span>Discount</span>
          <span>Sale</span>
        </div>
      )}

      <div className="rp__body">
        {/* Category rows */}
        {renderLine('Materials', totals.groups.materials.price, totals.groups.materials.discount, totals.groups.materials.sale)}
        {renderLine('Processes', totals.groups.processes.price, totals.groups.processes.discount, totals.groups.processes.sale)}
        {renderLine('Products', totals.groups.products.price, totals.groups.products.discount, totals.groups.products.sale)}

        {/* Detailed: show individual line items */}
        {detailed && items.length > 0 && (
          <>
            <div className="rp__divider" />
            <div className="rp__section-label">Breakdown</div>
            {items.map((item, i) => (
              <div key={i} className="rp__row rp__row--detail">
                <span className="rp__row-label rp__row-label--detail">{item.product_name}</span>
                <span className="rp__row-val">{fmt(item.original_price || 0)}</span>
                <span className="rp__row-val rp__row-val--discount">{fmt(item.discount || 0)}</span>
                <span className="rp__row-val rp__row-val--sale">{fmt(item.line_total || 0)}</span>
              </div>
            ))}
          </>
        )}

        <div className="rp__divider" />

        {/* Total Saved */}
        {totals.totalDiscount > 0 && (
          <div className="rp__row rp__row--saved">
            <span className="rp__row-label">Total Saved</span>
            <span className="rp__row-val rp__row-val--saved">{fmt(totals.totalDiscount)}</span>
          </div>
        )}

        {/* Subtotal */}
        <div className="rp__row rp__row--bold">
          <span className="rp__row-label">Total</span>
          <span className="rp__row-val rp__row-val--sale">{fmt(totals.totalSale)}</span>
        </div>

        {/* VAT */}
        {showVat && (
          <div className="rp__row">
            <span className="rp__row-label">VAT Inc @20%</span>
            <span className="rp__row-val rp__row-val--sale">{fmt(totals.vat)}</span>
          </div>
        )}

        {/* Grand Total */}
        <div className="rp__row rp__row--grand">
          <span className="rp__row-label">Grand Total</span>
          <span className="rp__row-val rp__row-val--grand">
            {showVat ? fmt(totals.grandTotal) : fmt(totals.totalSale)}
          </span>
        </div>

        <div className="rp__divider" />

        {/* Deposit (auto 20%) */}
        <div className="rp__row rp__row--deposit">
          <span className="rp__row-label">Deposit Amount<br /><span className="rp__row-sub">20% of Grand Total</span></span>
          <span className="rp__row-val rp__row-val--deposit">
            {showVat ? fmt(totals.deposit) : fmt(totals.totalSale * 0.2)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="rp__actions-stack">
        <button
          className="rp__btn rp__btn--draft"
          onClick={onSaveDraft}
          disabled={saving}
        >
          <FiSave /> {saving ? 'Saving...' : 'Save Draft'}
        </button>
        <button
          className="rp__btn rp__btn--pdf"
          onClick={onDownloadPDF}
          disabled={saving || items.length === 0}
        >
          <FiDownload /> Download PDF
        </button>
        <button
          className="rp__btn rp__btn--email"
          onClick={onSendEmail}
          disabled={saving || items.length === 0}
        >
          <FiMail /> Send Email
        </button>
      </div>
    </div>
  );
}
