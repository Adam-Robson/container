import { FirebaseError } from 'firebase/app';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import type { AuthContextType } from '../lib/auth-types';
import { authReducer, initialAuthState } from '../reducer/auth';
import {
  signInAsGuest,
  signInWithGithub,
  signInWithGoogle,
  signOutUser,
} from '../services/auth';
import { auth } from '../services/config';

export const AuthContext = createContext<AuthContextType | null>(null);

/** Dismiss sign-in popup. */
const CANCELLED_BY_USER = new Set([
  'auth/popup-closed-by-user',
  'auth/cancelled-popup-request',
  'auth/user-cancelled',
]);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  // Firebase persists the session (IndexedDB by default);
  // single source of truth.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      dispatch(user ? { type: 'LOGIN', payload: user } : { type: 'LOGOUT' });
    });

    return unsubscribe;
  }, []);

  const run = useCallback(async (action: () => Promise<unknown>) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await action();
      // clear the loading flag when session settles
    } catch (error) {
      if (error instanceof FirebaseError && CANCELLED_BY_USER.has(error.code)) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }
      dispatch({
        type: 'SET_ERROR',
        payload:
          error instanceof Error ? error.message : 'Authentication failed.',
      });
    }
  }, []);

  const loginWithGoogle = useCallback(() => run(signInWithGoogle), [run]);
  const loginWithGithub = useCallback(() => run(signInWithGithub), [run]);
  const loginAsGuest = useCallback(() => run(signInAsGuest), [run]);
  const logout = useCallback(() => run(signOutUser), [run]);

  const value = useMemo(
    () => ({ state, loginWithGoogle, loginWithGithub, loginAsGuest, logout }),
    [state, loginWithGoogle, loginWithGithub, loginAsGuest, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth };
