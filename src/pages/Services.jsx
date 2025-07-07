import React from 'react';
import { useServices } from '../context/ServicesContext';
import '../styles/Services.css';

export default function Services() {
  const { services } = useServices();

  // Group services by category
  const groupedServices = services.reduce((acc, service) => {
    const cat = service.category || 'Uncategorized';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(service);
    return acc;
  }, {});

  // Placeholder for cart logic
  function handleAddToCart(service) {
    console.log('Add to cart:', service); // Replace with your real cart logic
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
                      {duration && <span className="service-duration">({duration})</span>}
                    </div>
                    {description && (
                      <p className="service-description">{description}</p>
                    )}
                    <div className="service-item-footer">
                      <span className="service-price">${price.toFixed(2)}</span>
                      <button
                        className="add-to-cart-btn"
                        onClick={() => handleAddToCart({ id, name, price })}
                      >
                        Add to Cart
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
