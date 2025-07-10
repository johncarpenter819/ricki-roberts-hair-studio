import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useServices } from '../context/ServicesContext';
import '../styles/Services.css';

export default function Services() {
  const { services } = useServices();
  const navigate = useNavigate();

  // Group services by category
  const groupedServices = services.reduce((acc, service) => {
    const cat = service.category || 'Uncategorized';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(service);
    return acc;
  }, {});

  function formatDuration(duration) {
    if (!duration) return '';
    if (/[a-zA-Z]/.test(duration)) return duration;
    return `${duration} mins`;
  }

  // 🔁 REPLACED: handleAddToCart → handleBookNow
  function handleBookNow(service) {
    navigate('/booking', {
      state: {
        preselectedService: service.name,
      },
    });
  }

  return (
    <div className="services-container">
      <h1 className="services-heading">Our Services & Pricing</h1>

      {services.length === 0 ? (
        <p className="no-services-message">No services available at the moment.</p>
      ) : (
        Object.entries(groupedServices).map(([category, servicesInCategory]) => (
          <section key={category} className="services-category-section">
            <h2 className="services-category-title">{category}</h2>
            <ul className="services-list">
              {servicesInCategory.map(({ id, name, duration, price, description, image }) => (
                <li key={id} className="service-item-card">
                  <div className="service-item-image">
                    <img
                      src={image || "/assets/default-service.jpg"}
                      alt={name}
                      loading="lazy"
                    />
                  </div>
                  <div className="service-item-content">
                    <div className="service-item-header">
                      <h3>{name}</h3>
                      {duration && (
                        <span className="service-duration">
                          ({formatDuration(duration)})
                        </span>
                      )}
                    </div>
                    {description && (
                      <p className="service-description">{description}</p>
                    )}
                    <div className="service-item-footer">
                      <span className="service-price">${price.toFixed(2)}</span>
                      <button
                        className="add-to-cart-btn"
                        onClick={() => handleBookNow({ id, name })}
                      >
                        Book Now!
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
