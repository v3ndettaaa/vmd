<script lang="ts">
  import type { FileNode } from '../../stores/workspace_store.svelte';
  import { tabStore } from '../../stores/tab_store.svelte';
  import TreeNode from './TreeNode.svelte';

  let { node, depth = 0 }: { node: FileNode; depth?: number } = $props();

  let isExpanded = $state<boolean>(true);

  function handleClick() {
    if (node.is_dir) {
      isExpanded = !isExpanded;
    } else {
      tabStore.openTab(node.path);
    }
  }
</script>

<div class="tree-node">
  <button
    type="button"
    class="node-row {tabStore.activeTab?.path === node.path ? 'selected' : ''}"
    style="padding-left: {12 + depth * 14}px"
    onclick={handleClick}
  >
    {#if node.is_dir}
      <span class="chevron {isExpanded ? 'expanded' : ''}">▸</span>
      <span class="icon">📁</span>
    {:else}
      <span class="chevron placeholder"></span>
      <span class="icon">📄</span>
    {/if}
    <span class="name">{node.name}</span>
  </button>

  {#if node.is_dir && isExpanded && node.children}
    <div class="children">
      {#each node.children as child (child.path)}
        <TreeNode node={child} depth={depth + 1} />
      {/each}
    </div>
  {/if}
</div>

<style>
  .tree-node {
    display: flex;
    flex-direction: column;
  }
  .node-row {
    display: flex;
    align-items: center;
    gap: 6px;
    height: 28px;
    padding-right: 12px;
    background: transparent;
    border: none;
    color: var(--text-muted, #94a3b8);
    font-size: 12px;
    cursor: pointer;
    text-align: left;
    width: 100%;
    transition: all 0.1s ease;
  }
  .node-row:hover {
    background: rgba(255, 255, 255, 0.05);
    color: var(--text-primary, #ffffff);
  }
  .node-row.selected {
    background: rgba(129, 140, 248, 0.15);
    color: var(--accent-primary, #818cf8);
    font-weight: 500;
  }
  .chevron {
    font-size: 10px;
    display: inline-block;
    transition: transform 0.12s ease;
    width: 12px;
    text-align: center;
  }
  .chevron.expanded {
    transform: rotate(90deg);
  }
  .chevron.placeholder {
    visibility: hidden;
  }
  .icon {
    font-size: 13px;
  }
  .name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
  }
  .children {
    display: flex;
    flex-direction: column;
  }
</style>
