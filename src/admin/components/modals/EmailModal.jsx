import { useState } from 'react';
import ModalShell from './ModalShell';
import useEmails from '../../hooks/useEmails';

export default function EmailModal({ leadId, leadEmail, leadName, onClose }) {
  const { sendEmail } = useEmails(leadId);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) return;
    setSending(true);
    setError(null);

    const result = await sendEmail({ to: leadEmail, subject: subject.trim(), body: body.trim() });

    if (result.error) {
      setError(typeof result.error === 'string' ? result.error : 'Failed to send email');
      setSending(false);
      return;
    }

    setSending(false);
    onClose();
  };

  return (
    <ModalShell title={`Email to ${leadName}`} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="modal-field">
          <label className="modal-field__label">To</label>
          <input className="modal-field__input" value={leadEmail || ''} disabled />
        </div>
        <div className="modal-field">
          <label className="modal-field__label">Subject *</label>
          <input
            className="modal-field__input"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Your Quartz Company Quote"
            required
            autoFocus
          />
        </div>
        <div className="modal-field">
          <label className="modal-field__label">Message *</label>
          <textarea
            className="modal-field__textarea"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Type your message..."
            rows={6}
            required
          />
        </div>
        {error && (
          <p style={{ color: '#ef4444', fontSize: '0.82rem', margin: '0 0 0.75rem' }}>{error}</p>
        )}
        <div className="modal-actions">
          <button type="button" className="modal-actions__btn modal-actions__btn--cancel" onClick={onClose}>Cancel</button>
          <button type="submit" className="modal-actions__btn modal-actions__btn--submit" disabled={sending || !subject.trim() || !body.trim()}>
            {sending ? 'Sending...' : 'Send Email'}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
