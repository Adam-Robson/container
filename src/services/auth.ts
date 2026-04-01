import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

import { auth } from '../services/config';

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    const user = result.user;
    return { user, token };
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        `There was an error while signing in with Google: ${error.message}`,
      );
    }
  }
}

export async function signInWithGithub() {
  const provider = new GithubAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GithubAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    const user = result.user;
    return { user, token };
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        `There was an error while signing in with Github: ${error.message}`,
      );
    }
  }
}

export async function signOutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`There was an error while signing out: ${error.message}`);
    }
  }
}
