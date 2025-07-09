import React, { useState, useEffect } from 'react';
import { useBusiness } from '../context/BusinessContext';
import emailjs from '@emailjs/browser';
import '../styles/Contact.css';

const Contact = () => {
  const { contact } = useBusiness();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const templateParams = {
      from_name: form.name,
      from_email: form.email,
      message: form.message,
      to_email: contact.email,
    };

    emailjs.send(
      'YOUR_SERVICE_ID',     // replace with your EmailJS service ID
      'YOUR_TEMPLATE_ID',    // replace with your EmailJS template ID
      templateParams,
      'YOUR_PUBLIC_KEY'      // replace with your EmailJS public key
    )
    .then(() => {
      setStatus('Message sent successfully!');
      setForm({ name: '', email: '', message: '' });
    })
    .catch((err) => {
      console.error('Email send error:', err);
      setStatus('Failed to send message. Please try again.');
    });
  };

  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}`;

  return (
    <div className={`contact-page ${hydrated ? 'visible' : ''}`}>
      <h1>Ask Ricki Roberts a Question</h1>

      <form className="contact-form" onSubmit={handleSubmit}>
        <label>
          Your Name
          <input type="text" name="name" required value={form.name} onChange={handleChange} />
        </label>

        <label>
          Your Email
          <input type="email" name="email" required value={form.email} onChange={handleChange} />
        </label>

        <label>
          Your Message
          <textarea name="message" rows="5" required value={form.message} onChange={handleChange} />
        </label>

        <button type="submit" className="cta-btn">Send Message</button>

        {status && <p className="form-status">{status}</p>}
      </form>

      <div className="map-thumbnail">
        <a href={mapUrl} target="_blank" rel="noopener noreferrer">
          <p>Tap for directions to {contact.name || 'our location'}</p>
        </a>
      </div>
    </div>
  );
};

export default Contact;
