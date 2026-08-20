import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

const firebaseEnv: Record<string, string> = {
  VITE_APP_FIREBASE_API_KEY: 'test-api-key',
  VITE_APP_FIREBASE_AUTH_DOMAIN: 'test.firebaseapp.com',
  VITE_APP_FIREBASE_PROJECT_ID: 'test-project',
  VITE_APP_FIREBASE_STORAGE_BUCKET: 'test-project.appspot.com',
  VITE_APP_FIREBASE_MESSAGING_SENDER_ID: '000000000000',
  VITE_APP_FIREBASE_APP_ID: '1:000000000000:web:0000000000000000000000',
};

for (const [key, value] of Object.entries(firebaseEnv)) {
  vi.stubEnv(key, value);
}
