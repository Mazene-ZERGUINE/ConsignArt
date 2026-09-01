import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../lib/api';
import { UserRoles } from '../types/api';
import type { UserRole } from '../types/api';
import { Alert } from '../components/ui';

const HOME_BY_ROLE: Record<UserRole, string> = {
  [UserRoles.ADMIN]: '/admin',
  [UserRoles.GALLERY]: '/gallery',
  [UserRoles.ARTIST]: '/artist',
  [UserRoles.COLLECTOR]: '/collector',
};

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const user = await login(email, password);
      navigate(HOME_BY_ROLE[user.userRole]);
    } catch (err) {
      setError(getErrorMessage(err, 'Login failed'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1>Sign in to ConsignArt</h1>
        <p className="muted">Manage consigned art works, sales and exhibitions.</p>
        {error && <Alert type="error">{error}</Alert>}
        <form onSubmit={(event) => void handleSubmit(event)}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-actions">
            <button className="btn btn-primary" type="submit" disabled={submitting} style={{ width: '100%' }}>
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
          </div>
        </form>
        <p className="muted" style={{ marginTop: '1rem', textAlign: 'center' }}>
          No account yet? <Link to="/signup">Create a gallery or collector account</Link>
        </p>
      </div>
    </div>
  );
}
