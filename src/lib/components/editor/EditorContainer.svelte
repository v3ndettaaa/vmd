<script lang="ts">
  import { shellStore } from '../../stores/shell_store.svelte';
  import { tabStore } from '../../stores/tab_store.svelte';
  import SourceEditor from './SourceEditor.svelte';
  import LiveEditor from './LiveEditor.svelte';
  import SplitEditor from './SplitEditor.svelte';
  import { renderMarkdown } from '../../markdown/pipeline';

  let currentContent = $derived(tabStore.activeTab?.content ?? '');
  let readingHtml = $state<string>('');

  function handleContentChange(newVal: string) {
    if (tabStore.activeTabId) {
      tabStore.updateContent(tabStore.activeTabId, newVal);
    }
  }

  $effect(() => {
    if (shellStore.mode === 'reading' && currentContent) {
      renderMarkdown(currentContent).then((res) => {
        readingHtml = res.html;
      });
    }
  });
</script>

<div class="editor-container">
  {#if !tabStore.activeTab}
    <div class="no-tab-placeholder">
      <div class="placeholder-card">
        <p>No document selected</p>
        <button
          type="button"
          class="new-doc-btn"
          onclick={() => tabStore.openTab(`vmd://untitled-${Date.now()}.md`, '# New Document\n\n')}
        >
          Create New Document
        </button>
      </div>
    </div>
  {:else if shellStore.mode === 'source'}
    <SourceEditor
      value={tabStore.activeTab.content}
      onchange={handleContentChange}
    />
  {:else if shellStore.mode === 'live'}
    <LiveEditor
      value={tabStore.activeTab.content}
      onchange={handleContentChange}
    />
  {:else if shellStore.mode === 'split'}
    <SplitEditor
      value={tabStore.activeTab.content}
      onchange={handleContentChange}
    />
  {:else if shellStore.mode === 'reading'}
    <div class="reading-view">
      <article class="markdown-body">
        {@html readingHtml}
      </article>
    </div>
  {/if}
</div>

<style>
  .editor-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
    background: var(--bg-primary, #0d0d11);
  }
  .no-tab-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .placeholder-card {
    text-align: center;
    color: var(--text-muted, #94a3b8);
  }
  .new-doc-btn {
    background: var(--accent-primary, #818cf8);
    color: #ffffff;
    border: none;
    padding: 8px 18px;
    border-radius: 8px;
    font-size: 13px;
    cursor: pointer;
    margin-top: 10px;
  }
  .reading-view {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    padding: 40px 60px;
    background: var(--bg-primary, #0d0d11);
  }
  .markdown-body {
    max-width: 800px;
    margin: 0 auto;
    line-height: 1.7;
    font-size: 16px;
    color: var(--text-primary, #e2e8f0);
  }
</style>
