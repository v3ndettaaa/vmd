import { describe, it, expect, beforeEach } from 'vitest';
import { ExportService } from '../src/lib/services/export_service';
import { FileService } from '../src/lib/services/file_service';

describe('Task M7.3: Export Engine (HTML & PDF)', () => {
  beforeEach(() => {
    FileService.clearVirtualFs();
  });

  it('generates standalone HTML document with embedded CSS', () => {
    const htmlContent = '<h1>Exported Document</h1><p>Body paragraph.</p>';
    const doc = ExportService.generateStandaloneHtml(htmlContent, {
      title: 'Custom Title',
      isDark: true,
    });

    expect(doc).toContain('<!DOCTYPE html>');
    expect(doc).toContain('<title>Custom Title</title>');
    expect(doc).toContain('<h1>Exported Document</h1>');
    expect(doc).toContain('color-scheme: dark');
    expect(doc).toContain('body {');
  });

  it('exports standalone HTML file to filesystem', async () => {
    const htmlContent = '<h2>Report Title</h2>';
    const filePath = '/tmp/export_test.html';

    await ExportService.exportToHtml(filePath, htmlContent, {
      title: 'Report Title',
      isDark: false,
    });

    const fileOnDisk = await FileService.readFile(filePath);
    expect(fileOnDisk).toContain('Report Title');
    expect(fileOnDisk).toContain('color-scheme: light');
  });
});
