import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD4ZF5-QApD-JAzGZvwkVSKR3PyPEYgaBk",
  authDomain: "estimator-5823.firebaseapp.com",
  databaseURL: "https://estimator-5823-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "estimator-5823",
  storageBucket: "estimator-5823.firebasestorage.app",
  messagingSenderId: "1065304966389",
  appId: "1:1065304966389:web:d31e0ef01b89c88484f1bc",
  measurementId: "G-KE3EDJDVB6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Analytics (guard against unsupported environments)
export const analytics = (() => {
  if (typeof window === "undefined") return null;
  try {
    return getAnalytics(app);
  } catch (e) {
    console.warn("Analytics disabled:", e);
    return null;
  }
})();

export default app;
