<script lang="ts">
  import { shellStore, type EditorMode } from '../../stores/shell_store.svelte';

  const modes: { id: EditorMode; label: string }[] = [
    { id: 'source', label: 'Source' },
    { id: 'live', label: 'Live' },
    { id: 'split', label: 'Split' },
    { id: 'reading', label: 'Reading' },
  ];
</script>

<div class="mode-selector" role="tablist" aria-label="Editor Mode">
  {#each modes as mode}
    <button
      type="button"
      role="tab"
      aria-selected={shellStore.mode === mode.id}
      class="mode-btn {shellStore.mode === mode.id ? 'active' : ''}"
      onclick={() => shellStore.setMode(mode.id)}
    >
      {mode.label}
    </button>
  {/each}
</div>

<style>
  .mode-selector {
    display: inline-flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    padding: 3px;
    gap: 2px;
    -webkit-app-region: no-drag;
    border: 1px solid var(--border-subtle, #272732);
  }
  .mode-btn {
    border: none;
    background: transparent;
    color: var(--text-muted, #94a3b8);
    font-size: 12px;
    font-weight: 500;
    padding: 4px 12px;
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.15s ease;
  }
  .mode-btn:hover {
    color: var(--text-primary, #ffffff);
  }
  .mode-btn.active {
    background: var(--accent-primary, #818cf8);
    color: #ffffff;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  }
</style>
