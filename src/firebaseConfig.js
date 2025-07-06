import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAnFJcHYSePuNDMh1dONFJEjvOSnyZ4cvU",
  authDomain: "ricki-roberts-hair-salon.firebaseapp.com",
  projectId: "ricki-roberts-hair-salon",
  storageBucket: "ricki-roberts-hair-salon.firebasestorage.app",
  messagingSenderId: "615279199789",
  appId: "1:615279199789:web:7eaf21f286a165eac9daa4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);