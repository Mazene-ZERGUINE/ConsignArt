import { useState } from 'react';
import type { FormEvent } from 'react';
import { api, getErrorMessage } from '../../../lib/api';
import { Alert } from '../../../components/ui';

export function CreateAdminTab() {
  const [email, setEmail] = useState('');
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setTempPassword(null);
    setSubmitting(true);
    try {
      const result = await api.post<{ tempPassword: string }>('/admin/accounts', { email });
      setTempPassword(result.tempPassword);
      setEmail('');
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to create admin account'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="card" style={{ maxWidth: 480 }}>
      <h3>Create a new admin account</h3>
      <p className="muted">A random password is generated and shown only once below.</p>
      {error && <Alert type="error">{error}</Alert>}
      {tempPassword && (
        <Alert type="success">
          Account created. Temporary password: <strong>{tempPassword}</strong>
        </Alert>
      )}
      <form onSubmit={(event) => void handleSubmit(event)}>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-actions">
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? 'Creating…' : 'Create admin'}
          </button>
        </div>
      </form>
    </div>
  );
}
