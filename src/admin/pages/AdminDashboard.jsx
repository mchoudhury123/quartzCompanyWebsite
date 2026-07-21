import { useAuth } from '../../context/AuthContext';
import useDashboardStats from '../hooks/useDashboardStats';
import useZohoUnread from '../hooks/useZohoUnread';
import TaskCard from '../components/TaskCard';
import TodaysTodo from '../components/TodaysTodo';
import {
  FiFileText, FiMail, FiDollarSign, FiPackage,
  FiRepeat, FiCalendar, FiMapPin, FiPhoneCall,
  FiHeart, FiBriefcase, FiCheckCircle, FiStar, FiUserCheck, FiAlertCircle, FiClock
} from 'react-icons/fi';
import './AdminDashboard.css';

const ROW_1 = [
  { key: 'newQuotes', label: 'New Quote\nRequests', icon: FiFileText, color: '#3b3b3b', filter: 'new_quotes' },
  { key: 'contacted', label: 'Contacted', icon: FiUserCheck, color: '#4a9e8e', filter: 'contacted' },
  { key: 'followUp', label: 'Quotes', icon: FiRepeat, color: '#8b7fc7', filter: 'follow_up' },
  { key: 'deposits', label: 'Deposits', icon: FiDollarSign, color: '#d4874e', filter: 'deposits' },
  { key: 'completed', label: 'Completed', icon: FiCheckCircle, color: '#15803d', filter: 'completed' },
  { key: 'coldLeads', label: 'Cold Leads', icon: FiClock, color: '#6b8fb0', filter: 'cold' },
  { key: 'newsletter', label: 'Stay\nInspired', icon: FiHeart, color: '#b86f91', filter: 'newsletter' },
  { key: 'emails', label: 'Emails', icon: FiMail, color: '#7c6dab', isEmail: true },
  { key: 'samples', label: 'Samples', icon: FiPackage, color: '#5ba4a4', to: '/admin/samples' },
];

const ROW_2 = [
  { key: 'appointments', label: 'Appointments', icon: FiCalendar, color: '#8b3a3a', to: '/admin/appointments' },
  { key: 'followUpCall', label: 'Follow Up\nCall', icon: FiPhoneCall, color: '#d4874e', to: '/admin/appointments?type=follow_up_call', showCountAsBadge: true },
  { key: 'chaseMeasurements', label: 'Chase\nMeasurements', icon: FiMapPin, color: '#b93131', filter: 'chase_measurements' },
  { key: 'actionRequired', label: 'Action\nRequired', icon: FiAlertCircle, color: '#e07b39', filter: 'action_required' },
  { key: 'tradeContacts', label: 'Trade\nContacts', icon: FiBriefcase, color: '#5b8fd4', to: '/admin/trade-contacts' },
  { key: 'reviews', label: 'Reviews', icon: FiStar, color: '#b08d57', to: '/admin/reviews' },
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
        count={card.showCountAsBadge ? '' : count}
        badge={card.showCountAsBadge ? count : undefined}
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

      <div className="admin-dashboard__body">
        <div className="admin-dashboard__main">
          <div className="admin-dashboard__tasks">
            {ROW_1.map(renderCard)}
          </div>
          <div className="admin-dashboard__tasks">
            {ROW_2.map(renderCard)}
          </div>
        </div>
        <aside className="admin-dashboard__side">
          <TodaysTodo />
        </aside>
      </div>
    </div>
  );
}
