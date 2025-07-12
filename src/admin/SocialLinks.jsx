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
import '../styles/AdminPortal.css'; // Ensure this is imported

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
        .sort((a, b) => a.name.localeCompare(b.name)); // Sort by name alphabetically
      setLinks(fetchedLinks);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleUpdate = async (id, field, value) => {
    const linkRef = doc(db, 'socialLinks', id);
    await updateDoc(linkRef, { [field]: value });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this link?')) {
      const linkRef = doc(db, 'socialLinks', id);
      await deleteDoc(linkRef);
    }
  };

  const handleAdd = async () => {
    if (newName && newUrl) {
      await addDoc(collection(db, 'socialLinks'), { name: newName, url: newUrl });
      setNewName('');
      setNewUrl('');
    }
  };

  if (loading) {
    return <div className="admin-container">Loading social links...</div>;
  }

  return (
    <div className="social-links-container"> {/* Changed from admin-container */}
      <h2>Manage Social Media Links</h2>
      <p>Click on a field to edit it.</p>

      <ul className="social-links-list">
        {links.map(({ id, name, url }) => (
          <li key={id} className="social-link-item">
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
              className="social-links-delete-button" // Changed from admin-cancel-button, removed inline style
              aria-label={`Delete ${name}`}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>

      <h3>Add New Link</h3>
      <div className="add-social-link-form"> {/* Added a class for styling this div */}
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
          className="social-links-add-button" // Changed from admin-button, removed inline style
        >
          Add
        </button>
      </div>
    </div>
  );
}