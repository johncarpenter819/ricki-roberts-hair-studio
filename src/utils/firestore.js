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
  addDoc,
} from "firebase/firestore";

// ✅ Save business data (hours + contact info)
export async function saveBusinessData(hours, contact) {
  await setDoc(doc(db, "settings", "business"), { hours, contact });
}

// ✅ Get business data (hours + contact info)
export async function getBusinessData() {
  const docSnap = await getDoc(doc(db, "settings", "business"));
  return docSnap.exists() ? docSnap.data() : null;
}

// ✅ Get unique service names from Firestore
export async function getServiceNames() {
  const servicesDocRef = doc(db, "business", "services");
  const snapshot = await getDoc(servicesDocRef);
  if (!snapshot.exists()) return [];

  const data = snapshot.data();
  if (!Array.isArray(data.items)) return [];

  const names = data.items
    .map((item) => item?.name?.trim())
    .filter(Boolean);

  return [...new Set(names)];
}

// ✅ Get approved reviews (explicitly or legacy with no 'approved' flag)
export async function getReviews() {
  const reviewsRef = collection(db, "reviews");
  const q = query(reviewsRef, orderBy("timestamp", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .filter((r) => r.timestamp && (r.approved === true || r.approved === undefined));
}

// ✅ Get pending reviews
export async function getPendingReviews() {
  const reviewsRef = collection(db, "reviews");
  const q = query(reviewsRef, orderBy("timestamp", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .filter((r) => r.approved === false && r.timestamp);
}

// ✅ Get approved reviews only
export async function getApprovedReviews() {
  const reviewsRef = collection(db, "reviews");
  const q = query(reviewsRef, where("approved", "==", true), orderBy("timestamp", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .filter((r) => r.timestamp); // ensure sorted
}

// ✅ Get ALL reviews for admin (approved + pending)
export async function getAllReviews() {
  const reviewsRef = collection(db, "reviews");
  const q = query(reviewsRef, orderBy("timestamp", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .filter((r) => r.timestamp); // make sure timestamp exists
}

// ✅ Submit new review
export async function submitReview(data) {
  return await addDoc(collection(db, "reviews"), {
    ...data,
    timestamp: serverTimestamp(),
    approved: false,
  });
}

// ✅ Approve a review
export async function approveReview(reviewId) {
  const reviewRef = doc(db, "reviews", reviewId);
  await updateDoc(reviewRef, {
    approved: true,
    publishedAt: serverTimestamp(),
  });
}

// ✅ Delete a review
export async function deleteReview(reviewId) {
  try {
    await deleteDoc(doc(db, "reviews", reviewId));
  } catch (err) {
    console.error("Error deleting review:", err);
    throw err;
  }
}
