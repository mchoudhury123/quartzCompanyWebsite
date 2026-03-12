import { useState } from 'react';
import ModalShell from './ModalShell';
import { supabase } from '../../../lib/supabase';

export default function AddClientModal({ onClose, onCreated }) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    postcode: '',
    comments: '',
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim()) return;
    setSaving(true);

    const { data, error } = await supabase
      .from('leads')
      .insert({
        full_name: form.fullName.trim(),
        email: form.email.trim() || null,
        phone: form.phone.trim() || null,
        postcode: form.postcode.trim() || null,
        comments: form.comments.trim() || null,
        source: 'admin',
        status: 'new',
        pending_action: 'call_new',
      })
      .select('id')
      .single();

    setSaving(false);

    if (!error && data) {
      onCreated(data.id);
    }
  };

  return (
    <ModalShell title="Add Client" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <div className="modal-field">
          <label className="modal-field__label">Full Name *</label>
          <input
            className="modal-field__input"
            value={form.fullName}
            onChange={(e) => set('fullName', e.target.value)}
            placeholder="e.g. John Smith"
            required
            autoFocus
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div className="modal-field">
            <label className="modal-field__label">Email</label>
            <input
              className="modal-field__input"
              type="email"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              placeholder="john@example.com"
            />
          </div>
          <div className="modal-field">
            <label className="modal-field__label">Phone</label>
            <input
              className="modal-field__input"
              type="tel"
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
              placeholder="07XXX XXXXXX"
            />
          </div>
        </div>
        <div className="modal-field">
          <label className="modal-field__label">Postcode</label>
          <input
            className="modal-field__input"
            value={form.postcode}
            onChange={(e) => set('postcode', e.target.value)}
            placeholder="e.g. SW1A 1AA"
          />
        </div>
        <div className="modal-field">
          <label className="modal-field__label">Notes</label>
          <textarea
            className="modal-field__textarea"
            value={form.comments}
            onChange={(e) => set('comments', e.target.value)}
            placeholder="e.g. Called enquiring about Calacatta Gold worktops..."
            rows={3}
          />
        </div>
        <div className="modal-actions">
          <button type="button" className="modal-actions__btn modal-actions__btn--cancel" onClick={onClose}>Cancel</button>
          <button type="submit" className="modal-actions__btn modal-actions__btn--submit" disabled={saving || !form.fullName.trim()}>
            {saving ? 'Adding...' : 'Add Client'}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}
