const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let cachedAuth = null;
let cachedSignOut = null;
let cachedSignIn = null;

const loadFirebaseAuth = async () => {
  if (cachedAuth && cachedSignOut && cachedSignIn) {
    return {
      auth: cachedAuth,
      signOut: cachedSignOut,
      signInWithEmailAndPassword: cachedSignIn,
    };
  }

  const firebaseAppPath = "firebase/" + "app";
  const firebaseAuthPath = "firebase/" + "auth";
  const dynamicImport = new Function("path", "return import(path);");
  const appModule = await dynamicImport(firebaseAppPath).catch(() => null);
  const authModule = await dynamicImport(firebaseAuthPath).catch(() => null);

  if (!appModule || !authModule) {
    return null;
  }

  const app = appModule.initializeApp(firebaseConfig);
  cachedAuth = authModule.getAuth(app);
  cachedSignOut = authModule.signOut;
  cachedSignIn = authModule.signInWithEmailAndPassword;

  return {
    auth: cachedAuth,
    signOut: cachedSignOut,
    signInWithEmailAndPassword: cachedSignIn,
  };
};

export const signOutUser = async () => {
  const firebase = await loadFirebaseAuth();

  if (!firebase) {
    return;
  }

  await firebase.signOut(firebase.auth);
};

export const signInUser = async (email, password) => {
  const firebase = await loadFirebaseAuth();

  if (!firebase?.signInWithEmailAndPassword) {
    throw new Error("Firebase authentication is unavailable.");
  }

  return firebase.signInWithEmailAndPassword(firebase.auth, email, password);
};

export const auth = {
  get current() {
    return cachedAuth;
  },
};