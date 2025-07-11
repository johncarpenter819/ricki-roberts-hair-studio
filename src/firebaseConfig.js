// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth"; // Import getAuth for authentication services

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAnFJcHYSePuNDMh1dONFJEjvOSnyZ4cvU",
  authDomain: "ricki-roberts-hair-salon.firebaseapp.com",
  projectId: "ricki-roberts-hair-salon",
  storageBucket: "ricki-roberts-hair-salon.appspot.com",
  messagingSenderId: "615279199789",
  appId: "1:615279199789:web:7eaf21f286a165eac9daa4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app); // Initialize Firebase Auth

// Export the initialized Firebase services
export { app, db, storage, auth };
