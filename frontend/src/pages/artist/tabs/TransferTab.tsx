import { useState } from 'react';
import type { FormEvent } from 'react';
import { api, ApiError } from '../../../lib/api';
import { Alert } from '../../../components/ui';

export function TransferTab() {
  const [newGalleryId, setNewGalleryId] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    setSubmitting(true);
    try {
      await api.post('/artists/request-transfer', { newGalleryId, reason });
      setSuccess(true);
      setNewGalleryId('');
      setReason('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to submit transfer request');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="card" style={{ maxWidth: 480 }}>
      <h3>Request a transfer to another gallery</h3>
      <p className="muted">
        An artist can only be attached to one gallery at a time. Your request will need approval from an admin.
      </p>
      {success && <Alert type="success">Transfer request submitted.</Alert>}
      {error && <Alert type="error">{error}</Alert>}
      <form onSubmit={(event) => void handleSubmit(event)}>
        <div className="form-group">
          <label>Destination gallery ID</label>
          <input value={newGalleryId} onChange={(e) => setNewGalleryId(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Reason</label>
          <textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)} required />
        </div>
        <div className="form-actions">
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit request'}
          </button>
        </div>
      </form>
    </div>
  );
}
