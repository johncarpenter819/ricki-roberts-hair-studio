import { useState, useEffect, useRef } from 'react';

export default function GalleryManager() {
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('galleryImages');
    if (saved) {
      setImages(JSON.parse(saved));
    }
  }, []);

  function handleFileChange(e) {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      url: URL.createObjectURL(file),
    }));
    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);
    localStorage.setItem('galleryImages', JSON.stringify(updatedImages));
    e.target.value = null; // reset input
  }

  function handleDelete(id) {
    if (window.confirm('Delete this photo?')) {
      const filtered = images.filter((img) => img.id !== id);
      setImages(filtered);
      localStorage.setItem('galleryImages', JSON.stringify(filtered));
    }
  }

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1rem' }}>
      <h2>Gallery Manager</h2>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
      />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))',
          gap: '1rem',
          marginTop: '1rem',
        }}
      >
        {images.length === 0 && <p>No photos uploaded yet.</p>}

        {images.map((img) => (
          <div
            key={img.id}
            style={{
              position: 'relative',
              border: '1px solid #ccc',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            <img
              src={img.url}
              alt={img.name}
              style={{ width: '100%', height: '150px', objectFit: 'cover' }}
            />
            <button
              onClick={() => handleDelete(img.id)}
              style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                backgroundColor: 'rgba(220, 53, 69, 0.8)',
                border: 'none',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                cursor: 'pointer',
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
