/**
 * VMD Scroll Synchronization
 * Maps proportional and element-based scroll between editor and preview panes.
 */

export interface ScrollPosition {
  top: number;
  height: number;
  clientHeight: number;
}

/**
 * Calculates normalized scroll ratio (0.0 to 1.0)
 */
export function calculateScrollRatio(pos: ScrollPosition): number {
  const maxScroll = pos.height - pos.clientHeight;
  if (maxScroll <= 0) return 0;
  return Math.max(0, Math.min(1, pos.top / maxScroll));
}

/**
 * Synchronizes target container scroll top from source scroll ratio
 */
export function applySynchronizedScroll(
  targetEl: HTMLElement,
  ratio: number
): void {
  const maxScroll = targetEl.scrollHeight - targetEl.clientHeight;
  if (maxScroll > 0) {
    targetEl.scrollTop = ratio * maxScroll;
  }
}
