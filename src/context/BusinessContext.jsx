import React, { createContext, useState, useEffect, useContext } from "react";
import { db } from "../firebaseConfig";
import { doc, setDoc, onSnapshot } from "firebase/firestore";

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

// Define the order of days
const orderedDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Helper to sort an hours object
function sortHoursObject(hoursObj) {
  const sorted = {};
  orderedDays.forEach((day) => {
    sorted[day] = hoursObj[day] || "Closed";
  });
  return sorted;
}

export function BusinessProvider({ children }) {
  const [hours, setHours] = useState(defaultHours);
  const [contact, setContact] = useState(defaultContact);
  const [loading, setLoading] = useState(true);

  const hoursDocRef = doc(db, "business", "hours");
  const contactDocRef = doc(db, "business", "contact");

  useEffect(() => {
    const unsubscribeHours = onSnapshot(hoursDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const sorted = sortHoursObject(snapshot.data());
        setHours(sorted);
      } else {
        setHours(defaultHours);
      }
    });

    const unsubscribeContact = onSnapshot(contactDocRef, (snapshot) => {
      if (snapshot.exists()) {
        setContact(snapshot.data());
      } else {
        setContact(defaultContact);
      }
    });

    setLoading(false);

    return () => {
      unsubscribeHours();
      unsubscribeContact();
    };
  }, []);

  useEffect(() => {
    if (!loading) {
      setDoc(hoursDocRef, hours);
    }
  }, [hours]);

  useEffect(() => {
    if (!loading) {
      setDoc(contactDocRef, contact);
    }
  }, [contact]);

  if (loading) return null;

  return (
    <BusinessContext.Provider value={{ hours, setHours, contact, setContact }}>
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  return useContext(BusinessContext);
}
