import { useEffect, useState } from 'react';
import { api, getErrorMessage } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import type { ArtWorkResponse, ArtWorkStatusType } from '../types/api';
import { ArtWorkStatus, UserRoles } from '../types/api';
import { Alert, Badge, Spinner, EmptyState, formatMoney } from '../components/ui';

export function CatalogPage() {
  const { user } = useAuth();
  const [artWorks, setArtWorks] = useState<ArtWorkResponse[] | null>(null);
  const [status, setStatus] = useState<ArtWorkStatusType | ''>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setArtWorks(null);
    setError(null);
    const query = status ? `?status=${status}` : '';
    api
      .get<ArtWorkResponse[]>(`/artworks${query}`)
      .then((data) => {
        if (!cancelled) setArtWorks(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(getErrorMessage(err, 'Failed to load catalog'));
      });
    return () => {
      cancelled = true;
    };
  }, [status]);

  function reload() {
    const query = status ? `?status=${status}` : '';
    api
      .get<ArtWorkResponse[]>(`/artworks${query}`)
      .then(setArtWorks)
      .catch((err: unknown) => setError(getErrorMessage(err, 'Failed to load catalog')));
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Art work catalog</h2>
          <p>Browse art works. Results are automatically scoped to your role.</p>
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as ArtWorkStatusType | '')}
        >
          <option value="">All statuses</option>
          {Object.values(ArtWorkStatus).map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>

      {error && <Alert type="error">{error}</Alert>}
      {!artWorks && !error && <Spinner />}
      {artWorks && artWorks.length === 0 && <EmptyState>No art works found.</EmptyState>}

      {artWorks && artWorks.length > 0 && (
        <div className="grid grid-cards">
          {artWorks.map((artWork) => (
            <div key={artWork.id} className="card artwork-card">
              <img src={artWork.imageUrl} alt={artWork.title} />
              <div className="artwork-title">{artWork.title}</div>
              <div className="artwork-meta">
                {artWork.artistFirstName} {artWork.artistLastName} · {artWork.galleryName}
              </div>
              <p className="muted" style={{ fontSize: '0.85rem' }}>
                {artWork.description}
              </p>
              <div className="artwork-price">{formatMoney(artWork.sellingPrice)}</div>
              <div style={{ marginTop: '0.5rem' }}>
                <Badge value={artWork.status} />
              </div>
              {user?.userRole === UserRoles.COLLECTOR &&
                artWork.status === ArtWorkStatus.AVAILABLE && (
                  <BuyArtWork artWork={artWork} buyerId={user.entityId} onPurchased={reload} />
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BuyArtWork({
  artWork,
  buyerId,
  onPurchased,
}: {
  artWork: ArtWorkResponse;
  buyerId: string;
  onPurchased: () => void;
}) {
  const [signing, setSigning] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function confirmPurchase() {
    setError(null);
    setSubmitting(true);
    try {
      await api.post('/sales', { artWorkId: artWork.id, buyerId });
      setSigning(false);
      onPurchased();
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to complete the purchase'));
    } finally {
      setSubmitting(false);
    }
  }

  if (!signing) {
    return (
      <button
        className="btn btn-primary btn-sm"
        style={{ marginTop: '0.5rem' }}
        onClick={() => setSigning(true)}
      >
        Buy
      </button>
    );
  }

  return (
    <div className="card" style={{ marginTop: '0.5rem' }}>
      {error && <Alert type="error">{error}</Alert>}
      <p style={{ fontSize: '0.85rem' }}>
        <strong>Sale contract</strong> — by signing, you agree to purchase &ldquo;{artWork.title}
        &rdquo; from {artWork.galleryName} for {formatMoney(artWork.sellingPrice)}. The sale is
        final once confirmed.
      </p>
      <label style={{ display: 'flex', gap: '0.4rem', alignItems: 'flex-start', fontWeight: 400 }}>
        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
        <span>I have read and agree to the sale contract terms.</span>
      </label>
      <div className="form-actions" style={{ marginTop: '0.5rem' }}>
        <button
          className="btn btn-primary btn-sm"
          disabled={!agreed || submitting}
          onClick={() => void confirmPurchase()}
        >
          {submitting ? 'Signing…' : 'Sign & buy'}
        </button>{' '}
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setSigning(false)}
          disabled={submitting}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
