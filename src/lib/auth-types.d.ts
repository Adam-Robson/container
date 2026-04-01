import { User } from 'firebase/auth';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface Action {
  type: string;
  payload: User | boolean | string;
}

export type AuthAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string };

// interface AuthContextType {
//   state: AuthState;
//   loginWithGoogle: () => Promise<void>;
//   loginWithGithub: () => Promise<void>;
//   logout: () => Promise<void>;
//   // register: (email: string, password: string) => Promise<void>;
// }
