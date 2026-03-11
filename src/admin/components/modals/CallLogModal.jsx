import { useState } from 'react';
import ModalShell from './ModalShell';
import useCalls from '../../hooks/useCalls';

export default function CallLogModal({ leadId, onClose }) {
  const { logCall } = useCalls(leadId);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    direction: 'outbound',
    outcome: 'answered',
    durationMinutes: '',
    durationSeconds: '',
    summary: '',
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const totalSecs = (parseInt(form.durationMinutes) || 0) * 60 + (parseInt(form.durationSeconds) || 0);
    await logCall({
      direction: form.direction,
      outcome: form.outcome,
      durationSeconds: totalSecs || null,
      summary: form.summary,
    });
    setSaving(false);
    onClose();
  };

  return (
    <ModalShell title="Log Call" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div className="modal-field">
            <label className="modal-field__label">Direction</label>
            <select className="modal-field__select" value={form.direction} onChange={(e) => set('direction', e.target.value)}>
              <option value="outbound">Outbound</option>
              <option value="inbound">Inbound</option>
            </select>
          </div>
          <div className="modal-field">
            <label className="modal-field__label">Outcome</label>
            <select className="modal-field__select" value={form.outcome} onChange={(e) => set('outcome', e.target.value)}>
              <option value="answered">Answered</option>
              <option value="no_answer">No Answer</option>
              <option value="voicemail">Voicemail</option>
              <option value="busy">Busy</option>
              <option value="callback_requested">Callback Requested</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div className="modal-field">
            <label className="modal-field__label">Duration (min)</label>
            <input className="modal-field__input" type="number" min="0" value={form.durationMinutes} onChange={(e) => set('durationMinutes', e.target.value)} placeholder="0" />
          </div>
          <div className="modal-field">
            <label className="modal-field__label">Duration (sec)</label>
            <input className="modal-field__input" type="number" min="0" max="59" value={form.durationSeconds} onChange={(e) => set('durationSeconds', e.target.value)} placeholder="0" />
          </div>
        </div>
        <div className="modal-field">
          <label className="modal-field__label">Summary</label>
          <textarea className="modal-field__textarea" value={form.summary} onChange={(e) => set('summary', e.target.value)} placeholder="Brief summary of the call..." rows={4} />
        </div>
        <div className="modal-actions">
          <button type="button" className="modal-actions__btn modal-actions__btn--cancel" onClick={onClose}>Cancel</button>
          <button type="submit" className="modal-actions__btn modal-actions__btn--submit" disabled={saving}>
            {saving ? 'Saving...' : 'Log Call'}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
