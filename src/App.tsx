import { NavLink, Outlet } from 'react-router-dom';
import './App.css';

export default function App() {
  return (
    <>
      <header className="app-header">
        <NavLink to="/" className="app-header__brand" data-testid="brand">
          container
        </NavLink>
        <nav className="app-header__nav">
          <NavLink to="/">Home</NavLink>
        </nav>
      </header>

      <main className="app-main">
        <Outlet />
      </main>
    </>
  );
}
