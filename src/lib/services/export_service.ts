/**
 * VMD Export Service
 * Produces standalone, self-contained HTML files with embedded styling.
 */

import { FileService } from './file_service';

export interface ExportHtmlOptions {
  title?: string;
  themeCss?: string;
  isDark?: boolean;
}

export class ExportService {
  /**
   * Bundles HTML content and theme styles into a standalone self-contained HTML document.
   */
  static generateStandaloneHtml(htmlContent: string, options: ExportHtmlOptions = {}): string {
    const title = options.title || 'VMD Exported Document';
    const bg = options.isDark ? '#0d0d11' : '#fbfbf9';
    const text = options.isDark ? '#e2e8f0' : '#1c1917';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    :root {
      color-scheme: ${options.isDark ? 'dark' : 'light'};
    }
    body {
      margin: 0;
      padding: 40px 24px;
      background-color: ${bg};
      color: ${text};
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.65;
    }
    .markdown-container {
      max-width: 800px;
      margin: 0 auto;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 1.5rem 0;
    }
    th, td {
      border: 1px solid #444;
      padding: 8px 12px;
    }
    pre {
      background: #1e1e24;
      padding: 12px;
      border-radius: 6px;
      overflow-x: auto;
    }
    code {
      font-family: monospace;
    }
    blockquote {
      border-left: 4px solid #818cf8;
      padding-left: 12px;
      margin-left: 0;
      color: #94a3b8;
    }
  </style>
</head>
<body>
  <div class="markdown-container">
    ${htmlContent}
  </div>
</body>
</html>`;
  }

  static async exportToHtml(filePath: string, htmlContent: string, options: ExportHtmlOptions = {}): Promise<void> {
    const standalone = this.generateStandaloneHtml(htmlContent, options);
    await FileService.authorizeFile(filePath);
    await FileService.saveFileAtomic(filePath, standalone);
  }
}
