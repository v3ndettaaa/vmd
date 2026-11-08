/**
 * CodeMirror 6 Extension Assembly
 * Combines Markdown language, bidi support, history, and theme.
 */

import { type Extension } from '@codemirror/state';
import { EditorView, lineNumbers, highlightActiveLine, highlightActiveLineGutter, keymap } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { markdown } from '@codemirror/lang-markdown';
import { searchKeymap, highlightSelectionMatches } from '@codemirror/search';
import { bidiExtension } from '../../editor/codemirror_bidi';
import { createEditorTheme } from './codemirror_theme';

export interface EditorCallbacks {
  onChange?: (value: string) => void;
  onCursor?: (pos: { line: number; col: number; lines: number; chars: number; words: number }) => void;
}

export function buildEditorExtensions(callbacks: EditorCallbacks = {}): Extension[] {
  const updateListener = EditorView.updateListener.of((update) => {
    if (update.docChanged && callbacks.onChange) {
      callbacks.onChange(update.state.doc.toString());
    }

    if (callbacks.onCursor && (update.selectionSet || update.docChanged)) {
      const doc = update.state.doc;
      const head = update.state.selection.main.head;
      const line = doc.lineAt(head);
      const text = doc.toString();
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;

      callbacks.onCursor({
        line: line.number,
        col: head - line.from + 1,
        lines: doc.lines,
        chars: doc.length,
        words,
      });
    }
  });

  return [
    lineNumbers(),
    highlightActiveLineGutter(),
    highlightActiveLine(),
    history(),
    highlightSelectionMatches(),
    markdown(),
    bidiExtension(),
    createEditorTheme(),
    updateListener,
    keymap.of([
      ...defaultKeymap,
      ...historyKeymap,
      ...searchKeymap,
    ]),
    EditorView.lineWrapping,
  ];
}
