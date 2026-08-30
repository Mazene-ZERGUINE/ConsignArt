import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api, ApiError } from '../lib/api';
import { UserRoles } from '../types/api';
import type { UserRole } from '../types/api';
import { Alert } from '../components/ui';

const HOME_BY_ROLE: Record<UserRole, string> = {
  [UserRoles.ADMIN]: '/admin',
  [UserRoles.GALLERY]: '/gallery',
  [UserRoles.ARTIST]: '/artist',
  [UserRoles.COLLECTOR]: '/collector',
};

export function SignupPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userRole, setUserRole] = useState<UserRole>(UserRoles.COLLECTOR);
  const [galleryName, setGalleryName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await api.publicPost('/auth/signup', {
        email,
        password,
        userRole,
        ...(userRole === UserRoles.GALLERY && { galleryName }),
      });
      await login(email, password, userRole);
      navigate(HOME_BY_ROLE[userRole]);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Signup failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1>Create an account</h1>
        <p className="muted">
          Galleries must be validated by an admin before they can operate. Artist accounts are created by a gallery.
        </p>
        {error && <Alert type="error">{error}</Alert>}
        <form onSubmit={(event) => void handleSubmit(event)}>
          <div className="form-group">
            <label htmlFor="role">I am a</label>
            <select id="role" value={userRole} onChange={(e) => setUserRole(e.target.value as UserRole)}>
              <option value={UserRoles.COLLECTOR}>Collector</option>
              <option value={UserRoles.GALLERY}>Gallery</option>
            </select>
          </div>
          {userRole === UserRoles.GALLERY && (
            <div className="form-group">
              <label htmlFor="galleryName">Gallery name</label>
              <input
                id="galleryName"
                value={galleryName}
                onChange={(e) => setGalleryName(e.target.value)}
                required
              />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              minLength={12}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="muted" style={{ fontSize: '0.78rem' }}>
              At least 12 characters, with uppercase, lowercase and a number or symbol.
            </span>
          </div>
          <div className="form-actions">
            <button className="btn btn-primary" type="submit" disabled={submitting} style={{ width: '100%' }}>
              {submitting ? 'Creating account…' : 'Create account'}
            </button>
          </div>
        </form>
        <p className="muted" style={{ marginTop: '1rem', textAlign: 'center' }}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
