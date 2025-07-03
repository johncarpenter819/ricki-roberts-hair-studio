import { useState, useEffect } from 'react';

export default function AboutEditor() {
  // For demo, we'll load from localStorage or default text
  const defaultAbout =
    "At Ricki Roberts Hair Studio, we’re dedicated to delivering stylish, confident results while creating a warm and welcoming environment.";

  const [aboutText, setAboutText] = useState('');
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('aboutText') || defaultAbout;
    setAboutText(saved);
  }, []);

  function handleChange(e) {
    setAboutText(e.target.value);
  }

  function handleSave() {
    localStorage.setItem('aboutText', aboutText);
    setSavedMessage('About Us updated successfully!');
    setTimeout(() => setSavedMessage(''), 3000);
  }

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '1rem' }}>
      <h2>About Us Editor</h2>
      <textarea
        value={aboutText}
        onChange={handleChange}
        rows={8}
        style={{ width: '100%', fontSize: '1.1rem', padding: '0.5rem' }}
      />
      <button
        onClick={handleSave}
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          backgroundColor: '#a77b5a',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
      >
        Save
      </button>
      {savedMessage && <p style={{ color: 'green', marginTop: '1rem' }}>{savedMessage}</p>}
    </div>
  );
}
