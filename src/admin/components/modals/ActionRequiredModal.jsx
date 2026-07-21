import { useState } from 'react';
import ModalShell from './ModalShell';
import './ActionRequiredModal.css';

export default function ActionRequiredModal({ onSave, onClose }) {
  const [note, setNote] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('09:00');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!note.trim()) return;
    setSaving(true);
    const { error } = await onSave({ note: note.trim(), date: date || null, time: date ? time : null });
    setSaving(false);
    if (error) {
      window.alert(`Couldn't save the action: ${error.message || 'please try again.'}`);
      return;
    }
    onClose();
  };

  return (
    <ModalShell title="Action Required" onClose={onClose}>
      <label className="modal-field__label" htmlFor="action-note">
        What needs doing with this client?
      </label>
      <textarea
        id="action-note"
        className="modal-field__input"
        rows={4}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="e.g. Call back to confirm worktop colour before ordering"
        autoFocus
      />

      <label className="modal-field__label" htmlFor="action-date" style={{ marginTop: '1rem' }}>
        Add a date (optional)
      </label>
      <p className="action-required-modal__hint">
        If you set a date, this is booked as an appointment.
      </p>
      <div className="action-required-modal__datetime">
        <input
          id="action-date"
          type="date"
          className="modal-field__input"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        {date && (
          <input
            type="time"
            className="modal-field__input"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        )}
      </div>

      <div className="modal-actions">
        <button
          type="button"
          className="modal-actions__btn modal-actions__btn--cancel"
          onClick={onClose}
        >
          Cancel
        </button>
        <button
          type="button"
          className="action-required-modal__save"
          disabled={!note.trim() || saving}
          onClick={handleSave}
        >
          {saving ? 'Saving…' : 'Save Action'}
        </button>
      </div>
    </ModalShell>
  );
}
