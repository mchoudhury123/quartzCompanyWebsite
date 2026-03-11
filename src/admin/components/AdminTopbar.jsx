import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiLogOut, FiMenu } from 'react-icons/fi';
import './AdminTopbar.css';

const pageTitles = {
  '/admin/dashboard': 'Dashboard',
  '/admin/leads': 'Clients',
};

export default function AdminTopbar() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const title = pageTitles[location.pathname] ||
    (location.pathname.startsWith('/admin/leads/') ? 'Client Detail' : 'Admin');

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin', { replace: true });
  };

  return (
    <div className="admin-topbar">
      <h1 className="admin-topbar__title">{title}</h1>
      <div className="admin-topbar__right">
        <span className="admin-topbar__user">{user?.email}</span>
        <button className="admin-topbar__logout" onClick={handleSignOut} title="Sign out">
          <FiLogOut />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
