import { forwardRef, useImperativeHandle, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { BANK_DETAILS } from '../../../utils/bankDetails';
import './QuotePDF.css';

// Static company letterhead (matches the quote email supplier block).
const SUPPLIER = {
  name: 'The Quartz Company',
  lines: ['Unit 303/2  K2 House', 'Business Centre,', 'Heathfield Way,', 'Northampton'],
  postcode: 'NN5 7QP',
  email: 'sales@thequartzcompany.co.uk',
  phone: '07375 303 416',
};

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
  const depositPct = data?.depositPercent != null ? data.depositPercent : 50;
  const deposit = grandTotal * (depositPct / 100);

  const quoteNumber = data?.quoteNumber || '';
  const reference = quoteNumber && quoteNumber !== 'Draft' ? quoteNumber : '(your quote number)';

  // Customer address lines (skip blanks)
  const customerLines = [
    data?.customerCompany,
    data?.customerAddress,
    data?.customerCity,
    data?.customerPostcode,
  ].filter((l) => l && String(l).trim());

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
    itemList.map((item, i) => {
      const dims = item.x_mm && item.y_mm ? `${item.x_mm}×${item.y_mm}mm` : '';
      const qty = item.quantity != null ? item.quantity : 1;
      return (
        <tr key={i} className="qpdf__row">
          <td className="qpdf__cell">
            <div className="qpdf__item-name">{item.product_name}</div>
            {dims && <div className="qpdf__item-sub">{dims}</div>}
          </td>
          <td className="qpdf__cell qpdf__cell--center">{qty}</td>
          <td className="qpdf__cell qpdf__cell--right">{fmt(item.original_price)}</td>
          <td className="qpdf__cell qpdf__cell--right qpdf__cell--discount">
            {item.discount > 0 ? `-${fmt(item.discount)}` : '—'}
          </td>
          <td className="qpdf__cell qpdf__cell--right qpdf__cell--bold">{fmt(item.line_total)}</td>
        </tr>
      );
    });

  return (
    <div
      ref={containerRef}
      className="qpdf"
      style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none', zIndex: -1 }}
    >
      <div className="qpdf__accent" />

      {/* Date — kept near the top */}
      <div className="qpdf__datebar">Date: <strong>{data?.date || ''}</strong></div>

      {/* Letterhead: supplier · logo · customer */}
      <div className="qpdf__top">
        <div className="qpdf__party">
          <div className="qpdf__party-label">Supplier</div>
          <div className="qpdf__party-name">{SUPPLIER.name}</div>
          {SUPPLIER.lines.map((l, i) => (
            <div key={i} className="qpdf__party-line">{l}</div>
          ))}
          <div className="qpdf__party-line">{SUPPLIER.postcode}</div>
        </div>

        <div className="qpdf__brand">
          <img src="/logo.png" alt="The Quartz Company" className="qpdf__brand-logo" />
        </div>

        <div className="qpdf__party qpdf__party--right">
          <div className="qpdf__party-label">Customer</div>
          {data?.customerName && <div className="qpdf__party-name">{data.customerName}</div>}
          {customerLines.map((l, i) => (
            <div key={i} className="qpdf__party-line">{l}</div>
          ))}
        </div>
      </div>

      {/* Quotation heading */}
      <div className="qpdf__quote-head">
        <span className="qpdf__quote-eyebrow">Your Quotation</span>
        <span className="qpdf__quote-number">{quoteNumber || 'Draft'}</span>
      </div>

      <div className="qpdf__divider" />

      {/* Items table */}
      <table className="qpdf__table">
        <thead>
          <tr>
            <th className="qpdf__th">Item</th>
            <th className="qpdf__th qpdf__th--center">Qty</th>
            <th className="qpdf__th qpdf__th--right">Price</th>
            <th className="qpdf__th qpdf__th--right">Discount</th>
            <th className="qpdf__th qpdf__th--right">Total</th>
          </tr>
        </thead>
        <tbody>
          {materials.length > 0 && (
            <>
              <tr><td colSpan={5} className="qpdf__section">Materials</td></tr>
              {renderItemRows(materials)}
            </>
          )}
          {processes.length > 0 && (
            <>
              <tr><td colSpan={5} className="qpdf__section">Processes</td></tr>
              {renderItemRows(processes)}
            </>
          )}
          {products.length > 0 && (
            <>
              <tr><td colSpan={5} className="qpdf__section">Products</td></tr>
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
      </div>

      {/* Deposit + bank transfer */}
      <div className="qpdf__deposit">
        <div className="qpdf__deposit-head">
          <span className="qpdf__deposit-label">Deposit to Secure ({depositPct}%)</span>
          <span className="qpdf__deposit-amount">{fmt(deposit)}</span>
        </div>
        <p className="qpdf__deposit-note">
          A {depositPct}% deposit of {fmt(deposit)} is required to secure your order. Please pay by
          bank transfer using the details below.
        </p>
        <table className="qpdf__bank">
          <tbody>
            <tr><td>Account name</td><td>{BANK_DETAILS.accountName}</td></tr>
            <tr><td>Sort code</td><td>{BANK_DETAILS.sortCode}</td></tr>
            <tr><td>Account number</td><td>{BANK_DETAILS.accountNumber}</td></tr>
            <tr><td>Bank</td><td>{BANK_DETAILS.bankName}</td></tr>
            <tr><td>Reference</td><td>{reference}</td></tr>
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="qpdf__footer">
        <p>{SUPPLIER.name}</p>
        <p>{SUPPLIER.email} &nbsp;·&nbsp; {SUPPLIER.phone}</p>
      </div>
    </div>
  );
});

export default QuotePDF;
