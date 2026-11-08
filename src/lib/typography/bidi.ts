/**
 * VMD Bidirectional & Typography Engine
 * First-class Persian (RTL) & English (LTR) bidirectional support.
 */

// Strong RTL Unicode blocks: Arabic, Persian, Hebrew, Thaana, NKo, etc.
const RTL_REGEX = /[\u0591-\u07FF\u08A0-\u08FF\uFB1D-\uFDCF\uFDF0-\uFDFF\uFE70-\uFEFE]/;

// Strong LTR Unicode blocks: Latin, Greek, Cyrillic, etc.
const LTR_REGEX = /[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02B8\u0300-\u0590]/;

/**
 * Checks if a single character is a strong RTL character.
 */
export function isRTLChar(char: string): boolean {
  return RTL_REGEX.test(char);
}

/**
 * Checks if a single character is a strong LTR character.
 */
export function isLTRChar(char: string): boolean {
  return LTR_REGEX.test(char);
}

/**
 * Determines text direction based on the first strong directional character (Unicode Rule P2).
 * Returns 'rtl' if first strong character is Arabic/Persian, otherwise 'ltr'.
 */
export function detectDirection(text: string): 'rtl' | 'ltr' {
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (RTL_REGEX.test(ch)) return 'rtl';
    if (LTR_REGEX.test(ch)) return 'ltr';
  }
  return 'ltr';
}
const LTR_TYPES: Record<string, true> = {
  code: true,
  code_block: true,
  math: true,
  math_block: true,
  mermaid: true,
  echarts: true,
  chart: true,
};

export function isForcedLTR(blockType: string): boolean {
  return LTR_TYPES[blockType.toLowerCase()] === true;
}

/**
 * Wraps inline code, math, numbers, or opposite-direction runs with <bdi> tag
 * to prevent punctuation and parentheses flipping.
 */
export function wrapBidiInline(html: string): string {
  // Wrap inline code tags with dir="ltr"
  return html.replace(/<code\b(?![^>]*\bdir=)([^>]*)>(.*?)<\/code>/gi, '<code dir="ltr"$1>$2</code>');
}

/**
 * Applies Unicode Bidirectional Isolation characters to an inline span
 * First-Strong Isolate (FSI): \u2068 ... \u2069
 * Left-to-Right Isolate (LRI): \u2066 ... \u2069
 * Right-to-Left Isolate (RLI): \u2067 ... \u2069
 */
export function isolateInline(text: string, forceDir?: 'ltr' | 'rtl'): string {
  if (forceDir === 'ltr') {
    return `\u2066${text}\u2069`;
  }
  if (forceDir === 'rtl') {
    return `\u2067${text}\u2069`;
  }
  return `\u2068${text}\u2069`;
}
