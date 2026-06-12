import { forwardRef, useImperativeHandle, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { BANK_DETAILS } from '../../../utils/bankDetails';
import './InvoicePDF.css';

// Static company letterhead (matches the quote documents).
const SUPPLIER = {
  name: 'The Quartz Company',
  lines: ['Unit 303/2  K2 House', 'Business Centre,', 'Heathfield Way,', 'Northampton'],
  postcode: 'NN5 7QP',
  email: 'sales@thequartzcompany.co.uk',
  phone: '07375 303 416',
};

// Derive a distinct invoice number from the quote number (QC-… -> INV-…).
function toInvoiceNumber(quoteNumber) {
  if (!quoteNumber || quoteNumber === 'Draft') return '';
  return quoteNumber.replace(/^QC[-_]?/i, 'INV-');
}

const InvoicePDF = forwardRef(function InvoicePDF({ data }, ref) {
  const containerRef = useRef(null);

  const fmt = (n) => `£${Number(n || 0).toFixed(2)}`;

  const items = data?.allItems || [];
  const materials = items.filter((i) => i.category === 'stones');
  const processes = items.filter((i) => i.category === 'processes');
  const products = items.filter((i) => i.category !== 'stones' && i.category !== 'processes');

  const subtotal = items.reduce((s, i) => s + (i.line_total || 0), 0);
  const vat = subtotal * 0.2;
  const grandTotal = subtotal + vat;
  // Invoices always require 50% of the full amount up front.
  const duePct = 50;
  const amountDue = grandTotal * (duePct / 100);
  const balance = grandTotal - amountDue;

  const invoiceNumber = toInvoiceNumber(data?.quoteNumber);
  const poNumber = data?.poNumber || '';

  const customerLines = [
    data?.customerCompany,
    data?.customerAddress,
    data?.customerCity,
    data?.customerPostcode,
  ].filter((l) => l && String(l).trim());

  useImperativeHandle(ref, () => ({
    generate: async (filenameBase) => {
      const el = containerRef.current;
      if (!el) return;

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
          width: 794,
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${filenameBase || invoiceNumber || 'invoice'}.pdf`);
      } finally {
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
        <tr key={i}>
          <td className="inv__cell">
            <div className="inv__item-name">{item.product_name}</div>
            {dims && <div className="inv__item-sub">{dims}</div>}
          </td>
          <td className="inv__cell inv__cell--center">{qty}</td>
          <td className="inv__cell inv__cell--right inv__cell--bold">{fmt(item.line_total)}</td>
        </tr>
      );
    });

  return (
    <div
      ref={containerRef}
      className="inv"
      style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none', zIndex: -1 }}
    >
      {/* Header band: logo + INVOICE wordmark */}
      <div className="inv__head">
        <div className="inv__head-left">
          <img src="/logo.png" alt="The Quartz Company" className="inv__logo" />
        </div>
        <div className="inv__head-right">
          <div className="inv__title">INVOICE</div>
          <table className="inv__meta">
            <tbody>
              <tr><td>Invoice No.</td><td>{invoiceNumber || '—'}</td></tr>
              <tr><td>Invoice Date</td><td>{data?.date || ''}</td></tr>
              <tr><td>PO Number</td><td>{poNumber || '—'}</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="inv__band" />

      {/* Bill to / From */}
      <div className="inv__parties">
        <div className="inv__party">
          <div className="inv__party-label">Bill To</div>
          {data?.customerName && <div className="inv__party-name">{data.customerName}</div>}
          {customerLines.map((l, i) => (
            <div key={i} className="inv__party-line">{l}</div>
          ))}
        </div>
        <div className="inv__party inv__party--right">
          <div className="inv__party-label">From</div>
          <div className="inv__party-name">{SUPPLIER.name}</div>
          {SUPPLIER.lines.map((l, i) => (
            <div key={i} className="inv__party-line">{l}</div>
          ))}
          <div className="inv__party-line">{SUPPLIER.postcode}</div>
        </div>
      </div>

      {/* Line items */}
      <table className="inv__table">
        <thead>
          <tr>
            <th className="inv__th">Description</th>
            <th className="inv__th inv__th--center">Qty</th>
            <th className="inv__th inv__th--right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {materials.length > 0 && (
            <>
              <tr><td colSpan={3} className="inv__section">Materials</td></tr>
              {renderItemRows(materials)}
            </>
          )}
          {processes.length > 0 && (
            <>
              <tr><td colSpan={3} className="inv__section">Processes</td></tr>
              {renderItemRows(processes)}
            </>
          )}
          {products.length > 0 && (
            <>
              <tr><td colSpan={3} className="inv__section">Products</td></tr>
              {renderItemRows(products)}
            </>
          )}
        </tbody>
      </table>

      {/* Totals */}
      <div className="inv__totals">
        <div className="inv__total-row">
          <span>Subtotal</span><span>{fmt(subtotal)}</span>
        </div>
        <div className="inv__total-row">
          <span>VAT @20%</span><span>{fmt(vat)}</span>
        </div>
        <div className="inv__total-row inv__total-row--grand">
          <span>Total</span><span>{fmt(grandTotal)}</span>
        </div>
      </div>

      {/* Amount due now (50%) */}
      <div className="inv__due">
        <div className="inv__due-head">
          <span className="inv__due-label">Amount Due Now ({duePct}%)</span>
          <span className="inv__due-amount">{fmt(amountDue)}</span>
        </div>
        <p className="inv__due-note">
          A {duePct}% payment of {fmt(amountDue)} is due now to commence your order. The remaining
          balance of {fmt(balance)} is due on completion. Please pay by bank transfer:
        </p>
        <table className="inv__bank">
          <tbody>
            <tr><td>Account name</td><td>{BANK_DETAILS.accountName}</td></tr>
            <tr><td>Sort code</td><td>{BANK_DETAILS.sortCode}</td></tr>
            <tr><td>Account number</td><td>{BANK_DETAILS.accountNumber}</td></tr>
            <tr><td>Bank</td><td>{BANK_DETAILS.bankName}</td></tr>
            <tr><td>Reference</td><td>{poNumber || invoiceNumber || '—'}</td></tr>
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="inv__footer">
        <p>{SUPPLIER.name} &nbsp;·&nbsp; {SUPPLIER.email} &nbsp;·&nbsp; {SUPPLIER.phone}</p>
        <p>Payment terms: 50% due on order, balance due on completion. Thank you for your business.</p>
      </div>
    </div>
  );
});

export default InvoicePDF;
