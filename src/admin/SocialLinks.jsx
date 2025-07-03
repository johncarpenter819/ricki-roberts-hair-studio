import { useState, useEffect } from 'react';

const defaultLinks = [
  { id: 1, name: 'Instagram', url: 'https://instagram.com/', icon: '/icons/instagram.svg' },
  { id: 2, name: 'Facebook', url: 'https://facebook.com/', icon: '/icons/facebook.svg' },
  { id: 3, name: 'TikTok', url: 'https://tiktok.com/', icon: '/icons/tiktok.svg' },
];

export default function SocialLinks() {
  const [links, setLinks] = useState([]);
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('socialLinks');
    if (stored) setLinks(JSON.parse(stored));
    else setLinks(defaultLinks);
  }, []);

  function saveLinks(updatedLinks) {
    setLinks(updatedLinks);
    localStorage.setItem('socialLinks', JSON.stringify(updatedLinks));
  }

  function handleAdd() {
    if (!newName.trim() || !newUrl.trim()) return;
    const newLink = {
      id: Date.now(),
      name: newName.trim(),
      url: newUrl.trim(),
      icon: '/icons/link.svg', // fallback icon for custom links
    };
    const updated = [...links, newLink];
    saveLinks(updated);
    setNewName('');
    setNewUrl('');
  }

  function handleUpdate(id, field, value) {
    const updated = links.map((link) =>
      link.id === id ? { ...link, [field]: value } : link
    );
    saveLinks(updated);
  }

  function handleDelete(id) {
    if (window.confirm('Delete this social link?')) {
      const updated = links.filter((link) => link.id !== id);
      saveLinks(updated);
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: '1rem' }}>
      <h2>Social Media Links</h2>

      {links.length === 0 && <p>No social links added yet.</p>}

      <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
        {links.map(({ id, name, url }) => (
          <li
            key={id}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '0.5rem',
              gap: '0.5rem',
            }}
          >
            <input
              type="text"
              value={name}
              onChange={(e) => handleUpdate(id, 'name', e.target.value)}
              style={{ flex: '1', padding: '0.3rem' }}
            />
            <input
              type="url"
              value={url}
              onChange={(e) => handleUpdate(id, 'url', e.target.value)}
              style={{ flex: '3', padding: '0.3rem' }}
            />
            <button
              onClick={() => handleDelete(id)}
              style={{
                backgroundColor: '#dc3545',
                border: 'none',
                color: 'white',
                borderRadius: 4,
                cursor: 'pointer',
                padding: '0.3rem 0.6rem',
              }}
              aria-label={`Delete ${name}`}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      <h3>Add New Link</h3>
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
        <input
          type="text"
          placeholder="Name (e.g., Instagram)"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          style={{ flex: '1', padding: '0.3rem' }}
        />
        <input
          type="url"
          placeholder="URL (https://...)"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          style={{ flex: '2', padding: '0.3rem' }}
        />
        <button
          onClick={handleAdd}
          style={{
            backgroundColor: '#a77b5a',
            border: 'none',
            color: 'white',
            borderRadius: 4,
            cursor: 'pointer',
            padding: '0.3rem 1rem',
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}
