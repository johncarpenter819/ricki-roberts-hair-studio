import '../styles/Home.css';
import { useBusiness } from '../context/BusinessContext';
import { useTeam } from '../context/TeamContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { getServiceCategories } from '../utils/firestore';
import { useReviews } from '../context/ReviewsContext';

export default function Home() {
  const { hours, about } = useBusiness();
  const { team } = useTeam();
  const navigate = useNavigate();

  const { reviews, loading: loadingReviews, error: reviewsError } = useReviews();

  const [socialLinks, setSocialLinks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const sectionsRef = useRef([]);
  const reviewsRef = useRef(null);

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
      ...document.querySelectorAll('.review-card'),
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
    if (photo.startsWith("/assets/")) return photo;
    return `/assets/${photo}`;
  };

  const toggleReviews = () => {
    setShowAllReviews((prev) => {
      const newShowAll = !prev;
      if (prev) {
        reviewsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
      return newShowAll;
    });
  };

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
          {about || "Welcome to our salon! Our story will appear here soon."}
        </p>
      </section>

      <hr />

      <section
        className="glass-reviews"
        ref={el => (sectionsRef.current[1.5] = el)}
        tabIndex={-1}
        aria-labelledby="reviews-heading"
      >
        <h2 id="reviews-heading">Ratings & Reviews</h2>

        {loadingReviews && <p className="nanum-myeongjo-regular">Loading reviews...</p>}
        {reviewsError && <p className="nanum-myeongjo-regular" style={{color: 'red'}}>Failed to load reviews.</p>}

        {!loadingReviews && !reviewsError && (
          <>
            <div id="reviews-container" className="reviews-container" ref={reviewsRef}>
              {reviews.length === 0 ? (
                <p className="nanum-myeongjo-regular">No reviews available.</p>
              ) : (
                (showAllReviews ? reviews : reviews.slice(0, 10)).map((review, i) => (
                  <div key={review.id || i} className="review-card nanum-myeongjo-regular">
                    {review.stars && (
                      <div className="review-stars">{'⭐️'.repeat(review.stars)}</div>
                    )}
                    <p className="review-meta">
                      <strong>{review.name}</strong> — <span>{review.date}</span>
                    </p>
                    <p className="review-text">"{review.text}"</p>
                  </div>
                ))
              )}
            </div>
            {reviews.length > 10 && (
              <div className="reviews-button-container">
                <button
                  className="cta-btn"
                  onClick={toggleReviews}
                  aria-expanded={showAllReviews}
                  aria-controls="reviews-container"
                  style={{ marginTop: '1.5rem' }}
                >
                  {showAllReviews ? 'Show Less Reviews' : `Show All Reviews (${reviews.length})`}
                </button>
              </div>
            )}
          </>
        )}
      </section>

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
                <div
                  key={member.id}
                  className="team-card"
                  tabIndex={0}
                  aria-label={`Team member: ${member.name}`}
                >
                  <img
                    src={getPhotoSrc(member.photo)}
                    alt={`Portrait of ${member.name}`}
                    className="team-photo"
                  />
                  <h3>{member.name}</h3>
                  <p className="nanum-myeongjo-regular"><strong>Role:</strong> {member.role}</p>
                  {member.bio && (
                    <p className="team-bio nanum-myeongjo-regular">
                      <strong>Bio:</strong> {member.bio}
                    </p>
                  )}
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
            {[
              "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
            ].map(day => (
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
            If you are unable to make the appointment, please kindly notify us at{' '}
            <a href="tel:8179879261">(817) 987-9261</a> or{' '}
            <a href="mailto:ricquell.muah@gmail.com">ricquell.muah@gmail.com</a>.
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
                  <svg className="social-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <rect width="24" height="24" rx="5" ry="5" fill="none" />
                    <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zM12 7.25a4.75 4.75 0 100 9.5 4.75 4.75 0 000-9.5zm0 7.75a3 3 0 110-6 3 3 0 010 6zm4.75-8.5a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0z" />
                  </svg>
                )}
                {name === 'Facebook' && (
                  <svg className="social-icon" viewBox="0 0 24 24" aria-hidden="true">
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
