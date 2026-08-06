import { useState, useMemo } from 'react';
import useSalePeriods from '../hooks/useSalePeriods';
import { periodCategory, categoryLabel } from '../utils/salePeriods';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiTag } from 'react-icons/fi';
import '../styles/salePeriodColors.css';
import './SalePeriodsPage.css';

const BLANK = { name: '', start_date: '', end_date: '' };

function fmt(d) {
  if (!d) return '—';
  return new Date(`${d}T00:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export default function SalePeriodsPage() {
  const { periods, loading, createPeriod, updatePeriod, deletePeriod } = useSalePeriods();
  const [form, setForm] = useState(BLANK);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // periods come newest-first from the hook; index = how many periods ago.
  const rows = useMemo(
    () => periods.map((p, i) => ({ ...p, category: periodCategory(i) })),
    [periods]
  );

  const openNew = () => {
    setForm(BLANK);
    setEditingId(null);
    setError(null);
    setShowForm(true);
  };

  const openEdit = (p) => {
    setForm({ name: p.name || '', start_date: p.start_date || '', end_date: p.end_date || '' });
    setEditingId(p.id);
    setError(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(BLANK);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.start_date) {
      setError('A name and start date are required.');
      return;
    }
    if (form.end_date && form.end_date < form.start_date) {
      setError('The end date cannot be before the start date.');
      return;
    }
    setSaving(true);
    setError(null);
    const payload = {
      name: form.name.trim(),
      start_date: form.start_date,
      end_date: form.end_date || null,
    };
    const { error: saveErr } = editingId
      ? await updatePeriod(editingId, payload)
      : await createPeriod(payload);
    setSaving(false);
    if (saveErr) {
      setError(saveErr.message || 'Could not save. Have you run the sale periods migration?');
      return;
    }
    closeForm();
  };

  const handleDelete = async (p) => {
    if (!window.confirm(`Delete the sale period "${p.name}"? Leads are not affected, but they'll no longer be grouped under it.`)) return;
    await deletePeriod(p.id);
  };

  return (
    <div className="sale-periods">
      <div className="sale-periods__head">
        <div>
          <h1 className="sale-periods__title">Sale Periods</h1>
          <p className="sale-periods__sub">
            Define your sale campaigns. Clients are colour-coded in the Clients list by how many
            sale periods ago they came in, so the team knows who to contact first.
          </p>
        </div>
        <button className="sale-periods__add-btn" onClick={openNew}>
          <FiPlus /> New Sale Period
        </button>
      </div>

      <div className="sale-periods__legend">
        <span className="sale-periods__legend-item"><span className="sp-dot sp-dot--current" /> This sale</span>
        <span className="sale-periods__legend-item"><span className="sp-dot sp-dot--last" /> Last sale</span>
        <span className="sale-periods__legend-item"><span className="sp-dot sp-dot--mid" /> 2 sales ago</span>
        <span className="sale-periods__legend-item"><span className="sp-dot sp-dot--old" /> 3+ sales ago</span>
      </div>

      {showForm && (
        <form className="sale-periods__form" onSubmit={handleSubmit}>
          <div className="sale-periods__form-grid">
            <div className="sale-periods__field">
              <label>Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Summer Sale 2026"
                autoFocus
              />
            </div>
            <div className="sale-periods__field">
              <label>Start date</label>
              <input
                type="date"
                value={form.start_date}
                onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value }))}
              />
            </div>
            <div className="sale-periods__field">
              <label>End date <span className="sale-periods__opt">(optional)</span></label>
              <input
                type="date"
                value={form.end_date}
                onChange={(e) => setForm((f) => ({ ...f, end_date: e.target.value }))}
              />
            </div>
          </div>
          {error && <p className="sale-periods__error">{error}</p>}
          <div className="sale-periods__form-actions">
            <button type="button" className="sale-periods__btn sale-periods__btn--ghost" onClick={closeForm}>
              <FiX /> Cancel
            </button>
            <button type="submit" className="sale-periods__btn sale-periods__btn--primary" disabled={saving}>
              <FiCheck /> {saving ? 'Saving…' : editingId ? 'Save changes' : 'Add period'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="admin-page-loading">Loading sale periods…</div>
      ) : rows.length === 0 ? (
        <div className="sale-periods__empty">
          <FiTag />
          <p>No sale periods yet. Add your current sale (and any past ones) so leads can be grouped by campaign.</p>
        </div>
      ) : (
        <div className="sale-periods__list">
          {rows.map((p) => (
            <div key={p.id} className={`sale-periods__card sp-border--${p.category}`}>
              <div className="sale-periods__card-main">
                <span className={`sale-periods__pill sp-pill--${p.category}`}>{categoryLabel(p.category)}</span>
                <span className="sale-periods__name">{p.name}</span>
                <span className="sale-periods__dates">{fmt(p.start_date)} &ndash; {fmt(p.end_date)}</span>
              </div>
              <div className="sale-periods__card-actions">
                <button className="sale-periods__icon-btn" onClick={() => openEdit(p)} title="Edit">
                  <FiEdit2 />
                </button>
                <button className="sale-periods__icon-btn sale-periods__icon-btn--danger" onClick={() => handleDelete(p)} title="Delete">
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
