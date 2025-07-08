import '../styles/Home.css';
import { useBusiness } from '../context/BusinessContext';
import { useTeam } from '../context/TeamContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { db } from '../firebaseConfig';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { getServiceCategories } from '../utils/firestore';

export default function Home() {
  const { hours } = useBusiness();
  const { team } = useTeam();
  const navigate = useNavigate();

  const [socialLinks, setSocialLinks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const sectionsRef = useRef([]);

  useEffect(() => {
    const q = query(collection(db, 'socialLinks'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSocialLinks(fetched);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const result = await getServiceCategories();
        setCategories(result);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    const allObservedElements = [
      ...sectionsRef.current,
      ...document.querySelectorAll('.service-card'),
      ...document.querySelectorAll('.team-card'),
    ];

    if (allObservedElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    allObservedElements.forEach((el) => {
      if (el) observer.observe(el);
    });

    allObservedElements.forEach((el) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const inViewport =
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth);

      if (inViewport) {
        el.classList.add('visible');
        observer.unobserve(el);
      }
    });

    return () => {
      allObservedElements.forEach((el) => {
        if (el) observer.unobserve(el);
      });
    };
  }, [categories, team]);

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
        className="glass-about"
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
        className="glass-services"
        id="services"
        ref={el => (sectionsRef.current[1] = el)}
        tabIndex={-1}
        aria-labelledby="services-heading"
      >
        <h2 id="services-heading">Our Services</h2>
        <div className="service-grid">
          {loadingCategories ? (
            <p className="nanum-myeongjo-regular">Loading services...</p>
          ) : categories.length === 0 ? (
            <p className="nanum-myeongjo-regular">No services found.</p>
          ) : (
            categories.map((category, index) => (
              <div
                key={`${category}-${index}`}
                className="service-card"
                tabIndex={0}
                aria-label={`${category} service`}
              >
                <h3>{category}</h3>
                <p className="nanum-myeongjo-regular">
                  Explore our expert {category.toLowerCase()} offerings tailored just for you.
                </p>
              </div>
            ))
          )}
        </div>
      </section>

      <hr />

      <section
        className="glass-team"
        ref={el => (sectionsRef.current[2] = el)}
        tabIndex={-1}
        aria-labelledby="team-heading"
      >
        <h2 id="team-heading">Meet the Team</h2>
        <div className="team-container">
          <div className={`team-grid ${team.length === 0 ? 'no-members' : ''}`}>
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
        className="glass-social"
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
                  <svg
                    className="social-icon"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <circle cx="12" cy="12" r="3.5" />
                    <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
                  </svg>
                )}
                {name === 'Facebook' && (
                  <svg
                    className="social-icon"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M22.675 0h-21.35C.593 0 0 .593 0 1.326v21.348C0 23.406.593 24 1.325 24h11.495v-9.294H9.691v-3.622h3.129V8.413c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.464.099 2.795.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.764v2.314h3.588l-.467 3.622h-3.121V24h6.116c.73 0 1.324-.594 1.324-1.326V1.326C24 .593 23.406 0 22.675 0z" />
                  </svg>
                )}
              </a>
            ))
          )}
        </div>
      </section>
    </>
  );
}
