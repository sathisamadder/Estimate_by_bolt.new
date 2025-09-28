import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// NOTE: we intentionally do NOT import firebase/analytics at module top-level.
// Importing firebase/analytics eagerly can trigger network calls during SSR or
// dev server hot-reloads which sometimes leads to "body stream already read"
// errors in the analytics package. Instead provide a lazy initializer.

// Firebase configuration - switched to estimator-5823 as requested
const firebaseConfig = {
  apiKey: "AIzaSyD4ZF5-QApD-JAzGZvwkVSKR3PyPEYgaBk",
  authDomain: "estimator-5823.firebaseapp.com",
  databaseURL:
    "https://estimator-5823-default-rtdb.asia-southeast1.firebasedatabase.app",
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

// Lazy initializer for Analytics. Call this from client-only code when you
// actually need analytics. It memoizes the instance on window to avoid
// duplicate initialization and the associated errors.
export async function initAnalytics(): Promise<any | null> {
  if (typeof window === "undefined") return null;
  const win = window as any;
  if (win.__firebase_analytics_instance)
    return win.__firebase_analytics_instance;
  try {
    const analyticsModule = await import("firebase/analytics");
    // Check support if available
    if (typeof analyticsModule.isSupported === "function") {
      try {
        const supported = await analyticsModule.isSupported();
        if (!supported) return null;
      } catch (err) {
        // ignore and attempt to initialize
      }
    }
    const instance = analyticsModule.getAnalytics(app);
    win.__firebase_analytics_instance = instance;
    return instance;
  } catch (e) {
    console.warn("Analytics disabled:", e);
    return null;
  }
}

export default app;
