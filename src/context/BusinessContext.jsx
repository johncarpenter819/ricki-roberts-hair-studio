// src/context/BusinessContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";

const BusinessContext = createContext();

const defaultHours = {
  Monday: "Closed",
  Tuesday: "9am - 6pm",
  Wednesday: "9am - 6pm",
  Thursday: "9am - 6pm",
  Friday: "9am - 6pm",
  Saturday: "9am - 4pm",
  Sunday: "Closed",
};

const defaultContact = {
  phone: "555-123-4567",
  email: "contact@rickiroberts.com",
  address: "123 Salon Street, City, State ZIP",
};

export function BusinessProvider({ children }) {
  const [hours, setHours] = useState(defaultHours);
  const [contact, setContact] = useState(defaultContact);

  // Load from localStorage on mount
  useEffect(() => {
    const storedHours = localStorage.getItem("businessHours");
    const storedContact = localStorage.getItem("businessContact");
    if (storedHours) setHours(JSON.parse(storedHours));
    if (storedContact) setContact(JSON.parse(storedContact));
  }, []);

  // Save updates to localStorage
  useEffect(() => {
    localStorage.setItem("businessHours", JSON.stringify(hours));
  }, [hours]);

  useEffect(() => {
    localStorage.setItem("businessContact", JSON.stringify(contact));
  }, [contact]);

  return (
    <BusinessContext.Provider value={{ hours, setHours, contact, setContact }}>
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  return useContext(BusinessContext);
}
