import '../styles/Home.css';
import { useBusiness } from '../context/BusinessContext';
import { useTeam } from '../context/TeamContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { db } from '../firebaseConfig';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

export default function Home() {
  const { hours } = useBusiness();
  const { team } = useTeam();
  const navigate = useNavigate();

  const [socialLinks, setSocialLinks] = useState([]);

  // Refs for scroll animations
  const sectionsRef = useRef([]);

  useEffect(() => {
    const q = query(collection(db, 'socialLinks'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSocialLinks(fetched);
    });

    return () => unsubscribe();
  }, []);

  // Scroll fade-in with IntersectionObserver for sections, service cards, and team cards
  useEffect(() => {
    const allObservedElements = [
      ...sectionsRef.current,
      ...document.querySelectorAll('.service-card'),
      ...document.querySelectorAll('.team-card'),
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    allObservedElements.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      allObservedElements.forEach((el) => {
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  const goToBooking = () => navigate('/booking');

  const getPhotoSrc = (photo) => {
    if (!photo) return "/assets/default-profile.jpg";
    if (photo.startsWith("/assets/") || photo.startsWith("blob:")) return photo;
    return `/assets/${photo}`;
  };

  const orderedDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <>
      <section className="hero-banner" aria-label="Salon Banner and Welcome">
        <div className="hero-content-container">
          <div className="banner-text">
            <h1 className="glow-text">Welcome to Ricki Roberts Hair Studio</h1>
            <p className="nanum-myeongjo-regular">Style. Confidence. Community.</p>
            <button className="cta-btn pulse-glow" onClick={goToBooking}>Book Now</button>
          </div>
        </div>
      </section>

      <hr />

      <section
        className="glass-section"
        ref={el => (sectionsRef.current[0] = el)}
        tabIndex={-1}
        aria-labelledby="about-us-heading"
      >
        <h2 id="about-us-heading">About Us</h2>
        <p className="nanum-myeongjo-regular">
          At Ricki Roberts Hair Studio, we’re dedicated to delivering stylish,
          confident results while creating a warm and welcoming environment.
        </p>
      </section>

      <hr />

      <section
        className="glass-section"
        id="services"
        ref={el => (sectionsRef.current[1] = el)}
        tabIndex={-1}
        aria-labelledby="services-heading"
      >
        <h2 id="services-heading">Our Services</h2>
        <div className="service-grid">
          <div className="service-card" tabIndex={0} aria-label="Haircuts Service">
            <h3>Haircuts</h3>
            <p className="nanum-myeongjo-regular">Custom cuts tailored to your style and preferences.</p>
          </div>
          <div className="service-card" tabIndex={0} aria-label="Color Service">
            <h3>Color</h3>
            <p className="nanum-myeongjo-regular">Vibrant color, highlights, and balayage.</p>
          </div>
          <div className="service-card" tabIndex={0} aria-label="Styling Service">
            <h3>Styling</h3>
            <p className="nanum-myeongjo-regular">Perfect looks for events, photoshoots, or daily glam.</p>
          </div>
        </div>
      </section>

      <hr />

      <section
        className="glass-section"
        ref={el => (sectionsRef.current[2] = el)}
        tabIndex={-1}
        aria-labelledby="team-heading"
      >
        <h2 id="team-heading">Meet the Team</h2>
        <div className="team-grid">
          {team.length === 0 ? (
            <p className="nanum-myeongjo-regular">No team members found.</p>
          ) : (
            team.map(member => (
              <div key={member.id} className="team-card" tabIndex={0} aria-label={`Team member: ${member.name}`}>
                <img src={getPhotoSrc(member.photo)} alt={`Portrait of ${member.name}`} className="team-img" />
                <h3>{member.name}</h3>
                <p className="nanum-myeongjo-regular"><strong>Role:</strong> {member.role}</p>
                {member.bio && <p className="team-bio nanum-myeongjo-regular"><strong>Bio:</strong> {member.bio}</p>}
              </div>
            ))
          )}
        </div>
      </section>

      <hr />

      <section
        className="hours-cancellation-container"
        ref={el => (sectionsRef.current[3] = el)}
        tabIndex={-1}
      >
        <div className="hours" aria-labelledby="business-hours-heading">
          <h2 id="business-hours-heading">Business Hours</h2>
          <ul>
            {orderedDays.map(day => (
              <li key={day} className="nanum-myeongjo-regular">
                <strong>{day.substring(0, 3)}:</strong> {hours[day] || "Closed"}
              </li>
            ))}
          </ul>
        </div>

        <div className="cancellation-policy" aria-labelledby="cancellation-policy-heading">
          <h2 id="cancellation-policy-heading">Cancellation Policy</h2>
          <p className="nanum-myeongjo-regular">
            We get it that sometimes things come up and you may need to cancel. Ricki Roberts Hair Studio has a 50% cancellation fee.
            If you are unable to make the appointment, please kindly notify us at <a href="tel:8179879261">(817) 987-9261</a> or <a href="mailto:ricquell.muah@gmail.com">ricquell.muah@gmail.com</a>.
          </p>
        </div>
      </section>

      <hr />

      <section
        className="glass-section social"
        ref={el => (sectionsRef.current[4] = el)}
        tabIndex={-1}
        aria-labelledby="social-heading"
      >
        <h2 id="social-heading">Follow Us</h2>
        <div className="social-icons">
          {socialLinks.length === 0 ? (
            <p className="nanum-myeongjo-regular">No social links available.</p>
          ) : (
            socialLinks.map(({ id, name, url }) => (
              <a
                key={id}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Follow us on ${name}`}
                className="social-link"
              >
                {name === 'Instagram' && (
                  <svg className="social-icon" viewBox="0 0 24 24" fill="#E1306C" aria-hidden="true"><path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 1.5A4.25 4.25 0 003.5 7.75v8.5A4.25 4.25 0 007.75 20.5h8.5A4.25 4.25 0 0020.5 16.25v-8.5A4.25 4.25 0 0016.25 3.5h-8.5zM12 7a5 5 0 110 10 5 5 0 010-10zm0 1.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zm4.75-.75a.75.75 0 110 1.5.75.75 0 010-1.5z"/></svg>
                )}
                {name === 'Facebook' && (
                  <svg className="social-icon" viewBox="0 0 24 24" fill="#1877F2" aria-hidden="true"><path d="M22 12a10 10 0 10-11.625 9.875v-7H8v-3h2.375v-2.3c0-2.35 1.4-3.65 3.55-3.65 1.03 0 2.1.185 2.1.185v2.31H15.6c-1.24 0-1.63.765-1.63 1.55V12H17l-.5 3h-2.53v7A10.001 10.001 0 0022 12z"/></svg>
                )}
                {name === 'TikTok' && (
                  <svg className="social-icon" viewBox="0 0 24 24" fill="#000000" aria-hidden="true"><path d="M9 3h3v13a3 3 0 11-3-3v-3a6 6 0 106 6V8.5a6.5 6.5 0 004 1.5V7a4.5 4.5 0 01-4-2.5A3.5 3.5 0 0112 1H9v2z"/></svg>
                )}
              </a>
            ))
          )}
        </div>
      </section>
    </>
  );
}
