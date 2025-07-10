// src/utils/firestore.js
import { db } from "../firebaseConfig";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
  where,
  updateDoc,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";

// ✅ Save business data (hours + contact info)
export async function saveBusinessData(hours, contact) {
  await setDoc(doc(db, "settings", "business"), {
    hours,
    contact,
  });
}

// ✅ Get business data (hours + contact info)
export async function getBusinessData() {
  const docSnap = await getDoc(doc(db, "settings", "business"));
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null;
  }
}

// ✅ Get unique service categories from Firestore
export async function getServiceCategories() {
  const servicesDocRef = doc(db, "business", "services");
  const snapshot = await getDoc(servicesDocRef);
  if (!snapshot.exists()) return [];

  const data = snapshot.data();
  if (!Array.isArray(data.items)) return [];

  const categories = [
    ...new Set(
      data.items
        .map((item) => item?.category?.trim())
        .filter(Boolean)
    ),
  ];

  return categories;
}

// ✅ Get APPROVED reviews only (or legacy reviews with no 'approved' field)
export async function getReviews() {
  const reviewsRef = collection(db, "reviews");
  const q = query(reviewsRef, orderBy("timestamp", "desc")); // timestamp is more reliable

  const snapshot = await getDocs(q);
  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .filter((review) => review.approved === true || review.approved === undefined);
}

// ✅ Get PENDING reviews (for admin approval)
export async function getPendingReviews() {
  const reviewsRef = collection(db, "reviews");
  const q = query(reviewsRef, orderBy("timestamp", "desc"));

  const snapshot = await getDocs(q);
  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .filter((review) => review.approved === false);
}

// ✅ Get APPROVED reviews only (explicitly)
export async function getApprovedReviews() {
  const reviewsRef = collection(db, "reviews");
  const q = query(reviewsRef, where("approved", "==", true), orderBy("timestamp", "desc"));

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// ✅ Get ALL reviews (pending + approved) for admin
export async function getAllReviews() {
  const reviewsRef = collection(db, "reviews");
  const q = query(reviewsRef, orderBy("timestamp", "desc"));

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// ✅ Approve a review (sets approved:true and optional published timestamp)
export async function approveReview(reviewId) {
  const reviewRef = doc(db, "reviews", reviewId);
  await updateDoc(reviewRef, {
    approved: true,
    publishedAt: serverTimestamp(), // optional: track when review was published
  });
}

// ✅ Delete a review by ID
export async function deleteReview(reviewId) {
  try {
    await deleteDoc(doc(db, "reviews", reviewId));
  } catch (error) {
    console.error("Error deleting review:", error);
    throw error;
  }
}
