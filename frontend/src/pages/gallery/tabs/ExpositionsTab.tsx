import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { api, ApiError } from '../../../lib/api';
import type { ArtWorkResponse, ExpositionResponse, ExpositionTypeType } from '../../../types/api';
import { ArtWorkStatus, ExpositionType } from '../../../types/api';
import { Alert, Badge, EmptyState, Spinner, formatDate } from '../../../components/ui';

export function ExpositionsTab() {
  const [expositions, setExpositions] = useState<ExpositionResponse[] | null>(null);
  const [availableArtWorks, setAvailableArtWorks] = useState<ArtWorkResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const load = () => {
    api
      .get<ExpositionResponse[]>('/expositions')
      .then(setExpositions)
      .catch((err: unknown) => setError(err instanceof ApiError ? err.message : 'Failed to load expositions'));
    api
      .get<ArtWorkResponse[]>(`/artworks?status=${ArtWorkStatus.AVAILABLE}`)
      .then(setAvailableArtWorks)
      .catch(() => setAvailableArtWorks([]));
  };

  useEffect(load, []);

  async function closeExposition(id: string) {
    setActionError(null);
    try {
      await api.delete(`/expositions/${id}`);
      load();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : 'Failed to close exposition');
    }
  }

  return (
    <div>
      <div className="section-toolbar">
        <h3 style={{ margin: 0 }}>Expositions</h3>
        <button className="btn btn-primary" onClick={() => setFormOpen((v) => !v)}>
          {formOpen ? 'Cancel' : 'Organize an exposition'}
        </button>
      </div>

      {formOpen && (
        <ExpositionForm
          availableArtWorks={availableArtWorks}
          onCreated={() => {
            setFormOpen(false);
            load();
          }}
        />
      )}

      {actionError && <Alert type="error">{actionError}</Alert>}
      {error && <Alert type="error">{error}</Alert>}
      {!expositions && !error && <Spinner />}
      {expositions && expositions.length === 0 && <EmptyState>No expositions organized yet.</EmptyState>}

      {expositions && expositions.length > 0 && (
        <div className="grid grid-cards">
          {expositions.map((exposition) => (
            <div key={exposition.id} className="card">
              <h3>{exposition.name}</h3>
              <p className="muted">
                {formatDate(exposition.startDate)} → {formatDate(exposition.endDate)} ·{' '}
                {exposition.expositionType === ExpositionType.ON_SITE
                  ? `${exposition.address ?? ''} ${exposition.city ?? ''}`
                  : 'Virtual'}
              </p>
              <p>
                {exposition.artWorks.map((artWork) => (
                  <span key={artWork.id} style={{ display: 'block' }}>
                    {artWork.title} <Badge value={artWork.status} />
                  </span>
                ))}
              </p>
              <button className="btn btn-danger btn-sm" onClick={() => void closeExposition(exposition.id)}>
                Close exposition
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ExpositionForm({
  availableArtWorks,
  onCreated,
}: {
  availableArtWorks: ArtWorkResponse[];
  onCreated: () => void;
}) {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [expositionType, setExpositionType] = useState<ExpositionTypeType>(ExpositionType.ON_SITE);
  const [address, setAddress] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [city, setCity] = useState('');
  const [virtualLink, setVirtualLink] = useState('');
  const [artWorkIds, setArtWorkIds] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function toggleArtWork(id: string) {
    setArtWorkIds((current) => (current.includes(id) ? current.filter((v) => v !== id) : [...current, id]));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (artWorkIds.length === 0) {
      setError('Select at least one art work.');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/expositions', {
        name,
        startDate,
        endDate,
        expositionType,
        ...(expositionType === ExpositionType.ON_SITE ? { address, zipCode, city } : { virtualLink }),
        artWorkIds,
      });
      onCreated();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to create exposition');
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
            <label>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Start date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>End date</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Type</label>
            <select value={expositionType} onChange={(e) => setExpositionType(e.target.value as ExpositionTypeType)}>
              <option value={ExpositionType.ON_SITE}>On-site</option>
              <option value={ExpositionType.VIRTUAL}>Virtual</option>
            </select>
          </div>
          {expositionType === ExpositionType.ON_SITE ? (
            <>
              <div className="form-group">
                <label>Address</label>
                <input value={address} onChange={(e) => setAddress(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>City</label>
                <input value={city} onChange={(e) => setCity(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Zip code</label>
                <input maxLength={5} value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
              </div>
            </>
          ) : (
            <div className="form-group">
              <label>Virtual link</label>
              <input value={virtualLink} onChange={(e) => setVirtualLink(e.target.value)} required />
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Art works ({artWorkIds.length} selected)</label>
          {availableArtWorks.length === 0 && <p className="muted">No available art works to select.</p>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            {availableArtWorks.map((artWork) => (
              <label key={artWork.id} style={{ fontWeight: 400, display: 'flex', gap: '0.4rem' }}>
                <input
                  type="checkbox"
                  checked={artWorkIds.includes(artWork.id)}
                  onChange={() => toggleArtWork(artWork.id)}
                />
                {artWork.title}
              </label>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? 'Creating…' : 'Create exposition'}
          </button>
        </div>
      </form>
    </div>
  );
}
