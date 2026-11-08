/**
 * VMD Mode Coordinator
 * Ensures state, text, and cursor preservation across mode transitions.
 */

import type { EditorMode } from '../stores/shell_store.svelte';

export interface EditorSnapshot {
  mode: EditorMode;
  text: string;
  cursorLine: number;
  cursorCol: number;
  scrollTop: number;
}

export class ModeCoordinator {
  private currentText: string;
  private currentMode: EditorMode;
  private cursorLine: number;
  private cursorCol: number;
  private scrollTop: number;

  constructor(initialText = '', initialMode: EditorMode = 'split') {
    this.currentText = initialText;
    this.currentMode = initialMode;
    this.cursorLine = 1;
    this.cursorCol = 1;
    this.scrollTop = 0;
  }

  getSnapshot(): EditorSnapshot {
    return {
      mode: this.currentMode,
      text: this.currentText,
      cursorLine: this.cursorLine,
      cursorCol: this.cursorCol,
      scrollTop: this.scrollTop,
    };
  }

  updateText(newText: string): void {
    this.currentText = newText;
  }

  updateCursor(line: number, col: number): void {
    this.cursorLine = line;
    this.cursorCol = col;
  }

  updateScroll(top: number): void {
    this.scrollTop = top;
  }

  switchMode(targetMode: EditorMode): EditorSnapshot {
    this.currentMode = targetMode;
    return this.getSnapshot();
  }
}
