import { useAuth } from '../../context/AuthContext';
import useDashboardStats from '../hooks/useDashboardStats';
import useZohoUnread from '../hooks/useZohoUnread';
import TaskCard from '../components/TaskCard';
import {
  FiFileText, FiCopy, FiMail, FiDollarSign, FiPackage,
  FiRepeat, FiCalendar, FiThumbsUp, FiMapPin, FiPhone,
  FiClipboard
} from 'react-icons/fi';
import './AdminDashboard.css';

const ROW_1 = [
  { key: 'newQuotes', label: 'New Quote\nRequests', icon: FiFileText, color: '#3b3b3b', filter: 'new_quotes' },
  { key: 'repeatQuotes', label: '1+ Quote\nRequests', icon: FiCopy, color: '#c5a47e', filter: 'repeat_quotes', highlightWhenActive: true },
  { key: 'newQuotesSelfServe', label: 'New Quote\nRequests\nSelf Serve', icon: FiFileText, color: '#6b8f71', filter: 'new_quotes_self_serve' },
  { key: 'repeatQuotesSelfServe', label: '1+ Quote\nRequests\nSelf Serve', icon: FiCopy, color: '#8b7fc7', filter: 'repeat_quotes_self_serve', highlightWhenActive: true },
  { key: 'emails', label: 'Emails', icon: FiMail, color: '#7c6dab', isEmail: true },
  { key: 'deposits', label: 'Deposits', icon: FiDollarSign, color: '#d4874e', filter: 'deposits' },
  { key: 'samples', label: 'Samples', icon: FiPackage, color: '#5ba4a4', to: '/admin/samples' },
  { key: 'followUp', label: 'Follow Up\nQuotes', icon: FiRepeat, color: '#9e9e9e', filter: 'follow_up' },
];

const ROW_2 = [
  { key: 'appointments', label: 'Appointments', icon: FiCalendar, color: '#8b3a3a', to: '/admin/appointments' },
  { key: 'proWelcome', label: 'Pro Welcome', icon: FiThumbsUp, color: '#d4748b', filter: 'pro_welcome' },
  { key: 'chaseMeasurements', label: 'Chase\nMeasurements', icon: FiMapPin, color: '#b93131', filter: 'chase_measurements' },
  { key: 'otherTasks', label: 'Other Tasks', icon: FiPhone, color: '#4a9e8e', filter: 'other_tasks' },
  { key: 'complianceTasks', label: 'Compliance\nTasks', icon: FiClipboard, color: '#6b8f71', filter: 'compliance_tasks' },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const { counts, loading } = useDashboardStats();
  const zohoUnread = useZohoUnread(60000);

  if (loading) return <div className="admin-page-loading">Loading dashboard...</div>;

  const displayName = user?.email?.split('@')[0]?.replace(/[._]/g, ' ') || 'there';

  const renderCard = (card) => {
    if (card.isEmail) {
      return (
        <TaskCard
          key={card.key}
          label={card.label}
          count=""
          badge={zohoUnread || undefined}
          icon={card.icon}
          color={card.color}
          href="https://mail.zoho.eu"
        />
      );
    }
    const count = counts[card.key];
    return (
      <TaskCard
        key={card.key}
        label={card.label}
        count={count}
        icon={card.icon}
        color={card.color}
        to={card.to || `/admin/leads?filter=${card.filter}`}
        highlight={card.highlightWhenActive && count > 0}
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
    </div>
  );
}
