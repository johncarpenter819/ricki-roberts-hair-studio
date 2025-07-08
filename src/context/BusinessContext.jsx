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

const defaultAbout = "At Ricki Roberts Hair Studio, we’re dedicated to delivering stylish, confident results while creating a warm and welcoming environment.";

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
  const [about, setAbout] = useState(defaultAbout);
  const [loading, setLoading] = useState(true);

  const hoursDocRef = doc(db, "business", "hours");
  const contactDocRef = doc(db, "business", "contact");
  const aboutDocRef = doc(db, "business", "about");

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

    const unsubscribeAbout = onSnapshot(aboutDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setAbout(data.text || defaultAbout);
      } else {
        setAbout(defaultAbout);
      }
    });

    setLoading(false);

    return () => {
      unsubscribeHours();
      unsubscribeContact();
      unsubscribeAbout();
    };
  }, []);

  // Write hours updates to Firestore
  useEffect(() => {
    if (!loading) {
      setDoc(hoursDocRef, hours);
    }
  }, [hours]);

  // Write contact updates to Firestore
  useEffect(() => {
    if (!loading) {
      setDoc(contactDocRef, contact);
    }
  }, [contact]);

  // Write about updates to Firestore
  useEffect(() => {
    if (!loading) {
      setDoc(aboutDocRef, { text: about });
    }
  }, [about]);

  if (loading) return null;

  return (
    <BusinessContext.Provider value={{ hours, setHours, contact, setContact, about, setAbout }}>
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  return useContext(BusinessContext);
}
