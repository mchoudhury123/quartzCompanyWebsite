import { FiX, FiSend, FiMail } from 'react-icons/fi';
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

  const firstName = clientName ? clientName.split(' ')[0] : 'there';

  return (
    <div className="epm__overlay" onClick={onCancel}>
      <div className="epm__modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal header */}
        <div className="epm__header">
          <div className="epm__header-left">
            <FiMail className="epm__header-icon" />
            <h3 className="epm__title">Send Quotation Email</h3>
          </div>
          <button className="epm__close" onClick={onCancel}>
            <FiX />
          </button>
        </div>

        {/* Delivery info */}
        <div className="epm__delivery">
          <div className="epm__delivery-row">
            <span className="epm__delivery-label">Delivery Email Address</span>
            <span className="epm__delivery-value">{clientEmail || 'No email set'}</span>
          </div>
        </div>

        {/* Email preview */}
        <div className="epm__preview">
          <div className="epm__email">
            {/* Gold header */}
            <div className="epm__email-header">
              <span className="epm__email-logo">THE QUARTZ</span>
              <span className="epm__email-logo-sub">COMPANY</span>
            </div>

            {/* Body */}
            <div className="epm__email-body">
              <p className="epm__email-greeting">Hi {firstName},</p>

              <p className="epm__email-text">
                I have completed your Quartz Company quote using the details
                you have provided. You can view this quote{' '}
                <span className="epm__email-link">here</span>. Your quote
                expires <span className="epm__email-highlight">{fmtDate || 'in 2 days'}</span>.
              </p>

              <p className="epm__email-text">
                If you'd like to secure your quote before this date, all we need is a{' '}
                <strong>{fmt(deposit)} deposit</strong> (payable over the phone with me or
                using the link below).
              </p>

              {/* CTA button */}
              <div className="epm__email-cta">
                <span className="epm__email-btn">View and secure your quote</span>
              </div>

              {/* Not quite ready section */}
              <p className="epm__email-subheading">Not quite ready?</p>
              <p className="epm__email-text">
                Not to worry, you can view your quote, update and compare colours and
                thicknesses on the <span className="epm__email-link">customer portal</span>.
              </p>

              {/* Quote summary */}
              <div className="epm__email-details">
                <div className="epm__email-row">
                  <span>Quote Reference</span>
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
                    <span>Quote Expires</span>
                    <span className="epm__email-row-bold">{fmtDate}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="epm__email-footer">
              <p>The Quartz Company</p>
              <p>sales@thequartzcompany.co.uk</p>
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
