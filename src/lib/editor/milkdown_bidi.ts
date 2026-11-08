/**
 * Milkdown / ProseMirror Bidirectional Configuration
 * Ensures block-level dir="auto" and inline code/math isolation.
 */

import { Plugin, PluginKey } from 'prosemirror-state';
import { detectDirection, isForcedLTR } from '../typography/bidi';

export const bidiPluginKey = new PluginKey('vmd-bidi');

/**
 * ProseMirror plugin that automatically detects text direction
 * and sets the dir attribute on blocks when content changes.
 */
export function proseMirrorBidiPlugin(): Plugin {
  return new Plugin({
    key: bidiPluginKey,
    appendTransaction(transactions, _oldState, newState) {
      // Check if any transaction modified the document
      const docChanged = transactions.some((tr) => tr.docChanged);
      if (!docChanged) return null;

      let tr = newState.tr;
      let modified = false;

      newState.doc.forEach((node, offset) => {
        if (!node.isBlock) return;

        // Forced LTR blocks (code_block, math_block)
        if (isForcedLTR(node.type.name)) {
          if (node.attrs.dir !== 'ltr') {
            tr = tr.setNodeMarkup(offset, undefined, { ...node.attrs, dir: 'ltr' });
            modified = true;
          }
          return;
        }

        // Text blocks: detect from content
        const text = node.textContent;
        const targetDir = text ? detectDirection(text) : 'auto';
        if (node.attrs.dir !== targetDir) {
          tr = tr.setNodeMarkup(offset, undefined, { ...node.attrs, dir: targetDir });
          modified = true;
        }
      });

      return modified ? tr : null;
    },
  });
}
