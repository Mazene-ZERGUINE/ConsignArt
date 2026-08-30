import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="empty-state">
      <h2>Page not found</h2>
      <p>The page you are looking for doesn't exist.</p>
      <Link to="/">Back to home</Link>
    </div>
  );
}
