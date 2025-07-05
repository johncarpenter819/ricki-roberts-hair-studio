import { NavLink } from 'react-router-dom';

const linkStyles = {
  padding: '0.6rem 1rem',
  textDecoration: 'none',
  color: '#4b3b2b',
  fontWeight: '600',
  borderRadius: '4px',
  transition: 'background-color 0.3s',
};

const activeStyles = {
  backgroundColor: '#a77b5a',
  color: 'white',
};

export default function AdminNavbar({ onLogout }) {
  return (
    <nav
      style={{
        display: 'flex',
        gap: '1rem',
        padding: '1rem 2rem',
        backgroundColor: '#f7f3ef',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        flexWrap: 'wrap',
        justifyContent: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        alignItems: 'center',
      }}
    >
      <NavLink
        to="/admin/dashboard"
        style={({ isActive }) =>
          isActive ? { ...linkStyles, ...activeStyles } : linkStyles
        }
      >
        Dashboard
      </NavLink>
      <NavLink
        to="/admin/appointments"
        style={({ isActive }) =>
          isActive ? { ...linkStyles, ...activeStyles } : linkStyles
        }
      >
        Appointments
      </NavLink>
      <NavLink
        to="/admin/business-info"
        style={({ isActive }) =>
          isActive ? { ...linkStyles, ...activeStyles } : linkStyles
        }
      >
        Business Info
      </NavLink>
      <NavLink
        to="/admin/team-editor"
        style={({ isActive }) =>
          isActive ? { ...linkStyles, ...activeStyles } : linkStyles
        }
      >
        Team Editor
      </NavLink>
      {/* Services tab after Team Editor */}
      <NavLink
        to="/admin/services"
        style={({ isActive }) =>
          isActive ? { ...linkStyles, ...activeStyles } : linkStyles
        }
      >
        Services
      </NavLink>
      <NavLink
        to="/admin/gallery"
        style={({ isActive }) =>
          isActive ? { ...linkStyles, ...activeStyles } : linkStyles
        }
      >
        Gallery
      </NavLink>
      <NavLink
        to="/admin/social-links"
        style={({ isActive }) =>
          isActive ? { ...linkStyles, ...activeStyles } : linkStyles
        }
      >
        Social Links
      </NavLink>

      <button
        onClick={onLogout}
        style={{
          marginLeft: 'auto',
          padding: '0.5rem 1rem',
          backgroundColor: '#a77b5a',
          border: 'none',
          borderRadius: '4px',
          color: 'white',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'background-color 0.3s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#8b664a')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#a77b5a')}
        type="button"
      >
        Logout
      </button>
    </nav>
  );
}
