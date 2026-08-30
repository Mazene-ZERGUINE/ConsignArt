import { useState } from 'react';
import { ArtworksTab } from './tabs/ArtworksTab';
import { TransferTab } from './tabs/TransferTab';
import { StatsTab } from './tabs/StatsTab';

const TABS = ['My art works', 'Request transfer', 'Statistics'] as const;
type Tab = (typeof TABS)[number];

export function ArtistDashboardPage() {
  const [tab, setTab] = useState<Tab>('My art works');

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Artist dashboard</h2>
          <p>Track your art works, revenue and gallery relationship.</p>
        </div>
      </div>

      <div className="tabs">
        {TABS.map((t) => (
          <button key={t} className={`tab-button ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'My art works' && <ArtworksTab />}
      {tab === 'Request transfer' && <TransferTab />}
      {tab === 'Statistics' && <StatsTab />}
    </div>
  );
}
