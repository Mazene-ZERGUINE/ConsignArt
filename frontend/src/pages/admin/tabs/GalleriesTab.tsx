import { useEffect, useState } from 'react';
import { api, getErrorMessage } from '../../../lib/api';
import type { GalleryUser } from '../../../types/api';
import { Alert, Badge, EmptyState, Spinner } from '../../../components/ui';

export function GalleriesTab() {
  const [pendingOnly, setPendingOnly] = useState(true);
  const [galleries, setGalleries] = useState<GalleryUser[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const load = () => {
    setGalleries(null);
    api
      .get<GalleryUser[]>(`/gallery?pending=${pendingOnly}`)
      .then(setGalleries)
      .catch((err: unknown) => setError(getErrorMessage(err, 'Failed to load galleries')));
  };

  useEffect(load, [pendingOnly]);

  async function validate(galleryId: string) {
    setActionError(null);
    try {
      await api.get(`/admin/validate-gallery-account?galleryId=${galleryId}`);
      load();
    } catch (err) {
      setActionError(getErrorMessage(err, 'Failed to validate gallery'));
    }
  }

  return (
    <div>
      <div className="section-toolbar">
        <h3 style={{ margin: 0 }}>Galleries</h3>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 500 }}>
          <input type="checkbox" checked={pendingOnly} onChange={(e) => setPendingOnly(e.target.checked)} />
          Pending validation only
        </label>
      </div>

      {actionError && <Alert type="error">{actionError}</Alert>}
      {error && <Alert type="error">{error}</Alert>}
      {!galleries && !error && <Spinner />}
      {galleries && galleries.length === 0 && <EmptyState>No galleries found.</EmptyState>}

      {galleries && galleries.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Gallery ID</th>
              <th>Status</th>
              <th>Artists</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {galleries.map((gallery) => (
              <tr key={gallery.userId}>
                <td>{gallery.email}</td>
                <td>{gallery.entityId}</td>
                <td>
                  <Badge value={gallery.galleryVerified ? 'validated' : 'pending'} />
                </td>
                <td>{gallery.associatedArtists.length}</td>
                <td>
                  {!gallery.galleryVerified && (
                    <button className="btn btn-primary btn-sm" onClick={() => void validate(gallery.userId)}>
                      Validate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
