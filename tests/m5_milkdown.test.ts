import { describe, it, expect } from 'vitest';
import { EditorState } from 'prosemirror-state';
import { vmdSchema } from '../src/lib/editor/prosemirror_nodes';
import { parseToProseMirrorWithSourceMap, patchMarkdownFromProseMirror } from '../src/lib/editor/sync_engine';
import { buildProseMirrorPlugins } from '../src/lib/editor/milkdown_plugins';

describe('Task M5.1: Milkdown 7 & ProseMirror Source-Preserving Patch Sync', () => {
  it('initializes ProseMirror document and preserves block IDs', () => {
    const md = '# Main Heading\n\nFirst paragraph.\n\n```python\nprint(1)\n```';
    const { doc, map } = parseToProseMirrorWithSourceMap(md);

    expect(doc.childCount).toBe(3);
    expect(doc.child(0).attrs.blockId).toBe('block-0');
    expect(doc.child(1).attrs.blockId).toBe('block-1');
    expect(doc.child(2).attrs.blockId).toBe('block-2');

    // Plugins create successfully
    const plugins = buildProseMirrorPlugins({
      originalMd: md,
      map,
      onMarkdownChanged: () => {},
    });

    const state = EditorState.create({
      schema: vmdSchema,
      doc,
      plugins,
    });

    expect(state.doc.childCount).toBe(3);
  });

  it('emits localized patch when modifying a single paragraph', () => {
    const originalMd = '# Title\n\nParagraph 1.\n\nParagraph 2.';
    const { doc, map } = parseToProseMirrorWithSourceMap(originalMd);

    // Modify only paragraph 1
    const p1 = doc.child(1);
    const newP1 = vmdSchema.nodes.paragraph.create(
      p1.attrs,
      [vmdSchema.text('Modified Paragraph One.')]
    );

    const newDoc = vmdSchema.nodes.doc.create({}, [
      doc.child(0),
      newP1,
      doc.child(2),
    ]);

    const patched = patchMarkdownFromProseMirror(originalMd, newDoc, map);

    expect(patched).toContain('Modified Paragraph One.');
    expect(patched).toContain('# Title\n\n');
    expect(patched).toContain('Paragraph 2.');
  });
});
