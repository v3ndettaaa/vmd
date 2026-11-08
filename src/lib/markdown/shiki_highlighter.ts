/**
 * VMD Bundled Shiki Syntax Highlighter
 * Zero runtime grammar downloads; pre-bundles essential languages.
 */

import { createHighlighter, type Highlighter } from 'shiki';

let highlighterPromise: Promise<Highlighter> | null = null;

export async function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-dark-default', 'github-light-default'],
      langs: [
        'typescript',
        'javascript',
        'python',
        'rust',
        'bash',
        'json',
        'markdown',
        'html',
        'css',
      ],
    });
  }
  return highlighterPromise;
}

/**
 * Highlights a snippet of code using bundled Shiki themes.
 * Forces direction: ltr.
 */
export async function highlightCode(
  code: string,
  lang = 'text',
  isDark = true
): Promise<string> {
  try {
    const highlighter = await getHighlighter();
    const theme = isDark ? 'github-dark-default' : 'github-light-default';
    const supportedLangs = highlighter.getLoadedLanguages();

    const normalizedLang = supportedLangs.includes(lang.toLowerCase())
      ? lang.toLowerCase()
      : 'text';

    return highlighter.codeToHtml(code, {
      lang: normalizedLang,
      theme,
    });
  } catch {
    // Fallback: escaped plain code block
    const escaped = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return `<pre dir="ltr" class="shiki-fallback"><code>${escaped}</code></pre>`;
  }
}
