import { useState } from 'react';
import { api, getErrorMessage } from '../lib/api';
import type { ArtWorkHistoryEntry } from '../types/api';
import { Alert, Badge, Spinner, formatDate } from './ui';

export function ArtWorkHistoryToggle({ artWorkId }: { artWorkId: string }) {
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<ArtWorkHistoryEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  function toggle() {
    setOpen((current) => !current);
    if (!entries && !error) {
      api
        .get<ArtWorkHistoryEntry[]>(`/artworks/${artWorkId}/history`)
        .then(setEntries)
        .catch((err: unknown) => setError(getErrorMessage(err, 'Failed to load history')));
    }
  }

  return (
    <div>
      <button type="button" className="btn btn-secondary btn-sm" onClick={toggle}>
        {open ? 'Hide history' : 'History'}
      </button>
      {open && (
        <div className="card" style={{ marginTop: '0.5rem' }}>
          {error && <Alert type="error">{error}</Alert>}
          {!entries && !error && <Spinner />}
          {entries && entries.length === 0 && (
            <p className="muted">No status change recorded yet.</p>
          )}
          {entries && entries.length > 0 && (
            <ul style={{ margin: 0, paddingLeft: '1.1rem' }}>
              {entries.map((entry, index) => (
                <li key={index} style={{ marginBottom: '0.4rem' }}>
                  <Badge value={entry.previousStatus} /> → <Badge value={entry.newStatus} />{' '}
                  <span className="muted">on {formatDate(entry.changedAt)}</span>
                  {(entry.fromGalleryName || entry.toGalleryName) && (
                    <div className="muted" style={{ fontSize: '0.8rem' }}>
                      {entry.fromGalleryName ?? '—'} → {entry.toGalleryName ?? '—'}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
