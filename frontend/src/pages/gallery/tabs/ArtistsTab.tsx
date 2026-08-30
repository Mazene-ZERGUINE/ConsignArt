import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { api, ApiError } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import type { ArtistUser, GalleryUser } from '../../../types/api';
import { ActivityStatus } from '../../../types/api';
import { Alert, EmptyState, Spinner, formatDate } from '../../../components/ui';

export function ArtistsTab() {
  const { user } = useAuth();
  const gallery = user as GalleryUser;
  const [artists, setArtists] = useState<ArtistUser[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const load = () => {
    api
      .get<ArtistUser[]>('/artists')
      .then((all) => setArtists(all.filter((artist) => artist.gallery?.userId === gallery.userId)))
      .catch((err: unknown) => setError(err instanceof ApiError ? err.message : 'Failed to load artists'));
  };

  useEffect(load, [gallery.userId]);

  async function changeStatus(artistUserId: string, status: string) {
    setActionError(null);
    try {
      await api.patch(`/artists/${artistUserId}/status`, { status });
      load();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : 'Failed to update artist status');
    }
  }

  return (
    <div>
      <div className="section-toolbar">
        <h3 style={{ margin: 0 }}>Artists in your gallery</h3>
        <button className="btn btn-primary" onClick={() => setFormOpen((v) => !v)}>
          {formOpen ? 'Cancel' : 'Add artist'}
        </button>
      </div>

      {formOpen && <AddArtistForm onCreated={() => { setFormOpen(false); load(); }} />}
      {actionError && <Alert type="error">{actionError}</Alert>}
      {error && <Alert type="error">{error}</Alert>}
      {!artists && !error && <Spinner />}
      {artists && artists.length === 0 && <EmptyState>No artists yet. Add your first artist above.</EmptyState>}

      {artists && artists.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Nationality</th>
              <th>Portfolio</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {artists.map((artist) => (
              <tr key={artist.userId}>
                <td>
                  {artist.firstName} {artist.lastName}
                </td>
                <td>{artist.nationality ?? '—'}</td>
                <td>
                  {artist.portfolioUrl ? (
                    <a href={artist.portfolioUrl} target="_blank" rel="noreferrer">
                      Portfolio
                    </a>
                  ) : (
                    '—'
                  )}
                </td>
                <td>{formatDate(artist.joinedGalleryAt)}</td>
                <td>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => void changeStatus(artist.userId, ActivityStatus.ACTIVE)}
                  >
                    Activate
                  </button>{' '}
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => void changeStatus(artist.userId, ActivityStatus.INACTIVE)}
                  >
                    Deactivate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function AddArtistForm({ onCreated }: { onCreated: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [nationality, setNationality] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await api.post('/gallery/add-artist', {
        createUserDto: { email, password, userRole: 'artiste' },
        firstName,
        lastName,
        bio,
        portfolioUrl,
        nationality,
      });
      onCreated();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to add artist');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="card">
      {error && <Alert type="error">{error}</Alert>}
      <form onSubmit={(event) => void handleSubmit(event)}>
        <div className="form-grid">
          <div className="form-group">
            <label>First name</label>
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Last name</label>
            <input value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Nationality</label>
            <input value={nationality} onChange={(e) => setNationality(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Portfolio URL</label>
            <input value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Account email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Account password</label>
            <input
              type="password"
              minLength={12}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label>Biography</label>
          <textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} required />
        </div>
        <div className="form-actions">
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? 'Adding…' : 'Add artist'}
          </button>
        </div>
      </form>
    </div>
  );
}
