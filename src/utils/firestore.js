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

// ✅ Get customer reviews from Firestore (ordered by most recent)
export async function getReviews() {
  const reviewsRef = collection(db, "reviews");
  const q = query(reviewsRef, orderBy("date", "desc"));

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}
