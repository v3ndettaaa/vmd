/**
 * VMD ProseMirror Schema & Node Definitions
 * Supports source map metadata attachment for surgical non-destructive synchronization.
 */

import { Schema, type Node as ProseNode, type DOMOutputSpec } from 'prosemirror-model';

export interface BlockAttrs {
  blockId: string;
  sourceHash: string;
  sourceFrom: number;
  sourceTo: number;
  [key: string]: unknown;
}

export const vmdSchema = new Schema({
  nodes: {
    doc: {
      content: 'block+',
    },
    paragraph: {
      group: 'block',
      content: 'inline*',
      attrs: {
        blockId: { default: '' },
        sourceHash: { default: '' },
        sourceFrom: { default: 0 },
        sourceTo: { default: 0 },
        dir: { default: 'auto' },
      },
      parseDOM: [{ tag: 'p' }],
      toDOM(node): DOMOutputSpec {
        return ['p', {
          'data-block-id': node.attrs.blockId,
          'dir': node.attrs.dir || 'auto',
        }, 0];
      },
    },
    heading: {
      group: 'block',
      content: 'inline*',
      attrs: {
        level: { default: 1 },
        blockId: { default: '' },
        sourceHash: { default: '' },
        sourceFrom: { default: 0 },
        sourceTo: { default: 0 },
        dir: { default: 'auto' },
      },
      defining: true,
      parseDOM: [
        { tag: 'h1', attrs: { level: 1 } },
        { tag: 'h2', attrs: { level: 2 } },
        { tag: 'h3', attrs: { level: 3 } },
        { tag: 'h4', attrs: { level: 4 } },
        { tag: 'h5', attrs: { level: 5 } },
        { tag: 'h6', attrs: { level: 6 } },
      ],
      toDOM(node): DOMOutputSpec {
        return [`h${node.attrs.level}`, {
          'data-block-id': node.attrs.blockId,
          'dir': node.attrs.dir || 'auto',
        }, 0];
      },
    },
    code_block: {
      group: 'block',
      content: 'text*',
      marks: '',
      code: true,
      defining: true,
      attrs: {
        params: { default: '' },
        blockId: { default: '' },
        sourceHash: { default: '' },
        sourceFrom: { default: 0 },
        sourceTo: { default: 0 },
        dir: { default: 'ltr' },
      },
      parseDOM: [{ tag: 'pre', preserveWhitespace: 'full' }],
      toDOM(node): DOMOutputSpec {
        return ['pre', {
          'data-block-id': node.attrs.blockId,
          'data-params': node.attrs.params,
          'dir': 'ltr',
        }, ['code', 0]];
      },
    },
    math_block: {
      group: 'block',
      content: 'text*',
      marks: '',
      code: true,
      defining: true,
      attrs: {
        blockId: { default: '' },
        sourceHash: { default: '' },
        sourceFrom: { default: 0 },
        sourceTo: { default: 0 },
        dir: { default: 'ltr' },
      },
      parseDOM: [{ tag: 'div[data-type="math-block"]' }],
      toDOM(node): DOMOutputSpec {
        return ['div', {
          'data-type': 'math-block',
          'data-block-id': node.attrs.blockId,
          'dir': 'ltr',
        }, 0];
      },
    },
    blockquote: {
      group: 'block',
      content: 'block+',
      attrs: {
        blockId: { default: '' },
        sourceHash: { default: '' },
        sourceFrom: { default: 0 },
        sourceTo: { default: 0 },
        dir: { default: 'auto' },
      },
      parseDOM: [{ tag: 'blockquote' }],
      toDOM(node): DOMOutputSpec {
        return ['blockquote', {
          'data-block-id': node.attrs.blockId,
          'dir': node.attrs.dir || 'auto',
        }, 0];
      },
    },
    unsupported_block: {
      group: 'block',
      attrs: {
        blockId: { default: '' },
        sourceHash: { default: '' },
        sourceFrom: { default: 0 },
        sourceTo: { default: 0 },
        blockType: { default: 'unsupported' },
        raw: { default: '' },
      },
      parseDOM: [{ tag: 'div[data-type="unsupported-block"]' }],
      toDOM(node): DOMOutputSpec {
        return ['div', {
          'data-type': 'unsupported-block',
          'data-block-id': node.attrs.blockId,
          'data-block-type': node.attrs.blockType,
        }, node.attrs.raw];
      },
    },
    text: {
      group: 'inline',
    },
  },
  marks: {
    strong: {
      parseDOM: [{ tag: 'strong' }, { tag: 'b' }],
      toDOM(): DOMOutputSpec {
        return ['strong', 0];
      },
    },
    em: {
      parseDOM: [{ tag: 'em' }, { tag: 'i' }],
      toDOM(): DOMOutputSpec {
        return ['em', 0];
      },
    },
    code: {
      parseDOM: [{ tag: 'code' }],
      toDOM(): DOMOutputSpec {
        return ['code', { dir: 'ltr' }, 0];
      },
    },
  },
});
