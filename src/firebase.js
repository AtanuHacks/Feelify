// src/firebase.js
// -------------------------------------------
// ✅ Firebase initialization for Feelify App
// -------------------------------------------

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";
import { updateProfile } from "firebase/auth";
import { getFirestore } from "firebase/firestore";



// 🔹 Your Firebase configuration (from console)
const firebaseConfig = {
  apiKey: "AIzaSyCv7U1a3X8oN_RnFPqmvRMb4zQ28n3l-2Y",
  authDomain: "feelify-a87a8.firebaseapp.com",
  projectId: "feelify-a87a8",
  storageBucket: "feelify-a87a8.appspot.com",
  messagingSenderId: "671836406403",
  appId: "1:671836406403:web:2dc123938c36609d4111b6",
  measurementId: "G-YP9WZFSJYF"
};

// 🔹 Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔹 Export services used in your app
export const auth = getAuth(app);       // for login / logout / guest
export const storage = getStorage(app); // for user profile image uploads

// 🔹 Optional: Initialize analytics safely (only in browser)
export let analytics = null;
if (typeof window !== "undefined") {
  isSupported()
    .then((yes) => {
      if (yes) analytics = getAnalytics(app);
    })
    .catch(() => {
      console.log("Analytics not supported in this environment.");
    });
}
export const db = getFirestore(app);
export default app;