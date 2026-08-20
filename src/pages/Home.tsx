import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <section className="container" style={{ paddingBlock: 'var(--space-xl)' }}>
      <h1>container</h1>
      <p style={{ marginBlock: 'var(--space-md)' }}>
        Write JavaScript and TypeScript in the browser, then download it as a
        ready-to-run project.
      </p>
      <Link className="btn" to="/editor">
        Open the editor
      </Link>
    </section>
  );
}
