import { describe, it, expect } from 'vitest';
import { calculateScrollRatio, applySynchronizedScroll } from '../src/lib/components/editor/scroll_sync';

describe('Task M4.2: Split View & Synchronized Scrolling', () => {
  it('calculates scroll ratio accurately across scroll positions', () => {
    // At top (scrollTop = 0)
    expect(calculateScrollRatio({ top: 0, height: 1000, clientHeight: 200 })).toBe(0);

    // At middle (scrollTop = 400 of max 800)
    expect(calculateScrollRatio({ top: 400, height: 1000, clientHeight: 200 })).toBe(0.5);

    // At bottom (scrollTop = 800 of max 800)
    expect(calculateScrollRatio({ top: 800, height: 1000, clientHeight: 200 })).toBe(1);

    // Clamps overflow
    expect(calculateScrollRatio({ top: 1200, height: 1000, clientHeight: 200 })).toBe(1);
    expect(calculateScrollRatio({ top: -50, height: 1000, clientHeight: 200 })).toBe(0);
  });

  it('applies proportional scroll to target element', () => {
    const fakeEl = {
      scrollTop: 0,
      scrollHeight: 2000,
      clientHeight: 500,
    } as unknown as HTMLElement;

    // maxScroll is 1500; ratio 0.5 -> scrollTop = 750
    applySynchronizedScroll(fakeEl, 0.5);
    expect(fakeEl.scrollTop).toBe(750);

    // ratio 1.0 -> scrollTop = 1500
    applySynchronizedScroll(fakeEl, 1.0);
    expect(fakeEl.scrollTop).toBe(1500);
  });
});
