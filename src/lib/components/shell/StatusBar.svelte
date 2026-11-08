<script lang="ts">
  import { shellStore } from '../../stores/shell_store.svelte';
  import { themeStore } from '../../theme/theme_store.svelte';
</script>

<footer class="status-bar" role="status" aria-label="Editor Status">
  <div class="status-left">
    <span class="status-item dirty-indicator {shellStore.stats.isDirty ? 'dirty' : ''}">
      {shellStore.stats.isDirty ? '● Unsaved' : '✓ Saved'}
    </span>
    <span class="status-item">
      Ln {shellStore.stats.cursorLine}, Col {shellStore.stats.cursorCol}
    </span>
    <span class="status-item">
      {shellStore.stats.words.toLocaleString()} words
    </span>
    <span class="status-item">
      {shellStore.stats.chars.toLocaleString()} chars
    </span>
  </div>

  <div class="status-right">
    <span class="status-item dir-badge" title="Text Direction">
      {shellStore.stats.dir.toUpperCase()}
    </span>
    <button
      type="button"
      class="status-btn"
      title="Toggle Reduced Effects"
      onclick={() => themeStore.toggleReducedEffects()}
    >
      {themeStore.reducedEffects ? '⚡ Solid' : '✨ Glass'}
    </button>
    <span class="status-item theme-name">
      {themeStore.currentTheme.name}
    </span>
  </div>
</footer>

<style>
  .status-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 26px;
    padding: 0 12px;
    background-color: var(--bg-secondary, #16161c);
    border-top: 1px solid var(--border-subtle, #272732);
    font-size: 11px;
    color: var(--text-muted, #94a3b8);
    user-select: none;
    -webkit-app-region: no-drag;
  }
  .status-left,
  .status-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .status-item {
    display: inline-flex;
    align-items: center;
  }
  .dirty-indicator.dirty {
    color: #eab308;
  }
  .dir-badge {
    font-weight: 600;
    padding: 1px 4px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 4px;
  }
  .status-btn {
    background: transparent;
    border: none;
    color: inherit;
    font-size: inherit;
    cursor: pointer;
    padding: 2px 6px;
    border-radius: 4px;
    transition: background-color 0.12s ease;
  }
  .status-btn:hover {
    background-color: rgba(255, 255, 255, 0.08);
    color: var(--text-primary, #ffffff);
  }
</style>
