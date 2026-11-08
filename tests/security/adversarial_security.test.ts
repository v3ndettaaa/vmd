import { describe, it, expect } from 'vitest';
import { renderMarkdown, sanitizeHtml } from '../../src/lib/markdown/pipeline';
import { parseChartOptions } from '../../src/lib/renderers/echarts_renderer';
import { renderMermaid } from '../../src/lib/renderers/mermaid_renderer';
import { FileService } from '../../src/lib/services/file_service';

describe('Task M8.2: Security Hardening & Adversarial Penetration Tests', () => {
  const XSS_PAYLOADS = [
    '<script>alert(1)</script>',
    '<img src="x" onerror="alert(2)" />',
    '<svg onload="alert(3)" />',
    '<iframe src="javascript:alert(4)"></iframe>',
    '<body onload="alert(5)">',
    '<a href="javascript:alert(6)">link</a>',
    '<a href="data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==">data link</a>',
    '<math><mtext><table><mglyph><style><!--</style><img src=x onerror=alert(7)>',
    '<input type="image" src="x" onerror="alert(8)" />',
    '<video><source onerror="alert(9)"></video>',
    '<audio src="x" onerror="alert(10)"></audio>',
    '<object data="javascript:alert(11)"></object>',
    '<embed src="javascript:alert(12)"></embed>',
    '<link rel="stylesheet" href="javascript:alert(13)">',
    '<table background="javascript:alert(14)">',
    '<marquee onstart="alert(15)">',
    '<isindex type=image src=1 onerror=alert(16)>',
    '<details open ontoggle="alert(17)">',
    '<svg><animate onbegin="alert(18)" attributeName="x" dur="1s">',
    '[Click Me](javascript:alert(20))',
  ];

  it('neutralizes all 20 adversarial XSS payloads without execution', async () => {
    for (let i = 0; i < XSS_PAYLOADS.length; i++) {
      const payload = XSS_PAYLOADS[i];
      const res = await renderMarkdown(payload);

      expect(res.html).not.toContain('<script>');
      expect(res.html).not.toContain('onerror=');
      expect(res.html).not.toContain('onload=');
      expect(res.html).not.toContain('ontoggle=');
      expect(res.html).not.toContain('javascript:');
    }
  });

  it('rejects Mermaid diagram click callback injections and script tags', async () => {
    const maliciousMermaid = `
graph TD
  A-->B
  click A "javascript:alert(1)"
  click B call alert()
`;
    const res = await renderMermaid(maliciousMermaid);
    expect(res.svg).not.toContain('<script>');
    expect(res.svg).not.toContain('javascript:');
    expect(res.svg).not.toContain('onclick=');
  });

  it('neutralizes prototype pollution vectors in ECharts JSON', () => {
    const payloads = [
      '{"__proto__": {"admin": true}}',
      '{"constructor": {"prototype": {"admin": true}}}',
      '{"series": [{"__proto__": {"isAdmin": true}}]}',
    ];

    for (const p of payloads) {
      const parsed = parseChartOptions(p);
      expect(parsed.error).toContain('Prototype pollution attempt detected');
      expect((Object.prototype as Record<string, unknown>).admin).toBeUndefined();
      expect((Object.prototype as Record<string, unknown>).isAdmin).toBeUndefined();
    }
  });

  it('rejects filesystem path traversal attacks', async () => {
    FileService.clearVirtualFs();
    FileService.setVirtualFile('/workspace/note.md', '# Note', true);

    const traversalPaths = [
      '../../etc/passwd',
      '/workspace/../../../etc/shadow',
      '..%2f..%2fetc%2fpasswd',
    ];

    for (const path of traversalPaths) {
      await expect(FileService.readFile(path)).rejects.toThrow();
    }
  });
});
