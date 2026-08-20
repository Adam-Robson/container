import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInAnonymously,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

import { auth } from './config';

/**
 * Authenticate with Google.
 */
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const credential = GoogleAuthProvider.credentialFromResult(result);
  return { user: result.user, token: credential?.accessToken };
}

/**
 * Authenticate with GitHub.
 */
export async function signInWithGithub() {
  const provider = new GithubAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const credential = GithubAuthProvider.credentialFromResult(result);
  // This token is only handed to us here; Firebase does not store or refresh
  // it. Persist it deliberately if repo/gist access is needed later.
  return { user: result.user, token: credential?.accessToken };
}

/**
 * Give access immediately for site visitors.
 */
export async function signInAsGuest() {
  const result = await signInAnonymously(auth);
  return { user: result.user };
}

export async function signOutUser() {
  await signOut(auth);
}
