import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { BusinessProvider } from './context/BusinessContext';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import AdminNavbar from './components/AdminNavbar';
import Footer from './components/Footer';
import Admin from './pages/Admin';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();  // get current route path
  const { isLoggedIn, setIsLoggedIn } = useAuth();

  // When user logs out, redirect to admin login
  useEffect(() => {
    if (!isLoggedIn && location.pathname.startsWith('/admin')) {
      navigate('/admin/login');
    }
  }, [isLoggedIn, location.pathname, navigate]);

  // Admin logout handler
  const handleAdminLogout = () => {
    setIsLoggedIn(false);
  };

  // Admin login handler
  const handleAdminLogin = () => {
    setIsLoggedIn(true);
  };

  // Check if we are on an admin route (for navbar selection)
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <BusinessProvider>
      {/* Show admin navbar only on admin routes when logged in */}
      {isAdminRoute && isLoggedIn ? (
        <AdminNavbar onLogout={handleAdminLogout} />
      ) : (
        <Navbar />
      )}

      <Routes>
        <Route path="/admin/*" element={<Admin onLogin={handleAdminLogin} />} />
        <Route path="/" element={<Home />} />
        {/* other public-facing routes */}
      </Routes>

      <Footer />
    </BusinessProvider>
  );
}
