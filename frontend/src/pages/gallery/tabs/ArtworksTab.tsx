import { useEffect, useState } from 'react';
import { api, getErrorMessage } from '../../../lib/api';
import type { ArtWorkResponse, ArtWorkStatusType } from '../../../types/api';
import { ArtWorkStatus } from '../../../types/api';
import { Alert, Badge, EmptyState, Spinner, formatMoney } from '../../../components/ui';
import { ArtWorkHistoryToggle } from '../../../components/ArtWorkHistory';

export function ArtworksTab() {
  const [artWorks, setArtWorks] = useState<ArtWorkResponse[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const load = () => {
    api
      .get<ArtWorkResponse[]>('/artworks')
      .then(setArtWorks)
      .catch((err: unknown) => setError(getErrorMessage(err, 'Failed to load art works')));
  };

  useEffect(load, []);

  async function changeStatus(id: string, status: ArtWorkStatusType) {
    setActionError(null);
    try {
      await api.patch(`/artworks/${id}/status`, { status });
      load();
    } catch (err) {
      setActionError(getErrorMessage(err, 'Failed to change status'));
    }
  }

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
      <h3>Your gallery's art works</h3>
      {actionError && <Alert type="error">{actionError}</Alert>}
      {error && <Alert type="error">{error}</Alert>}
      {!artWorks && !error && <Spinner />}
      {artWorks && artWorks.length === 0 && <EmptyState>No art works consigned yet.</EmptyState>}

      {artWorks && artWorks.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Artist</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {artWorks.map((artWork) => (
              <tr key={artWork.id}>
                <td>{artWork.title}</td>
                <td>
                  {artWork.artistFirstName} {artWork.artistLastName}
                </td>
                <td>{formatMoney(artWork.sellingPrice)}</td>
                <td>
                  <Badge value={artWork.status} />
                </td>
                <td>
                  <div
                    style={{
                      display: 'flex',
                      gap: '0.4rem',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                    }}
                  >
                    <select
                      value={artWork.status}
                      onChange={(e) =>
                        void changeStatus(artWork.id, e.target.value as ArtWorkStatusType)
                      }
                    >
                      {Object.values(ArtWorkStatus).map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => void remove(artWork.id)}
                    >
                      Delete
                    </button>
                    <ArtWorkHistoryToggle artWorkId={artWork.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
