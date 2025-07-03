import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{ backgroundColor: '#222', padding: '1rem', color: 'white' }}>
      <h1>Ricki Roberts Hair Studio</h1>
      <ul style={{ listStyle: 'none', display: 'flex', gap: '1rem' }}>
        <li><Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link></li>
        <li><Link to="/services" style={{ color: 'white', textDecoration: 'none' }}>Services</Link></li>
        <li><Link to="/booking" style={{ color: 'white', textDecoration: 'none' }}>Booking</Link></li>
        <li><Link to="/contact" style={{ color: 'white', textDecoration: 'none' }}>Contact</Link></li>
      </ul>
    </nav>
  );
}
