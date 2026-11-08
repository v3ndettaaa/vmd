/**
 * VMD Mermaid Offline Renderer
 * Renders diagrams to sanitized SVGs with strict security and zero external calls.
 */

import mermaid from 'mermaid';
import DOMPurify from 'dompurify';

let initialized = false;

function ensureInitialized() {
  if (!initialized) {
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      htmlLabels: false,
      theme: 'dark',
      fontFamily: 'JetBrains Mono, system-ui, sans-serif',
    });
    initialized = true;
  }
}

export interface MermaidRenderResult {
  svg: string;
  error?: string;
}

let counter = 0;

/**
 * Renders raw Mermaid code to a sanitized SVG string.
 */
export async function renderMermaid(code: string, idPrefix = 'vmd-mermaid'): Promise<MermaidRenderResult> {
  ensureInitialized();
  const id = `${idPrefix}-${Date.now()}-${counter++}`;

  try {
    const { svg } = await mermaid.render(id, code);
    // Sanitize SVG using DOMPurify with strict SVG profile
    const sanitized = DOMPurify.sanitize(svg, {
      USE_PROFILES: { svg: true, svgFilters: true },
      ADD_TAGS: ['use'],
      FORBID_TAGS: ['script'],
      FORBID_ATTR: ['onclick', 'onerror', 'onload'],
    });

    return { svg: sanitized };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    // Clean up temporary DOM element if created by mermaid
    const el = document.getElementById(id);
    if (el) el.remove();

    return {
      svg: `<div class="mermaid-error" style="color: var(--color-danger, #ef4444); padding: 1rem; border: 1px solid currentColor; border-radius: 4px;"><code>${escapeHtml(errorMsg)}</code></div>`,
      error: errorMsg,
    };
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
