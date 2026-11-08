<script lang="ts">
  import { shellStore } from '../../stores/shell_store.svelte';
  import ModeSelector from './ModeSelector.svelte';
  import WindowControls from './WindowControls.svelte';
</script>

<header class="title-bar" data-tauri-drag-region>
  <div class="title-left">
    <div class="logo">
      <svg width="18" height="18" viewBox="0 0 512 512" fill="none">
        <rect width="480" height="480" x="16" y="16" rx="64" fill="var(--bg-secondary, #16161c)" stroke="var(--accent-primary, #818cf8)" stroke-width="24" />
        <path d="M160 160L256 360L352 160H300L256 260L212 160H160Z" fill="var(--accent-primary, #818cf8)" />
      </svg>
    </div>
    <span class="app-title">{shellStore.title}</span>
  </div>

  <div class="title-center">
    <ModeSelector />
  </div>

  <div class="title-right">
    <WindowControls />
  </div>
</header>

<style>
  .title-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 42px;
    padding: 0 0 0 14px;
    background: var(--surface-glass, rgba(22, 22, 28, 0.72));
    border-bottom: 1px solid var(--border-subtle, #272732);
    user-select: none;
    -webkit-app-region: drag;
    backdrop-filter: blur(var(--glass-blur, 16px));
    -webkit-backdrop-filter: blur(var(--glass-blur, 16px));
  }
  .title-left {
    display: flex;
    align-items: center;
    gap: 10px;
    -webkit-app-region: no-drag;
  }
  .app-title {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-primary, #e2e8f0);
    letter-spacing: -0.01em;
  }
  .title-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .title-right {
    display: flex;
    align-items: center;
  }
</style>
