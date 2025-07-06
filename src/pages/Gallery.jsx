import { useEffect, useState } from 'react';
import { db } from '../firebaseConfig'; // adjust path if needed
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

export default function Gallery() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'gallery'), orderBy('order'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setImages(items);
    });
    return unsubscribe;
  }, []);

  return (
    <main style={{ maxWidth: '960px', margin: '2rem auto', padding: '0 1rem' }}>
      <h1 style={{ textAlign: 'center', color: '#a77b5a', marginBottom: '2rem' }}>
        Portfolio Gallery
      </h1>
      {images.length === 0 ? (
        <p style={{ textAlign: 'center', fontStyle: 'italic' }}>
          No images to display yet.
        </p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {images.map(({ id, url, title, caption, name }) => (
            <figure
              key={id}
              style={{
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                backgroundColor: '#fff',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <img
                src={url}
                alt={title || name || 'Gallery image'}
                style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                loading="lazy"
              />
              <figcaption
                style={{
                  padding: '0.75rem 1rem',
                  fontSize: '0.9rem',
                  color: '#555',
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                {title && <strong style={{ marginBottom: '0.25rem' }}>{title}</strong>}
                {caption && <span>{caption}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </main>
  );
}
