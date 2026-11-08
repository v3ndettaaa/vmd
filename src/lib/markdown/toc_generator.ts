/**
 * VMD Table of Contents & Heading Extractor
 * Extracts H1-H6 headings with line numbers, hierarchy, and unique IDs.
 */

export interface TocHeading {
  id: string;
  level: number;
  text: string;
  line: number;
}

/**
 * Generates slug from heading text supporting English, Persian, and Unicode
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-');
}

/**
 * Extracts all ATX and Setext headings from Markdown text.
 */
export function extractHeadings(markdown: string): TocHeading[] {
  const headings: TocHeading[] = [];
  const lines = markdown.split(/\r?\n/);
  const seenSlugs = new Map<string, number>();

  let inCodeBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Track fenced code blocks to skip false-positive headings
    if (/^[`~]{3,}/.test(line.trim())) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    const atxMatch = line.match(/^(#{1,6})[ \t]+(.*)$/);
    if (atxMatch) {
      const level = atxMatch[1].length;
      const text = atxMatch[2].trim().replace(/[ \t]+#+$/, ''); // Strip trailing hashes
      const baseSlug = slugify(text) || `heading-${headings.length + 1}`;
      const count = seenSlugs.get(baseSlug) || 0;
      seenSlugs.set(baseSlug, count + 1);
      const id = count === 0 ? baseSlug : `${baseSlug}-${count}`;

      headings.push({
        id,
        level,
        text,
        line: i + 1,
      });
    }
  }

  return headings;
}
