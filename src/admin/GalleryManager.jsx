import { useEffect, useState, useRef } from 'react';
import { db } from '../firebaseConfig';
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';

const storage = getStorage();

export default function GalleryManager() {
  const [images, setImages] = useState([]);
  const [draggedImageId, setDraggedImageId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Real-time sync with Firestore
  useEffect(() => {
    const q = query(collection(db, 'gallery'), orderBy('order'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setImages(items);
    });
    return unsubscribe;
  }, []);

  async function handleFileChange(e) {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      for (const file of files) {
        // Use UUID for filename to avoid collisions
        const uniqueName = `${crypto.randomUUID()}-${file.name}`;
        const storageRef = ref(storage, `gallery/${uniqueName}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        await addDoc(collection(db, 'gallery'), {
          url: downloadURL,
          name: file.name,
          title: '',
          caption: '',
          order: images.length,
          path: storageRef.fullPath,
        });
      }
    } catch (err) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
      e.target.value = null; // reset input
    }
  }

  async function handleDelete(id, path) {
    if (!window.confirm('Delete this photo?')) return;
    try {
      await deleteDoc(doc(db, 'gallery', id));
      if (path) {
        const storageRef = ref(storage, path);
        await deleteObject(storageRef);
      }
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  }

  // Debounce updates to Firestore
  const debounceTimers = useRef({});

  function handleUpdateDebounced(id, field, value) {
    if (debounceTimers.current[id]?.[field]) {
      clearTimeout(debounceTimers.current[id][field]);
    } else {
      debounceTimers.current[id] = debounceTimers.current[id] || {};
    }

    debounceTimers.current[id][field] = setTimeout(async () => {
      try {
        await updateDoc(doc(db, 'gallery', id), { [field]: value });
      } catch (err) {
        alert(`Failed to update ${field}: ${err.message}`);
      }
      debounceTimers.current[id][field] = null;
    }, 500);
  }

  function handleDragStart(id) {
    setDraggedImageId(id);
  }

  async function handleDrop(targetId) {
    if (draggedImageId === targetId) return;

    const draggedIndex = images.findIndex((img) => img.id === draggedImageId);
    const targetIndex = images.findIndex((img) => img.id === targetId);
    if (draggedIndex < 0 || targetIndex < 0) return;

    const reordered = [...images];
    const [moved] = reordered.splice(draggedIndex, 1);
    reordered.splice(targetIndex, 0, moved);

    setImages(reordered);

    // Update Firestore order for all affected images
    try {
      await Promise.all(
        reordered.map((img, index) =>
          updateDoc(doc(db, 'gallery', img.id), { order: index })
        )
      );
    } catch (err) {
      alert('Failed to update order: ' + err.message);
    }

    setDraggedImageId(null);
  }

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '1rem' }}>
      <h2 style={{ textAlign: 'center' }}>Gallery Manager</h2>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        disabled={uploading}
        style={{ marginBottom: '1rem' }}
      />
      {uploading && (
        <p style={{ color: '#a77b5a', fontWeight: '600', textAlign: 'center' }}>
          Uploading...
        </p>
      )}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {images.length === 0 && !uploading && (
          <p style={{ gridColumn: '1/-1', textAlign: 'center' }}>
            No photos uploaded yet.
          </p>
        )}

        {images.map((img) => (
          <div
            key={img.id}
            draggable={!uploading}
            onDragStart={() => handleDragStart(img.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(img.id)}
            style={{
              border: '2px solid #a77b5a',
              borderRadius: '10px',
              overflow: 'hidden',
              padding: '1rem',
              backgroundColor: '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              position: 'relative',
              opacity: uploading ? 0.6 : 1,
              userSelect: uploading ? 'none' : 'auto',
            }}
          >
            <img
              src={img.url}
              alt={img.name}
              style={{
                width: '100%',
                height: '160px',
                objectFit: 'cover',
                borderRadius: '6px',
                marginBottom: '0.5rem',
              }}
              draggable={false}
            />
            <input
              type="text"
              defaultValue={img.title}
              onChange={(e) => handleUpdateDebounced(img.id, 'title', e.target.value)}
              placeholder="Title"
              disabled={uploading}
              style={{
                width: '100%',
                marginBottom: '0.5rem',
                padding: '0.4rem',
                borderRadius: '6px',
                border: '1px solid #ccc',
                fontSize: '1rem',
              }}
            />
            <textarea
              defaultValue={img.caption}
              onChange={(e) =>
                handleUpdateDebounced(img.id, 'caption', e.target.value)
              }
              placeholder="Caption"
              disabled={uploading}
              style={{
                width: '100%',
                minHeight: '60px',
                padding: '0.4rem',
                borderRadius: '6px',
                border: '1px solid #ccc',
                fontSize: '1rem',
                resize: 'vertical',
              }}
            />
            <button
              onClick={() => handleDelete(img.id, img.path)}
              disabled={uploading}
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '4px 8px',
                borderRadius: '4px',
                cursor: uploading ? 'not-allowed' : 'pointer',
              }}
              aria-label={`Delete ${img.name}`}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
