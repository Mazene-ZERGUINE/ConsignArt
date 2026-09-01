import { useState } from 'react';
import { CatalogPage } from '../CatalogPage';
import { PurchasesTab } from './tabs/PurchasesTab';

const TABS = ['My purchases', 'Catalog'] as const;
type Tab = (typeof TABS)[number];

export function CollectorDashboardPage() {
  const [tab, setTab] = useState<Tab>('My purchases');

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Collector dashboard</h2>
          <p>Browse the catalog, buy a piece and track your purchases.</p>
        </div>
      </div>

      <div className="tabs">
        {TABS.map((t) => (
          <button
            key={t}
            className={`tab-button ${tab === t ? 'active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'My purchases' && <PurchasesTab />}
      {tab === 'Catalog' && <CatalogPage />}
    </div>
  );
}
