import type { User } from 'firebase/auth';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import type { AuthContextType } from '../lib/auth-types';
import actionValidator from '../middlewares/actionValidator';
import { authReducer, initialAuthState } from '../reducer/auth';
import logger from '../reducer/logger';
import { signInWithGithub, signInWithGoogle } from '../services/auth';
import { auth } from '../services/config';

export const AuthContext = createContext<AuthContextType | null>(null);

// Log every dispatched action and resulting state in development only.
const reducer = import.meta.env.DEV ? logger(authReducer) : authReducer;

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, rawDispatch] = useReducer(reducer, initialAuthState);
  const dispatch = useMemo(() => actionValidator(rawDispatch), []);

  const [storedUser, setStoredUser] = useLocalStorage<User | null>(
    'authUser',
    null,
  );

  useEffect(() => {
    if (storedUser) {
      dispatch({ type: 'LOGIN', payload: storedUser });
      dispatch({ type: 'SET_LOADING', payload: false });
    } else {
      const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
        if (user) {
          dispatch({ type: 'LOGIN', payload: user });
          setStoredUser(user);
        } else {
          dispatch({ type: 'LOGOUT' });
          setStoredUser(null);
        }
        dispatch({ type: 'SET_LOADING', payload: false });
      });

      return () => unsubscribe();
    }
  }, [storedUser, setStoredUser, dispatch]);

  const loginWithGoogle = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await signInWithGoogle();
    } catch (error) {
      if (error instanceof Error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    }
  };

  const loginWithGithub = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await signInWithGithub();
    } catch (error) {
      if (error instanceof Error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    }
  };

  // Function to handle logout
  const logout = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await signOut(auth);
      dispatch({ type: 'LOGOUT' });
      setStoredUser(null);
    } catch (error) {
      if (error instanceof Error) {
        dispatch({ type: 'SET_ERROR', payload: error.message });
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{ state, loginWithGoogle, loginWithGithub, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth };
