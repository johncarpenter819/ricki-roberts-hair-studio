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

    // Firestore query: approved reviews ordered by timestamp desc
    const q = query(
      collection(db, "reviews"),
      orderBy("timestamp", "desc")
    );

    // Real-time listener
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        // Filter approved reviews only
        const approvedReviews = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(r => r.approved === true || r.approved === undefined);

        // Sort descending by timestamp or date if timestamp missing
        approvedReviews.sort((a, b) => {
          const ta = a.timestamp?.toMillis?.() || new Date(a.date).getTime() || 0;
          const tb = b.timestamp?.toMillis?.() || new Date(b.date).getTime() || 0;
          return tb - ta;
        });

        // Merge logic: if approved reviews exist, replace first legacy review with newest Firestore one
        let mergedReviews = [...reviewsData];
        if (approvedReviews.length > 0) {
          // Replace first legacy review
          mergedReviews[0] = approvedReviews[0];
          // Append rest of approved reviews (excluding the first which replaced legacy)
          if (approvedReviews.length > 1) {
            mergedReviews = [
              mergedReviews[0],
              ...approvedReviews.slice(1),
              ...mergedReviews.slice(1),
            ];
          }
        }

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
