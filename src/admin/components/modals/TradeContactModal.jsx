import { useState } from 'react';
import ModalShell from './ModalShell';
import { geocodePostcode } from '../../utils/geocode';
import './TradeContactModal.css';

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
    county: initial?.county || '',
    postcode: initial?.postcode || '',
    mile_radius: initial?.mile_radius ?? '',
    fabrication: initial?.fabrication ?? false,
    templating: initial?.templating ?? false,
    installation: initial?.installation ?? false,
    price_1_slab: initial?.price_1_slab || '',
    price_2_slab: initial?.price_2_slab || '',
    price_3_slab: initial?.price_3_slab || '',
    price_4_slab: initial?.price_4_slab || '',
    sink_cutout: initial?.sink_cutout || '',
    hob_cutout: initial?.hob_cutout || '',
    extra_charges: initial?.extra_charges || '',
    notes: initial?.notes || '',
  }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const isEdit = !!initial;

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  const toggle = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.checked }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Name is required');
      return;
    }
    setSaving(true);
    setError(null);

    const postcode = form.postcode.trim();
    const payload = {
      name: form.name.trim(),
      company: form.company.trim() || null,
      role: form.role || null,
      phone: form.phone.trim() || null,
      email: form.email.trim() || null,
      address: form.address.trim() || null,
      county: form.county.trim() || null,
      postcode: postcode || null,
      mile_radius: form.mile_radius === '' ? null : Number(form.mile_radius),
      fabrication: !!form.fabrication,
      templating: !!form.templating,
      installation: !!form.installation,
      price_1_slab: form.price_1_slab.trim() || null,
      price_2_slab: form.price_2_slab.trim() || null,
      price_3_slab: form.price_3_slab.trim() || null,
      price_4_slab: form.price_4_slab.trim() || null,
      sink_cutout: form.sink_cutout.trim() || null,
      hob_cutout: form.hob_cutout.trim() || null,
      extra_charges: form.extra_charges.trim() || null,
      notes: form.notes.trim() || null,
    };

    // Geocode the postcode so the contact can be plotted on the map. Only
    // re-geocode when the postcode changed (or coords are missing).
    if (postcode && (postcode !== (initial?.postcode || '') || initial?.latitude == null)) {
      const coords = await geocodePostcode(postcode);
      if (coords) {
        payload.latitude = coords.latitude;
        payload.longitude = coords.longitude;
      }
    } else if (!postcode) {
      payload.latitude = null;
      payload.longitude = null;
    }

    const result = await onSave(payload);
    setSaving(false);
    if (result?.error) {
      setError(result.error.message || 'Failed to save');
      return;
    }
    onClose();
  };

  return (
    <ModalShell title={isEdit ? 'Edit Contact' : 'Add Trade Contact'} onClose={onClose} className="modal-shell--wide">
      <form onSubmit={handleSubmit}>
        <div className="tc-form__grid">
          <div className="modal-field">
            <label className="modal-field__label">Name *</label>
            <input className="modal-field__input" value={form.name} onChange={update('name')} placeholder="Company or contact name" required autoFocus />
          </div>
          <div className="modal-field">
            <label className="modal-field__label">Role</label>
            <select className="modal-field__input" value={form.role} onChange={update('role')}>
              <option value="">Select role…</option>
              {ROLE_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="modal-field">
            <label className="modal-field__label">Company</label>
            <input className="modal-field__input" value={form.company} onChange={update('company')} placeholder="Business name (optional)" />
          </div>
          <div className="modal-field">
            <label className="modal-field__label">Phone</label>
            <input className="modal-field__input" type="tel" value={form.phone} onChange={update('phone')} placeholder="Mobile or office number" />
          </div>
          <div className="modal-field">
            <label className="modal-field__label">Email</label>
            <input className="modal-field__input" type="email" value={form.email} onChange={update('email')} placeholder="contact@example.com" />
          </div>
          <div className="modal-field">
            <label className="modal-field__label">Location / Town</label>
            <input className="modal-field__input" value={form.address} onChange={update('address')} placeholder="e.g. Southall, or full address" />
          </div>
          <div className="modal-field">
            <label className="modal-field__label">County</label>
            <input className="modal-field__input" value={form.county} onChange={update('county')} placeholder="e.g. London" />
          </div>
          <div className="modal-field">
            <label className="modal-field__label">Postcode <span className="tc-form__hint">(places them on the map)</span></label>
            <input className="modal-field__input" value={form.postcode} onChange={update('postcode')} placeholder="e.g. UB1 3DZ" />
          </div>
          <div className="modal-field">
            <label className="modal-field__label">Mile radius <span className="tc-form__hint">(max travel distance)</span></label>
            <input className="modal-field__input" type="number" min="0" value={form.mile_radius} onChange={update('mile_radius')} placeholder="e.g. 100" />
          </div>
        </div>

        <div className="modal-field">
          <label className="modal-field__label">Services offered</label>
          <div className="tc-form__services">
            <label className="tc-form__check"><input type="checkbox" checked={form.fabrication} onChange={toggle('fabrication')} /> Fabrication</label>
            <label className="tc-form__check"><input type="checkbox" checked={form.templating} onChange={toggle('templating')} /> Templating</label>
            <label className="tc-form__check"><input type="checkbox" checked={form.installation} onChange={toggle('installation')} /> Installation</label>
          </div>
        </div>

        <label className="modal-field__label">Guideline pricing <span className="tc-form__hint">(fab + template + install)</span></label>
        <div className="tc-form__grid">
          <div className="modal-field">
            <label className="modal-field__label">1 slab</label>
            <input className="modal-field__input" value={form.price_1_slab} onChange={update('price_1_slab')} placeholder="e.g. 900 + VAT" />
          </div>
          <div className="modal-field">
            <label className="modal-field__label">2 slabs</label>
            <input className="modal-field__input" value={form.price_2_slab} onChange={update('price_2_slab')} placeholder="e.g. £1,300" />
          </div>
          <div className="modal-field">
            <label className="modal-field__label">3 slabs</label>
            <input className="modal-field__input" value={form.price_3_slab} onChange={update('price_3_slab')} placeholder="e.g. £1,600" />
          </div>
          <div className="modal-field">
            <label className="modal-field__label">4 slabs</label>
            <input className="modal-field__input" value={form.price_4_slab} onChange={update('price_4_slab')} placeholder="e.g. £1,900" />
          </div>
          <div className="modal-field">
            <label className="modal-field__label">Sink cut-out</label>
            <input className="modal-field__input" value={form.sink_cutout} onChange={update('sink_cutout')} placeholder="e.g. incl" />
          </div>
          <div className="modal-field">
            <label className="modal-field__label">Hob cut-out</label>
            <input className="modal-field__input" value={form.hob_cutout} onChange={update('hob_cutout')} placeholder="e.g. incl" />
          </div>
        </div>

        <div className="modal-field">
          <label className="modal-field__label">Extra charges / notes</label>
          <input className="modal-field__input" value={form.extra_charges} onChange={update('extra_charges')} placeholder="e.g. £90 within London" />
        </div>

        <div className="modal-field">
          <label className="modal-field__label">Internal notes</label>
          <textarea className="modal-field__textarea" value={form.notes} onChange={update('notes')} placeholder="Availability, preferred jobs, anything worth remembering…" rows={3} />
        </div>

        {error && <p style={{ color: '#ef4444', fontSize: '0.82rem', margin: '0 0 0.75rem' }}>{error}</p>}
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
