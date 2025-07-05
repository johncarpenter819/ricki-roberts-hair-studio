import React, { createContext, useContext, useState, useEffect } from 'react';

const ServicesContext = createContext();

const defaultServices = [
  { id: 1, name: 'Haircut', price: 40 },
  { id: 2, name: 'Color', price: 60 },
];

export function ServicesProvider({ children }) {
  const [services, setServices] = useState(() => {
    const saved = localStorage.getItem('services');
    return saved ? JSON.parse(saved) : defaultServices;
  });

  useEffect(() => {
    localStorage.setItem('services', JSON.stringify(services));
  }, [services]);

  return (
    <ServicesContext.Provider value={{ services, setServices }}>
      {children}
    </ServicesContext.Provider>
  );
}

export function useServices() {
  return useContext(ServicesContext);
}
