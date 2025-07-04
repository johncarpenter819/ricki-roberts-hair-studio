import '../styles/Home.css'
import { useBusiness } from '../context/BusinessContext';

export default function Home() {
  const { hours } = useBusiness();

  return (
    <>
      {/* Book Appointment CTA */}
      <section className="book-section">
        <h2>Book an Appointment</h2>
        <p>Use our easy online system to schedule your next visit.</p>
        <button className="cta-btn">Schedule Now</button>
      </section>

      <hr />

      {/* About Section */}
      <section className="about">
        <h2>About Us</h2>
        <p>
          At Ricki Roberts Hair Studio, we’re dedicated to delivering stylish,
          confident results while creating a warm and welcoming environment.
        </p>
      </section>

      <hr />

      {/* Services Preview */}
      <section className="services">
        <h2>Our Services</h2>
        <div className="service-grid">
          <div className="service-card">
            <h3>Haircuts</h3>
            <p>Custom cuts tailored to your style and preferences.</p>
          </div>
          <div className="service-card">
            <h3>Color</h3>
            <p>Vibrant color, highlights, and balayage.</p>
          </div>
          <div className="service-card">
            <h3>Styling</h3>
            <p>Perfect looks for events, photoshoots, or daily glam.</p>
          </div>
        </div>
      </section>

      <hr />

      {/* Meet the Team */}
      <section className="team">
        <h2>Meet the Team</h2>
        <div className="team-grid">
          <div className="team-member">
            <img src="/assets/ricque.jpg" alt="Ricque" />
            <h3>Ricque Roberts</h3>
            <p>Owner & Master Stylist</p>
          </div>
        </div>
      </section>

      <hr />

      {/* Business Hours */}
      <section className="hours">
        <h2>Business Hours</h2>
        <ul>
          {Object.entries(hours).map(([day, time]) => (
            <li key={day}>
              {day.substring(0,3)}: {time}
            </li>
          ))}
        </ul>
      </section>

      <hr />

      {/* Social Links */}
      <section className="social">
        <h2>Follow Us</h2>
        <div className="social-icons">
          <a href="#"><img src="/icons/instagram.svg" alt="Instagram" /></a>
          <a href="#"><img src="/icons/facebook.svg" alt="Facebook" /></a>
          <a href="#"><img src="/icons/tiktok.svg" alt="TikTok" /></a>
        </div>
      </section>
    </>
  );
}
