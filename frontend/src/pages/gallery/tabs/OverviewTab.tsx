import { useEffect, useState } from 'react';
import { api, ApiError } from '../../../lib/api';
import type { GalleryStats } from '../../../types/api';
import { Alert, Spinner, StatTile, formatMoney } from '../../../components/ui';

export function OverviewTab() {
  const [stats, setStats] = useState<GalleryStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<GalleryStats>('/analytics/gallery')
      .then(setStats)
      .catch((err: unknown) => setError(err instanceof ApiError ? err.message : 'Failed to load statistics'));
  }, []);

  if (error) return <Alert type="error">{error}</Alert>;
  if (!stats) return <Spinner />;

  return (
    <div>
      <div className="grid grid-3" style={{ marginBottom: '1.5rem' }}>
        <StatTile label="Total sales revenue" value={formatMoney(stats.totalSalesRevenue)} />
        <StatTile label="Gallery commission earned" value={formatMoney(stats.totalGalleryCommission)} />
        <StatTile label="Rotation rate" value={`${Math.round(stats.rotationRate * 100)}%`} />
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3>Art works sold per month</h3>
          {stats.artworksSoldByMonth.length === 0 && <p className="muted">No sales recorded yet.</p>}
          {stats.artworksSoldByMonth.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Art works sold</th>
                </tr>
              </thead>
              <tbody>
                {stats.artworksSoldByMonth.map((row) => (
                  <tr key={row.month}>
                    <td>{row.month}</td>
                    <td>{row.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card">
          <h3>Top 5 selling artists</h3>
          {stats.topArtists.length === 0 && <p className="muted">No sales recorded yet.</p>}
          {stats.topArtists.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>Artist</th>
                  <th>Sales</th>
                </tr>
              </thead>
              <tbody>
                {stats.topArtists.map((artist) => (
                  <tr key={artist.artistId}>
                    <td>
                      {artist.firstName} {artist.lastName}
                    </td>
                    <td>{artist.salesCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
