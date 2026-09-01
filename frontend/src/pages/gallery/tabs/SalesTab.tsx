import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { api, getErrorMessage } from '../../../lib/api';
import type { ArtWorkResponse, SaleResponse } from '../../../types/api';
import { ArtWorkStatus } from '../../../types/api';
import { Alert, EmptyState, Spinner, formatDate, formatMoney } from '../../../components/ui';

export function SalesTab() {
  const [sales, setSales] = useState<SaleResponse[] | null>(null);
  const [availableArtWorks, setAvailableArtWorks] = useState<ArtWorkResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const load = () => {
    api
      .get<SaleResponse[]>('/sales')
      .then(setSales)
      .catch((err: unknown) => setError(getErrorMessage(err, 'Failed to load sales')));
    api
      .get<ArtWorkResponse[]>(`/artworks?status=${ArtWorkStatus.AVAILABLE}`)
      .then(setAvailableArtWorks)
      .catch((err: unknown) => {
        setAvailableArtWorks([]);
        setError(getErrorMessage(err, 'Failed to load available art works'));
      });
  };

  useEffect(load, []);

  return (
    <div>
      <div className="section-toolbar">
        <h3 style={{ margin: 0 }}>Sales</h3>
        <button className="btn btn-primary" onClick={() => setFormOpen((v) => !v)}>
          {formOpen ? 'Cancel' : 'Record a sale'}
        </button>
      </div>

      {formOpen && (
        <RecordSaleForm
          availableArtWorks={availableArtWorks}
          onCreated={() => {
            setFormOpen(false);
            load();
          }}
        />
      )}

      {error && <Alert type="error">{error}</Alert>}
      {!sales && !error && <Spinner />}
      {sales && sales.length === 0 && <EmptyState>No sales recorded yet.</EmptyState>}

      {sales && sales.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Art work</th>
              <th>Date</th>
              <th>Selling price</th>
              <th>Gallery commission</th>
              <th>Artist amount</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id}>
                <td>{sale.artWorkTitle}</td>
                <td>{formatDate(sale.sellingDate)}</td>
                <td>{formatMoney(sale.sellingPrice)}</td>
                <td>{formatMoney(sale.galleryCommission)}</td>
                <td>{formatMoney(sale.artistAmount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function RecordSaleForm({
  availableArtWorks,
  onCreated,
}: {
  availableArtWorks: ArtWorkResponse[];
  onCreated: () => void;
}) {
  const [artWorkId, setArtWorkId] = useState('');
  const [buyerId, setBuyerId] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await api.post('/sales', {
        artWorkId,
        buyerId,
        ...(sellingPrice && { sellingPrice: Number(sellingPrice) }),
      });
      onCreated();
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to record sale'));
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
                  {artWork.title} ({formatMoney(artWork.sellingPrice)})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Buyer's collector ID</label>
            <input value={buyerId} onChange={(e) => setBuyerId(e.target.value)} required />
            <span className="muted" style={{ fontSize: '0.78rem' }}>
              The collector can find their ID on their dashboard.
            </span>
          </div>
          <div className="form-group">
            <label>Selling price (optional, defaults to listed price)</label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
            />
          </div>
        </div>
        <div className="form-actions">
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? 'Recording…' : 'Record sale'}
          </button>
        </div>
      </form>
    </div>
  );
}
