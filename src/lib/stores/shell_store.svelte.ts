/**
 * VMD Shell State & Window Controls
 */

import { getCurrentWindow } from '@tauri-apps/api/window';

export type EditorMode = 'source' | 'live' | 'split' | 'reading';

export interface DocumentStats {
  lines: number;
  words: number;
  chars: number;
  cursorLine: number;
  cursorCol: number;
  dir: 'rtl' | 'ltr';
  isDirty: boolean;
}

class ShellState {
  mode = $state<EditorMode>('split');
  title = $state<string>('VMD Workspace');
  stats = $state<DocumentStats>({
    lines: 1,
    words: 0,
    chars: 0,
    cursorLine: 1,
    cursorCol: 1,
    dir: 'ltr',
    isDirty: false,
  });

  setMode(m: EditorMode): void {
    this.mode = m;
  }

  updateStats(newStats: Partial<DocumentStats>): void {
    this.stats = { ...this.stats, ...newStats };
  }

  async minimizeWindow(): Promise<void> {
    try {
      await getCurrentWindow().minimize();
    } catch {
      // Ignored in browser / test environment
    }
  }

  async toggleMaximizeWindow(): Promise<void> {
    try {
      await getCurrentWindow().toggleMaximize();
    } catch {
      // Ignored in browser / test environment
    }
  }

  async closeWindow(): Promise<void> {
    try {
      await getCurrentWindow().close();
    } catch {
      // Ignored in browser / test environment
    }
  }
}

export const shellStore = new ShellState();
