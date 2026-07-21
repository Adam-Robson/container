import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { AuthProvider, useAuth } from '../contexts/AuthProvider';

const onAuthStateChangedMock = vi.fn();

vi.mock('../services/config', () => ({ auth: {} }));

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: (...args: unknown[]) => onAuthStateChangedMock(...args),
  signOut: vi.fn(),
}));

vi.mock('../services/auth', () => ({
  signInWithGoogle: vi.fn(),
  signInWithGithub: vi.fn(),
}));

function TestConsumer() {
  const { state } = useAuth();
  return (
    <div>
      <span data-testid="loading">{String(state.loading)}</span>
      <span data-testid="user">{state.user ? state.user.uid : 'none'}</span>
    </div>
  );
}

describe('AuthProvider', () => {
  beforeEach(() => {
    window.localStorage.clear();
    onAuthStateChangedMock.mockReset();
  });

  test('resolves to logged-out state when firebase reports no user', async () => {
    onAuthStateChangedMock.mockImplementation((_auth, callback) => {
      callback(null);
      return () => {};
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });
    expect(screen.getByTestId('user')).toHaveTextContent('none');
  });

  test('hydrates from a previously stored user without calling firebase', () => {
    window.localStorage.setItem(
      'authUser',
      JSON.stringify({ uid: 'stored-user' }),
    );

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    expect(screen.getByTestId('user')).toHaveTextContent('stored-user');
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
    expect(onAuthStateChangedMock).not.toHaveBeenCalled();
  });

  test('useAuth throws when used outside an AuthProvider', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    expect(() => render(<TestConsumer />)).toThrow(
      'useAuth must be used within an AuthProvider',
    );

    consoleError.mockRestore();
  });
});
