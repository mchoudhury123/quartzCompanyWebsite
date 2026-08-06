import { useState, useMemo } from 'react';
import ModalShell from './ModalShell';
import useEmails from '../../hooks/useEmails';
import useEmailTemplates from '../../hooks/useEmailTemplates';
import { buildBrandedEmail } from '../../utils/saleEmailTemplates';

const FROM_OPTIONS = [
  'sales@thequartzcompany.co.uk',
  'admin@thequartzcompany.co.uk',
];

export default function EmailModal({ leadId, leadEmail, leadName, onClose }) {
  const { sendEmail } = useEmails(leadId);
  const { templates, saveTemplate, deleteTemplate } = useEmailTemplates();
  const [from, setFrom] = useState(FROM_OPTIONS[0]);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const loadTemplate = (id) => {
    setSelectedTemplateId(id);
    if (!id) return;
    const t = templates.find((tpl) => tpl.id === id);
    if (t) {
      setSubject(t.subject || '');
      setBody(t.body || '');
    }
  };

  const handleSaveTemplate = async () => {
    if (!subject.trim() && !body.trim()) {
      setError('Add a subject or message before saving a template.');
      return;
    }
    const name = window.prompt('Name this template (e.g. "Follow-up", "Quote ready"):');
    if (!name || !name.trim()) return;
    const { error: saveErr } = await saveTemplate(name.trim(), subject.trim(), body.trim());
    if (saveErr) setError(`Couldn't save the template: ${saveErr.message}`);
  };

  const handleDeleteTemplate = async () => {
    if (!selectedTemplateId) return;
    const t = templates.find((tpl) => tpl.id === selectedTemplateId);
    if (!window.confirm(`Delete the template "${t?.name || ''}"?`)) return;
    await deleteTemplate(selectedTemplateId);
    setSelectedTemplateId('');
  };

  // Live preview of the branded email — mirrors what's actually sent, and the
  // footer reflects the selected "From" address.
  const previewHtml = useMemo(
    () => buildBrandedEmail({ subject, body, contactEmail: from }),
    [subject, body, from]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) return;
    setSending(true);
    setError(null);

    const result = await sendEmail({ from, to: leadEmail, subject: subject.trim(), body: body.trim() });

    if (result.error) {
      setError(typeof result.error === 'string' ? result.error : 'Failed to send email');
      setSending(false);
      return;
    }

    setSending(false);
    onClose();
  };

  return (
    <ModalShell title={`Email to ${leadName}`} onClose={onClose} className="modal-shell--wide">
      <form onSubmit={handleSubmit}>
        <div className="modal-field">
          <label className="modal-field__label">Templates</label>
          <div className="email-modal__templates">
            <select
              className="modal-field__input"
              value={selectedTemplateId}
              onChange={(e) => loadTemplate(e.target.value)}
            >
              <option value="">
                {templates.length ? '— Load a saved template —' : 'No saved templates yet'}
              </option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <button type="button" className="email-modal__tpl-btn" onClick={handleSaveTemplate}>
              Save as template
            </button>
            {selectedTemplateId && (
              <button type="button" className="email-modal__tpl-btn email-modal__tpl-btn--danger" onClick={handleDeleteTemplate}>
                Delete
              </button>
            )}
          </div>
        </div>
        <div className="modal-field">
          <label className="modal-field__label">From</label>
          <select
            className="modal-field__input"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          >
            {FROM_OPTIONS.map((addr) => (
              <option key={addr} value={addr}>{addr}</option>
            ))}
          </select>
        </div>
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
            placeholder={'Type your message...\n\nLeave a blank line between paragraphs. It will be sent in The Quartz Company branded template.'}
            rows={6}
            required
          />
        </div>
        <div className="modal-field">
          <label className="modal-field__label">Live preview</label>
          <iframe
            title="Email preview"
            className="email-modal__preview"
            srcDoc={previewHtml}
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
