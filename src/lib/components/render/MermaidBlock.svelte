<script lang="ts">
  import { onMount } from 'svelte';
  import { renderMermaid } from '../../renderers/mermaid_renderer';

  let { code = '' }: { code: string } = $props();

  let svgHtml = $state<string>('');
  let errorMsg = $state<string | undefined>(undefined);
  let copied = $state<boolean>(false);

  async function updateDiagram() {
    if (!code.trim()) return;
    const res = await renderMermaid(code);
    svgHtml = res.svg;
    errorMsg = res.error;
  }

  $effect(() => {
    updateDiagram();
  });

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      copied = true;
      setTimeout(() => (copied = false), 2000);
    } catch {
      // Ignored
    }
  }
</script>

<div class="mermaid-block-container" dir="ltr">
  <div class="mermaid-toolbar">
    <span class="mermaid-label">DIAGRAM</span>
    <button type="button" class="tool-btn" onclick={copyCode}>
      {copied ? '✓ Copied' : 'Copy Code'}
    </button>
  </div>
  <div class="mermaid-viewport">
    {#if svgHtml}
      {@html svgHtml}
    {:else}
      <div class="loading">Rendering diagram...</div>
    {/if}
  </div>
</div>

<style>
  .mermaid-block-container {
    margin: 1.5rem 0;
    border-radius: 8px;
    border: 1px solid var(--border-subtle, #272732);
    background: var(--bg-secondary, #16161c);
    overflow: hidden;
    direction: ltr;
  }
  .mermaid-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 30px;
    padding: 0 12px;
    background: rgba(255, 255, 255, 0.03);
    border-bottom: 1px solid var(--border-subtle, #272732);
    font-size: 11px;
    color: var(--text-muted, #94a3b8);
  }
  .mermaid-label {
    font-weight: 600;
    font-family: 'JetBrains Mono', monospace;
  }
  .tool-btn {
    background: transparent;
    border: none;
    color: inherit;
    font-size: 11px;
    cursor: pointer;
    padding: 2px 8px;
    border-radius: 4px;
  }
  .tool-btn:hover {
    background: rgba(255, 255, 255, 0.08);
    color: var(--text-primary, #ffffff);
  }
  .mermaid-viewport {
    padding: 16px;
    display: flex;
    justify-content: center;
    overflow-x: auto;
  }
  .loading {
    font-size: 12px;
    color: var(--text-muted, #94a3b8);
  }
</style>
