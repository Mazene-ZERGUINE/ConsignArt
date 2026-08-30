import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { GalleryUser } from '../../types/api';
import { Alert } from '../../components/ui';
import { OverviewTab } from './tabs/OverviewTab';
import { ArtistsTab } from './tabs/ArtistsTab';
import { ArtworksTab } from './tabs/ArtworksTab';
import { SalesTab } from './tabs/SalesTab';
import { ExpositionsTab } from './tabs/ExpositionsTab';
import { LoansTab } from './tabs/LoansTab';

const TABS = ['Overview', 'Artists', 'Art works', 'Sales', 'Expositions', 'Loans'] as const;
type Tab = (typeof TABS)[number];

export function GalleryDashboardPage() {
  const { user } = useAuth();
  const gallery = user as GalleryUser;
  const [tab, setTab] = useState<Tab>('Overview');

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Gallery dashboard</h2>
          <p>Manage your artists, art works, sales, expositions and loans.</p>
        </div>
      </div>

      {!gallery.galleryVerified && (
        <Alert type="info">
          Your gallery account is pending validation by an admin. You can browse the app, but some actions
          (organizing expositions, recording sales) require a validated account.
        </Alert>
      )}

      <div className="tabs">
        {TABS.map((t) => (
          <button key={t} className={`tab-button ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'Overview' && <OverviewTab />}
      {tab === 'Artists' && <ArtistsTab />}
      {tab === 'Art works' && <ArtworksTab />}
      {tab === 'Sales' && <SalesTab />}
      {tab === 'Expositions' && <ExpositionsTab />}
      {tab === 'Loans' && <LoansTab />}
    </div>
  );
}
