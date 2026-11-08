<script lang="ts">
  import { shellStore } from '../../stores/shell_store.svelte';
</script>

<div class="window-controls" role="group" aria-label="Window Controls">
  <button
    type="button"
    class="control-btn minimize"
    aria-label="Minimize Window"
    onclick={() => shellStore.minimizeWindow()}
  >
    <svg width="10" height="1" viewBox="0 0 10 1">
      <rect width="10" height="1" fill="currentColor" />
    </svg>
  </button>
  <button
    type="button"
    class="control-btn maximize"
    aria-label="Maximize Window"
    onclick={() => shellStore.toggleMaximizeWindow()}
  >
    <svg width="10" height="10" viewBox="0 0 10 10">
      <rect width="9" height="9" x="0.5" y="0.5" fill="none" stroke="currentColor" stroke-width="1" />
    </svg>
  </button>
  <button
    type="button"
    class="control-btn close"
    aria-label="Close Window"
    onclick={() => shellStore.closeWindow()}
  >
    <svg width="10" height="10" viewBox="0 0 10 10">
      <line x1="1" y1="1" x2="9" y2="9" stroke="currentColor" stroke-width="1.2" />
      <line x1="9" y1="1" x2="1" y2="9" stroke="currentColor" stroke-width="1.2" />
    </svg>
  </button>
</div>

<style>
  .window-controls {
    display: inline-flex;
    align-items: center;
    gap: 0;
    -webkit-app-region: no-drag;
  }
  .control-btn {
    width: 44px;
    height: 36px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    color: var(--text-muted, #94a3b8);
    cursor: pointer;
    transition: background-color 0.12s ease, color 0.12s ease;
  }
  .control-btn:hover {
    background-color: rgba(255, 255, 255, 0.08);
    color: var(--text-primary, #ffffff);
  }
  .control-btn.close:hover {
    background-color: #ef4444;
    color: #ffffff;
  }
</style>
