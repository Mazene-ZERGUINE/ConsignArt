import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRoles } from '../types/api';
import { Spinner } from '../components/ui';

const HOME_BY_ROLE: Record<string, string> = {
  [UserRoles.ADMIN]: '/admin',
  [UserRoles.GALLERY]: '/gallery',
  [UserRoles.ARTIST]: '/artist',
  [UserRoles.COLLECTOR]: '/collector',
};

export function HomeRedirect() {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;

  return <Navigate to={HOME_BY_ROLE[user.userRole] ?? '/login'} replace />;
}
