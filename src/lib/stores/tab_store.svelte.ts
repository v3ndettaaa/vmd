/**
 * VMD Tab & Document Session Store
 * Manages open editor tabs, active document selection, dirty flags, and SQLite persistence.
 */

import { invoke } from '@tauri-apps/api/core';
import { FileService } from '../services/file_service';

export interface Tab {
  id: string;
  path: string;
  title: string;
  content: string;
  originalContent: string;
  isDirty: boolean;
}

class TabState {
  tabs = $state<Tab[]>([]);
  activeTabId = $state<string | null>(null);

  get activeTab(): Tab | null {
    if (!this.activeTabId) return null;
    return this.tabs.find((t) => t.id === this.activeTabId) || null;
  }

  async openTab(path: string, initialContent?: string): Promise<string> {
    // Check if already open
    const existing = this.tabs.find((t) => t.path === path);
    if (existing) {
      this.activeTabId = existing.id;
      this.persistSession();
      return existing.id;
    }

    let content = initialContent ?? '';
    if (initialContent === undefined) {
      try {
        await FileService.authorizeFile(path);
        content = await FileService.readFile(path);
      } catch {
        content = '';
      }
    }

    const title = path.split('/').pop() || 'Untitled.md';
    const id = `tab-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

    const newTab: Tab = {
      id,
      path,
      title,
      content,
      originalContent: content,
      isDirty: false,
    };

    this.tabs = [...this.tabs, newTab];
    this.activeTabId = id;
    this.persistSession();
    return id;
  }

  updateContent(id: string, content: string): void {
    const tab = this.tabs.find((t) => t.id === id);
    if (!tab) return;

    tab.content = content;
    tab.isDirty = tab.content !== tab.originalContent;
  }

  async saveCurrentTab(): Promise<void> {
    const tab = this.activeTab;
    if (!tab) return;

    await FileService.authorizeFile(tab.path);
    await FileService.saveFileAtomic(tab.path, tab.content);
    tab.originalContent = tab.content;
    tab.isDirty = false;
  }

  async closeTab(id: string, force = false): Promise<boolean> {
    const tab = this.tabs.find((t) => t.id === id);
    if (!tab) return false;

    if (tab.isDirty && !force) {
      // Return false indicating tab is dirty and requires user action
      return false;
    }

    const index = this.tabs.findIndex((t) => t.id === id);
    this.tabs = this.tabs.filter((t) => t.id !== id);

    if (this.activeTabId === id) {
      if (this.tabs.length > 0) {
        const nextIndex = Math.min(index, this.tabs.length - 1);
        this.activeTabId = this.tabs[nextIndex].id;
      } else {
        this.activeTabId = null;
      }
    }

    this.persistSession();
    return true;
  }

  async persistSession(): Promise<void> {
    try {
      const stateToSave = JSON.stringify({
        activeTabId: this.activeTabId,
        tabs: this.tabs.map((t) => ({ path: t.path, title: t.title })),
      });
      await invoke('save_session_state', { key: 'editor_session', value: stateToSave });
    } catch {
      // Ignored in browser / test mode
    }
  }

  async restoreSession(): Promise<void> {
    try {
      const saved = await invoke<string | null>('load_session_state', { key: 'editor_session' });
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.tabs)) {
          for (const item of parsed.tabs) {
            await this.openTab(item.path);
          }
          if (parsed.activeTabId) {
            this.activeTabId = parsed.activeTabId;
          }
        }
      }
    } catch {
      // Ignored
    }
  }
}

export const tabStore = new TabState();
