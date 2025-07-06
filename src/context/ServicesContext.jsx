// src/context/ServicesContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

const ServicesContext = createContext();

const defaultServices = [
  { id: 1, name: 'Haircut', price: 40 },
  { id: 2, name: 'Color', price: 60 },
];

export function ServicesProvider({ children }) {
  const [services, setServicesState] = useState(defaultServices);
  const [loading, setLoading] = useState(true);

  const servicesDocRef = doc(db, 'business', 'services');

  useEffect(() => {
    // Real-time listener for services document
    const unsubscribe = onSnapshot(servicesDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data && Array.isArray(data.items)) {
          setServicesState(data.items);
        } else {
          setServicesState(defaultServices);
        }
      } else {
        setServicesState(defaultServices);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Function to update services both locally and in Firestore
  const setServices = async (updatedServices) => {
    setServicesState(updatedServices);
    await setDoc(servicesDocRef, { items: updatedServices });
  };

  if (loading) return null; // or spinner

  return (
    <ServicesContext.Provider value={{ services, setServices }}>
      {children}
    </ServicesContext.Provider>
  );
}

export function useServices() {
  return useContext(ServicesContext);
}
