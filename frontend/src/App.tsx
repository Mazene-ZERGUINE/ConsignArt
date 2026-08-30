import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { HomeRedirect } from './pages/HomeRedirect';
import { CatalogPage } from './pages/CatalogPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { GalleryDashboardPage } from './pages/gallery/GalleryDashboardPage';
import { ArtistDashboardPage } from './pages/artist/ArtistDashboardPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { CollectorDashboardPage } from './pages/collector/CollectorDashboardPage';
import { UserRoles } from './types/api';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route element={<Layout />}>
        <Route path="/" element={<HomeRedirect />} />
        <Route
          path="/catalog"
          element={
            <ProtectedRoute>
              <CatalogPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gallery"
          element={
            <ProtectedRoute roles={[UserRoles.GALLERY]}>
              <GalleryDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/artist"
          element={
            <ProtectedRoute roles={[UserRoles.ARTIST]}>
              <ArtistDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={[UserRoles.ADMIN]}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/collector"
          element={
            <ProtectedRoute roles={[UserRoles.COLLECTOR]}>
              <CollectorDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;

