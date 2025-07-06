import { NavLink } from 'react-router-dom';
import '../styles/Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src="../../logo.jpg" alt="Logo" className="logo-img" />
        <h1 className="navbar-title">Ricki Roberts Hair Studio</h1>
      </div>
      <ul className="navbar-links">
        <li>
          <NavLink to="/" end className="nav-link">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/services" className="nav-link">
            Services
          </NavLink>
        </li>
        <li>
          <NavLink to="/gallery" className="nav-link">
            Gallery
          </NavLink>
        </li>
        <li>
          <NavLink to="/booking" className="nav-link">
            Booking
          </NavLink>
        </li>
        <li>
          <NavLink to="/contact" className="nav-link">
            Contact
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
