import { useState } from 'react';
import { GalleriesTab } from './tabs/GalleriesTab';
import { TransferRequestsTab } from './tabs/TransferRequestsTab';
import { UsersTab } from './tabs/UsersTab';
import { CreateAdminTab } from './tabs/CreateAdminTab';
import { StatsTab } from './tabs/StatsTab';

const TABS = ['Statistics', 'Galleries', 'Transfer requests', 'Users', 'Create admin'] as const;
type Tab = (typeof TABS)[number];

export function AdminDashboardPage() {
  const [tab, setTab] = useState<Tab>('Statistics');

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Admin dashboard</h2>
          <p>Validate galleries, manage transfer requests and monitor the platform.</p>
        </div>
      </div>

      <div className="tabs">
        {TABS.map((t) => (
          <button key={t} className={`tab-button ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'Statistics' && <StatsTab />}
      {tab === 'Galleries' && <GalleriesTab />}
      {tab === 'Transfer requests' && <TransferRequestsTab />}
      {tab === 'Users' && <UsersTab />}
      {tab === 'Create admin' && <CreateAdminTab />}
    </div>
  );
}
