import { useState, useMemo } from 'react';
import useTradeContacts from '../hooks/useTradeContacts';
import TradeContactModal from '../components/modals/TradeContactModal';
import TradeContactsMap from '../components/TradeContactsMap';
import { contactColor } from '../utils/tradeContactColor';
import {
  FiPlus, FiSearch, FiUser, FiBriefcase, FiPhone, FiMail,
  FiMapPin, FiEdit2, FiTrash2, FiX, FiChevronDown,
} from 'react-icons/fi';
import './TradeContactsPage.css';

const ROLE_COLORS = {
  Fabricator: '#5b8fd4',
  Templater: '#8b7fc7',
  Installer: '#6b8f71',
  Stonemason: '#c5a47e',
  'Delivery Driver': '#d4874e',
  Supplier: '#7c6dab',
  Surveyor: '#d4748b',
  Other: '#9e9e9e',
};

function roleColor(role) {
  return ROLE_COLORS[role] || '#9e9e9e';
}

export default function TradeContactsPage() {
  const { contacts, loading, createContact, updateContact, deleteContact } = useTradeContacts();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const roles = useMemo(() => {
    const set = new Set();
    contacts.forEach((c) => { if (c.role) set.add(c.role); });
    return Array.from(set).sort();
  }, [contacts]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return contacts.filter((c) => {
      if (roleFilter && c.role !== roleFilter) return false;
      if (!q) return true;
      return (
        (c.name || '').toLowerCase().includes(q) ||
        (c.company || '').toLowerCase().includes(q) ||
        (c.phone || '').toLowerCase().includes(q) ||
        (c.email || '').toLowerCase().includes(q)
      );
    });
  }, [contacts, search, roleFilter]);

  const openNew = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (contact) => {
    setEditing(contact);
    setModalOpen(true);
  };

  const handleSave = async (payload) => {
    if (editing) return updateContact(editing.id, payload);
    return createContact(payload);
  };

  const handleDelete = async (contact) => {
    if (!window.confirm(`Remove ${contact.name} from your trade contacts?`)) return;
    await deleteContact(contact.id);
  };

  if (loading) return <div className="admin-page-loading">Loading contacts…</div>;

  return (
    <div className="tc-page">
      <div className="tc-page__header">
        <div>
          <h1 className="tc-page__title">Trade Contacts</h1>
          <p className="tc-page__subtitle">
            Fabricators, templaters, installers and everyone else we work with.
          </p>
        </div>
        <button className="tc-page__add-btn" onClick={openNew}>
          <FiPlus /> Add Contact
        </button>
      </div>

      <div className="tc-toolbar">
        <div className="tc-toolbar__search">
          <FiSearch className="tc-toolbar__search-icon" />
          <input
            className="tc-toolbar__search-input"
            placeholder="Search name, company, phone or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="tc-toolbar__clear" onClick={() => setSearch('')}>
              <FiX />
            </button>
          )}
        </div>

        {roles.length > 0 && (
          <div className="tc-toolbar__roles">
            <button
              className={`tc-role-chip${!roleFilter ? ' tc-role-chip--active' : ''}`}
              onClick={() => setRoleFilter('')}
            >
              All
            </button>
            {roles.map((role) => (
              <button
                key={role}
                className={`tc-role-chip${roleFilter === role ? ' tc-role-chip--active' : ''}`}
                style={{ '--chip-color': roleColor(role) }}
                onClick={() => setRoleFilter(roleFilter === role ? '' : role)}
              >
                {role}
              </button>
            ))}
          </div>
        )}
      </div>

      {contacts.some((c) => c.latitude != null && c.longitude != null) && (
        <>
          <TradeContactsMap contacts={filtered} />
          {(() => {
            const located = filtered.filter((c) => c.latitude != null && c.longitude != null).length;
            const missing = filtered.length - located;
            return (
              <p className="tc-map-note">
                Showing {located} contact{located === 1 ? '' : 's'} on the map
                {missing > 0 && ` · ${missing} need a postcode to appear`}. Click a pin for phone number and pricing.
              </p>
            );
          })()}
        </>
      )}

      {filtered.length === 0 ? (
        <div className="tc-empty">
          <FiBriefcase className="tc-empty__icon" />
          {contacts.length === 0 ? (
            <>
              <h2 className="tc-empty__title">Nothing here yet</h2>
              <p className="tc-empty__copy">
                Add your fabricators, templaters, installers and other trade
                partners so their details are always one click away.
              </p>
              <button className="tc-page__add-btn" onClick={openNew}>
                <FiPlus /> Add your first contact
              </button>
            </>
          ) : (
            <>
              <h2 className="tc-empty__title">No matches</h2>
              <p className="tc-empty__copy">
                Try clearing the search or picking a different role.
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="tc-grid">
          {filtered.map((c) => {
            const expanded = expandedId === c.id;
            const services = [
              c.fabrication && 'Fabrication',
              c.templating && 'Templating',
              c.installation && 'Installation',
            ].filter(Boolean).join(' · ');
            const priceRows = [
              ['1 slab', c.price_1_slab],
              ['2 slabs', c.price_2_slab],
              ['3 slabs', c.price_3_slab],
              ['4 slabs', c.price_4_slab],
              ['Sink cut-out', c.sink_cutout],
              ['Hob cut-out', c.hob_cutout],
              ['Extra', c.extra_charges],
            ].filter(([, v]) => v);
            const hasDetails = services || c.mile_radius != null || priceRows.length > 0;
            return (
              <div
                key={c.id}
                className={`tc-card${expanded ? ' tc-card--expanded' : ''}`}
                style={{ '--card-color': contactColor(c.id || c.name) }}
                onClick={() => hasDetails && setExpandedId(expanded ? null : c.id)}
                role={hasDetails ? 'button' : undefined}
                tabIndex={hasDetails ? 0 : undefined}
              >
                <div className="tc-card__head">
                  <div className="tc-card__identity">
                    <div className="tc-card__avatar"><FiUser /></div>
                    <div>
                      <h3 className="tc-card__name">{c.name}</h3>
                      {c.company && <p className="tc-card__company">{c.company}</p>}
                    </div>
                  </div>
                  {c.role && (
                    <span className="tc-card__role" style={{ '--role-color': roleColor(c.role) }}>
                      {c.role}
                    </span>
                  )}
                </div>

                <div className="tc-card__body">
                  {c.phone && (
                    <a href={`tel:${c.phone}`} className="tc-card__row" onClick={(e) => e.stopPropagation()}>
                      <FiPhone /> <span>{c.phone}</span>
                    </a>
                  )}
                  {c.email && (
                    <a href={`mailto:${c.email}`} className="tc-card__row" onClick={(e) => e.stopPropagation()}>
                      <FiMail /> <span>{c.email}</span>
                    </a>
                  )}
                  {(c.address || c.county || c.postcode) && (
                    <div className="tc-card__row">
                      <FiMapPin /> <span>{[c.address, c.county, c.postcode].filter(Boolean).join(', ')}</span>
                    </div>
                  )}
                  {c.notes && <p className="tc-card__notes">{c.notes}</p>}
                </div>

                {hasDetails && !expanded && (
                  <button
                    className="tc-card__expand"
                    onClick={(e) => { e.stopPropagation(); setExpandedId(c.id); }}
                  >
                    View pricing &amp; details <FiChevronDown />
                  </button>
                )}

                {expanded && (
                  <div className="tc-card__details">
                    {services && (
                      <div className="tc-card__detail-line"><span>Services</span><strong>{services}</strong></div>
                    )}
                    {c.mile_radius != null && (
                      <div className="tc-card__detail-line"><span>Coverage</span><strong>Up to {c.mile_radius} miles</strong></div>
                    )}
                    {priceRows.length > 0 && (
                      <div className="tc-card__prices">
                        <div className="tc-card__prices-title">Guideline pricing</div>
                        {priceRows.map(([label, value]) => (
                          <div className="tc-card__detail-line" key={label}>
                            <span>{label}</span><strong>{value}</strong>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="tc-card__actions" onClick={(e) => e.stopPropagation()}>
                  <button className="tc-card__action" onClick={() => openEdit(c)}>
                    <FiEdit2 /> Edit
                  </button>
                  <button className="tc-card__action tc-card__action--danger" onClick={() => handleDelete(c)}>
                    <FiTrash2 /> Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalOpen && (
        <TradeContactModal
          initial={editing}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
