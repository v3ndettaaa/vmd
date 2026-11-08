/**
 * VMD File Service
 * Calls Tauri Rust backend atomic commands with in-memory fallback for testing.
 */

import { invoke } from '@tauri-apps/api/core';

// In-memory virtual filesystem for browser mode / tests
const virtualFs = new Map<string, string>();
const authorizedPaths = new Set<string>();

export class FileService {
  static async readFile(path: string): Promise<string> {
    try {
      return await invoke<string>('read_text_file', { path });
    } catch (err: unknown) {
      if (virtualFs.has(path)) {
        if (!authorizedPaths.has(path)) {
          throw new Error(`Unauthorized access: ${path}`);
        }
        return virtualFs.get(path)!;
      }
      throw err;
    }
  }

  static async saveFileAtomic(path: string, content: string): Promise<void> {
    try {
      await invoke('write_text_file_atomic', { path, content });
    } catch (err: unknown) {
      if (authorizedPaths.has(path) || path.startsWith('/tmp') || path.startsWith('vmd://')) {
        virtualFs.set(path, content);
        authorizedPaths.add(path);
        return;
      }
      throw err;
    }
  }

  static async authorizeFile(path: string): Promise<void> {
    try {
      await invoke('authorize_standalone_file', { path });
    } catch {
      authorizedPaths.add(path);
    }
  }

  static setVirtualFile(path: string, content: string, authorized = true): void {
    virtualFs.set(path, content);
    if (authorized) {
      authorizedPaths.add(path);
    } else {
      authorizedPaths.delete(path);
    }
  }

  static clearVirtualFs(): void {
    virtualFs.clear();
    authorizedPaths.clear();
  }
}
