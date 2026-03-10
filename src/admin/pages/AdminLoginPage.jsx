import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminLoginPage.css';

export default function AdminLoginPage() {
  const { session, signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (session) {
    navigate('/admin/dashboard', { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: authError } = await signIn(email, password);
    if (authError) {
      setError('Invalid email or password');
      setLoading(false);
    } else {
      navigate('/admin/dashboard', { replace: true });
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <div className="admin-login__header">
          <span className="admin-login__logo">THE QUARTZ COMPANY</span>
          <h1 className="admin-login__title">Sales CRM</h1>
          <p className="admin-login__subtitle">Sign in to manage leads and follow-ups</p>
        </div>
        <form className="admin-login__form" onSubmit={handleSubmit}>
          <div className="admin-login__field">
            <label className="admin-login__label" htmlFor="email">Email</label>
            <input
              id="email"
              className="admin-login__input"
              type="email"
              placeholder="sales@thequartzcompany.co.uk"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="admin-login__field">
            <label className="admin-login__label" htmlFor="password">Password</label>
            <input
              id="password"
              className="admin-login__input"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="admin-login__error">{error}</p>}
          <button className="admin-login__submit" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
