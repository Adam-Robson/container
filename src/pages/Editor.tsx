import './Editor.css';

/**
 * Mount point for editor.
 */
export default function EditorPage() {
  return (
    <div className="editor">
      <aside className="editor__sidebar">
        <p className="editor__placeholder-text">File tree</p>
      </aside>
      <section className="editor__surface">
        <p className="editor__placeholder-text">Editor mounts here</p>
      </section>
    </div>
  );
}
