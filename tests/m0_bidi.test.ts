import { describe, it, expect } from 'vitest';
import { detectDirection, isForcedLTR, isolateInline } from '../src/lib/typography/bidi';
import { proseMirrorBidiPlugin } from '../src/lib/editor/milkdown_bidi';
import { bidiExtension } from '../src/lib/editor/codemirror_bidi';
import { vmdSchema } from '../src/lib/editor/prosemirror_nodes';
import { EditorState } from 'prosemirror-state';

describe('Task M0.3: RTL & Persian Bidirectional Editing Proof', () => {
  it('detects text direction correctly based on Unicode Rule P2', () => {
    // Pure Persian
    expect(detectDirection('سلام دنیا!')).toBe('rtl');

    // Pure English
    expect(detectDirection('Hello world!')).toBe('ltr');

    // Mixed Persian starting sentence
    expect(detectDirection('نسخه 2.0 نرم‌افزار VMD منتشر شد.')).toBe('rtl');

    // Mixed English starting sentence
    expect(detectDirection('VMD version 2.0 has been released with پشتیبانی فارسی.')).toBe('ltr');

    // Weak characters prefix (spaces, numbers, quotes)
    expect(detectDirection('  "123" سلام')).toBe('rtl');
    expect(detectDirection('  "123" Hello')).toBe('ltr');
  });

  it('strictly forces code, math, and diagram blocks to LTR', () => {
    expect(isForcedLTR('code')).toBe(true);
    expect(isForcedLTR('code_block')).toBe(true);
    expect(isForcedLTR('math')).toBe(true);
    expect(isForcedLTR('math_block')).toBe(true);
    expect(isForcedLTR('mermaid')).toBe(true);
    expect(isForcedLTR('echarts')).toBe(true);

    expect(isForcedLTR('paragraph')).toBe(false);
    expect(isForcedLTR('heading')).toBe(false);
  });

  it('applies Unicode directional isolation correctly', () => {
    const isolatedLtr = isolateInline('VMD 2.0', 'ltr');
    expect(isolatedLtr.charCodeAt(0)).toBe(0x2066); // LRI
    expect(isolatedLtr.charCodeAt(isolatedLtr.length - 1)).toBe(0x2069); // PDI

    const isolatedRtl = isolateInline('سلام', 'rtl');
    expect(isolatedRtl.charCodeAt(0)).toBe(0x2067); // RLI
    expect(isolatedRtl.charCodeAt(isolatedRtl.length - 1)).toBe(0x2069); // PDI
  });

  it('updates ProseMirror block directions dynamically via plugin transaction', () => {
    const plugin = proseMirrorBidiPlugin();
    const doc = vmdSchema.nodes.doc.create({}, [
      vmdSchema.nodes.paragraph.create({ dir: 'ltr' }, [vmdSchema.text('متن فارسی جدید')]),
      vmdSchema.nodes.code_block.create({ dir: 'rtl' }, [vmdSchema.text('console.log("hello");')]),
    ]);

    const state = EditorState.create({
      schema: vmdSchema,
      doc,
      plugins: [plugin],
    });

    // Dispatch an appendTransaction
    const tr = state.tr.insertText('!', 1);
    const newState = state.apply(tr);

    // After transaction, paragraph with Persian text is updated to rtl, and code block is forced to ltr
    const pNode = newState.doc.child(0);
    const codeNode = newState.doc.child(1);

    expect(pNode.attrs.dir).toBe('rtl');
    expect(codeNode.attrs.dir).toBe('ltr');
  });

  it('provides valid CodeMirror 6 extension without exceptions', () => {
    const ext = bidiExtension();
    expect(Array.isArray(ext)).toBe(true);
    expect(ext.length).toBeGreaterThan(0);
  });
});
