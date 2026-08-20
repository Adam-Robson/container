import { NavLink, Outlet } from 'react-router-dom';
import './App.css';
import AuthMenu from './components/AuthMenu';
import { useAuth } from './contexts/AuthProvider';

export default function App() {
  const { state } = useAuth();

  return (
    <>
      <header className="app-header">
        <NavLink to="/" className="app-header__brand" data-testid="container">
          container
        </NavLink>
        <nav className="app-header__nav">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/editor">Editor</NavLink>
        </nav>
        <AuthMenu />
      </header>

      {state.error && (
        <p className="auth-error" role="alert">
          {state.error}
        </p>
      )}

      <main className="app-main">
        <Outlet />
      </main>
    </>
  );
}
