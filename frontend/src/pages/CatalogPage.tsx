import { useEffect, useState } from 'react';
import { api, ApiError } from '../lib/api';
import type { ArtWorkResponse, ArtWorkStatusType } from '../types/api';
import { ArtWorkStatus } from '../types/api';
import { Alert, Badge, Spinner, EmptyState, formatMoney } from '../components/ui';

export function CatalogPage() {
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
        if (!cancelled) setError(err instanceof ApiError ? err.message : 'Failed to load catalog');
      });
    return () => {
      cancelled = true;
    };
  }, [status]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Art work catalog</h2>
          <p>Browse art works. Results are automatically scoped to your role.</p>
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value as ArtWorkStatusType | '')}>
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
