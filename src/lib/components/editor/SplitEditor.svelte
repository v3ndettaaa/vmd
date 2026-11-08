<script lang="ts">
  import { onMount } from 'svelte';
  import SourceEditor from './SourceEditor.svelte';
  import { renderMarkdown } from '../../markdown/pipeline';
  import { calculateScrollRatio, applySynchronizedScroll } from './scroll_sync';

  let {
    value = $bindable(''),
    syncScroll = true,
  }: {
    value?: string;
    syncScroll?: boolean;
  } = $props();

  let splitRatio = $state<number>(50); // percentage 20 to 80
  let isDragging = $state<boolean>(false);
  let previewEl = $state<HTMLDivElement | null>(null);
  let renderedHtml = $state<string>('');

  async function updatePreview() {
    const res = await renderMarkdown(value);
    renderedHtml = res.html;
  }

  $effect(() => {
    updatePreview();
  });

  function handleEditorScroll(top: number, height: number, clientHeight: number) {
    if (!syncScroll || !previewEl) return;
    const ratio = calculateScrollRatio({ top, height, clientHeight });
    applySynchronizedScroll(previewEl, ratio);
  }

  function handleMouseDown(e: MouseEvent) {
    isDragging = true;
    e.preventDefault();
  }

  onMount(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!isDragging) return;
      const windowWidth = window.innerWidth;
      const newRatio = (e.clientX / windowWidth) * 100;
      splitRatio = Math.max(20, Math.min(80, newRatio));
    }

    function handleMouseUp() {
      isDragging = false;
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  });
</script>

<div class="split-editor-container {isDragging ? 'resizing' : ''}">
  <div class="split-pane editor-pane" style="width: {splitRatio}%">
    <SourceEditor
      bind:value
      onscroll={handleEditorScroll}
    />
  </div>

  <div
    class="split-divider"
    role="separator"
    aria-orientation="vertical"
    aria-valuenow={splitRatio}
    aria-valuemin="20"
    aria-valuemax="80"
    onmousedown={handleMouseDown}
  >
    <div class="divider-handle"></div>
  </div>

  <div
    class="split-pane preview-pane"
    style="width: {100 - splitRatio}%"
    bind:this={previewEl}
  >
    <article class="markdown-body">
      {@html renderedHtml}
    </article>
  </div>
</div>

<style>
  .split-editor-container {
    display: flex;
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
  }
  .split-editor-container.resizing {
    user-select: none;
    cursor: col-resize;
  }
  .split-pane {
    height: 100%;
    overflow: hidden;
  }
  .editor-pane {
    background: var(--bg-primary, #0d0d11);
  }
  .preview-pane {
    background: var(--bg-primary, #0d0d11);
    overflow-y: auto;
    padding: 24px 32px;
  }
  .split-divider {
    width: 6px;
    height: 100%;
    background: var(--border-subtle, #272732);
    cursor: col-resize;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.12s ease;
    z-index: 10;
  }
  .split-divider:hover,
  .split-editor-container.resizing .split-divider {
    background: var(--accent-primary, #818cf8);
  }
  .divider-handle {
    width: 2px;
    height: 24px;
    border-radius: 1px;
    background: rgba(255, 255, 255, 0.4);
  }
  .markdown-body {
    max-width: 800px;
    margin: 0 auto;
    line-height: 1.65;
    color: var(--text-primary, #e2e8f0);
    font-size: 15px;
  }
  .markdown-body :global(h1),
  .markdown-body :global(h2),
  .markdown-body :global(h3) {
    border-bottom: 1px solid var(--border-subtle, #272732);
    padding-bottom: 0.3em;
  }
  .markdown-body :global(table) {
    border-collapse: collapse;
    width: 100%;
    margin: 1rem 0;
  }
  .markdown-body :global(th),
  .markdown-body :global(td) {
    border: 1px solid var(--border-subtle, #272732);
    padding: 8px 12px;
  }
  .markdown-body :global(th) {
    background: var(--bg-secondary, #16161c);
  }
</style>
