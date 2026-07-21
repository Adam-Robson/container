import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import {
  signInWithGithub,
  signInWithGoogle,
  signOutUser,
} from '../services/auth';

vi.mock('../services/config', () => ({ auth: {} }));

vi.mock('firebase/auth', () => {
  const GoogleAuthProvider = Object.assign(function GoogleAuthProvider() {}, {
    credentialFromResult: vi.fn(),
  });
  const GithubAuthProvider = Object.assign(function GithubAuthProvider() {}, {
    credentialFromResult: vi.fn(),
  });
  return {
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithPopup: vi.fn(),
    signOut: vi.fn(),
  };
});

describe('services/auth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('signInWithGoogle returns the signed-in user and access token', async () => {
    const user = { uid: 'google-user' };
    // biome-ignore lint/suspicious/noExplicitAny: partial firebase mock
    vi.mocked(signInWithPopup).mockResolvedValue({ user } as any);
    vi.mocked(GoogleAuthProvider.credentialFromResult).mockReturnValue({
      accessToken: 'google-token',
      // biome-ignore lint/suspicious/noExplicitAny: partial firebase mock
    } as any);

    const result = await signInWithGoogle();

    expect(result).toEqual({ user, token: 'google-token' });
  });

  test('signInWithGoogle swallows popup errors and logs them', async () => {
    vi.mocked(signInWithPopup).mockRejectedValue(new Error('popup closed'));
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const result = await signInWithGoogle();

    expect(result).toBeUndefined();
    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });

  test('signInWithGithub returns the signed-in user and access token', async () => {
    const user = { uid: 'github-user' };
    // biome-ignore lint/suspicious/noExplicitAny: partial firebase mock
    vi.mocked(signInWithPopup).mockResolvedValue({ user } as any);
    vi.mocked(GithubAuthProvider.credentialFromResult).mockReturnValue({
      accessToken: 'github-token',
      // biome-ignore lint/suspicious/noExplicitAny: partial firebase mock
    } as any);

    const result = await signInWithGithub();

    expect(result).toEqual({ user, token: 'github-token' });
  });

  test('signOutUser calls firebase signOut', async () => {
    vi.mocked(signOut).mockResolvedValue(undefined);

    await signOutUser();

    expect(signOut).toHaveBeenCalledWith({});
  });
});
