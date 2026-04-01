import * as dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

dotenv.config();

// https://firebase.google.com/docs/web/setup#available-libraries
const apikey = process.env.VITE_APP_FIREBASE_API_KEY ?? '';
const authdomain = process.env.VITE_APP_FIREBASE_AUTH_DOMAIN ?? '';
const projectid = process.env.VITE_APP_FIREBASE_PROJECT_ID ?? '';
const storagebucket = process.env.VITE_APP_FIREBASE_STORAGE_BUCKET ?? '';
const messagingsenderid =
  process.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID ?? '';
const appid = process.env.VITE_APP_FIREBASE_APP_ID ?? '';
const measurementid = process.env.VITE_APP_FIREBASE_MEASUREMENT_ID ?? '';
// Firebase configuration
// measurementId is optional for Firebase JS SDK v7.20.0 and later
const firebaseConfig = {
  apiKey: apikey,
  authDomain: authdomain,
  projectId: projectid,
  storageBucket: storagebucket,
  messagingSenderId: messagingsenderid,
  appId: appid,
  measurementId: measurementid,
};

// make sure the configuration object is defined
if (!firebaseConfig) {
  throw new Error(`please check the configuration object for firebase. the
  configuration object is currently undefined`);
}

// initialize firebase
const app = initializeApp(firebaseConfig);
// initialize authentication
export const auth = getAuth(app);
