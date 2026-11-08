<script lang="ts">
  import { workspaceStore } from '../../stores/workspace_store.svelte';
  import TreeNode from './TreeNode.svelte';

  function handleOpenFolder() {
    workspaceStore.openWorkspace('/home/v3/Projects/vmd');
  }
</script>

<aside class="folder-tree glass-panel {workspaceStore.isOpen ? '' : 'collapsed'}">
  <div class="tree-header">
    <span class="tree-title">Explorer</span>
    <div class="header-actions">
      <button
        type="button"
        class="action-btn"
        title="Open Workspace Folder"
        onclick={handleOpenFolder}
      >
        📂
      </button>
    </div>
  </div>

  <div class="tree-content">
    {#if workspaceStore.tree.length === 0}
      <div class="empty-tree">
        <p>No folder opened</p>
        <button type="button" class="open-btn" onclick={handleOpenFolder}>
          Open Folder
        </button>
      </div>
    {:else}
      {#each workspaceStore.tree as node (node.path)}
        <TreeNode {node} depth={0} />
      {/each}
    {/if}
  </div>
</aside>

<style>
  .folder-tree {
    width: 240px;
    height: 100%;
    display: flex;
    flex-direction: column;
    border-right: 1px solid var(--border-subtle, #272732);
    background: var(--bg-secondary, #16161c);
    user-select: none;
    transition: width 0.15s ease, margin-left 0.15s ease;
  }
  .folder-tree.collapsed {
    width: 0;
    margin-left: -240px;
    overflow: hidden;
  }
  .tree-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 35px;
    padding: 0 12px;
    border-bottom: 1px solid var(--border-subtle, #272732);
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-muted, #94a3b8);
  }
  .action-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 13px;
    padding: 2px 4px;
    border-radius: 4px;
  }
  .action-btn:hover {
    background: rgba(255, 255, 255, 0.08);
  }
  .tree-content {
    flex: 1;
    overflow-y: auto;
    padding: 6px 0;
  }
  .empty-tree {
    padding: 24px 16px;
    text-align: center;
    font-size: 12px;
    color: var(--text-muted, #94a3b8);
  }
  .empty-tree p {
    margin: 0 0 12px;
  }
  .open-btn {
    background: var(--accent-primary, #818cf8);
    color: #ffffff;
    border: none;
    padding: 6px 14px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 500;
    cursor: pointer;
  }
</style>
