<script lang="ts">
  import { onMount } from 'svelte';
  import { highlightCode } from '../../markdown/shiki_highlighter';
  import { themeStore } from '../../theme/theme_store.svelte';

  let { code = '', lang = 'text' }: { code: string; lang?: string } = $props();

  let highlightedHtml = $state<string>('');
  let copied = $state<boolean>(false);

  async function updateHighlight() {
    highlightedHtml = await highlightCode(code, lang, themeStore.currentTheme.isDark);
  }

  $effect(() => {
    updateHighlight();
  });

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(code);
      copied = true;
      setTimeout(() => (copied = false), 2000);
    } catch {
      // Ignored
    }
  }
</script>

<div class="code-block-container" dir="ltr">
  <div class="code-header">
    <span class="code-lang">{lang.toUpperCase()}</span>
    <button
      type="button"
      class="copy-btn"
      aria-label="Copy Code"
      onclick={copyToClipboard}
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  </div>
  <div class="code-content">
    {#if highlightedHtml}
      {@html highlightedHtml}
    {:else}
      <pre><code>{code}</code></pre>
    {/if}
  </div>
</div>

<style>
  .code-block-container {
    margin: 1rem 0;
    border-radius: 8px;
    border: 1px solid var(--border-subtle, #272732);
    background: var(--code-bg, #0d0d11);
    overflow: hidden;
    direction: ltr;
    text-align: left;
  }
  .code-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 32px;
    padding: 0 12px;
    background: rgba(255, 255, 255, 0.03);
    border-bottom: 1px solid var(--border-subtle, #272732);
    font-size: 11px;
    color: var(--text-muted, #94a3b8);
  }
  .code-lang {
    font-weight: 600;
    font-family: 'JetBrains Mono', monospace;
  }
  .copy-btn {
    background: transparent;
    border: none;
    color: inherit;
    font-size: 11px;
    cursor: pointer;
    padding: 2px 8px;
    border-radius: 4px;
    transition: background-color 0.1s ease;
  }
  .copy-btn:hover {
    background: rgba(255, 255, 255, 0.08);
    color: var(--text-primary, #ffffff);
  }
  .code-content {
    padding: 12px 16px;
    overflow-x: auto;
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    line-height: 1.5;
  }
  .code-content :global(pre) {
    margin: 0;
    background: transparent !important;
  }
</style>
