import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useDashboardStats from '../hooks/useDashboardStats';
import TaskCard from '../components/TaskCard';
import StatusBadge from '../components/StatusBadge';
import {
  FiFileText, FiCopy, FiMail, FiDollarSign, FiPackage,
  FiRepeat, FiCalendar, FiThumbsUp, FiMapPin, FiPhone,
  FiClipboard, FiCheckSquare
} from 'react-icons/fi';
import './AdminDashboard.css';

const ROW_1 = [
  { key: 'newQuotes', label: 'New Quote\nRequests', icon: FiFileText, color: '#3b3b3b', filter: 'new_quotes' },
  { key: 'repeatQuotes', label: '1+ Quote\nRequests', icon: FiCopy, color: '#c5a47e', filter: 'repeat_quotes' },
  { key: 'newQuotesSelfServe', label: 'New Quote\nRequests\nSelf Serve', icon: FiFileText, color: '#6b8f71', filter: 'new_quotes_self_serve' },
  { key: 'repeatQuotesSelfServe', label: '1+ Quote\nRequests\nSelf Serve', icon: FiCopy, color: '#8b7fc7', filter: 'repeat_quotes_self_serve' },
  { key: 'emails', label: 'Emails', icon: FiMail, color: '#7c6dab', isEmail: true },
  { key: 'deposits', label: 'Deposits', icon: FiDollarSign, color: '#d4874e', filter: 'deposits' },
  { key: 'samples', label: 'Samples', icon: FiPackage, color: '#5ba4a4', filter: 'samples' },
  { key: 'followUp', label: 'Follow Up\nQuotes', icon: FiRepeat, color: '#9e9e9e', filter: 'follow_up' },
];

const ROW_2 = [
  { key: 'appointments', label: 'Appointments', icon: FiCalendar, color: '#8b3a3a', filter: 'appointments' },
  { key: 'proWelcome', label: 'Pro Welcome', icon: FiThumbsUp, color: '#d4748b', filter: 'pro_welcome' },
  { key: 'chaseMeasurements', label: 'Chase\nMeasurements', icon: FiMapPin, color: '#b93131', filter: 'chase_measurements' },
  { key: 'otherTasks', label: 'Other Tasks', icon: FiPhone, color: '#4a9e8e', filter: 'other_tasks' },
  { key: 'complianceTasks', label: 'Compliance\nTasks', icon: FiClipboard, color: '#6b8f71', filter: 'compliance_tasks' },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const { counts, recentLeads, loading } = useDashboardStats();

  if (loading) return <div className="admin-page-loading">Loading dashboard...</div>;

  const formatDate = (d) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const displayName = user?.email?.split('@')[0]?.replace(/[._]/g, ' ') || 'there';

  const renderCard = (card) => {
    if (card.isEmail) {
      return (
        <TaskCard
          key={card.key}
          label={card.label}
          count={counts[card.key]}
          badge={counts[card.key] || undefined}
          icon={card.icon}
          color={card.color}
          href="https://mail.zoho.eu"
        />
      );
    }
    return (
      <TaskCard
        key={card.key}
        label={card.label}
        count={counts[card.key]}
        icon={card.icon}
        color={card.color}
        to={`/admin/leads?filter=${card.filter}`}
      />
    );
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard__welcome">
        <h1 className="admin-dashboard__welcome-title">Dashboard</h1>
        <p className="admin-dashboard__welcome-sub">Welcome back, {displayName}</p>
      </div>

      <div className="admin-dashboard__tasks">
        {ROW_1.map(renderCard)}
      </div>
      <div className="admin-dashboard__tasks">
        {ROW_2.map(renderCard)}
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
