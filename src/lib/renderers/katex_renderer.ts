/**
 * VMD KaTeX Offline Renderer
 * Renders LaTeX formulas to HTML strings using bundled KaTeX without external requests.
 */

import katex from 'katex';

export interface KaTeXRenderResult {
  html: string;
  error?: string;
}

/**
 * Renders a LaTeX formula to sanitized KaTeX HTML.
 */
export function renderKaTeX(expression: string, displayMode = false): KaTeXRenderResult {
  try {
    const html = katex.renderToString(expression, {
      displayMode,
      throwOnError: false,
      strict: false,
      output: 'htmlAndMathml',
    });
    return { html };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      html: `<span class="katex-error" style="color: var(--color-danger, #ef4444);">${escapeHtml(expression)}</span>`,
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
