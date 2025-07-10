// src/context/ReviewsContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import reviewsData from "../data/reviews.json";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";

const ReviewsContext = createContext();

export function useReviews() {
  return useContext(ReviewsContext);
}

export function ReviewsProvider({ children }) {
  const [reviews, setReviews] = useState(reviewsData || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    const q = query(
      collection(db, "reviews"),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        // Firestore approved reviews only
        const approvedReviews = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(r => r.approved === true || r.approved === undefined);

        // Sort Firestore reviews descending by timestamp or date
        approvedReviews.sort((a, b) => {
          const ta = a.timestamp?.toMillis?.() || new Date(a.date).getTime() || 0;
          const tb = b.timestamp?.toMillis?.() || new Date(b.date).getTime() || 0;
          return tb - ta;
        });

        // Combine: Firestore reviews (new, approved) first, then all legacy reviews appended
        // No deduplication between legacy and Firestore since legacy lacks ids and should not be removed
        const mergedReviews = [...approvedReviews, ...reviewsData];

        setReviews(mergedReviews);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching approved reviews:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const value = {
    reviews,
    loading,
    error,
  };

  return (
    <ReviewsContext.Provider value={value}>
      {children}
    </ReviewsContext.Provider>
  );
}
