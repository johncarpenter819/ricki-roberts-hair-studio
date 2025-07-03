import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from '../admin/Login';
import Dashboard from '../admin/Dashboard';
import Appointments from '../admin/Appointments';
import BusinessInfo from '../admin/BusinessSettings';
import TeamEditor from '../admin/TeamEditor';
import Gallery from '../admin/GalleryManager';
import SocialLinks from '../admin/SocialLinks';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminLayout from '../admin/AdminLayout';

export default function Admin({ onLogin }) {
  const { isLoggedIn, setIsLoggedIn } = useAuth();

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Routes>
      <Route
        path="login"
        element={
          isLoggedIn ? (
            <Navigate to="/admin/dashboard" replace />
          ) : (
            <Login
              onLogin={() => {
                setIsLoggedIn(true);
                onLogin();
              }}
            />
          )
        }
      />

      <Route element={<ProtectedRoute loggedIn={isLoggedIn} />}>
        <Route element={<AdminLayout onLogout={handleLogout} />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="business-info" element={<BusinessInfo />} />
          <Route path="team-editor" element={<TeamEditor />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="social-links" element={<SocialLinks />} />
        </Route>
      </Route>

      <Route
        path=""
        element={isLoggedIn ? <Navigate to="dashboard" replace /> : <Navigate to="login" replace />}
      />
    </Routes>
  );
}
