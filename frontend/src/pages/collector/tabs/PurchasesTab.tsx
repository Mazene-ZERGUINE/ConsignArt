import { useEffect, useState } from 'react';
import { api, ApiError } from '../../../lib/api';
import type { SaleResponse } from '../../../types/api';
import { Alert, EmptyState, Spinner, formatDate, formatMoney } from '../../../components/ui';

export function PurchasesTab() {
  const [sales, setSales] = useState<SaleResponse[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<SaleResponse[]>('/sales')
      .then(setSales)
      .catch((err: unknown) => setError(err instanceof ApiError ? err.message : 'Failed to load purchases'));
  }, []);

  if (error) return <Alert type="error">{error}</Alert>;
  if (!sales) return <Spinner />;
  if (sales.length === 0) return <EmptyState>You haven't purchased any art work yet.</EmptyState>;

  return (
    <table>
      <thead>
        <tr>
          <th>Art work</th>
          <th>Date</th>
          <th>Price paid</th>
          <th>Invoice ID</th>
        </tr>
      </thead>
      <tbody>
        {sales.map((sale) => (
          <tr key={sale.id}>
            <td>{sale.artWorkTitle}</td>
            <td>{formatDate(sale.sellingDate)}</td>
            <td>{formatMoney(sale.sellingPrice)}</td>
            <td>{sale.invoiceId}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
