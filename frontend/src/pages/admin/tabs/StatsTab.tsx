import { useEffect, useState } from 'react';
import { api, getErrorMessage } from '../../../lib/api';
import type { AdminStats } from '../../../types/api';
import { Alert, Spinner, StatTile, formatMoney } from '../../../components/ui';

export function StatsTab() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<AdminStats>('/analytics/admin')
      .then(setStats)
      .catch((err: unknown) => setError(getErrorMessage(err, 'Failed to load statistics')));
  }, []);

  if (error) return <Alert type="error">{error}</Alert>;
  if (!stats) return <Spinner />;

  return (
    <div className="grid grid-3">
      <StatTile label="Active users" value={stats.activeUsersCount} />
      <StatTile label="Transactions" value={stats.transactionsCount} />
      <StatTile label="Transactions volume" value={formatMoney(stats.transactionsVolume)} />
      <StatTile label="Total platform commissions" value={formatMoney(stats.totalPlatformCommissions)} />
    </div>
  );
}
