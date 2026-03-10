import { Outlet } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import '../styles/admin-variables.css';

export default function AdminLayout() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}
