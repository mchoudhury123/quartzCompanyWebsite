import { useState } from 'react';
import ModalShell from './ModalShell';
import useQuotes from '../../hooks/useQuotes';

export default function QuoteCreateModal({ leadId, onClose }) {
  const { createQuote } = useQuotes(leadId);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    subtotal: '',
    vat: '',
    total: '',
    validUntil: '',
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const recalc = (sub, vatVal) => {
    const s = parseFloat(sub) || 0;
    const v = parseFloat(vatVal) || 0;
    set('total', (s + v).toFixed(2));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    await createQuote({
      title: form.title,
      description: form.description,
      items: [],
      subtotal: parseFloat(form.subtotal) || 0,
      vat: parseFloat(form.vat) || 0,
      total: parseFloat(form.total) || 0,
      validUntil: form.validUntil || null,
    });
    setSaving(false);
    onClose();
  };

  return (
    <ModalShell title="Create Quote" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="modal-field">
          <label className="modal-field__label">Title *</label>
          <input className="modal-field__input" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="e.g. Kitchen Worktop Quote" required />
        </div>
        <div className="modal-field">
          <label className="modal-field__label">Description</label>
          <textarea className="modal-field__textarea" value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Additional details..." rows={3} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
          <div className="modal-field">
            <label className="modal-field__label">Subtotal (£)</label>
            <input className="modal-field__input" type="number" step="0.01" value={form.subtotal} onChange={(e) => { set('subtotal', e.target.value); recalc(e.target.value, form.vat); }} />
          </div>
          <div className="modal-field">
            <label className="modal-field__label">VAT (£)</label>
            <input className="modal-field__input" type="number" step="0.01" value={form.vat} onChange={(e) => { set('vat', e.target.value); recalc(form.subtotal, e.target.value); }} />
          </div>
          <div className="modal-field">
            <label className="modal-field__label">Total (£)</label>
            <input className="modal-field__input" type="number" step="0.01" value={form.total} onChange={(e) => set('total', e.target.value)} />
          </div>
        </div>
        <div className="modal-field">
          <label className="modal-field__label">Valid Until</label>
          <input className="modal-field__input" type="date" value={form.validUntil} onChange={(e) => set('validUntil', e.target.value)} />
        </div>
        <div className="modal-actions">
          <button type="button" className="modal-actions__btn modal-actions__btn--cancel" onClick={onClose}>Cancel</button>
          <button type="submit" className="modal-actions__btn modal-actions__btn--submit" disabled={saving || !form.title.trim()}>
            {saving ? 'Creating...' : 'Create Quote'}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
