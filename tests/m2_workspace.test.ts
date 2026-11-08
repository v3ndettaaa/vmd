import { describe, it, expect } from 'vitest';
import { workspaceStore } from '../src/lib/stores/workspace_store.svelte';

describe('Task M2.2: Workspace Folder Tree & File Watching', () => {
  it('opens workspace and populates file tree', async () => {
    await workspaceStore.openWorkspace('/home/v3/Projects/vmd');
    expect(workspaceStore.workspacePath).toBe('/home/v3/Projects/vmd');
    expect(workspaceStore.tree.length).toBeGreaterThan(0);

    const firstNode = workspaceStore.tree[0];
    expect(firstNode.name).toBeDefined();
    expect(firstNode.path).toBeDefined();
  });

  it('toggles sidebar visibility state', () => {
    expect(workspaceStore.isOpen).toBe(true);
    workspaceStore.toggleSidebar();
    expect(workspaceStore.isOpen).toBe(false);
    workspaceStore.toggleSidebar();
    expect(workspaceStore.isOpen).toBe(true);
  });
});
