import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp, getApps, getApp, deleteApp } from "firebase/app";
import { initializeAuth, getAuth, createUserWithEmailAndPassword, type Auth } from "@firebase/auth";
import { getFirestore } from "firebase/firestore";

// @firebase/auth genuinely ships getReactNativePersistence (Metro resolves it correctly at
// runtime via the package's "react-native" export condition), but TypeScript's own conditional
// exports resolution picks the generic, non-RN type declaration first and never sees it as a
// named export. Reaching it via require() sidesteps that gap without touching the real types.
const getReactNativePersistence: (storage: unknown) => any =
  require("@firebase/auth").getReactNativePersistence;

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  throw new Error(
    "Missing Firebase config. Copy .env.example to .env and fill in your Firebase project values."
  );
}

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

let authInstance: Auth;
try {
  authInstance = initializeAuth(firebaseApp, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  // Already initialized (e.g. Fast Refresh during development) -- reuse the existing instance.
  authInstance = getAuth(firebaseApp);
}
export const auth = authInstance;

export const db = getFirestore(firebaseApp);

// Admin needs to create a brand-new login for a member without signing out of their own
// session, and without a paid Cloud Functions plan. The trick: spin up a second, temporary
// Firebase App instance, create the user there (which only signs that user in on the
// secondary app, never touching the primary one the admin is using), then tear it down.
export async function createMemberAuthAccount(email: string, password: string) {
  const secondaryApp = initializeApp(firebaseConfig, `secondary-${Date.now()}`);
  try {
    const secondaryAuth = getAuth(secondaryApp);
    const credential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
    return credential.user.uid;
  } finally {
    await deleteApp(secondaryApp);
  }
}
