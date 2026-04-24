import { useState } from 'react';
import ModalShell from './ModalShell';

const ROLE_OPTIONS = [
  'Fabricator',
  'Templater',
  'Installer',
  'Stonemason',
  'Delivery Driver',
  'Supplier',
  'Surveyor',
  'Other',
];

export default function TradeContactModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(() => ({
    name: initial?.name || '',
    company: initial?.company || '',
    role: initial?.role || '',
    phone: initial?.phone || '',
    email: initial?.email || '',
    address: initial?.address || '',
    notes: initial?.notes || '',
  }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const isEdit = !!initial;

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Name is required');
      return;
    }
    setSaving(true);
    setError(null);
    const payload = {
      name: form.name.trim(),
      company: form.company.trim() || null,
      role: form.role || null,
      phone: form.phone.trim() || null,
      email: form.email.trim() || null,
      address: form.address.trim() || null,
      notes: form.notes.trim() || null,
    };
    const result = await onSave(payload);
    setSaving(false);
    if (result?.error) {
      setError(result.error.message || 'Failed to save');
      return;
    }
    onClose();
  };

  return (
    <ModalShell title={isEdit ? 'Edit Contact' : 'Add Trade Contact'} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="modal-field">
          <label className="modal-field__label">Name *</label>
          <input
            className="modal-field__input"
            value={form.name}
            onChange={update('name')}
            placeholder="Full name"
            required
            autoFocus
          />
        </div>
        <div className="modal-field">
          <label className="modal-field__label">Role</label>
          <select
            className="modal-field__input"
            value={form.role}
            onChange={update('role')}
          >
            <option value="">Select role…</option>
            {ROLE_OPTIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div className="modal-field">
          <label className="modal-field__label">Company</label>
          <input
            className="modal-field__input"
            value={form.company}
            onChange={update('company')}
            placeholder="Business name (optional)"
          />
        </div>
        <div className="modal-field">
          <label className="modal-field__label">Phone</label>
          <input
            className="modal-field__input"
            type="tel"
            value={form.phone}
            onChange={update('phone')}
            placeholder="Mobile or office number"
          />
        </div>
        <div className="modal-field">
          <label className="modal-field__label">Email</label>
          <input
            className="modal-field__input"
            type="email"
            value={form.email}
            onChange={update('email')}
            placeholder="contact@example.com"
          />
        </div>
        <div className="modal-field">
          <label className="modal-field__label">Address</label>
          <input
            className="modal-field__input"
            value={form.address}
            onChange={update('address')}
            placeholder="Yard, workshop or office address"
          />
        </div>
        <div className="modal-field">
          <label className="modal-field__label">Notes</label>
          <textarea
            className="modal-field__textarea"
            value={form.notes}
            onChange={update('notes')}
            placeholder="Rates, availability, preferred jobs, anything worth remembering…"
            rows={4}
          />
        </div>
        {error && (
          <p style={{ color: '#ef4444', fontSize: '0.82rem', margin: '0 0 0.75rem' }}>{error}</p>
        )}
        <div className="modal-actions">
          <button type="button" className="modal-actions__btn modal-actions__btn--cancel" onClick={onClose}>Cancel</button>
          <button type="submit" className="modal-actions__btn modal-actions__btn--submit" disabled={saving}>
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Contact'}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
