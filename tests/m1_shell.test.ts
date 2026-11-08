import { describe, it, expect } from 'vitest';
import { shellStore } from '../src/lib/stores/shell_store.svelte';

describe('Task M1.2: VMD Window Shell & Title Bar', () => {
  it('updates editor modes smoothly in shellStore', () => {
    shellStore.setMode('source');
    expect(shellStore.mode).toBe('source');

    shellStore.setMode('live');
    expect(shellStore.mode).toBe('live');

    shellStore.setMode('split');
    expect(shellStore.mode).toBe('split');

    shellStore.setMode('reading');
    expect(shellStore.mode).toBe('reading');
  });

  it('updates document statistics accurately', () => {
    shellStore.updateStats({
      lines: 42,
      words: 350,
      chars: 2100,
      cursorLine: 10,
      cursorCol: 5,
      dir: 'rtl',
      isDirty: true,
    });

    expect(shellStore.stats.lines).toBe(42);
    expect(shellStore.stats.words).toBe(350);
    expect(shellStore.stats.chars).toBe(2100);
    expect(shellStore.stats.cursorLine).toBe(10);
    expect(shellStore.stats.cursorCol).toBe(5);
    expect(shellStore.stats.dir).toBe('rtl');
    expect(shellStore.stats.isDirty).toBe(true);
  });

  it('handles window actions safely in browser/test environment', async () => {
    await expect(shellStore.minimizeWindow()).resolves.toBeUndefined();
    await expect(shellStore.toggleMaximizeWindow()).resolves.toBeUndefined();
    await expect(shellStore.closeWindow()).resolves.toBeUndefined();
  });
});
