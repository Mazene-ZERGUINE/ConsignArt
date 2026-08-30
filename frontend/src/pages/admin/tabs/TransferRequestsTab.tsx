import { useEffect, useState } from 'react';
import { api, ApiError } from '../../../lib/api';
import type { TransferRequestResponse, TransferRequestStatusType } from '../../../types/api';
import { TransferRequestStatus } from '../../../types/api';
import { Alert, Badge, EmptyState, Spinner } from '../../../components/ui';

export function TransferRequestsTab() {
  const [status, setStatus] = useState<TransferRequestStatusType>(TransferRequestStatus.PENDING);
  const [requests, setRequests] = useState<TransferRequestResponse[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const load = () => {
    setRequests(null);
    api
      .get<TransferRequestResponse[]>(`/admin/transfer-requests?status=${status}`)
      .then(setRequests)
      .catch((err: unknown) => setError(err instanceof ApiError ? err.message : 'Failed to load transfer requests'));
  };

  useEffect(load, [status]);

  async function act(id: string, actionType: 'approve' | 'reject') {
    setActionError(null);
    try {
      await api.patch(`/admin/transfer-requests/${id}/action?actionType=${actionType}`);
      load();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : 'Failed to update transfer request');
    }
  }

  return (
    <div>
      <div className="section-toolbar">
        <h3 style={{ margin: 0 }}>Transfer requests</h3>
        <select value={status} onChange={(e) => setStatus(e.target.value as TransferRequestStatusType)}>
          {Object.values(TransferRequestStatus).map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>

      {actionError && <Alert type="error">{actionError}</Alert>}
      {error && <Alert type="error">{error}</Alert>}
      {!requests && !error && <Spinner />}
      {requests && requests.length === 0 && <EmptyState>No transfer requests found.</EmptyState>}

      {requests && requests.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Artist</th>
              <th>From gallery</th>
              <th>To gallery</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id}>
                <td>
                  {request.artistToTransfer.firstName} {request.artistToTransfer.lastName}
                </td>
                <td>{request.fromGallery.email}</td>
                <td>{request.toGallery.email}</td>
                <td>{request.transferReason}</td>
                <td>
                  <Badge value={request.status} />
                </td>
                <td>
                  {request.status === TransferRequestStatus.PENDING && (
                    <>
                      <button className="btn btn-primary btn-sm" onClick={() => void act(request.id, 'approve')}>
                        Approve
                      </button>{' '}
                      <button className="btn btn-danger btn-sm" onClick={() => void act(request.id, 'reject')}>
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
