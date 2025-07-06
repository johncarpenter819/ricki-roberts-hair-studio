import '../styles/Home.css';
import { useBusiness } from '../context/BusinessContext';
import { useTeam } from '../context/TeamContext';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const { hours } = useBusiness();
  const { team } = useTeam();
  const navigate = useNavigate();

  const goToBooking = () => {
    navigate('/booking');
  };

  const getPhotoSrc = (photo) => {
    if (!photo) return "/assets/default-profile.jpg";
    if (photo.startsWith("/assets/") || photo.startsWith("blob:")) {
      return photo;
    }
    return `/assets/${photo}`;
  };

  // Ensure weekdays appear in the correct order
  const orderedDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <>
      {/* Hero Banner */}
      <section className="hero-banner">
        <img src="/assets/banner.jpg" alt="Salon Banner" className="banner-image" />
        <div className="banner-text">
          <h1>Welcome to Ricki Roberts Hair Studio</h1>
          <p>Style. Confidence. Community.</p>
          <button className="cta-btn" onClick={goToBooking}>Book Now</button>
        </div>
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
      <section className="services" id="services">
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
          {team.length === 0 ? (
            <p>No team members found.</p>
          ) : (
            team.map(member => (
              <div key={member.id} className="team-card">
                <img 
                  src={getPhotoSrc(member.photo)} 
                  alt={member.name} 
                  className="team-img"
                />
                <h3>{member.name}</h3>
                <p><strong>Role:</strong> {member.role}</p>
                {member.bio && (
                  <p className="team-bio"><strong>Bio:</strong> {member.bio}</p>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      <hr />

      {/* Business Hours + Cancellation Policy */}
      <section className="hours-cancellation-container">
        <div className="hours">
          <h2>Business Hours</h2>
          <ul>
            {orderedDays.map(day => (
              <li key={day}>
                <strong>{day.substring(0, 3)}:</strong> {hours[day] || "Closed"}
              </li>
            ))}
          </ul>
        </div>

        <div className="cancellation-policy">
          <h2>Cancellation Policy</h2>
          <p>
            We get it that sometimes things come up and you may need to cancel. Ricki Roberts Hair Studio has a 50% cancellation fee.
            If you are unable to make the appointment, please kindly notify Ricki Roberts Hair Studio at <a href="tel:8179879261">(817) 987-9261</a> or <a href="mailto:ricquell.muah@gmail.com">ricquell.muah@gmail.com</a> as soon as possible to reschedule.
          </p>
        </div>
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
