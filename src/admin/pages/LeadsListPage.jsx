import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import useLeads, { PRESET_FILTERS } from '../hooks/useLeads';
import useSalePeriods from '../hooks/useSalePeriods';
import StatusBadge from '../components/StatusBadge';
import AddClientModal from '../components/modals/AddClientModal';
import ModalShell from '../components/modals/ModalShell';
import { sourceLabel } from '../utils/leadSource';
import { assignLeadPeriod, periodCategory, categoryLabel } from '../utils/salePeriods';
import { FiSearch, FiChevronUp, FiChevronDown, FiX, FiUserPlus, FiTrash2, FiCheckCircle } from 'react-icons/fi';
import '../styles/salePeriodColors.css';
import './LeadsListPage.css';

export default function LeadsListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialFilter = searchParams.get('filter') || '';
  const { leads, loading, statusFilter, setStatusFilter, presetFilter, clearPresetFilter, search, setSearch, sortField, sortAsc, toggleSort, deleteLead, markDepositTaken } = useLeads(initialFilter);
  // Sale periods come newest-first — used to colour-code each lead by how many
  // sale periods ago they came in.
  const { periods: salePeriods } = useSalePeriods();
  const [showAddClient, setShowAddClient] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [payingId, setPayingId] = useState(null);

  const handleMarkDepositPaid = async (lead) => {
    if (!window.confirm(`Mark ${lead.full_name}'s deposit as received? They'll move to Deposit Taken.`)) return;
    setPayingId(lead.id);
    const { error } = await markDepositTaken(lead);
    setPayingId(null);
    if (error) window.alert(`Couldn't record the payment: ${error.message || 'please try again.'}`);
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  const handleClearPreset = () => {
    clearPresetFilter();
    setSearchParams({});
  };

  const handleStatusChange = (e) => {
    if (presetFilter) {
      clearPresetFilter();
      setSearchParams({});
    }
    setStatusFilter(e.target.value);
  };

  const handleDelete = async () => {
    if (!deleteTarget || deleteConfirm !== 'DELETE') return;
    setDeleting(true);
    await deleteLead(deleteTarget.id);
    setDeleting(false);
    setDeleteTarget(null);
    setDeleteConfirm('');
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortAsc ? <FiChevronUp className="leads-sort-icon" /> : <FiChevronDown className="leads-sort-icon" />;
  };

  const renderRow = (lead, showExpected) => {
    const assigned = assignLeadPeriod(lead.created_at, salePeriods);
    const cat = assigned ? periodCategory(assigned.periodsAgo) : null;
    return (
    <tr key={lead.id} className={cat ? `sp-row--${cat}` : ''}>
      <td>
        <Link to={`/admin/leads/${lead.id}`} className={`admin-table__link${lead.pending_action ? ' admin-table__link--action' : ''}`}>
          {lead.full_name}
        </Link>
      </td>
      <td>{lead.email}</td>
      <td>{lead.phone}</td>
      <td><StatusBadge status={lead.status} /></td>
      <td className="admin-table__source">{sourceLabel(lead.source)}</td>
      <td className="admin-table__date">{formatDate(lead.created_at)}</td>
      <td className="leads-list__period">
        {assigned ? (
          <span className={`sp-pill--${cat}`} title={categoryLabel(cat)}>{assigned.period.name}</span>
        ) : (
          <span className="leads-list__period-none">—</span>
        )}
      </td>
      {showExpected && (
        <td>
          <div className="leads-list__expected-wrap">
            <span className="leads-list__expected">
              {lead._depositExpectedDate ? formatDate(lead._depositExpectedDate) : '—'}
            </span>
            <button
              className="leads-list__deposit-paid-btn"
              onClick={() => handleMarkDepositPaid(lead)}
              disabled={payingId === lead.id || !lead._depositQuoteId}
              title="Mark deposit as received"
            >
              <FiCheckCircle /> {payingId === lead.id ? 'Saving…' : 'Deposit Paid'}
            </button>
          </div>
        </td>
      )}
      <td>
        <button
          className="leads-list__delete-btn"
          onClick={() => setDeleteTarget(lead)}
          title="Delete client"
        >
          <FiTrash2 />
        </button>
      </td>
    </tr>
    );
  };

  const renderTable = (rows, showExpected = false) => (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th className="admin-table__sortable" onClick={() => toggleSort('full_name')}>
              Name <SortIcon field="full_name" />
            </th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Source</th>
            <th className="admin-table__sortable" onClick={() => toggleSort('created_at')}>
              Date <SortIcon field="created_at" />
            </th>
            <th>Sale Period</th>
            {showExpected && <th>Expected Deposit</th>}
            <th></th>
          </tr>
        </thead>
        <tbody>{rows.map((lead) => renderRow(lead, showExpected))}</tbody>
      </table>
    </div>
  );

  // Deposits preset is shown as two sections: pending payment vs already taken.
  const isDepositView = presetFilter === 'deposits';
  const pendingDeposits = isDepositView ? leads.filter((l) => !l._depositTaken) : [];
  const takenDeposits = isDepositView ? leads.filter((l) => l._depositTaken) : [];

  return (
    <div className="leads-list">
      {presetFilter && PRESET_FILTERS[presetFilter] && (
        <div className="leads-list__preset-banner">
          <span>Showing: <strong>{PRESET_FILTERS[presetFilter].label}</strong></span>
          <button className="leads-list__preset-clear" onClick={handleClearPreset}>
            <FiX /> Clear filter
          </button>
        </div>
      )}

      <div className="leads-list__toolbar">
        <div className="leads-list__search">
          <FiSearch className="leads-list__search-icon" />
          <input
            className="leads-list__search-input"
            type="text"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="leads-list__filter"
          value={presetFilter ? 'all' : statusFilter}
          onChange={handleStatusChange}
          disabled={!!presetFilter}
        >
          <option value="all">All Statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="quoted">Quoted</option>
          <option value="deposit">Deposit</option>
          <option value="cold">Cold Leads</option>
        </select>
        <button className="leads-list__add-btn" onClick={() => setShowAddClient(true)}>
          <FiUserPlus /> Add Client
        </button>
      </div>

      {salePeriods.length > 0 && (
        <div className="leads-list__legend">
          <span className="leads-list__legend-label">Sale period:</span>
          <span className="leads-list__legend-item"><span className="sp-dot sp-dot--current" /> This sale</span>
          <span className="leads-list__legend-item"><span className="sp-dot sp-dot--last" /> Last sale</span>
          <span className="leads-list__legend-item"><span className="sp-dot sp-dot--mid" /> 2 sales ago</span>
          <span className="leads-list__legend-item"><span className="sp-dot sp-dot--old" /> 3+ sales ago</span>
        </div>
      )}

      {loading ? (
        <div className="admin-page-loading">Loading leads...</div>
      ) : leads.length === 0 ? (
        <div className="leads-list__empty">
          <p>No leads found{statusFilter !== 'all' || presetFilter || search ? ' matching your filters' : ''}.</p>
        </div>
      ) : isDepositView ? (
        <>
          <section className="leads-list__section">
            <h3 className="leads-list__section-title">Pending Deposit ({pendingDeposits.length})</h3>
            {pendingDeposits.length > 0 ? (
              renderTable(pendingDeposits, true)
            ) : (
              <p className="leads-list__section-empty">No deposits awaiting payment.</p>
            )}
          </section>
          <section className="leads-list__section">
            <h3 className="leads-list__section-title">Deposit Taken ({takenDeposits.length})</h3>
            {takenDeposits.length > 0 ? (
              renderTable(takenDeposits)
            ) : (
              <p className="leads-list__section-empty">No deposits taken yet.</p>
            )}
          </section>
        </>
      ) : (
        renderTable(leads)
      )}

      {showAddClient && (
        <AddClientModal
          onClose={() => setShowAddClient(false)}
          onCreated={(id) => navigate(`/admin/leads/${id}`)}
        />
      )}

      {deleteTarget && (
        <ModalShell title="Delete Client" onClose={() => { setDeleteTarget(null); setDeleteConfirm(''); }}>
          <p className="leads-list__delete-warning">
            You are about to permanently delete <strong>{deleteTarget.full_name}</strong> and all their associated data (quotes, samples, calls, SMS, files, activity).
          </p>
          <p className="leads-list__delete-prompt">Type <strong>DELETE</strong> to confirm:</p>
          <input
            className="modal-field__input"
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
            placeholder="Type DELETE"
            autoFocus
          />
          <div className="modal-actions">
            <button
              type="button"
              className="modal-actions__btn modal-actions__btn--cancel"
              onClick={() => { setDeleteTarget(null); setDeleteConfirm(''); }}
            >
              Cancel
            </button>
            <button
              type="button"
              className="leads-list__delete-confirm-btn"
              disabled={deleteConfirm !== 'DELETE' || deleting}
              onClick={handleDelete}
            >
              {deleting ? 'Deleting...' : 'Delete Client'}
            </button>
          </div>
        </ModalShell>
      )}
    </div>
  );
}
