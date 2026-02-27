import { useState } from 'react';
import './PasswordGate.css';

const CORRECT_PASSWORD = 'Gemini123';
const STORAGE_KEY = 'tqc_authenticated';

export default function PasswordGate({ children }) {
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem(STORAGE_KEY) === 'true'
  );
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, 'true');
      setAuthenticated(true);
    } else {
      setError(true);
      setPassword('');
    }
  };

  if (authenticated) {
    return children;
  }

  return (
    <div className="password-gate">
      <div className="password-gate__content">
        <span className="password-gate__badge">Coming Soon</span>
        <h1 className="password-gate__title">The Quartz Company</h1>
        <p className="password-gate__subtitle">
          Our new website is under construction. Enter the password to preview.
        </p>
        <form className="password-gate__form" onSubmit={handleSubmit}>
          <input
            className={`password-gate__input ${error ? 'password-gate__input--error' : ''}`}
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false); }}
            autoFocus
          />
          <button className="password-gate__button" type="submit">
            Enter
          </button>
        </form>
        {error && <p className="password-gate__error">Incorrect password. Please try again.</p>}
      </div>
    </div>
  );
}
