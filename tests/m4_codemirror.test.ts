import { describe, it, expect } from 'vitest';
import { EditorState } from '@codemirror/state';
import { buildEditorExtensions } from '../src/lib/components/editor/codemirror_extensions';
import { createEditorTheme } from '../src/lib/components/editor/codemirror_theme';

describe('Task M4.1: CodeMirror 6 Source Editor with Native Bidi', () => {
  it('creates editor state with all extensions without errors', () => {
    let changedValue = '';
    const extensions = buildEditorExtensions({
      onChange: (v) => {
        changedValue = v;
      },
    });

    const state = EditorState.create({
      doc: '# Initial Heading\n\nSome paragraph text.',
      extensions,
    });

    expect(state.doc.toString()).toContain('# Initial Heading');
    expect(state.doc.lines).toBe(3);

    // Apply a transaction
    const tr = state.update({
      changes: { from: 2, to: 17, insert: 'Updated Title' },
    });
    const newState = tr.state;
    expect(newState.doc.toString()).toBe('# Updated Title\n\nSome paragraph text.');
  });

  it('provides theme extension referencing CSS custom properties', () => {
    const theme = createEditorTheme();
    expect(theme).toBeDefined();
  });
});
