import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { parseBlockMap, isSurrogateOrCombiningBoundary, safeBoundary } from '../src/lib/editor/source_map';
import { parseToProseMirrorWithSourceMap, patchMarkdownFromProseMirror } from '../src/lib/editor/sync_engine';
import { vmdSchema } from '../src/lib/editor/prosemirror_nodes';

describe('Task M0.2: Source-Preserving Patch Synchronization Engine & Adversarial Suite', () => {
  const fixturesDir = resolve(__dirname, 'fixtures/adversarial_suite');
  const fixtureFiles = readdirSync(fixturesDir).filter(f => f.endsWith('.md')).sort();

  it('guarantees zero-edit invariant (100% byte-for-byte identical) on all 54 adversarial fixtures', () => {
    expect(fixtureFiles.length).toBeGreaterThanOrEqual(50);

    for (const file of fixtureFiles) {
      const originalMd = readFileSync(resolve(fixturesDir, file), 'utf-8');
      const { doc, map } = parseToProseMirrorWithSourceMap(originalMd);
      const patchedMd = patchMarkdownFromProseMirror(originalMd, doc, map);

      expect(patchedMd).toBe(originalMd);
    }
  });

  it('guarantees locality invariant when modifying a single heading in a complex document', () => {
    const complexMd = readFileSync(resolve(fixturesDir, '01_zero_edit_complex.md'), 'utf-8');
    const { doc, map } = parseToProseMirrorWithSourceMap(complexMd);

    // Find the heading node
    let headingIndex = -1;
    for (let i = 0; i < doc.childCount; i++) {
      if (doc.child(i).type.name === 'heading') {
        headingIndex = i;
        break;
      }
    }
    expect(headingIndex).toBeGreaterThanOrEqual(0);

    // Modify only the heading text in ProseMirror
    const originalHeading = doc.child(headingIndex);
    const newHeading = vmdSchema.nodes.heading.create(
      originalHeading.attrs,
      [vmdSchema.text('Modified Heading Title')]
    );

    const newChildren = [];
    for (let i = 0; i < doc.childCount; i++) {
      newChildren.push(i === headingIndex ? newHeading : doc.child(i));
    }
    const modifiedDoc = vmdSchema.nodes.doc.create({}, newChildren);

    const patchedMd = patchMarkdownFromProseMirror(complexMd, modifiedDoc, map);

    // Assert the heading was modified
    expect(patchedMd).toContain('# Modified Heading Title');

    // Assert untouched regions remain byte-for-byte identical
    // 1. YAML Frontmatter is untouched
    expect(patchedMd).toContain('---\ntitle: "Document Title"\ntags: [rust, svelte, markdown]\nversion: 1.0.0\n---');
    // 2. HTML comments are untouched
    expect(patchedMd).toContain('<!-- Author: VMD Team -->');
    expect(patchedMd).toContain('<!-- End of document -->');
    // 3. Tilde code fence with attributes is untouched
    expect(patchedMd).toContain('~~~python {1-3} title="test.py"\ndef hello():\n    # Print greeting\n    print("سلام دنیا")\n~~~');
    // 4. Uneven table formatting is untouched
    expect(patchedMd).toContain('| Feature | Status | Notes |');
    expect(patchedMd).toContain('| :--- | :---: | ---: |');
    // 5. LaTeX aligned math environment is untouched
    expect(patchedMd).toContain('\\nabla \\times \\vec{\\mathbf{B}}');
  });

  it('validates UTF-16 code-unit offsets and surrogate/combining boundary safety', () => {
    const textWithEmojiAndPersian = 'سلام 🚀 دوستان َ (فتحه)';

    // Surrogate pair for 🚀 (\uD83D \uDE80)
    const rocketIndex = textWithEmojiAndPersian.indexOf('🚀');
    expect(isSurrogateOrCombiningBoundary(textWithEmojiAndPersian, rocketIndex + 1)).toBe(true);
    expect(safeBoundary(textWithEmojiAndPersian, rocketIndex + 1)).toBe(rocketIndex + 2);

    // Persian ZWNJ (\u200C)
    const zwnjText = 'می\u200Cخواهم';
    const zwnjIndex = zwnjText.indexOf('\u200C');
    expect(isSurrogateOrCombiningBoundary(zwnjText, zwnjIndex)).toBe(true);
  });
});
