/**
 * CodeMirror 6 Dynamic Theme Extension
 * Bridges VMD theme tokens directly to CodeMirror editor styling.
 */

import { EditorView } from '@codemirror/view';
import { type Extension } from '@codemirror/state';

export function createEditorTheme(): Extension {
  return EditorView.theme({
    '&': {
      backgroundColor: 'var(--bg-primary, #0d0d11)',
      color: 'var(--text-primary, #e2e8f0)',
      height: '100%',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '14px',
    },
    '.cm-scroller': {
      overflow: 'auto',
      fontFamily: 'inherit',
      lineHeight: '1.6',
    },
    '.cm-content': {
      caretColor: 'var(--accent-primary, #818cf8)',
      padding: '16px 20px',
    },
    '.cm-cursor, .cm-dropCursor': {
      borderLeftColor: 'var(--accent-primary, #818cf8)',
      borderLeftWidth: '2px',
    },
    '&.cm-focused .cm-selectionBackground, ::selection': {
      backgroundColor: 'var(--selection-bg, rgba(129, 140, 248, 0.28)) !important',
    },
    '.cm-gutters': {
      backgroundColor: 'var(--bg-secondary, #16161c)',
      color: 'var(--text-muted, #94a3b8)',
      borderRight: '1px solid var(--border-subtle, #272732)',
      userSelect: 'none',
      paddingLeft: '8px',
    },
    '.cm-activeLine': {
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
    },
    '.cm-activeLineGutter': {
      backgroundColor: 'rgba(255, 255, 255, 0.06)',
      color: 'var(--text-primary, #ffffff)',
    },
    '.cm-line': {
      padding: '0 4px',
    },
  });
}
