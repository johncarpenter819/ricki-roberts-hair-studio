import React, { useState, useEffect } from 'react';
import { useBusiness } from '../context/BusinessContext';
import emailjs from '@emailjs/browser';
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getServiceNames } from '../utils/firestore';
import '../styles/Contact.css';

const Contact = () => {
  const { contact } = useBusiness();

  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');
  const [hydrated, setHydrated] = useState(false);

  const [services, setServices] = useState([]);
  const [stylists, setStylists] = useState([]);

  const [reviewForm, setReviewForm] = useState({
    name: '',
    stars: '',
    text: '',
    service: '',
    stylist: '',
  });
  const [reviewStatus, setReviewStatus] = useState('');

  useEffect(() => {
    setHydrated(true);

    async function fetchData() {
      try {
        const serviceNames = await getServiceNames();
        setServices(serviceNames);

        const teamRaw = localStorage.getItem("teamMembers");
        const team = teamRaw ? JSON.parse(teamRaw) : [];
        const names = team.map((member) => member.name).filter(Boolean);
        setStylists(names);
      } catch (err) {
        console.error("Failed loading dynamic fields:", err);
        setServices([]);
        setStylists([]);
      }
    }

    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleReviewChange = (e) => {
    setReviewForm({ ...reviewForm, [e.target.name]: e.target.value });
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
      'YOUR_SERVICE_ID',
      'YOUR_TEMPLATE_ID',
      templateParams,
      'YOUR_PUBLIC_KEY'
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

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (
      !reviewForm.stars ||
      !reviewForm.text.trim() ||
      !reviewForm.service ||
      !reviewForm.stylist
    ) {
      setReviewStatus('Please fill in all required review fields.');
      return;
    }

    try {
      await addDoc(collection(db, 'reviews'), {
        name: reviewForm.name?.trim() || 'Anonymous',
        stars: Number(reviewForm.stars),
        text: reviewForm.text.trim(),
        service: reviewForm.service,
        stylist: reviewForm.stylist,
        date: new Date().toLocaleDateString(),
        timestamp: serverTimestamp(),
        approved: false,
      });
      setReviewStatus('Thank you for leaving a review!');
      setReviewForm({ name: '', stars: '', text: '', service: '', stylist: '' });
    } catch (err) {
      console.error('Review submit error:', err);
      setReviewStatus('Failed to submit review. Please try again.');
    }
  };

  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.address)}`;

  return (
    <div className={`contact-page contact-page-split ${hydrated ? 'visible' : ''}`}>
      <div className="contact-left">
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

      <div className="contact-right review-form-container">
        <h1>Leave a Review</h1>
        <form onSubmit={handleReviewSubmit} className="contact-form">
          <label>
            Your Name (optional)
            <input type="text" name="name" value={reviewForm.name} onChange={handleReviewChange} />
          </label>

          <label>
            Service Performed <span style={{ color: 'red' }}>*</span>
            <select
              name="service"
              value={reviewForm.service}
              onChange={handleReviewChange}
              required
            >
              <option value="" disabled>Select a service</option>
              {services.length === 0 ? (
                <option disabled>Loading services...</option>
              ) : (
                services.map((svc) => (
                  <option key={svc} value={svc}>{svc}</option>
                ))
              )}
            </select>
          </label>

          <label>
            Stylist <span style={{ color: 'red' }}>*</span>
            <select
              name="stylist"
              value={reviewForm.stylist}
              onChange={handleReviewChange}
              required
            >
              <option value="" disabled>Select stylist</option>
              {stylists.length === 0 ? (
                <option disabled>Loading stylists...</option>
              ) : (
                stylists.map((sty) => (
                  <option key={sty} value={sty}>{sty}</option>
                ))
              )}
            </select>
          </label>

          <label>
            Rating <span style={{ color: 'red' }}>*</span>
            <select name="stars" value={reviewForm.stars} onChange={handleReviewChange} required>
              <option value="">No Rating</option>
              <option value="5">⭐⭐⭐⭐⭐ (5)</option>
              <option value="4">⭐⭐⭐⭐ (4)</option>
              <option value="3">⭐⭐⭐ (3)</option>
              <option value="2">⭐⭐ (2)</option>
              <option value="1">⭐ (1)</option>
            </select>
          </label>

          <label>
            Your Review <span style={{ color: 'red' }}>*</span>
            <textarea
              name="text"
              rows="5"
              required
              value={reviewForm.text}
              onChange={handleReviewChange}
            />
          </label>

          <button type="submit" className="cta-btn">Submit Review</button>
          {reviewStatus && <p className="form-status">{reviewStatus}</p>}
        </form>
      </div>
    </div>
  );
};

export default Contact;
