import { useState } from 'react';
import ModalShell from './ModalShell';
import useSms from '../../hooks/useSms';

export default function SmsModal({ leadId, leadPhone, leadName, onClose }) {
  const { sendSms } = useSms(leadId);
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const charCount = body.length;
  const smsSegments = Math.ceil(charCount / 160) || 1;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!body.trim()) return;
    setSending(true);
    setError(null);

    const result = await sendSms({ to: leadPhone, body: body.trim() });

    if (result.error) {
      setError(typeof result.error === 'string' ? result.error : 'Failed to send SMS');
      setSending(false);
      return;
    }

    setSending(false);
    onClose();
  };

  return (
    <ModalShell title={`SMS to ${leadName}`} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="modal-field">
          <label className="modal-field__label">To</label>
          <input className="modal-field__input" value={leadPhone || ''} disabled />
        </div>
        <div className="modal-field">
          <label className="modal-field__label">Message</label>
          <textarea
            className="modal-field__textarea"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Type your message..."
            rows={4}
            maxLength={480}
          />
          <span style={{ fontSize: '0.72rem', color: '#6b7280', marginTop: '0.25rem', display: 'block' }}>
            {charCount}/160 characters ({smsSegments} segment{smsSegments > 1 ? 's' : ''})
          </span>
        </div>
        {error && (
          <p style={{ color: '#ef4444', fontSize: '0.82rem', margin: '0 0 0.75rem' }}>{error}</p>
        )}
        <div className="modal-actions">
          <button type="button" className="modal-actions__btn modal-actions__btn--cancel" onClick={onClose}>Cancel</button>
          <button type="submit" className="modal-actions__btn modal-actions__btn--submit" disabled={sending || !body.trim()}>
            {sending ? 'Sending...' : 'Send SMS'}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
