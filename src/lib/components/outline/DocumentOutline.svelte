<script lang="ts">
  import { extractHeadings, type TocHeading } from '../../markdown/toc_generator';

  let {
    markdown = '',
    onselect,
  }: {
    markdown: string;
    onselect?: (heading: TocHeading) => void;
  } = $props();

  const headings = $derived(extractHeadings(markdown));
  let activeId = $state<string | null>(null);

  function handleClick(heading: TocHeading) {
    activeId = heading.id;
    onselect?.(heading);
  }
</script>

<nav class="document-outline" aria-label="Table of Contents">
  <div class="outline-header">Outline</div>
  <div class="outline-list">
    {#if headings.length === 0}
      <p class="empty-outline">No headings found</p>
    {:else}
      {#each headings as heading (heading.id)}
        <button
          type="button"
          class="heading-item level-{heading.level} {activeId === heading.id ? 'active' : ''}"
          style="padding-left: {(heading.level - 1) * 12 + 10}px"
          onclick={() => handleClick(heading)}
        >
          <span class="heading-level-dot"></span>
          <span class="heading-text">{heading.text}</span>
        </button>
      {/each}
    {/if}
  </div>
</nav>

<style>
  .document-outline {
    width: 220px;
    height: 100%;
    display: flex;
    flex-direction: column;
    border-left: 1px solid var(--border-subtle, #272732);
    background: var(--bg-secondary, #16161c);
    user-select: none;
  }
  .outline-header {
    height: 35px;
    padding: 0 12px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--border-subtle, #272732);
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-muted, #94a3b8);
  }
  .outline-list {
    flex: 1;
    overflow-y: auto;
    padding: 8px 0;
  }
  .empty-outline {
    padding: 16px;
    font-size: 12px;
    color: var(--text-muted, #94a3b8);
    text-align: center;
    margin: 0;
  }
  .heading-item {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    height: 26px;
    padding-right: 12px;
    background: transparent;
    border: none;
    color: var(--text-muted, #94a3b8);
    font-size: 12px;
    cursor: pointer;
    text-align: left;
    transition: all 0.1s ease;
  }
  .heading-item:hover {
    background: rgba(255, 255, 255, 0.04);
    color: var(--text-primary, #ffffff);
  }
  .heading-item.active {
    color: var(--accent-primary, #818cf8);
    font-weight: 500;
    background: rgba(129, 140, 248, 0.1);
  }
  .heading-level-dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: currentColor;
    opacity: 0.6;
    flex-shrink: 0;
  }
  .heading-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
  }
</style>
