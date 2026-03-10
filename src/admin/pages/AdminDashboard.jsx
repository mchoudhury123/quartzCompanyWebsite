import { Link } from 'react-router-dom';
import useDashboardStats from '../hooks/useDashboardStats';
import TaskCard from '../components/TaskCard';
import StatusBadge from '../components/StatusBadge';
import { FiFileText, FiMessageSquare, FiPackage, FiPhoneCall, FiRepeat, FiDollarSign, FiMail } from 'react-icons/fi';
import './AdminDashboard.css';

const taskCards = [
  { key: 'newQuotes', label: 'New Quote Requests', icon: FiFileText, color: '#3b82f6', filter: 'new_quotes' },
  { key: 'newEnquiries', label: 'New Enquiries', icon: FiMessageSquare, color: '#6366f1', filter: 'new_enquiries' },
  { key: 'samples', label: 'Samples to Send', icon: FiPackage, color: '#f59e0b', filter: 'samples' },
  { key: 'callbacks', label: 'Callbacks Requested', icon: FiPhoneCall, color: '#ef4444', filter: 'callbacks' },
  { key: 'followUp', label: 'Follow Up Quotes', icon: FiRepeat, color: '#8b5cf6', filter: 'follow_up' },
  { key: 'deposits', label: 'Deposits', icon: FiDollarSign, color: '#10b981', filter: 'deposits' },
];

export default function AdminDashboard() {
  const { counts, recentLeads, loading } = useDashboardStats();

  if (loading) return <div className="admin-page-loading">Loading dashboard...</div>;

  const formatDate = (d) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__tasks">
        {taskCards.map((card) => (
          <TaskCard
            key={card.key}
            label={card.label}
            count={counts[card.key]}
            icon={card.icon}
            color={card.color}
            to={`/admin/leads?filter=${card.filter}`}
          />
        ))}
        <TaskCard
          label="Emails"
          icon={FiMail}
          color="#c5a47e"
          href="https://mail.zoho.eu"
        />
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
