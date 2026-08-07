import { Fragment, forwardRef, useImperativeHandle, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { BANK_DETAILS } from '../../../utils/bankDetails';
import { GOOGLE_REVIEW_URL } from '../../../utils/reviewRequestEmail';
import { itemTitle, itemDims, groupItems } from '../../../utils/quoteItems';
import './InvoicePDF.css';

// Static company letterhead (matches the quote documents).
const SUPPLIER = {
  name: 'The Quartz Company',
  lines: ['Unit 303/2  K2 House', 'Business Centre,', 'Heathfield Way,', 'Northampton'],
  postcode: 'NN5 7QP',
  email: 'sales@thequartzcompany.co.uk',
  phone: '07375 303 416',
};

// A4 portrait is 1:√2 — at the 794px render width, one page is this tall.
const A4_RATIO = 297 / 210;
const RENDER_WIDTH = 794;

// Below this, squeezing the document onto one page makes it unreadable, so it
// paginates instead.
const MIN_FIT_SCALE = 0.5;

// Derive a distinct invoice number from the quote number (QC-… -> INV-…).
// A balance invoice gets a "-B" suffix so the deposit invoice and the final
// invoice for the same order never share a number.
export function toInvoiceNumber(quoteNumber, mode) {
  if (!quoteNumber || quoteNumber === 'Draft') return '';
  const base = quoteNumber.replace(/^QC[-_]?/i, 'INV-');
  return mode === 'balance' ? `${base}-B` : base;
}

// `preview` renders the document in-flow (for the on-screen preview in the
// invoice builder) instead of parked offscreen ready for capture.
const InvoicePDF = forwardRef(function InvoicePDF({ data, preview = false }, ref) {
  const containerRef = useRef(null);

  const fmt = (n) => `£${Number(n || 0).toFixed(2)}`;

  const items = data?.allItems || [];
  const groups = groupItems(items);

  // Prefer the totals stored on the quote so the invoice can never drift from
  // what the customer was quoted; fall back to recomputing from the line items.
  const computedSubtotal = items.reduce((s, i) => s + (i.line_total || 0), 0);
  const subtotal = data?.subtotal != null ? Number(data.subtotal) : computedSubtotal;
  const vat = data?.vat != null ? Number(data.vat) : subtotal * 0.2;
  const grandTotal = data?.total != null ? Number(data.total) : subtotal + vat;

  // 'deposit'  — the up-front payment that starts the order
  // 'balance'  — what's left after a deposit has already been received
  // 'full'     — the whole amount in one go
  const mode = data?.mode || 'deposit';
  const depositPct = data?.depositPercent != null ? data.depositPercent : 50;
  const depositReceived = Number(data?.depositPaidAmount || 0);

  let amountDue;
  let dueLabel;
  if (mode === 'balance') {
    amountDue = Math.max(0, grandTotal - depositReceived);
    dueLabel = 'Balance Now Due';
  } else if (mode === 'full') {
    amountDue = grandTotal;
    dueLabel = 'Amount Due';
  } else {
    amountDue =
      data?.depositAmount != null ? Number(data.depositAmount) : grandTotal * (depositPct / 100);
    dueLabel = 'Deposit Due Now';
  }
  const remainingAfter = Math.max(0, grandTotal - depositReceived - amountDue);

  const invoiceNumber = data?.invoiceNumber || toInvoiceNumber(data?.quoteNumber, mode);
  const poNumber = data?.poNumber || '';
  const showReview = data?.showReview !== false && mode !== 'deposit';
  const reviewUrl = data?.reviewUrl || GOOGLE_REVIEW_URL;
  const reviewMessage =
    data?.reviewMessage ||
    'Thank you for choosing The Quartz Company — it has been a pleasure creating your worktops.';

  const customerLines = [
    data?.customerCompany,
    data?.customerAddress,
    data?.customerCity,
    data?.customerPostcode,
  ].filter((l) => l && String(l).trim());

  // Render the document to a jsPDF instance. Shared by the download and the
  // email attachment, so the customer's copy is byte-for-byte what the admin
  // sees when they hit Download.
  const buildPdf = async () => {
      const el = containerRef.current;
      if (!el) return null;

      el.style.position = 'fixed';
      el.style.left = '0';
      el.style.top = '0';
      el.style.zIndex = '9999';
      el.style.opacity = '1';
      el.style.pointerEvents = 'auto';

      try {
        // Measure any clickable regions (the Google review button) while the
        // document is laid out — html2canvas flattens them to pixels, so the
        // links have to be re-added to the PDF as annotations afterwards.
        const containerRect = el.getBoundingClientRect();
        const hotspots = Array.from(el.querySelectorAll('[data-pdf-link]')).map((node) => {
          const r = node.getBoundingClientRect();
          return {
            url: node.getAttribute('data-pdf-link'),
            x: r.left - containerRect.left,
            y: r.top - containerRect.top,
            w: r.width,
            h: r.height,
          };
        });

        const canvas = await html2canvas(el, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          width: 794,
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const fullHeight = (canvas.height * pdfWidth) / canvas.width;

        // An invoice belongs on one sheet. If the document runs over, shrink
        // it to fit rather than spilling the bank details onto page two —
        // but not past MIN_FIT_SCALE, where the type stops being readable.
        const fitScale = fullHeight > pageHeight ? pageHeight / fullHeight : 1;
        const singlePage = fitScale >= MIN_FIT_SCALE;

        let drawWidth = pdfWidth;
        let offsetX = 0;
        let pageCount = 1;

        if (singlePage) {
          drawWidth = pdfWidth * fitScale;
          offsetX = (pdfWidth - drawWidth) / 2;
          pdf.addImage(imgData, 'PNG', offsetX, 0, drawWidth, fullHeight * fitScale);
        } else {
          // Genuinely huge item list — slice it across pages instead of
          // shrinking it into illegibility.
          pageCount = Math.max(1, Math.ceil(fullHeight / pageHeight - 0.001));
          for (let page = 0; page < pageCount; page += 1) {
            if (page > 0) pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, -page * pageHeight, pdfWidth, fullHeight);
          }
        }

        // px -> mm, using the same ratio the image was drawn at.
        const ratio = drawWidth / (containerRect.width || 794);
        hotspots.forEach((h) => {
          if (!h.url) return;
          const yMm = h.y * ratio;
          const page = singlePage ? 0 : Math.min(pageCount - 1, Math.floor(yMm / pageHeight));
          pdf.setPage(page + 1);
          pdf.link(offsetX + h.x * ratio, yMm - page * pageHeight, h.w * ratio, h.h * ratio, {
            url: h.url,
          });
        });
        pdf.setPage(1);

        return pdf;
      } finally {
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        el.style.opacity = '0';
        el.style.pointerEvents = 'none';
        el.style.zIndex = '-1';
      }
  };

  const fileName = (base) => `${base || invoiceNumber || 'invoice'}.pdf`;

  useImperativeHandle(ref, () => ({
    // How the document will land on A4, so the builder can show the fit before
    // anyone downloads. Works while the element is parked offscreen — it's
    // still laid out, just invisible.
    measure: () => {
      const el = containerRef.current;
      if (!el) return null;
      const heightPx = el.offsetHeight;
      const onePagePx = (el.offsetWidth || RENDER_WIDTH) * A4_RATIO;
      if (!heightPx || !onePagePx) return null;
      const scale = heightPx > onePagePx ? onePagePx / heightPx : 1;
      return {
        scale,
        singlePage: scale >= MIN_FIT_SCALE,
        pages: Math.max(1, Math.ceil(heightPx / onePagePx - 0.001)),
      };
    },

    generate: async (filenameBase) => {
      const pdf = await buildPdf();
      if (pdf) pdf.save(fileName(filenameBase));
    },

    // Base64 PDF (no data: prefix) for emailing as an attachment.
    getBase64: async (filenameBase) => {
      const pdf = await buildPdf();
      if (!pdf) return null;
      const uri = pdf.output('datauristring');
      const marker = 'base64,';
      const at = uri.indexOf(marker);
      if (at === -1) return null;
      return { base64: uri.slice(at + marker.length), fileName: fileName(filenameBase) };
    },
  }));

  const renderItemRows = (itemList, keyPrefix) =>
    itemList.map((item, i) => {
      const dims = itemDims(item);
      const qty = item.quantity != null ? item.quantity : 1;
      return (
        <tr key={`${keyPrefix}-${i}`}>
          <td className="inv__cell">
            <div className="inv__item-name">{itemTitle(item)}</div>
            {dims && <div className="inv__item-sub">{dims}</div>}
          </td>
          <td className="inv__cell">{poNumber || '—'}</td>
          <td className="inv__cell inv__cell--center">{qty}</td>
          <td className="inv__cell inv__cell--right inv__cell--bold">{fmt(item.line_total)}</td>
        </tr>
      );
    });

  return (
    <div
      ref={containerRef}
      className="inv"
      style={
        preview
          ? undefined
          : { position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none', zIndex: -1 }
      }
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
              {data?.dueDate && <tr><td>Payment Due</td><td>{data.dueDate}</td></tr>}
              <tr><td>Order Ref.</td><td>{data?.quoteNumber && data.quoteNumber !== 'Draft' ? data.quoteNumber : '—'}</td></tr>
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
        <colgroup>
          <col style={{ width: 'auto' }} />
          <col style={{ width: '190px' }} />
          <col style={{ width: '70px' }} />
          <col style={{ width: '130px' }} />
        </colgroup>
        <thead>
          <tr>
            <th className="inv__th">Description</th>
            <th className="inv__th">PO Number</th>
            <th className="inv__th inv__th--center">Qty</th>
            <th className="inv__th inv__th--right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group, gi) => (
            <Fragment key={group.label || `group-${gi}`}>
              {group.label && (
                <tr><td colSpan={4} className="inv__section">{group.label}</td></tr>
              )}
              {renderItemRows(group.items, gi)}
            </Fragment>
          ))}
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
        {depositReceived > 0 && (
          <>
            <div className="inv__total-row inv__total-row--paid">
              <span>Deposit received{data?.depositPaidDate ? ` — ${data.depositPaidDate}` : ''}</span>
              <span>−{fmt(depositReceived)}</span>
            </div>
            <div className="inv__total-row inv__total-row--outstanding">
              <span>Outstanding</span><span>{fmt(Math.max(0, grandTotal - depositReceived))}</span>
            </div>
          </>
        )}
      </div>

      {/* Amount due on this invoice */}
      <div className="inv__due">
        <div className="inv__due-head">
          <span className="inv__due-label">{dueLabel}</span>
          <span className="inv__due-amount">{fmt(amountDue)}</span>
        </div>
        <p className="inv__due-note">
          {mode === 'balance' ? (
            <>
              Thank you for your deposit of {fmt(depositReceived)}. The remaining balance of{' '}
              {fmt(amountDue)}
              {data?.dueDate ? ` is due by ${data.dueDate}` : ' is now due'}. Please pay by bank
              transfer:
            </>
          ) : mode === 'full' ? (
            <>
              The full amount of {fmt(amountDue)}
              {data?.dueDate ? ` is due by ${data.dueDate}` : ' is now due'}. Please pay by bank
              transfer:
            </>
          ) : (
            <>
              A payment of {fmt(amountDue)} is due now to commence your order. The remaining balance
              of {fmt(remainingAfter)} is due on completion. Please pay by bank transfer:
            </>
          )}
        </p>
        <table className="inv__bank">
          <tbody>
            <tr><td>Account name</td><td>{BANK_DETAILS.accountName}</td></tr>
            <tr><td>Sort code</td><td>{BANK_DETAILS.sortCode}</td></tr>
            <tr><td>Account number</td><td>{BANK_DETAILS.accountNumber}</td></tr>
            <tr><td>Bank</td><td>{BANK_DETAILS.bankName}</td></tr>
            <tr><td>Reference</td><td>{data?.quoteNumber && data.quoteNumber !== 'Draft' ? data.quoteNumber : '—'}</td></tr>
          </tbody>
        </table>
      </div>

      {/* Google review invitation — the button is a real clickable link in the
          exported PDF (added back as a link annotation after rasterising). */}
      {showReview && (
        <div className="inv__review">
          <div className="inv__review-stars">★ ★ ★ ★ ★</div>
          <div className="inv__review-title">How did we do?</div>
          <p className="inv__review-text">{reviewMessage}</p>
          <p className="inv__review-text">
            If you have a moment, we would be hugely grateful if you would share your experience.
            It takes less than a minute and helps other homeowners find us.
          </p>
          <div className="inv__review-btn" data-pdf-link={reviewUrl}>
            Leave us a Google review
          </div>
          <p className="inv__review-url" data-pdf-link={reviewUrl}>{reviewUrl}</p>
        </div>
      )}

      {/* Footer */}
      <div className="inv__footer">
        <p>{SUPPLIER.name} &nbsp;·&nbsp; {SUPPLIER.email} &nbsp;·&nbsp; {SUPPLIER.phone}</p>
        <p>
          {mode === 'deposit'
            ? 'Payment terms: deposit due on order, balance due on completion. Thank you for your business.'
            : 'Thank you for your business.'}
        </p>
      </div>
    </div>
  );
});

export default InvoicePDF;
