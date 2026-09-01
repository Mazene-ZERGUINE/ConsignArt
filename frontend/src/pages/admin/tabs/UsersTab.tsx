import { useEffect, useState } from 'react';
import { api, getErrorMessage } from '../../../lib/api';
import type { AuthenticatedUser, UserRole } from '../../../types/api';
import { UserRoles } from '../../../types/api';
import { Alert, EmptyState, Spinner } from '../../../components/ui';

export function UsersTab() {
  const [role, setRole] = useState<UserRole | ''>('');
  const [users, setUsers] = useState<AuthenticatedUser[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setUsers(null);
    const query = role ? `?role=${role}` : '';
    api
      .get<AuthenticatedUser[]>(`/users${query}`)
      .then(setUsers)
      .catch((err: unknown) => setError(getErrorMessage(err, 'Failed to load users')));
  }, [role]);

  return (
    <div>
      <div className="section-toolbar">
        <h3 style={{ margin: 0 }}>Platform users</h3>
        <select value={role} onChange={(e) => setRole(e.target.value as UserRole | '')}>
          <option value="">All roles</option>
          {Object.values(UserRoles).map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>

      {error && <Alert type="error">{error}</Alert>}
      {!users && !error && <Spinner />}
      {users && users.length === 0 && <EmptyState>No users found.</EmptyState>}

      {users && users.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>User ID</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.userId}>
                <td>{u.email}</td>
                <td>{u.userRole}</td>
                <td>{u.userId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
