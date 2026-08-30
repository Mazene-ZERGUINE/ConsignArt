import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CatalogPage } from '../CatalogPage';
import { PurchasesTab } from './tabs/PurchasesTab';
import { Alert } from '../../components/ui';

const TABS = ['My purchases', 'Catalog'] as const;
type Tab = (typeof TABS)[number];

export function CollectorDashboardPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>('My purchases');

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Collector dashboard</h2>
          <p>Browse the catalog and track your purchases.</p>
        </div>
      </div>

      <Alert type="info">
        Your collector ID (share it with a gallery to buy a piece): <strong>{user?.entityId}</strong>
      </Alert>

      <div className="tabs">
        {TABS.map((t) => (
          <button key={t} className={`tab-button ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'My purchases' && <PurchasesTab />}
      {tab === 'Catalog' && <CatalogPage />}
    </div>
  );
}
