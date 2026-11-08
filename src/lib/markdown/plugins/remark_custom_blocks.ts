/**
 * VMD Remark Custom Blocks Plugin
 * Maps code fences with languages 'mermaid' and 'echarts'/'chart'
 * into dedicated interactive component container tags for rehype.
 */

import type { Root, Code } from 'mdast';
import type { Plugin } from 'unified';

export const remarkCustomBlocks: Plugin<[], Root> = () => {
  return (tree: Root) => {
    for (let i = 0; i < tree.children.length; i++) {
      const node = tree.children[i];
      if (node.type !== 'code') continue;

      const codeNode = node as Code;
      const lang = (codeNode.lang || '').toLowerCase();

      if (lang === 'mermaid') {
        codeNode.data = {
          ...codeNode.data,
          hName: 'div',
          hProperties: {
            className: ['vmd-mermaid-block'],
            'data-mermaid-code': encodeURIComponent(codeNode.value),
          },
        };
      } else if (lang === 'echarts' || lang === 'chart') {
        codeNode.data = {
          ...codeNode.data,
          hName: 'div',
          hProperties: {
            className: ['vmd-echarts-block'],
            'data-chart-config': codeNode.value,
          },
          hChildren: [],
        };
      }
    }
  };
};
