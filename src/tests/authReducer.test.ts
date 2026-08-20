import type { User } from 'firebase/auth';
import { describe, expect, test } from 'vitest';
import { authReducer, initialAuthState } from '../reducer/auth';

const mockUser = { uid: '123' } as User;

describe('authReducer', () => {
  test('LOGIN sets the user, clears loading and error', () => {
    const state = authReducer(
      { ...initialAuthState, error: 'oops' },
      { type: 'LOGIN', payload: mockUser },
    );
    expect(state).toEqual({ user: mockUser, loading: false, error: null });
  });

  test('LOGOUT clears the user', () => {
    const state = authReducer(
      { user: mockUser, loading: false, error: null },
      { type: 'LOGOUT' },
    );
    expect(state).toEqual({ user: null, loading: false, error: null });
  });

  test('SET_LOADING updates the loading flag', () => {
    const state = authReducer(initialAuthState, {
      type: 'SET_LOADING',
      payload: false,
    });
    expect(state.loading).toBe(false);
  });

  test('SET_ERROR sets the error and clears loading', () => {
    const state = authReducer(initialAuthState, {
      type: 'SET_ERROR',
      payload: 'failed',
    });
    expect(state.error).toBe('failed');
    expect(state.loading).toBe(false);
  });

  test('unknown action types return the state unchanged', () => {
    // @ts-expect-error deliberately passing an invalid action type
    const state = authReducer(initialAuthState, { type: 'NOOP' });
    expect(state).toBe(initialAuthState);
  });
});
