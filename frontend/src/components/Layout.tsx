import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRoles } from '../types/api';

const NAV_BY_ROLE: Record<string, { to: string; label: string }[]> = {
  [UserRoles.ADMIN]: [
    { to: '/admin', label: 'Admin dashboard' },
    { to: '/catalog', label: 'Catalog' },
  ],
  [UserRoles.GALLERY]: [
    { to: '/gallery', label: 'Gallery dashboard' },
    { to: '/catalog', label: 'Catalog' },
  ],
  [UserRoles.ARTIST]: [
    { to: '/artist', label: 'Artist dashboard' },
    { to: '/catalog', label: 'Catalog' },
  ],
  [UserRoles.COLLECTOR]: [
    { to: '/collector', label: 'My purchases' },
    { to: '/catalog', label: 'Catalog' },
  ],
};

export function Layout() {
  const { user, logout } = useAuth();
  const links = user ? (NAV_BY_ROLE[user.userRole] ?? []) : [];

  return (
    <div className="app-shell">
      <header className="app-header">
        <NavLink to="/" className="app-brand">
          ConsignArt
        </NavLink>
        <nav className="app-nav">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => (isActive ? 'active' : undefined)}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        {user && (
          <div className="app-user">
            <span>
              {user.email} · {user.userRole}
            </span>
            <button className="btn btn-secondary btn-sm" onClick={() => void logout()}>
              Log out
            </button>
          </div>
        )}
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
