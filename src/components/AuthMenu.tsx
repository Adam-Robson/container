import { useAuth } from '../contexts/AuthProvider';

export default function AuthMenu() {
  const { state, loginWithGithub, loginWithGoogle, loginAsGuest, logout } =
    useAuth();

  if (state.loading) {
    return <span className="auth-menu__user">…</span>;
  }

  if (state.user) {
    return (
      <div className="auth-menu">
        <span className="auth-menu__user">
          {state.user.isAnonymous
            ? 'Guest'
            : (state.user.displayName ?? state.user.email)}
        </span>
        <button type="button" className="btn btn--ghost" onClick={logout}>
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="auth-menu">
      <button type="button" className="btn btn--ghost" onClick={loginAsGuest}>
        Continue as guest
      </button>
      <button type="button" className="btn" onClick={loginWithGithub}>
        Sign in with GitHub
      </button>
      <button type="button" className="btn" onClick={loginWithGoogle}>
        Sign in with Google
      </button>
    </div>
  );
}
