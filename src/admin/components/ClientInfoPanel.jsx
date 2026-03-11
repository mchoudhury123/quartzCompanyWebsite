import { useState } from 'react';
import StatusBadge from './StatusBadge';
import StatusSelect from './StatusSelect';
import { FiMail, FiPhone, FiMapPin, FiEdit2, FiCheck, FiX } from 'react-icons/fi';
import './ClientInfoPanel.css';

function EditableField({ value, onSave, placeholder }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value || '');

  const save = () => {
    onSave(draft);
    setEditing(false);
  };

  if (editing) {
    return (
      <span className="client-info__editable">
        <input
          className="client-info__edit-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={placeholder}
          autoFocus
          onKeyDown={(e) => { if (e.key === 'Enter') save(); if (e.key === 'Escape') setEditing(false); }}
        />
        <button className="client-info__edit-btn" onClick={save}><FiCheck /></button>
        <button className="client-info__edit-btn" onClick={() => setEditing(false)}><FiX /></button>
      </span>
    );
  }

  return (
    <span className="client-info__editable">
      <span>{value || <em className="client-info__empty">{placeholder}</em>}</span>
      <button className="client-info__edit-trigger" onClick={() => { setDraft(value || ''); setEditing(true); }}>
        <FiEdit2 />
      </button>
    </span>
  );
}

export default function ClientInfoPanel({ lead, onStatusChange, onFieldUpdate }) {
  const formatDate = (d) => new Date(d).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <div className="client-info">
      <div className="client-info__header">
        <h2 className="client-info__name">{lead.full_name}</h2>
        <StatusBadge status={lead.status} />
      </div>

      <div className="client-info__status-row">
        <StatusSelect value={lead.status} onChange={onStatusChange} />
      </div>

      <div className="client-info__section">
        <h4 className="client-info__section-title">Contact</h4>
        {lead.email && (
          <div className="client-info__field">
            <FiMail className="client-info__field-icon" />
            <a href={`mailto:${lead.email}`} className="client-info__link">{lead.email}</a>
          </div>
        )}
        {lead.phone && (
          <div className="client-info__field">
            <FiPhone className="client-info__field-icon" />
            <a href={`tel:${lead.phone}`} className="client-info__link">{lead.phone}</a>
          </div>
        )}
        <div className="client-info__field">
          <FiMapPin className="client-info__field-icon" />
          <EditableField
            value={lead.address}
            onSave={(v) => onFieldUpdate('address', v)}
            placeholder="Add address"
          />
        </div>
        {lead.postcode && (
          <div className="client-info__field">
            <FiMapPin className="client-info__field-icon" />
            <span>{lead.postcode}</span>
          </div>
        )}
      </div>

      <div className="client-info__section">
        <h4 className="client-info__section-title">Lead Details</h4>
        <div className="client-info__meta-row">
          <span className="client-info__meta-label">Owner</span>
          <EditableField
            value={lead.lead_owner}
            onSave={(v) => onFieldUpdate('lead_owner', v)}
            placeholder="Unassigned"
          />
        </div>
        <div className="client-info__meta-row">
          <span className="client-info__meta-label">Category</span>
          <EditableField
            value={lead.lead_category}
            onSave={(v) => onFieldUpdate('lead_category', v)}
            placeholder="General"
          />
        </div>
        <div className="client-info__meta-row">
          <span className="client-info__meta-label">Source</span>
          <span className="client-info__meta-value">
            {lead.source === 'quote_modal' ? 'Quote Form' : lead.source === 'contact_form' ? 'Contact Form' : lead.source || '—'}
          </span>
        </div>
        <div className="client-info__meta-row">
          <span className="client-info__meta-label">Created</span>
          <span className="client-info__meta-value">{formatDate(lead.created_at)}</span>
        </div>
      </div>

      {lead.source === 'quote_modal' && (
        <div className="client-info__section">
          <h4 className="client-info__section-title">Quote Request</h4>
          {lead.product_name && (
            <div className="client-info__meta-row">
              <span className="client-info__meta-label">Product</span>
              <span className="client-info__meta-value">{lead.product_name}</span>
            </div>
          )}
          {lead.product_material && (
            <div className="client-info__meta-row">
              <span className="client-info__meta-label">Material</span>
              <span className="client-info__meta-value">{lead.product_material}</span>
            </div>
          )}
          {lead.run_length_mm && (
            <div className="client-info__meta-row">
              <span className="client-info__meta-label">Run Length</span>
              <span className="client-info__meta-value">{lead.run_length_mm}mm</span>
            </div>
          )}
          {lead.depth_mm && (
            <div className="client-info__meta-row">
              <span className="client-info__meta-label">Depth</span>
              <span className="client-info__meta-value">{lead.depth_mm}mm</span>
            </div>
          )}
          {lead.thickness && (
            <div className="client-info__meta-row">
              <span className="client-info__meta-label">Thickness</span>
              <span className="client-info__meta-value">{lead.thickness}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
