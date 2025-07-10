import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { BusinessProvider } from './context/BusinessContext';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import AdminNavbar from './components/AdminNavbar';
import Footer from './components/Footer';
import Admin from './pages/Admin';
import Services from './pages/Services';
import Booking from './pages/Booking';
import Contact from './pages/Contact';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, setIsLoggedIn } = useAuth();

  // Redirect to admin login if user is not logged in and on admin route
  useEffect(() => {
    if (!isLoggedIn && location.pathname.startsWith('/admin')) {
      navigate('/admin/login');
    }
  }, [isLoggedIn, location.pathname, navigate]);

  const handleAdminLogout = () => {
    setIsLoggedIn(false);
  };

  const handleAdminLogin = () => {
    setIsLoggedIn(true);
  };

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <BusinessProvider>
      <div className="layout-wrapper">
        {isAdminRoute && isLoggedIn ? (
          <AdminNavbar onLogout={handleAdminLogout} />
        ) : (
          <Navbar />
        )}

        <main className="layout-content">
          <Routes>
            <Route path="/admin/*" element={<Admin onLogin={handleAdminLogin} />} />
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BusinessProvider>
  );
}
