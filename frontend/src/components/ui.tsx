import type { ReactNode } from 'react';

export function Badge({ value }: { value: string }) {
  return <span className={`badge badge-${value}`}>{value.replace('_', ' ')}</span>;
}

export function Alert({ type = 'info', children }: { type?: 'info' | 'error' | 'success'; children: ReactNode }) {
  return <div className={`alert alert-${type}`}>{children}</div>;
}

export function Spinner() {
  return <p className="muted">Loading…</p>;
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <div className="empty-state">{children}</div>;
}

export function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="stat-tile">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('fr-FR');
}
