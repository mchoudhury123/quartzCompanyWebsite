import { useMemo } from 'react';
import { FiX, FiSend, FiMail } from 'react-icons/fi';
import { buildQuoteEmailHtml } from '../../../utils/quoteEmailTemplate';
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
  const firstName = clientName ? clientName.split(' ')[0] : 'there';
  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  const previewHtml = useMemo(
    () =>
      buildQuoteEmailHtml({
        firstName,
        quoteNumber: quoteNumber || 'QC-2026-XXXX',
        total,
        deposit,
        validUntil,
        viewUrl: `${origin}/quote/view/preview`,
        logoUrl: `${origin}/LOGO%20IDEA%20BIG%20QUARTZ%20ARIAL.png`,
      }),
    [firstName, quoteNumber, total, deposit, validUntil, origin]
  );

  return (
    <div className="epm__overlay" onClick={onCancel}>
      <div className="epm__modal" onClick={(e) => e.stopPropagation()}>
        <div className="epm__header">
          <div className="epm__header-left">
            <FiMail className="epm__header-icon" />
            <h3 className="epm__title">Send Quotation Email</h3>
          </div>
          <button className="epm__close" onClick={onCancel}>
            <FiX />
          </button>
        </div>

        <div className="epm__delivery">
          <div className="epm__delivery-row">
            <span className="epm__delivery-label">Delivery Email Address</span>
            <span className="epm__delivery-value">{clientEmail || 'No email set'}</span>
          </div>
        </div>

        <div className="epm__preview">
          <iframe
            className="epm__preview-frame"
            title="Quotation email preview"
            srcDoc={previewHtml}
            sandbox=""
          />
        </div>

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
