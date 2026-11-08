import { describe, it, expect } from 'vitest';
import { ModeCoordinator } from '../src/lib/editor/mode_coordinator';
import type { EditorMode } from '../src/lib/stores/shell_store.svelte';

describe('Task M5.2: Flawless Mode Switching & State Preservation', () => {
  it('preserves document text byte-for-byte across 50 mode switching iterations', () => {
    const complexMd = `---
title: "Mode Switching Test"
version: 1.0.0
---

# Heading 1

This is a test paragraph with **bold**, *italic*, and [link](https://vmd.app).

| Column A | Column B |
| :--- | ---: |
| Value 1 | 100 |

\`\`\`rust
fn main() {
    println!("Hello VMD");
}
\`\`\`
`;
    const coordinator = new ModeCoordinator(complexMd, 'source');
    coordinator.updateCursor(12, 4);
    coordinator.updateScroll(250);

    const modes: EditorMode[] = ['source', 'live', 'split', 'reading'];

    for (let i = 0; i < 50; i++) {
      const targetMode = modes[i % modes.length];
      const snapshot = coordinator.switchMode(targetMode);

      expect(snapshot.text).toBe(complexMd);
      expect(snapshot.cursorLine).toBe(12);
      expect(snapshot.cursorCol).toBe(4);
      expect(snapshot.scrollTop).toBe(250);
      expect(snapshot.mode).toBe(targetMode);
    }
  });
});
