// src/utils/firestore.js
import { db } from "../firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";

export async function saveBusinessData(hours, contact) {
  await setDoc(doc(db, "settings", "business"), {
    hours,
    contact
  });
}

export async function getBusinessData() {
  const docSnap = await getDoc(doc(db, "settings", "business"));
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return null;
  }
}
