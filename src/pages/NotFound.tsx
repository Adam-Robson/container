import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="container" style={{ paddingBlock: 'var(--space-xl)' }}>
      <h1>404</h1>
      <p style={{ marginBlock: 'var(--space-md)' }}>Page does not exist.</p>
      <Link to="/">Back home</Link>
    </section>
  );
}
