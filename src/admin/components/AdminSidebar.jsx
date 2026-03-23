import { NavLink } from 'react-router-dom';
import { FiGrid, FiUsers, FiPackage, FiCalendar, FiArrowLeft } from 'react-icons/fi';
import './AdminSidebar.css';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: FiGrid },
  { to: '/admin/leads', label: 'Clients', icon: FiUsers },
  { to: '/admin/samples', label: 'Samples', icon: FiPackage },
  { to: '/admin/appointments', label: 'Appointments', icon: FiCalendar },
];

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__brand">
        <div className="admin-sidebar__logo">
          <span className="admin-sidebar__logo-q">Q</span>
        </div>
        <div className="admin-sidebar__brand-info">
          <span className="admin-sidebar__brand-text">THE QUARTZ COMPANY</span>
          <span className="admin-sidebar__brand-sub">Sales CRM</span>
        </div>
      </div>
      <nav className="admin-sidebar__nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `admin-sidebar__link${isActive ? ' admin-sidebar__link--active' : ''}`
            }
          >
            <item.icon className="admin-sidebar__icon" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="admin-sidebar__footer">
        <a href="/" className="admin-sidebar__link admin-sidebar__link--back">
          <FiArrowLeft className="admin-sidebar__icon" />
          <span>Back to Website</span>
        </a>
      </div>
    </aside>
  );
}
