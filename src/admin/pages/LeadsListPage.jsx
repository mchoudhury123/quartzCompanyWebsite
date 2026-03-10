import { Link, useSearchParams } from 'react-router-dom';
import useLeads, { PRESET_FILTERS } from '../hooks/useLeads';
import StatusBadge from '../components/StatusBadge';
import { FiSearch, FiChevronUp, FiChevronDown, FiX } from 'react-icons/fi';
import './LeadsListPage.css';

export default function LeadsListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialFilter = searchParams.get('filter') || '';
  const { leads, loading, statusFilter, setStatusFilter, presetFilter, clearPresetFilter, search, setSearch, sortField, sortAsc, toggleSort } = useLeads(initialFilter);

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

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortAsc ? <FiChevronUp className="leads-sort-icon" /> : <FiChevronDown className="leads-sort-icon" />;
  };

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
          <option value="won">Won</option>
          <option value="lost">Lost</option>
        </select>
      </div>

      {loading ? (
        <div className="admin-page-loading">Loading leads...</div>
      ) : leads.length === 0 ? (
        <div className="leads-list__empty">
          <p>No leads found{statusFilter !== 'all' || presetFilter || search ? ' matching your filters' : ''}.</p>
        </div>
      ) : (
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
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td>
                    <Link to={`/admin/leads/${lead.id}`} className="admin-table__link">
                      {lead.full_name}
                    </Link>
                  </td>
                  <td>{lead.email}</td>
                  <td>{lead.phone}</td>
                  <td><StatusBadge status={lead.status} /></td>
                  <td className="admin-table__source">{lead.source === 'quote_modal' ? 'Quote' : 'Contact'}</td>
                  <td className="admin-table__date">{formatDate(lead.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
