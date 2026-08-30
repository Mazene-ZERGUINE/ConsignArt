import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { api, ApiError } from '../../../lib/api';
import type { ArtWorkResponse, LoanResponse } from '../../../types/api';
import { ArtWorkStatus } from '../../../types/api';
import { Alert, EmptyState, Spinner, formatDate } from '../../../components/ui';

export function LoansTab() {
  const [loans, setLoans] = useState<LoanResponse[] | null>(null);
  const [availableArtWorks, setAvailableArtWorks] = useState<ArtWorkResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const load = () => {
    api
      .get<LoanResponse[]>('/loans')
      .then(setLoans)
      .catch((err: unknown) => setError(err instanceof ApiError ? err.message : 'Failed to load loans'));
    api
      .get<ArtWorkResponse[]>(`/artworks?status=${ArtWorkStatus.AVAILABLE}`)
      .then(setAvailableArtWorks)
      .catch(() => setAvailableArtWorks([]));
  };

  useEffect(load, []);

  return (
    <div>
      <div className="section-toolbar">
        <h3 style={{ margin: 0 }}>Loans to other galleries</h3>
        <button className="btn btn-primary" onClick={() => setFormOpen((v) => !v)}>
          {formOpen ? 'Cancel' : 'Lend an art work'}
        </button>
      </div>

      {formOpen && (
        <LoanForm
          availableArtWorks={availableArtWorks}
          onCreated={() => {
            setFormOpen(false);
            load();
          }}
        />
      )}

      {error && <Alert type="error">{error}</Alert>}
      {!loans && !error && <Spinner />}
      {loans && loans.length === 0 && <EmptyState>No loans recorded yet.</EmptyState>}

      {loans && loans.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Art work</th>
              <th>From</th>
              <th>To</th>
              <th>Conditions</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan.id}>
                <td>{loan.artWorkTitle}</td>
                <td>{formatDate(loan.from)}</td>
                <td>{formatDate(loan.to)}</td>
                <td>{loan.conditions ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function LoanForm({ availableArtWorks, onCreated }: { availableArtWorks: ArtWorkResponse[]; onCreated: () => void }) {
  const [artWorkId, setArtWorkId] = useState('');
  const [toGalleryId, setToGalleryId] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [conditions, setConditions] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await api.post('/loans', { artWorkId, toGalleryId, from, to, conditions });
      onCreated();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to record loan');
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
            <label>Art work</label>
            <select value={artWorkId} onChange={(e) => setArtWorkId(e.target.value)} required>
              <option value="" disabled>
                Select an available art work
              </option>
              {availableArtWorks.map((artWork) => (
                <option key={artWork.id} value={artWork.id}>
                  {artWork.title}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Destination gallery ID</label>
            <input value={toGalleryId} onChange={(e) => setToGalleryId(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>From</label>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>To</label>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} required />
          </div>
        </div>
        <div className="form-group">
          <label>Conditions (optional)</label>
          <textarea rows={2} value={conditions} onChange={(e) => setConditions(e.target.value)} />
        </div>
        <div className="form-actions">
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? 'Recording…' : 'Lend art work'}
          </button>
        </div>
      </form>
    </div>
  );
}
