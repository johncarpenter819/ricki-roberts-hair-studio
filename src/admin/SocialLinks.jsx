import { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  getDocs,
} from 'firebase/firestore';

const defaultLinks = [
  { name: 'Instagram', url: 'https://instagram.com/', icon: '/icons/instagram.svg' },
  { name: 'Facebook', url: 'https://facebook.com/', icon: '/icons/facebook.svg' },
  { name: 'TikTok', url: 'https://tiktok.com/', icon: '/icons/tiktok.svg' },
];

export default function SocialLinks() {
  const [links, setLinks] = useState([]);
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initializeDefaultsIfNeeded() {
      const colRef = collection(db, 'socialLinks');
      const snapshot = await getDocs(colRef);
      if (snapshot.empty) {
        // Add default links only once if collection is empty
        for (const link of defaultLinks) {
          await addDoc(colRef, link);
        }
      }
    }

    initializeDefaultsIfNeeded();

    const q = query(collection(db, 'socialLinks'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedLinks = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(link => typeof link.name === 'string' && typeof link.url === 'string');
      setLinks(fetchedLinks);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  async function handleAdd() {
    if (!newName.trim() || !newUrl.trim()) return;

    const newLink = {
      name: newName.trim(),
      url: newUrl.trim(),
      icon: '/icons/link.svg',
    };

    try {
      await addDoc(collection(db, 'socialLinks'), newLink);
      setNewName('');
      setNewUrl('');
      // No need to update state here — onSnapshot listener will update it
    } catch (err) {
      alert('Failed to add link: ' + err.message);
    }
  }

  async function handleUpdate(id, field, value) {
    try {
      const stringValue = (typeof value === 'string') ? value : (value == null ? '' : String(value));
      const docRef = doc(db, 'socialLinks', id);
      await updateDoc(docRef, { [field]: stringValue });
      // No manual state update — onSnapshot updates state
    } catch (err) {
      alert('Failed to update link: ' + err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this social link?')) return;
    try {
      await deleteDoc(doc(db, 'socialLinks', id));
      // No manual state update — onSnapshot updates state
    } catch (err) {
      alert('Failed to delete link: ' + err.message);
    }
  }

  if (loading) return <p>Loading social links...</p>;

  return (
    <div className="admin-container">
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
              value={typeof name === 'string' ? name : ''}
              onChange={(e) => handleUpdate(id, 'name', e.target.value)}
              className="admin-input"
              style={{ flex: '1' }}
            />
            <input
              type="url"
              value={typeof url === 'string' ? url : ''}
              onChange={(e) => handleUpdate(id, 'url', e.target.value)}
              className="admin-input"
              style={{ flex: '3' }}
            />
            <button
              onClick={() => handleDelete(id)}
              className="admin-cancel-button"
              aria-label={`Delete ${name}`}
              style={{ flexShrink: 0 }}
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
          className="admin-input"
          style={{ flex: '1' }}
        />
        <input
          type="url"
          placeholder="URL (https://...)"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          className="admin-input"
          style={{ flex: '3' }}
        />
        <button
          onClick={handleAdd}
          className="admin-button"
          style={{ flexShrink: 0 }}
        >
          Add
        </button>
      </div>
    </div>
  );
}
