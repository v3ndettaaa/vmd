/**
 * CodeMirror 6 Bidirectional Extension
 * Configures dynamic line direction and bidi isolation for mixed Persian/English text.
 */

import { type Extension } from '@codemirror/state';
import { EditorView, ViewPlugin, type ViewUpdate, Decoration, type DecorationSet } from '@codemirror/view';
import { detectDirection } from '../typography/bidi';

/**
 * Creates line decorations setting dir="rtl" or dir="ltr" per line
 */
function buildLineDecorations(view: EditorView): DecorationSet {
  const widgets = [];
  for (const { from, to } of view.visibleRanges) {
    let pos = from;
    while (pos <= to) {
      const line = view.state.doc.lineAt(pos);
      const text = line.text;
      const dir = detectDirection(text);
      if (dir === 'rtl') {
        widgets.push(
          Decoration.line({
            attributes: { dir: 'rtl', class: 'cm-line-rtl' },
          }).range(line.from)
        );
      } else {
        widgets.push(
          Decoration.line({
            attributes: { dir: 'ltr', class: 'cm-line-ltr' },
          }).range(line.from)
        );
      }
      pos = line.to + 1;
    }
  }
  return Decoration.set(widgets, true);
}

const bidiPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = buildLineDecorations(view);
    }

    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged) {
        this.decorations = buildLineDecorations(update.view);
      }
    }
  },
  {
    decorations: (v) => v.decorations,
  }
);

/**
 * Exported bidi configuration extension for CodeMirror 6
 */
export function bidiExtension(): Extension {
  return [
    bidiPlugin,
    EditorView.theme({
      '.cm-line-rtl': {
        direction: 'rtl',
        textAlign: 'right',
      },
      '.cm-line-ltr': {
        direction: 'ltr',
        textAlign: 'left',
      },
      '.cm-content': {
        unicodeBidi: 'plaintext',
      },
    }),
  ];
}
