/**
 * VMD Markdown AST Pipeline & DOMPurify Sanitizer
 * Transforms Markdown into secure, theme-aware HTML.
 */

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import DOMPurify from 'dompurify';
import { remarkCallouts } from './plugins/remark_callouts';
import { remarkCustomBlocks } from './plugins/remark_custom_blocks';

export interface RenderedDocument {
  html: string;
  frontmatter?: Record<string, unknown>;
}

const processor = unified()
  .use(remarkParse)
  .use(remarkFrontmatter, ['yaml', 'toml'])
  .use(remarkGfm)
  .use(remarkMath)
  .use(remarkCallouts)
  .use(remarkCustomBlocks)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeStringify);
function getPurifier() {
  if (typeof window !== 'undefined') {
    const factory = (DOMPurify as unknown as { default?: unknown }).default || DOMPurify;
    if (typeof factory === 'function') {
      return (factory as (w: unknown) => { sanitize: (s: string, o?: unknown) => string })(window);
    }
  }
  return DOMPurify;
}
/**
 * Sanitizes HTML using DOMPurify with strict protocol and tag whitelists.
 */
export function sanitizeHtml(rawHtml: string): string {
  const purifier = getPurifier();
  return purifier.sanitize(rawHtml, {
    USE_PROFILES: { html: true, svg: true, svgFilters: true },
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'a', 'b', 'i', 'strong', 'em', 'mark', 'small', 'del', 'ins', 'sub', 'sup',
      'ul', 'ol', 'li', 'dl', 'dt', 'dd',
      'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
      'blockquote', 'pre', 'code', 'kbd', 'samp', 'var', 'hr', 'br',
      'div', 'span', 'bdi', 'bdo', 'section', 'article',
      'svg', 'path', 'rect', 'circle', 'line', 'polygon', 'polyline', 'text', 'g', 'defs', 'use',
      'img', 'details', 'summary',
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'class', 'id', 'dir', 'style', 'width', 'height',
      'data-callout', 'data-callout-title', 'data-mermaid-code', 'data-chart-config',
      'viewBox', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin',
      'colspan', 'rowspan', 'align',
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|asset):|[^a-z]|[a-z+.-]+(?:[^a-z+.-:]|$))/i,
    FORBID_TAGS: ['script', 'object', 'embed', 'iframe', 'form', 'input'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur'],
  });
}

/**
 * Renders Markdown source string to sanitized HTML.
 */
export async function renderMarkdown(source: string): Promise<RenderedDocument> {
  const file = await processor.process(source);
  const rawHtml = String(file);
  const cleanHtml = sanitizeHtml(rawHtml);

  return {
    html: cleanHtml,
  };
}
