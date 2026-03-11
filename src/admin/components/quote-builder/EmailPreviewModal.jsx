import { FiX, FiSend } from 'react-icons/fi';
import './EmailPreviewModal.css';

export default function EmailPreviewModal({
  clientName,
  clientEmail,
  quoteNumber,
  total,
  deposit,
  validUntil,
  onConfirm,
  onCancel,
  sending,
}) {
  const fmt = (v) => `£${Number(v || 0).toFixed(2)}`;
  const fmtDate = validUntil
    ? new Date(validUntil).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  return (
    <div className="epm__overlay" onClick={onCancel}>
      <div className="epm__modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal header */}
        <div className="epm__header">
          <h3 className="epm__title">Email Preview</h3>
          <button className="epm__close" onClick={onCancel}>
            <FiX />
          </button>
        </div>

        {/* Recipient info */}
        <div className="epm__recipient">
          <span className="epm__recipient-label">To:</span>
          <span className="epm__recipient-value">
            {clientName ? `${clientName} <${clientEmail}>` : clientEmail || 'Client email'}
          </span>
        </div>
        <div className="epm__recipient">
          <span className="epm__recipient-label">Subject:</span>
          <span className="epm__recipient-value">
            Your Quote {quoteNumber} from The Quartz Company
          </span>
        </div>

        {/* Email preview */}
        <div className="epm__preview">
          <div className="epm__email">
            {/* Gold header */}
            <div className="epm__email-header">THE QUARTZ COMPANY</div>

            {/* Body */}
            <div className="epm__email-body">
              <p className="epm__email-greeting">Hi {clientName || 'there'},</p>
              <p className="epm__email-text">
                Your quote is ready to view. Please review the details below and secure your quote
                before it expires.
              </p>

              {/* Quote details card */}
              <div className="epm__email-details">
                <div className="epm__email-row">
                  <span>Quote</span>
                  <span className="epm__email-row-bold">{quoteNumber || 'QC-2026-XXXX'}</span>
                </div>
                <div className="epm__email-row">
                  <span>Total (inc. VAT)</span>
                  <span className="epm__email-row-total">{fmt(total)}</span>
                </div>
                <div className="epm__email-row">
                  <span>Deposit Required</span>
                  <span className="epm__email-row-deposit">{fmt(deposit)}</span>
                </div>
                {fmtDate && (
                  <div className="epm__email-row">
                    <span>Valid Until</span>
                    <span className="epm__email-row-bold">{fmtDate}</span>
                  </div>
                )}
              </div>

              {/* CTA button */}
              <div className="epm__email-cta">
                <span className="epm__email-btn">View and secure your quote</span>
              </div>

              <p className="epm__email-footnote">
                If you have any questions, reply to this email or call us directly.
              </p>
            </div>

            {/* Footer */}
            <div className="epm__email-footer">
              <p>The Quartz Company</p>
              <p>info@thequartzcompany.co.uk</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="epm__actions">
          <button className="epm__btn epm__btn--cancel" onClick={onCancel} disabled={sending}>
            Cancel
          </button>
          <button className="epm__btn epm__btn--send" onClick={onConfirm} disabled={sending}>
            <FiSend /> {sending ? 'Sending...' : 'Confirm & Send'}
          </button>
        </div>
      </div>
    </div>
  );
}
