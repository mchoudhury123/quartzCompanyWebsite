import { forwardRef, useImperativeHandle, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import './QuotePDF.css';

const QuotePDF = forwardRef(function QuotePDF({ data }, ref) {
  const containerRef = useRef(null);

  const fmt = (n) => `£${Number(n || 0).toFixed(2)}`;

  const items = data?.allItems || [];

  // Category grouping
  const materials = items.filter((i) => i.category === 'stones');
  const processes = items.filter((i) => i.category === 'processes');
  const products = items.filter((i) => i.category !== 'stones' && i.category !== 'processes');

  const subtotal = items.reduce((s, i) => s + (i.line_total || 0), 0);
  const totalDiscount = items.reduce((s, i) => s + (i.discount || 0), 0);
  const vat = subtotal * 0.2;
  const grandTotal = subtotal + vat;
  const deposit = grandTotal * 0.2;

  useImperativeHandle(ref, () => ({
    generate: async (savedQuote) => {
      const el = containerRef.current;
      if (!el) return;

      // Temporarily make visible for capture
      el.style.position = 'fixed';
      el.style.left = '0';
      el.style.top = '0';
      el.style.zIndex = '9999';
      el.style.opacity = '1';
      el.style.pointerEvents = 'auto';

      try {
        const canvas = await html2canvas(el, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          width: 794, // A4 width at 96 DPI
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

        const filename = savedQuote?.quote_number
          ? `${savedQuote.quote_number}.pdf`
          : 'quote.pdf';
        pdf.save(filename);
      } finally {
        // Hide again
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        el.style.opacity = '0';
        el.style.pointerEvents = 'none';
        el.style.zIndex = '-1';
      }
    },
  }));

  const renderItemRows = (itemList) =>
    itemList.map((item, i) => (
      <tr key={i} className="qpdf__row">
        <td className="qpdf__cell">{item.product_name}</td>
        <td className="qpdf__cell qpdf__cell--right">{fmt(item.original_price)}</td>
        <td className="qpdf__cell qpdf__cell--right qpdf__cell--discount">
          {item.discount > 0 ? `-${fmt(item.discount)}` : '—'}
        </td>
        <td className="qpdf__cell qpdf__cell--right qpdf__cell--bold">{fmt(item.line_total)}</td>
      </tr>
    ));

  return (
    <div
      ref={containerRef}
      className="qpdf"
      style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none', zIndex: -1 }}
    >
      {/* Header */}
      <div className="qpdf__header">
        <div className="qpdf__logo">THE QUARTZ COMPANY</div>
        <div className="qpdf__header-right">
          <div className="qpdf__qnum">{data?.quoteNumber || ''}</div>
          <div className="qpdf__date">{data?.date || ''}</div>
        </div>
      </div>

      <div className="qpdf__divider" />

      {/* Material info */}
      {data?.materialName && (
        <div className="qpdf__material">
          <span className="qpdf__material-label">Material:</span> {data.materialName} ({data.thickness})
        </div>
      )}

      {/* Items table */}
      <table className="qpdf__table">
        <thead>
          <tr>
            <th className="qpdf__th">Item</th>
            <th className="qpdf__th qpdf__th--right">Price</th>
            <th className="qpdf__th qpdf__th--right">Discount</th>
            <th className="qpdf__th qpdf__th--right">Total</th>
          </tr>
        </thead>
        <tbody>
          {materials.length > 0 && (
            <>
              <tr><td colSpan={4} className="qpdf__section">Materials</td></tr>
              {renderItemRows(materials)}
            </>
          )}
          {processes.length > 0 && (
            <>
              <tr><td colSpan={4} className="qpdf__section">Processes</td></tr>
              {renderItemRows(processes)}
            </>
          )}
          {products.length > 0 && (
            <>
              <tr><td colSpan={4} className="qpdf__section">Products</td></tr>
              {renderItemRows(products)}
            </>
          )}
        </tbody>
      </table>

      {/* Totals */}
      <div className="qpdf__divider" />
      <div className="qpdf__totals">
        {totalDiscount > 0 && (
          <div className="qpdf__total-row qpdf__total-row--saved">
            <span>Total Saved</span>
            <span>{fmt(totalDiscount)}</span>
          </div>
        )}
        <div className="qpdf__total-row">
          <span>Subtotal</span>
          <span>{fmt(subtotal)}</span>
        </div>
        <div className="qpdf__total-row">
          <span>VAT @20%</span>
          <span>{fmt(vat)}</span>
        </div>
        <div className="qpdf__total-row qpdf__total-row--grand">
          <span>Grand Total</span>
          <span>{fmt(grandTotal)}</span>
        </div>
        <div className="qpdf__divider" />
        <div className="qpdf__total-row qpdf__total-row--deposit">
          <span>Deposit (20%)</span>
          <span>{fmt(deposit)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="qpdf__footer">
        <p>The Quartz Company</p>
        <p>info@thequartzcompany.co.uk | www.thequartzcompany.co.uk</p>
      </div>
    </div>
  );
});

export default QuotePDF;
