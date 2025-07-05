import React from 'react';
import { useServices } from '../context/ServicesContext';

export default function Services() {
  const { services } = useServices();

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1rem' }}>
      <h2>Our Services & Pricing</h2>
      {services.length === 0 ? (
        <p>No services available at the moment.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {services.map(({ id, name, price }) => (
            <li key={id} style={{ marginBottom: '1rem', borderBottom: '1px solid #ccc', paddingBottom: '0.5rem' }}>
              <strong>{name}</strong> - ${price.toFixed(2)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
