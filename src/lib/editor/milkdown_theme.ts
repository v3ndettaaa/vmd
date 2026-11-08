/**
 * Milkdown / ProseMirror Headless Theme Styling
 * Applies VMD design tokens to ProseMirror live editor surface.
 */

export const milkdownThemeCss = `
  .milkdown {
    height: 100%;
    overflow-y: auto;
    padding: 32px 48px;
    background: var(--bg-primary, #0d0d11);
    color: var(--text-primary, #e2e8f0);
    font-size: 15px;
    line-height: 1.7;
    outline: none;
  }

  .milkdown .ProseMirror {
    outline: none;
    min-height: 100%;
    max-width: 800px;
    margin: 0 auto;
  }

  .milkdown .ProseMirror-selectednode {
    outline: 2px solid var(--accent-primary, #818cf8);
    border-radius: 4px;
  }

  .milkdown h1,
  .milkdown h2,
  .milkdown h3,
  .milkdown h4,
  .milkdown h5,
  .milkdown h6 {
    color: var(--text-primary, #ffffff);
    margin-top: 1.5em;
    margin-bottom: 0.5em;
    font-weight: 600;
  }

  .milkdown h1 { font-size: 1.85em; border-bottom: 1px solid var(--border-subtle, #272732); padding-bottom: 0.3em; }
  .milkdown h2 { font-size: 1.5em; border-bottom: 1px solid var(--border-subtle, #272732); padding-bottom: 0.3em; }
  .milkdown h3 { font-size: 1.25em; }

  .milkdown blockquote {
    border-left: 4px solid var(--accent-primary, #818cf8);
    margin: 1.25em 0;
    padding: 0.5em 1em;
    background: rgba(255, 255, 255, 0.02);
    color: var(--text-muted, #94a3b8);
  }

  .milkdown pre {
    background: var(--code-bg, #121217);
    border: 1px solid var(--border-subtle, #272732);
    border-radius: 8px;
    padding: 14px 18px;
    overflow-x: auto;
    font-family: 'JetBrains Mono', monospace;
    font-size: 13.5px;
    direction: ltr;
  }

  .milkdown code {
    background: rgba(255, 255, 255, 0.08);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.9em;
  }

  .milkdown table {
    border-collapse: collapse;
    width: 100%;
    margin: 1.5em 0;
  }

  .milkdown th,
  .milkdown td {
    border: 1px solid var(--border-subtle, #272732);
    padding: 8px 12px;
  }

  .milkdown th {
    background: var(--bg-secondary, #16161c);
  }
`;
