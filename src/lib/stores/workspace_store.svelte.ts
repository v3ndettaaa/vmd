/**
 * VMD Workspace Store
 * Manages the workspace folder directory tree and external file change events.
 */

import { invoke } from '@tauri-apps/api/core';

export interface FileNode {
  name: string;
  path: string;
  is_dir: boolean;
  children?: FileNode[];
}

class WorkspaceState {
  workspacePath = $state<string | null>(null);
  tree = $state<FileNode[]>([]);
  isOpen = $state<boolean>(true); // Sidebar toggle

  async openWorkspace(dir: string): Promise<void> {
    try {
      const nodes = await invoke<FileNode[]>('open_workspace', { dir });
      this.workspacePath = dir;
      this.tree = nodes;
    } catch {
      // In-memory fallback
      this.workspacePath = dir;
      this.tree = [
        { name: 'README.md', path: `${dir}/README.md`, is_dir: false },
        {
          name: 'notes',
          path: `${dir}/notes`,
          is_dir: true,
          children: [
            { name: 'index.md', path: `${dir}/notes/index.md`, is_dir: false },
          ],
        },
      ];
    }
  }

  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
  }
}

export const workspaceStore = new WorkspaceState();
