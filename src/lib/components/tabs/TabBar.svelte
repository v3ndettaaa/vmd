<script lang="ts">
  import { tabStore } from '../../stores/tab_store.svelte';
  import TabItem from './TabItem.svelte';

  function handleNewTab() {
    tabStore.openTab(`vmd://untitled-${Date.now()}.md`, '# Untitled Document\n\n');
  }
</script>

<div class="tab-bar" role="tablist" aria-label="Open Documents">
  <div class="tabs-scroll">
    {#each tabStore.tabs as tab (tab.id)}
      <TabItem {tab} />
    {/each}
  </div>

  <button
    type="button"
    class="new-tab-btn"
    aria-label="New Document"
    title="New Document (Ctrl+N)"
    onclick={handleNewTab}
  >
    <svg width="12" height="12" viewBox="0 0 12 12">
      <line x1="6" y1="2" x2="6" y2="10" stroke="currentColor" stroke-width="1.2" />
      <line x1="2" y1="6" x2="10" y2="6" stroke="currentColor" stroke-width="1.2" />
    </svg>
  </button>
</div>

<style>
  .tab-bar {
    display: flex;
    align-items: center;
    height: 35px;
    background: var(--bg-secondary, #16161c);
    border-bottom: 1px solid var(--border-subtle, #272732);
    overflow: hidden;
  }
  .tabs-scroll {
    display: flex;
    align-items: center;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
    flex: 1;
  }
  .tabs-scroll::-webkit-scrollbar {
    display: none;
  }
  .new-tab-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 35px;
    background: transparent;
    border: none;
    color: var(--text-muted, #94a3b8);
    cursor: pointer;
    transition: all 0.12s ease;
  }
  .new-tab-btn:hover {
    background: rgba(255, 255, 255, 0.05);
    color: var(--text-primary, #ffffff);
  }
</style>
