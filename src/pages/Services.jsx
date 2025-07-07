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

  return (
    <div className="services-container">
      <h2 className="services-heading">Our Services & Pricing</h2>

      {services.length === 0 ? (
        <p className="no-services-message">No services available at the moment.</p>
      ) : (
        Object.entries(groupedServices).map(([category, servicesInCategory]) => (
          <section key={category} className="services-category-section">
            <h3 className="services-category-title">{category}</h3>
            <ul className="services-list">
              {servicesInCategory.map(({ id, name, duration, price }) => (
                <li key={id} className="services-list-item">
                  <div className="service-name-duration">
                    <strong>{name}</strong>
                    {duration && <span className="service-duration">({duration})</span>}
                  </div>
                  <div className="service-price">${price.toFixed(2)}</div>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
