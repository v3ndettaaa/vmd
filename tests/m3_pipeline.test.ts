import { describe, it, expect } from 'vitest';
import { renderMarkdown, sanitizeHtml } from '../src/lib/markdown/pipeline';

describe('Task M3.1: Unified Markdown AST Pipeline & DOMPurify Sanitization', () => {
  it('renders GFM tables and footnotes correctly', async () => {
    const md = `
| Item | Price |
| :--- | ---: |
| Apple | $1.00 |
| Orange | $2.00 |

Here is a footnote[^1].

[^1]: Footnote content.
`;
    const res = await renderMarkdown(md);
    expect(res.html).toContain('<table>');
    expect(res.html).toContain('>Item</th>');
    expect(res.html).toContain('>Apple</td>');
    expect(res.html).toContain('class="data-footnote-backref"');
  });

  it('transforms GitHub callouts (> [!NOTE]) into callout divs', async () => {
    const md = `
> [!NOTE] Important Reminder
> This is a callout message body.
`;
    const res = await renderMarkdown(md);
    expect(res.html).toContain('class="callout callout-note"');
    expect(res.html).toContain('data-callout="note"');
    expect(res.html).toContain('data-callout-title="Important Reminder"');
    expect(res.html).toContain('This is a callout message body.');
  });

  it('maps mermaid and echarts fences into dedicated container blocks', async () => {
    const md = `
\`\`\`mermaid
graph TD;
  A-->B;
\`\`\`

\`\`\`echarts
{"title": {"text": "Test"}}
\`\`\`
`;
    const res = await renderMarkdown(md);
    expect(res.html).toContain('class="vmd-mermaid-block"');
    expect(res.html).toContain('data-mermaid-code=');
    expect(res.html).toContain('class="vmd-echarts-block"');
    expect(res.html).toContain('data-chart-config=');
  });

  it('strips malicious XSS payloads with strict DOMPurify sanitization', async () => {
    const malicious = `
# Title
<script>alert("XSS")</script>
<img src="x" onerror="alert(1)" />
<a href="javascript:alert(2)">Click me</a>
`;
    const res = await renderMarkdown(malicious);
    expect(res.html).not.toContain('<script>');
    expect(res.html).not.toContain('alert(');
    expect(res.html).not.toContain('onerror');
    expect(res.html).not.toContain('javascript:');
  });
});
