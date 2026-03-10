import { Link } from 'react-router-dom';
import useDashboardStats from '../hooks/useDashboardStats';
import StatsCard from '../components/StatsCard';
import StatusBadge from '../components/StatusBadge';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const { stats, recentLeads, loading } = useDashboardStats();

  if (loading) return <div className="admin-page-loading">Loading dashboard...</div>;

  const cards = [
    { label: 'Total Leads', value: stats.total, color: '#3b82f6' },
    { label: 'New', value: stats.new, color: '#3b82f6' },
    { label: 'Contacted', value: stats.contacted, color: '#f59e0b' },
    { label: 'Quoted', value: stats.quoted, color: '#8b5cf6' },
    { label: 'Won', value: stats.won, color: '#10b981' },
  ];

  const formatDate = (d) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__stats">
        {cards.map((c) => (
          <StatsCard key={c.label} label={c.label} value={c.value} color={c.color} />
        ))}
      </div>

      <div className="admin-dashboard__recent">
        <div className="admin-dashboard__section-header">
          <h2 className="admin-dashboard__section-title">Recent Leads</h2>
          <Link to="/admin/leads" className="admin-dashboard__view-all">View All</Link>
        </div>
        {recentLeads.length === 0 ? (
          <div className="admin-dashboard__empty">
            <p>No leads yet. Leads from the quote form and contact page will appear here.</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Source</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((lead) => (
                  <tr key={lead.id}>
                    <td>
                      <Link to={`/admin/leads/${lead.id}`} className="admin-table__link">
                        {lead.full_name}
                      </Link>
                    </td>
                    <td>{lead.email}</td>
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
    </div>
  );
}
