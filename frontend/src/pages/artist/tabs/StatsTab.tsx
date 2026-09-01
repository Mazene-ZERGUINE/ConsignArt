import { useEffect, useState } from 'react';
import { api, getErrorMessage } from '../../../lib/api';
import type { ArtistStats } from '../../../types/api';
import { Alert, Spinner, StatTile, formatMoney } from '../../../components/ui';

export function StatsTab() {
  const [stats, setStats] = useState<ArtistStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<ArtistStats>('/analytics/artist')
      .then(setStats)
      .catch((err: unknown) => setError(getErrorMessage(err, 'Failed to load statistics')));
  }, []);

  if (error) return <Alert type="error">{error}</Alert>;
  if (!stats) return <Spinner />;

  return (
    <div className="grid grid-3">
      <StatTile label="Total sales" value={stats.totalSalesCount} />
      <StatTile label="Total revenue" value={formatMoney(stats.totalRevenue)} />
      <StatTile label="Commissions paid to gallery" value={formatMoney(stats.totalCommissionsPaid)} />
      <StatTile label="Art works still available" value={stats.availableArtworksCount} />
    </div>
  );
}
