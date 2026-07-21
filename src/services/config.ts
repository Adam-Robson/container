import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// https://firebase.google.com/docs/web/setup#available-libraries
// Vite only exposes env vars prefixed with VITE_ on import.meta.env, and
// inlines them at build time - there is no process.env in browser code.
const requiredEnv = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_FIREBASE_APP_ID,
};

const missingKeys = Object.entries(requiredEnv)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingKeys.length > 0) {
  throw new Error(
    `Missing required Firebase environment variables: ${missingKeys.join(', ')}. ` +
      'Copy .env.example to .env and fill in your Firebase project settings.',
  );
}

// measurementId is optional for Firebase JS SDK v7.20.0 and later
const firebaseConfig = {
  ...requiredEnv,
  measurementId: import.meta.env.VITE_APP_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
