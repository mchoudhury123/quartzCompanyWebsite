import { useEffect, useMemo, useRef, useState } from 'react';
import { FiDownload, FiMail } from 'react-icons/fi';
import { supabase } from '../../../lib/supabase';
import { buildInvoiceEmail } from '../../../utils/invoiceEmail';
import { GOOGLE_REVIEW_URL } from '../../../utils/reviewRequestEmail';
import InvoicePDF, { toInvoiceNumber } from '../quote-builder/InvoicePDF';
import ModalShell from './ModalShell';
import './InvoiceModal.css';

const DEFAULT_REVIEW_MESSAGE =
  'Thank you for choosing The Quartz Company — it has been a pleasure creating your worktops.';

const isoToday = () => new Date().toISOString().split('T')[0];

const isoPlusDays = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

const prettyDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

const money = (n) => `£${Number(n || 0).toFixed(2)}`;

// Round to pennies so an edited deposit can't leave a fraction-of-a-penny
// balance on the document.
const pence = (n) => Math.round((Number(n) || 0) * 100) / 100;

// Vercel rejects a request body over 4.5MB at the proxy, before the function
// runs — so this has to be checked HERE, in the browser. A server-side check
// never gets the chance to fire, it just comes back as a bare 413.
const MAX_ATTACH_BASE64 = 3_000_000;

/**
 * Invoice builder — opened from the Quotes tab ("Generate Invoice").
 *
 * Turns the quote into a deposit / balance / full invoice, previews it live,
 * downloads it as a PDF, and optionally emails it to the customer. Once a
 * deposit has been received the invoice also carries a "leave us a Google
 * review" button, which is a genuine clickable link in both the PDF and email.
 *
 * The deposit figure here only affects this document — recording a payment
 * against the order is still the Quotes tab's "Mark Deposit Paid" button.
 */
export default function InvoiceModal({ quote, leadId, onClose }) {
  const invoiceRef = useRef(null);

  const total = pence(quote.total || 0);
  const quoteDeposit = pence(quote.deposit_amount || 0);

  const [lead, setLead] = useState(null);
  const [mode, setMode] = useState(quote.deposit_paid ? 'balance' : 'deposit');
  const [invoiceDate, setInvoiceDate] = useState(isoToday());
  const [dueDate, setDueDate] = useState(isoPlusDays(7));
  const [poNumber, setPoNumber] = useState('');
  const [showReview, setShowReview] = useState(Boolean(quote.deposit_paid));
  const [reviewMessage, setReviewMessage] = useState(DEFAULT_REVIEW_MESSAGE);
  const [busy, setBusy] = useState(false);
  const [sendState, setSendState] = useState(null); // 'sending' | 'sent' | 'error'
  const [sendError, setSendError] = useState('');

  // Deposit already received. Pre-filled from the quote, but editable — the
  // customer may have paid a different figure to the one quoted.
  const [depositTaken, setDepositTaken] = useState(Boolean(quote.deposit_paid));
  const [depositInput, setDepositInput] = useState(
    quoteDeposit > 0 ? quoteDeposit.toFixed(2) : ''
  );
  const [depositDate, setDepositDate] = useState(
    quote.deposit_paid_at ? String(quote.deposit_paid_at).split('T')[0] : ''
  );

  useEffect(() => {
    let cancelled = false;
    supabase
      .from('leads')
      .select('full_name, email, company, address, city, postcode')
      .eq('id', leadId)
      .single()
      .then(({ data }) => {
        if (!cancelled) setLead(data || null);
      });
    return () => {
      cancelled = true;
    };
  }, [leadId]);

  // A deposit invoice asks for money up front — never bolt a review request
  // onto it. Switching back to a balance/full invoice re-offers it.
  useEffect(() => {
    setShowReview(mode !== 'deposit');
  }, [mode]);

  const subtotal = pence(quote.subtotal != null ? quote.subtotal : total / 1.2);
  const vat = pence(quote.vat != null ? quote.vat : total - subtotal);
  const items = Array.isArray(quote.items) ? quote.items : [];

  // Only a balance invoice nets off a deposit — a "full amount" invoice by
  // definition asks for the lot.
  const depositPaidAmount =
    mode === 'balance' && depositTaken ? Math.min(total, Math.max(0, pence(depositInput))) : 0;

  const amountDue = useMemo(() => {
    if (mode === 'balance') return pence(Math.max(0, total - depositPaidAmount));
    if (mode === 'full') return total;
    return quoteDeposit;
  }, [mode, total, depositPaidAmount, quoteDeposit]);

  const invoiceNumber = toInvoiceNumber(quote.quote_number, mode);

  const invoiceData = {
    quoteNumber: quote.quote_number,
    invoiceNumber,
    mode,
    date: prettyDate(invoiceDate),
    dueDate: prettyDate(dueDate),
    poNumber,
    allItems: items,
    subtotal,
    vat,
    total,
    depositAmount: quoteDeposit,
    depositPaidAmount,
    depositPaidDate: prettyDate(depositDate),
    showReview,
    reviewUrl: GOOGLE_REVIEW_URL,
    reviewMessage,
    customerName: lead?.full_name || '',
    customerCompany: lead?.company || '',
    customerAddress: lead?.address || '',
    customerCity: lead?.city || '',
    customerPostcode: lead?.postcode || '',
  };

  const handleDownload = async () => {
    if (busy) return;
    setBusy(true);
    try {
      // Let the hidden template re-render with the current settings first.
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      if (invoiceRef.current) await invoiceRef.current.generate(invoiceNumber || 'invoice');
    } finally {
      setBusy(false);
    }
  };

  const handleEmail = async () => {
    if (busy || sendState === 'sending') return;
    if (!lead?.email) {
      window.alert("This customer doesn't have an email address on file.");
      return;
    }
    if (!window.confirm(`Email invoice ${invoiceNumber} to ${lead.email}?`)) return;

    setSendState('sending');
    setSendError('');

    // Build the same PDF the Download button produces and send it along as an
    // attachment. If it can't be built, the email still goes — the HTML body
    // is a complete invoice on its own.
    let pdf = null;
    let oversized = '';
    try {
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      if (invoiceRef.current?.getBase64) pdf = await invoiceRef.current.getBase64(invoiceNumber);
      if (pdf && pdf.base64.length > MAX_ATTACH_BASE64) {
        // Report the actual size — if this ever fires we want to know by how
        // much, not just that it happened.
        oversized = `${((pdf.base64.length * 3) / 4 / 1024 / 1024).toFixed(1)}MB`;
        pdf = null;
      }
    } catch (_) {
      pdf = null;
    }

    const firstName = (lead.full_name || '').split(' ')[0] || 'there';
    const { subject, html } = buildInvoiceEmail({
      firstName,
      invoiceNumber,
      quoteNumber: quote.quote_number,
      mode,
      items,
      subtotal,
      vat,
      total,
      depositPaidAmount,
      depositPaidDate: prettyDate(depositDate),
      amountDue,
      invoiceDate: prettyDate(invoiceDate),
      dueDate: prettyDate(dueDate),
      poNumber,
      customerName: lead.full_name || '',
      customerCompany: lead.company || '',
      customerAddress: lead.address || '',
      customerCity: lead.city || '',
      customerPostcode: lead.postcode || '',
      showReview,
      reviewMessage,
      hasAttachment: Boolean(pdf?.base64),
      attachmentName: pdf?.fileName || '',
      logoUrl: `${window.location.origin}/logo.png`,
    });

    try {
      const res = await fetch('/api/zoho-send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: lead.email,
          subject,
          body: subject,
          html,
          transactional: true,
          pdfBase64: pdf?.base64 || '',
          fileName: pdf?.fileName || '',
        }),
      });
      // The /api routes are Vercel serverless functions — they don't exist
      // under `vite dev`, which is by far the most common reason this fails.
      if (res.status === 404) {
        setSendError(
          "Sending email only works on the live site — the /api functions aren't running on localhost. Download the PDF instead, or try again on thequartzcompany.co.uk."
        );
        setSendState('error');
        return;
      }

      let data = null;
      try {
        data = await res.json();
      } catch (_) {
        data = null;
      }

      if (res.status === 413) {
        setSendError(
          'The invoice PDF was too large to send. Untick the Google review button to shorten the document, or download the PDF and attach it by hand.'
        );
        setSendState('error');
        return;
      }

      if (!data || data.error) {
        setSendError(data?.error || `The email service returned an unexpected response (HTTP ${res.status}).`);
        setSendState('error');
        return;
      }
      setSendState('sent');
      // Sent, but without the PDF — say so rather than let the admin assume
      // the customer got an attachment.
      if (oversized) {
        setSendError(
          `The invoice was emailed, but the PDF (${oversized}) was too large to attach. The email itself is a full invoice, so nothing is missing — send them the downloaded PDF separately if they need it.`
        );
      } else if (data.attachWarning) {
        setSendError(data.attachWarning);
      }

      // Log it against the lead so the Emails tab shows the invoice was sent.
      try {
        await supabase.from('lead_emails').insert({
          lead_id: leadId,
          direction: 'outbound',
          subject,
          body: `Invoice ${invoiceNumber} — ${money(amountDue)} due${
            data.attached ? ` (PDF attached: ${pdf?.fileName})` : ''
          }`,
          to_address: lead.email,
          from_address: 'sales@thequartzcompany.co.uk',
          zoho_message_id: data.messageId || null,
          status: 'sent',
          sent_by: 'Admin',
        });
      } catch (_) {
        /* activity logging is best-effort */
      }
    } catch (err) {
      setSendError(err?.message || 'Could not reach the email service.');
      setSendState('error');
    }
  };

  const emailLabel = () => {
    switch (sendState) {
      case 'sending':
        return 'Sending…';
      case 'sent':
        return 'Invoice sent ✓';
      case 'error':
        return 'Failed — retry';
      default:
        return 'Email to customer';
    }
  };

  const depositOverTotal = depositTaken && pence(depositInput) > total;

  // Re-measure the hidden document whenever something that affects its height
  // changes, so the preview can report how it will land on A4.
  const [fit, setFit] = useState(null);
  const layoutKey = [
    items.length,
    mode,
    showReview,
    reviewMessage,
    depositPaidAmount,
    depositDate,
    invoiceDate,
    dueDate,
    poNumber,
    lead?.full_name,
    lead?.company,
    lead?.address,
    lead?.city,
    lead?.postcode,
  ].join('|');

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      if (invoiceRef.current?.measure) setFit(invoiceRef.current.measure());
    });
    return () => cancelAnimationFrame(id);
  }, [layoutKey]);

  const fitLabel = () => {
    if (!fit) return '';
    if (!fit.singlePage) return `${fit.pages} pages`;
    if (fit.scale >= 0.999) return 'Fits on one page';
    return `One page — scaled to ${Math.round(fit.scale * 100)}%`;
  };

  return (
    <>
      <ModalShell
        title={`Invoice — ${quote.quote_number}`}
        onClose={onClose}
        className="inv-modal-shell"
      >
        <div className="inv-modal">
          <div className="inv-modal__controls">
            <p className="inv-modal__intro">
              {lead?.full_name ? <strong>{lead.full_name}</strong> : 'Customer'} ·{' '}
              {quote.title || 'Order'} · Total {money(total)}
            </p>

            <div className="modal-field">
              <span className="modal-field__label">Payment required</span>
              <div className="inv-modal__modes">
                {[
                  { key: 'deposit', label: 'Deposit', hint: money(quoteDeposit) },
                  { key: 'balance', label: 'Balance', hint: money(Math.max(0, total - depositPaidAmount)) },
                  { key: 'full', label: 'Full amount', hint: money(total) },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    className={`inv-modal__mode${mode === opt.key ? ' inv-modal__mode--active' : ''}`}
                    onClick={() => setMode(opt.key)}
                  >
                    <span className="inv-modal__mode-label">{opt.label}</span>
                    <span className="inv-modal__mode-hint">{opt.hint}</span>
                  </button>
                ))}
              </div>
            </div>

            {mode === 'balance' && (
              <div className="inv-modal__deposit">
                <label className="inv-modal__check">
                  <input
                    type="checkbox"
                    checked={depositTaken}
                    onChange={(e) => setDepositTaken(e.target.checked)}
                  />
                  <span>A deposit has already been paid</span>
                </label>

                {depositTaken && (
                  <>
                    <div className="inv-modal__row">
                      <div className="modal-field">
                        <label className="modal-field__label" htmlFor="inv-dep-amount">
                          Deposit paid
                        </label>
                        <div className="inv-modal__money">
                          <span className="inv-modal__money-sign">£</span>
                          <input
                            id="inv-dep-amount"
                            type="number"
                            min="0"
                            step="0.01"
                            className="modal-field__input"
                            value={depositInput}
                            placeholder="0.00"
                            onChange={(e) => setDepositInput(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="modal-field">
                        <label className="modal-field__label" htmlFor="inv-dep-date">
                          Date received (optional)
                        </label>
                        <input
                          id="inv-dep-date"
                          type="date"
                          className="modal-field__input"
                          value={depositDate}
                          onChange={(e) => setDepositDate(e.target.value)}
                        />
                      </div>
                    </div>
                    {quoteDeposit > 0 && pence(depositInput) !== quoteDeposit && (
                      <button
                        type="button"
                        className="inv-modal__link-btn"
                        onClick={() => setDepositInput(quoteDeposit.toFixed(2))}
                      >
                        Use the quoted deposit ({money(quoteDeposit)})
                      </button>
                    )}
                    <p className="inv-modal__hint">
                      This figure appears on the invoice only — it does not record a payment against
                      the order. Use <strong>Mark Deposit Paid</strong> for that.
                    </p>
                  </>
                )}
              </div>
            )}

            {mode === 'balance' && !depositTaken && (
              <p className="inv-modal__warn">
                No deposit is being deducted, so the balance is the full total. Tick the box above if
                the customer has already paid one.
              </p>
            )}
            {depositOverTotal && (
              <p className="inv-modal__warn">
                The deposit is more than the invoice total — it has been capped at {money(total)},
                leaving nothing to pay.
              </p>
            )}

            <div className="inv-modal__row">
              <div className="modal-field">
                <label className="modal-field__label" htmlFor="inv-date">Invoice date</label>
                <input
                  id="inv-date"
                  type="date"
                  className="modal-field__input"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                />
              </div>
              <div className="modal-field">
                <label className="modal-field__label" htmlFor="inv-due">Payment due</label>
                <input
                  id="inv-due"
                  type="date"
                  className="modal-field__input"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>

            <div className="modal-field">
              <label className="modal-field__label" htmlFor="inv-po">PO number (optional)</label>
              <input
                id="inv-po"
                type="text"
                className="modal-field__input"
                value={poNumber}
                placeholder="Leave blank if none"
                onChange={(e) => setPoNumber(e.target.value)}
              />
            </div>

            <label className="inv-modal__check">
              <input
                type="checkbox"
                checked={showReview}
                disabled={mode === 'deposit'}
                onChange={(e) => setShowReview(e.target.checked)}
              />
              <span>
                Include a &ldquo;Leave us a Google review&rdquo; button
                {mode === 'deposit' && (
                  <em className="inv-modal__check-note"> — not on a deposit invoice</em>
                )}
              </span>
            </label>

            {showReview && (
              <div className="modal-field">
                <label className="modal-field__label" htmlFor="inv-review-msg">
                  Thank-you message
                </label>
                <textarea
                  id="inv-review-msg"
                  className="modal-field__textarea"
                  value={reviewMessage}
                  onChange={(e) => setReviewMessage(e.target.value)}
                />
                <p className="inv-modal__hint">
                  The button links to {GOOGLE_REVIEW_URL} — clickable in both the PDF and the email.
                </p>
              </div>
            )}

            <div className="inv-modal__summary">
              <span className="inv-modal__summary-label">
                {mode === 'balance'
                  ? 'Balance now due'
                  : mode === 'full'
                  ? 'Amount due'
                  : 'Deposit due now'}
              </span>
              <span className="inv-modal__summary-amount">{money(amountDue)}</span>
            </div>

            {sendError && (
              <p
                className={`inv-modal__warn inv-modal__warn--send${
                  sendState === 'sent' ? ' inv-modal__warn--notice' : ''
                }`}
              >
                {sendError}
              </p>
            )}

            <div className="modal-actions">
              <button
                type="button"
                className="modal-actions__btn modal-actions__btn--cancel"
                onClick={handleEmail}
                disabled={busy || sendState === 'sending' || !lead}
              >
                <FiMail /> {emailLabel()}
              </button>
              <button
                type="button"
                className="modal-actions__btn modal-actions__btn--submit"
                onClick={handleDownload}
                disabled={busy || !lead}
              >
                <FiDownload /> {busy ? 'Generating…' : 'Download PDF'}
              </button>
            </div>
          </div>

          {/* Live preview — the same template that gets exported, scaled down. */}
          <div className="inv-modal__preview">
            <div className="inv-modal__preview-label">
              <span>Preview — {invoiceNumber || 'invoice'}</span>
              {fit && (
                <span
                  className={`inv-modal__fit${fit.singlePage ? '' : ' inv-modal__fit--over'}`}
                >
                  {fitLabel()}
                </span>
              )}
            </div>
            <div className="inv-modal__preview-scroll">
              <div className="inv-modal__preview-page">
                <InvoicePDF data={invoiceData} preview />
              </div>
            </div>
          </div>
        </div>
      </ModalShell>

      {/* Rendered outside the modal so the offscreen A4 document used for the
          PDF capture is never clipped by the modal's scroll container. */}
      <InvoicePDF ref={invoiceRef} data={invoiceData} />
    </>
  );
}
