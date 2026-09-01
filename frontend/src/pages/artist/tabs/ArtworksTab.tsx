import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { api, getErrorMessage } from '../../../lib/api';
import type { ArtWorkResponse, CreateArtWorkPayload } from '../../../types/api';
import { Alert, Badge, EmptyState, Spinner, formatMoney } from '../../../components/ui';
import { ArtWorkHistoryToggle } from '../../../components/ArtWorkHistory';

const EMPTY_FORM: CreateArtWorkPayload = {
  title: '',
  description: '',
  creationYear: '',
  technique: '',
  sellingPrice: 0,
  reservationPrice: 0,
  imageUrl: '',
};

export function ArtworksTab() {
  const [artWorks, setArtWorks] = useState<ArtWorkResponse[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const load = () => {
    api
      .get<ArtWorkResponse[]>('/artists/art-works')
      .then(setArtWorks)
      .catch((err: unknown) => setError(getErrorMessage(err, 'Failed to load art works')));
  };

  useEffect(load, []);

  async function remove(id: string) {
    setActionError(null);
    try {
      await api.delete(`/artworks/${id}`);
      load();
    } catch (err) {
      setActionError(getErrorMessage(err, 'Failed to delete art work'));
    }
  }

  return (
    <div>
      <div className="section-toolbar">
        <h3 style={{ margin: 0 }}>Your art works</h3>
        <button className="btn btn-primary" onClick={() => setFormOpen((v) => !v)}>
          {formOpen ? 'Cancel' : 'Add art work'}
        </button>
      </div>

      {formOpen && (
        <ArtWorkForm
          onCreated={() => {
            setFormOpen(false);
            load();
          }}
        />
      )}

      {actionError && <Alert type="error">{actionError}</Alert>}
      {error && <Alert type="error">{error}</Alert>}
      {!artWorks && !error && <Spinner />}
      {artWorks && artWorks.length === 0 && <EmptyState>No art works consigned yet.</EmptyState>}

      {artWorks && artWorks.length > 0 && (
        <div className="grid grid-cards">
          {artWorks.map((artWork) => (
            <div key={artWork.id} className="card artwork-card">
              <img src={artWork.imageUrl} alt={artWork.title} />
              <div className="artwork-title">{artWork.title}</div>
              <div className="artwork-meta">{artWork.galleryName}</div>
              <div className="artwork-price">{formatMoney(artWork.sellingPrice)}</div>
              <div style={{ margin: '0.5rem 0' }}>
                <Badge value={artWork.status} />
              </div>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button className="btn btn-danger btn-sm" onClick={() => void remove(artWork.id)}>
                  Delete
                </button>
                <ArtWorkHistoryToggle artWorkId={artWork.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ArtWorkForm({ onCreated }: { onCreated: () => void }) {
  const [form, setForm] = useState<CreateArtWorkPayload>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof CreateArtWorkPayload>(key: K, value: CreateArtWorkPayload[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await api.post('/artists/art-work', form);
      onCreated();
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to add art work'));
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
            <label>Title</label>
            <input
              maxLength={60}
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Technique</label>
            <input
              value={form.technique}
              onChange={(e) => update('technique', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Creation year</label>
            <input
              maxLength={4}
              minLength={4}
              value={form.creationYear}
              onChange={(e) => update('creationYear', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Image URL</label>
            <input
              value={form.imageUrl}
              onChange={(e) => update('imageUrl', e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Selling price (€)</label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={form.sellingPrice}
              onChange={(e) => update('sellingPrice', Number(e.target.value))}
              required
            />
          </div>
          <div className="form-group">
            <label>Reservation price (€)</label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={form.reservationPrice}
              onChange={(e) => update('reservationPrice', Number(e.target.value))}
              required
            />
          </div>
          <div className="form-group">
            <label>Height (cm, optional)</label>
            <input
              type="number"
              min={0}
              onChange={(e) => update('height', Number(e.target.value) || undefined)}
            />
          </div>
          <div className="form-group">
            <label>Width (cm, optional)</label>
            <input
              type="number"
              min={0}
              onChange={(e) => update('width', Number(e.target.value) || undefined)}
            />
          </div>
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            required
          />
        </div>
        <div className="form-actions">
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? 'Adding…' : 'Add art work'}
          </button>
        </div>
      </form>
    </div>
  );
}
