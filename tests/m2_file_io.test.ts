import { describe, it, expect, beforeEach } from 'vitest';
import { FileService } from '../src/lib/services/file_service';

describe('Task M2.1: Scoped File I/O & Atomic Storage Service', () => {
  beforeEach(() => {
    FileService.clearVirtualFs();
  });

  it('reads authorized file content successfully', async () => {
    FileService.setVirtualFile('/workspace/sample.md', '# Hello Markdown', true);
    const content = await FileService.readFile('/workspace/sample.md');
    expect(content).toBe('# Hello Markdown');
  });

  it('rejects unauthorized file access attempt', async () => {
    FileService.setVirtualFile('/etc/passwd', 'root:x:0:0', false);
    await expect(FileService.readFile('/etc/passwd')).rejects.toThrow('Unauthorized access');
  });

  it('saves file content atomically and allows read-back', async () => {
    const filePath = '/tmp/atomic_note.md';
    await FileService.authorizeFile(filePath);
    await FileService.saveFileAtomic(filePath, '# Updated Title\n\nNew body content.');

    const readBack = await FileService.readFile(filePath);
    expect(readBack).toBe('# Updated Title\n\nNew body content.');
  });
});
