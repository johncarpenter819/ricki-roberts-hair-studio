import { NavLink } from 'react-router-dom';

export default function Navbar() {
  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    padding: '0.25rem 0.5rem',
  };

  const activeStyle = {
    fontWeight: 'bold',
    borderBottom: '2px solid #a77b5a',
  };

  return (
    <nav style={{ backgroundColor: '#222', padding: '1rem', color: 'white' }}>
      <h1>Ricki Roberts Hair Studio</h1>
      <ul style={{ listStyle: 'none', display: 'flex', gap: '1rem', margin: 0, padding: 0 }}>
        <li>
          <NavLink 
            to="/" 
            end
            style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/services" 
            style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
          >
            Services
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/gallery" 
            style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
          >
            Gallery
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/booking" 
            style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
          >
            Booking
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/contact" 
            style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}
          >
            Contact
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
