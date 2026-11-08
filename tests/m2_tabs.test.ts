import { describe, it, expect, beforeEach } from 'vitest';
import { tabStore } from '../src/lib/stores/tab_store.svelte';

describe('Task M2.3: Document Tabs & Session State Persistence', () => {
  beforeEach(() => {
    tabStore.tabs = [];
    tabStore.activeTabId = null;
  });

  it('opens new tabs and activates them', async () => {
    const id1 = await tabStore.openTab('/test/note1.md', '# Note 1');
    expect(tabStore.tabs.length).toBe(1);
    expect(tabStore.activeTabId).toBe(id1);
    expect(tabStore.activeTab?.title).toBe('note1.md');

    const id2 = await tabStore.openTab('/test/note2.md', '# Note 2');
    expect(tabStore.tabs.length).toBe(2);
    expect(tabStore.activeTabId).toBe(id2);
  });

  it('updates dirty state when content is edited', async () => {
    const id = await tabStore.openTab('/test/note.md', '# Original');
    expect(tabStore.activeTab?.isDirty).toBe(false);

    tabStore.updateContent(id, '# Modified Content');
    expect(tabStore.activeTab?.isDirty).toBe(true);

    tabStore.updateContent(id, '# Original');
    expect(tabStore.activeTab?.isDirty).toBe(false);
  });

  it('refuses to close dirty tab without force flag', async () => {
    const id = await tabStore.openTab('/test/note.md', '# Original');
    tabStore.updateContent(id, '# Modified');

    const closed = await tabStore.closeTab(id, false);
    expect(closed).toBe(false);
    expect(tabStore.tabs.length).toBe(1);

    const forceClosed = await tabStore.closeTab(id, true);
    expect(forceClosed).toBe(true);
    expect(tabStore.tabs.length).toBe(0);
  });
});
