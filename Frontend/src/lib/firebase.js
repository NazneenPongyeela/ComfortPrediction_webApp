import { initializeApp } from "firebase/app";
import {
  getAuth,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let cachedApp = null;
let cachedAuth = null;

const getFirebaseApp = () => {
  if (cachedApp) {
    return cachedApp;
  }

  cachedApp = initializeApp(firebaseConfig);
  return cachedApp;
};

const getFirebaseAuth = () => {
  if (cachedAuth) {
    return cachedAuth;
  }

  const app = getFirebaseApp();
  cachedAuth = getAuth(app);
  return cachedAuth;
};

export const signOutUser = async () => {
  const firebaseAuth = getFirebaseAuth();
  await signOut(firebaseAuth);
  localStorage.removeItem("idToken");
  sessionStorage.removeItem("idToken");
};

export const signInUser = async (email, password) => {
  const firebaseAuth = getFirebaseAuth();
  return signInWithEmailAndPassword(firebaseAuth, email, password);
};

export const auth = {
  get current() {
    return getFirebaseAuth();
  },
};
