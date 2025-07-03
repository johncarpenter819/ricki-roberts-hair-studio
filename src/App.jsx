import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { BusinessProvider } from './context/BusinessContext';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import AdminNavbar from './components/AdminNavbar';
import Footer from './components/Footer';
import Admin from './pages/Admin';

export default function App() {
  const navigate = useNavigate();
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => localStorage.getItem('loggedIn') === 'true');
  const [justLoggedOut, setJustLoggedOut] = useState(false);

  useEffect(() => {
    const checkStorage = () => {
      setIsAdminLoggedIn(localStorage.getItem('loggedIn') === 'true');
    };
    window.addEventListener('storage', checkStorage);
    return () => window.removeEventListener('storage', checkStorage);
  }, []);

  useEffect(() => {
    if (justLoggedOut) {
      navigate('/admin/login');
      setJustLoggedOut(false);
    }
  }, [justLoggedOut, navigate]);

  const handleAdminLogin = () => {
    localStorage.setItem('loggedIn', 'true');
    setIsAdminLoggedIn(true);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('loggedIn');
    setIsAdminLoggedIn(false);
    setJustLoggedOut(true);
  };

  return (
    <BusinessProvider>
      {isAdminLoggedIn ? (
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
