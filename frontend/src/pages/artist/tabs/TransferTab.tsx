import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { api, getErrorMessage } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import type { ArtistUser, GalleryDirectoryEntry } from '../../../types/api';
import { Alert, Spinner } from '../../../components/ui';

export function TransferTab() {
  const { user } = useAuth();
  const artist = user as ArtistUser;
  const [galleries, setGalleries] = useState<GalleryDirectoryEntry[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [newGalleryId, setNewGalleryId] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .get<GalleryDirectoryEntry[]>('/gallery/directory')
      .then((all) => setGalleries(all.filter((gallery) => gallery.userId !== artist.gallery?.userId)))
      .catch((err: unknown) => setLoadError(getErrorMessage(err, 'Failed to load galleries')));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      setError(getErrorMessage(err, 'Failed to submit transfer request'));
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
      {loadError && <Alert type="error">{loadError}</Alert>}
      {!galleries && !loadError && <Spinner />}
      {galleries && galleries.length === 0 && (
        <Alert type="info">No other validated gallery is available to transfer to yet.</Alert>
      )}
      {galleries && galleries.length > 0 && (
        <form onSubmit={(event) => void handleSubmit(event)}>
          <div className="form-group">
            <label>Destination gallery</label>
            <select value={newGalleryId} onChange={(e) => setNewGalleryId(e.target.value)} required>
              <option value="" disabled>
                Select a gallery…
              </option>
              {galleries.map((gallery) => (
                <option key={gallery.userId} value={gallery.userId}>
                  {gallery.name} ({gallery.email})
                </option>
              ))}
            </select>
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
      )}
    </div>
  );
}
