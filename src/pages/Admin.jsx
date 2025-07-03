import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
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
  const [loggedIn, setLoggedIn] = useState(() => localStorage.getItem('loggedIn') === 'true');
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedIn) localStorage.setItem('loggedIn', 'true');
    else localStorage.removeItem('loggedIn');
  }, [loggedIn]);

  const handleLogout = () => {
    setLoggedIn(false);
    navigate('/admin/login');
  };

  return (
    <Routes>
      {/* Login route */}
      <Route
        path="login"
        element={
          loggedIn ? (
            <Navigate to="/admin/dashboard" replace />
          ) : (
            <Login
              onLogin={() => {
                setLoggedIn(true);
                onLogin(); // notify parent App.jsx
              }}
            />
          )
        }
      />

      {/* Protected Routes wrapped in AdminLayout */}
      <Route element={<ProtectedRoute loggedIn={loggedIn} />}>
        <Route element={<AdminLayout onLogout={handleLogout} />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="business-info" element={<BusinessInfo />} />
          <Route path="team-editor" element={<TeamEditor />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="social-links" element={<SocialLinks />} />
        </Route>
      </Route>

      {/* Default redirect */}
      <Route
        path=""
        element={loggedIn ? <Navigate to="dashboard" replace /> : <Navigate to="login" replace />}
      />
    </Routes>
  );
}
