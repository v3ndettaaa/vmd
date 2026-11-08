/**
 * VMD Remark Callout Plugin
 * Transforms GitHub / Obsidian style callouts (> [!NOTE], > [!WARNING], etc.)
 * into typed callout AST nodes.
 */

import type { Root, Blockquote, Paragraph, Text } from 'mdast';
import type { Plugin } from 'unified';

export type CalloutType = 'note' | 'tip' | 'info' | 'warning' | 'danger' | 'caution' | 'success';

const CALLOUT_REGEX = /^\[!(NOTE|TIP|INFO|WARNING|DANGER|CAUTION|SUCCESS)\]\s*(.*)$/i;

export const remarkCallouts: Plugin<[], Root> = () => {
  return (tree: Root) => {
    for (let i = 0; i < tree.children.length; i++) {
      const node = tree.children[i];
      if (node.type !== 'blockquote') continue;

      const bq = node as Blockquote;
      if (bq.children.length === 0 || bq.children[0].type !== 'paragraph') continue;

      const firstPara = bq.children[0] as Paragraph;
      if (firstPara.children.length === 0 || firstPara.children[0].type !== 'text') continue;

      const firstTextNode = firstPara.children[0] as Text;
      const lines = firstTextNode.value.split('\n');
      const firstLine = lines[0].trim();

      const match = firstLine.match(CALLOUT_REGEX);
      if (match) {
        const calloutType = match[1].toLowerCase() as CalloutType;
        const calloutTitle = match[2].trim() || match[1].toUpperCase();

        // Remove the callout header from the first line
        if (lines.length > 1) {
          firstTextNode.value = lines.slice(1).join('\n');
        } else {
          firstPara.children.shift();
        }

        // Attach data to the blockquote node
        bq.data = {
          ...bq.data,
          hName: 'div',
          hProperties: {
            className: ['callout', `callout-${calloutType}`],
            'data-callout': calloutType,
            'data-callout-title': calloutTitle,
          },
        };
      }
    }
  };
};
