import { useState } from 'react';
import ModalShell from './ModalShell';
import useSamples from '../../hooks/useSamples';

export default function SampleCreateModal({ leadId, onClose }) {
  const { createSample } = useSamples(leadId);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    productName: '',
    colour: '',
    material: '',
    notes: '',
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.productName.trim()) return;
    setSaving(true);
    await createSample({
      productName: form.productName,
      colour: form.colour,
      material: form.material,
      notes: form.notes,
    });
    setSaving(false);
    onClose();
  };

  return (
    <ModalShell title="Request Sample" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="modal-field">
          <label className="modal-field__label">Product Name *</label>
          <input className="modal-field__input" value={form.productName} onChange={(e) => set('productName', e.target.value)} placeholder="e.g. Calacatta Gold" required />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div className="modal-field">
            <label className="modal-field__label">Colour</label>
            <input className="modal-field__input" value={form.colour} onChange={(e) => set('colour', e.target.value)} placeholder="e.g. White / Grey" />
          </div>
          <div className="modal-field">
            <label className="modal-field__label">Material</label>
            <input className="modal-field__input" value={form.material} onChange={(e) => set('material', e.target.value)} placeholder="e.g. Quartz" />
          </div>
        </div>
        <div className="modal-field">
          <label className="modal-field__label">Notes</label>
          <textarea className="modal-field__textarea" value={form.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Any additional notes..." rows={3} />
        </div>
        <div className="modal-actions">
          <button type="button" className="modal-actions__btn modal-actions__btn--cancel" onClick={onClose}>Cancel</button>
          <button type="submit" className="modal-actions__btn modal-actions__btn--submit" disabled={saving || !form.productName.trim()}>
            {saving ? 'Creating...' : 'Request Sample'}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
