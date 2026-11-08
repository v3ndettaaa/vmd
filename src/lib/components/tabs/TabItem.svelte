<script lang="ts">
  import { tabStore, type Tab } from '../../stores/tab_store.svelte';

  let { tab }: { tab: Tab } = $props();

  const isActive = $derived(tabStore.activeTabId === tab.id);

  function handleClose(e: MouseEvent) {
    e.stopPropagation();
    tabStore.closeTab(tab.id, true);
  }

  function handleMiddleClick(e: MouseEvent) {
    if (e.button === 1) {
      e.preventDefault();
      tabStore.closeTab(tab.id, true);
    }
  }
</script>

<button
  type="button"
  role="tab"
  aria-selected={isActive}
  class="tab-item {isActive ? 'active' : ''}"
  onclick={() => (tabStore.activeTabId = tab.id)}
  onauxclick={handleMiddleClick}
>
  <span class="tab-title">{tab.title}</span>
  {#if tab.isDirty}
    <span class="tab-dirty" title="Unsaved changes">●</span>
  {/if}
  <span
    role="button"
    tabindex="0"
    class="tab-close"
    aria-label="Close tab"
    onclick={handleClose}
    onkeydown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.stopPropagation();
        tabStore.closeTab(tab.id, true);
      }
    }}
  >
    <svg width="8" height="8" viewBox="0 0 8 8">
      <line x1="1" y1="1" x2="7" y2="7" stroke="currentColor" stroke-width="1.2" />
      <line x1="7" y1="1" x2="1" y2="7" stroke="currentColor" stroke-width="1.2" />
    </svg>
  </span>
</button>

<style>
  .tab-item {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 34px;
    padding: 0 10px;
    background: transparent;
    border: none;
    border-right: 1px solid var(--border-subtle, #272732);
    color: var(--text-muted, #94a3b8);
    font-size: 12px;
    cursor: pointer;
    user-select: none;
    transition: all 0.12s ease;
    max-width: 180px;
  }
  .tab-item:hover {
    background: rgba(255, 255, 255, 0.04);
    color: var(--text-primary, #e2e8f0);
  }
  .tab-item.active {
    background: var(--bg-primary, #0d0d11);
    color: var(--text-primary, #ffffff);
    border-bottom: 2px solid var(--accent-primary, #818cf8);
  }
  .tab-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .tab-dirty {
    color: #eab308;
    font-size: 10px;
  }
  .tab-close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    border-radius: 4px;
    opacity: 0.6;
    transition: all 0.12s ease;
  }
  .tab-close:hover {
    opacity: 1;
    background: rgba(255, 255, 255, 0.15);
  }
</style>
