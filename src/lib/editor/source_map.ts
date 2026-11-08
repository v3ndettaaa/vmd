/**
 * VMD Source Map Engine
 * Partitions Markdown documents into contiguous blocks with exact UTF-16 code-unit offsets.
 * Guarantees zero-edit byte-for-byte fidelity and non-destructive surgical patching.
 */

export type BlockType =
  | 'frontmatter'
  | 'heading'
  | 'code'
  | 'math'
  | 'table'
  | 'blockquote'
  | 'list'
  | 'html_comment'
  | 'html_block'
  | 'thematic_break'
  | 'paragraph'
  | 'unsupported';

export interface SourceBlock {
  id: string;
  from: number; // UTF-16 code unit offset (inclusive)
  to: number;   // UTF-16 code unit offset (exclusive)
  type: BlockType;
  raw: string;
  hash: string;
}

export interface BlockMap {
  blocks: SourceBlock[];
  totalLength: number;
}

/**
 * Fast deterministic FNV-1a hash for string content
 */
export function hashString(str: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}

/**
 * Validates that an index does not split a UTF-16 surrogate pair
 * or a Unicode combining mark sequence (including Persian ZWNJ and vowels).
 */
export function isSurrogateOrCombiningBoundary(text: string, index: number): boolean {
  if (index <= 0 || index >= text.length) return false;

  // Surrogate pair check: high surrogate followed by low surrogate
  const prev = text.charCodeAt(index - 1);
  const curr = text.charCodeAt(index);
  if (prev >= 0xd800 && prev <= 0xdbff && curr >= 0xdc00 && curr <= 0xdfff) {
    return true;
  }

  // Unicode combining mark check (General Category: Mn, Mc, Me)
  // Persian combining marks: 0x064B - 0x065F (tanwin, harakat), 0x0670 (superscript alef)
  // Zero-width non-joiner: 0x200C
  // Zero-width joiner: 0x200D
  if (
    (curr >= 0x0300 && curr <= 0x036f) ||
    (curr >= 0x064b && curr <= 0x065f) ||
    curr === 0x0670 ||
    curr === 0x200c ||
    curr === 0x200d ||
    (curr >= 0xfe00 && curr <= 0xfe0f) ||
    (curr >= 0x20d0 && curr <= 0x20ff)
  ) {
    return true;
  }

  return false;
}

/**
 * Adjust index if it lands on a surrogate or combining boundary
 */
export function safeBoundary(text: string, index: number): number {
  if (isSurrogateOrCombiningBoundary(text, index)) {
    return Math.min(text.length, index + 1);
  }
  return index;
}

/**
 * Parses Markdown into a contiguous array of SourceBlocks covering [0, text.length]
 * with zero gaps: blocks[i].to === blocks[i+1].from.
 */
export function parseBlockMap(markdown: string): BlockMap {
  const blocks: SourceBlock[] = [];
  const len = markdown.length;
  if (len === 0) {
    return { blocks: [], totalLength: 0 };
  }

  let pos = 0;
  let blockIndex = 0;

  function consumeTrailingBlankLines(fromIdx: number): number {
    let p = fromIdx;
    while (p < len) {
      const nextNl = markdown.indexOf('\n', p);
      const lineEnd = nextNl === -1 ? len : nextNl + 1;
      const line = markdown.slice(p, lineEnd);
      if (line.trim().length === 0) {
        p = lineEnd;
      } else {
        break;
      }
    }
    return p;
  }

  // 1. Check for Frontmatter at start of document
  if (pos === 0) {
    const yamlMatch = markdown.match(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/);
    const tomlMatch = markdown.match(/^\+\+\+\r?\n[\s\S]*?\r?\n\+\+\+(?:\r?\n|$)/);
    const jsonMatch = markdown.match(/^\{\r?\n[\s\S]*?\r?\n\}(?:\r?\n|$)/);
    const fm = yamlMatch || tomlMatch || jsonMatch;

    if (fm && fm.index === 0) {
      let to = fm[0].length;
      to = consumeTrailingBlankLines(to);
      const raw = markdown.slice(0, to);
      blocks.push({
        id: `block-${blockIndex++}`,
        from: 0,
        to,
        type: 'frontmatter',
        raw,
        hash: hashString(raw),
      });
      pos = to;
    }
  }

  // 2. Parse remaining top-level blocks
  while (pos < len) {
    const blockStart = pos;
    const rest = markdown.slice(pos);

    // If pos starts with blank lines, consume them into previous block or create empty spacer
    if (rest.startsWith('\n') || rest.startsWith('\r\n')) {
      const nextNonBlank = consumeTrailingBlankLines(pos);
      if (blocks.length > 0) {
        // Attach to previous block
        const prev = blocks[blocks.length - 1];
        prev.to = nextNonBlank;
        prev.raw = markdown.slice(prev.from, prev.to);
        prev.hash = hashString(prev.raw);
      }
      pos = nextNonBlank;
      if (pos >= len) break;
      continue;
    }

    // HTML comment (<!-- ... -->)
    const commentMatch = rest.match(/^<!--[\s\S]*?-->/);
    if (commentMatch) {
      let end = pos + commentMatch[0].length;
      const nextNl = markdown.indexOf('\n', end);
      if (nextNl !== -1 && markdown.slice(end, nextNl).trim().length === 0) {
        end = nextNl + 1;
      }
      end = consumeTrailingBlankLines(end);
      const raw = markdown.slice(blockStart, end);
      blocks.push({
        id: `block-${blockIndex++}`,
        from: blockStart,
        to: end,
        type: 'html_comment',
        raw,
        hash: hashString(raw),
      });
      pos = end;
      continue;
    }

    // Fenced code block (``` or ~~~)
    const fenceMatch = rest.match(/^([`~]{3,})[^\n]*\r?\n/);
    if (fenceMatch) {
      const marker = fenceMatch[1];
      const char = marker[0];
      const minLen = marker.length;
      const regex = new RegExp(`(?:^|\\r?\\n)${char}{${minLen},}[ \\t]*(?:\\r?\\n|$)`, 'm');
      const closeMatch = rest.slice(fenceMatch[0].length).match(regex);
      let end = len;
      if (closeMatch && closeMatch.index !== undefined) {
        end = pos + fenceMatch[0].length + closeMatch.index + closeMatch[0].length;
      }
      end = consumeTrailingBlankLines(end);
      const raw = markdown.slice(blockStart, end);
      blocks.push({
        id: `block-${blockIndex++}`,
        from: blockStart,
        to: end,
        type: 'code',
        raw,
        hash: hashString(raw),
      });
      pos = end;
      continue;
    }

    // Display math block ($$ ... $$)
    const mathMatch = rest.match(/^\$\$\r?\n/);
    if (mathMatch) {
      const closeMatch = rest.slice(mathMatch[0].length).match(/(?:^|\r?\n)\$\$[ \t]*(?:\r?\n|$)/);
      let end = len;
      if (closeMatch && closeMatch.index !== undefined) {
        end = pos + mathMatch[0].length + closeMatch.index + closeMatch[0].length;
      }
      end = consumeTrailingBlankLines(end);
      const raw = markdown.slice(blockStart, end);
      blocks.push({
        id: `block-${blockIndex++}`,
        from: blockStart,
        to: end,
        type: 'math',
        raw,
        hash: hashString(raw),
      });
      pos = end;
      continue;
    }

    // ATX Heading (# ... )
    const atxHeading = rest.match(/^#{1,6}[ \t]+[^\n]*(?:\r?\n|$)/);
    if (atxHeading) {
      let end = pos + atxHeading[0].length;
      end = consumeTrailingBlankLines(end);
      const raw = markdown.slice(blockStart, end);
      blocks.push({
        id: `block-${blockIndex++}`,
        from: blockStart,
        to: end,
        type: 'heading',
        raw,
        hash: hashString(raw),
      });
      pos = end;
      continue;
    }

    // Thematic break (---, ***, ___)
    const thematicBreak = rest.match(/^(?: {0,3}([-*_])[ \t]*(?:\1[ \t]*){2,})(?:\r?\n|$)/);
    if (thematicBreak) {
      let end = pos + thematicBreak[0].length;
      end = consumeTrailingBlankLines(end);
      const raw = markdown.slice(blockStart, end);
      blocks.push({
        id: `block-${blockIndex++}`,
        from: blockStart,
        to: end,
        type: 'thematic_break',
        raw,
        hash: hashString(raw),
      });
      pos = end;
      continue;
    }

    // Blockquote (> ...)
    if (rest.startsWith('>')) {
      const bqMatch = rest.match(/^(?:>[^\n]*(?:\r?\n|$))+/);
      if (bqMatch) {
        let end = pos + bqMatch[0].length;
        end = consumeTrailingBlankLines(end);
        const raw = markdown.slice(blockStart, end);
        blocks.push({
          id: `block-${blockIndex++}`,
          from: blockStart,
          to: end,
          type: 'blockquote',
          raw,
          hash: hashString(raw),
        });
        pos = end;
        continue;
      }
    }

    // GFM Table (| ... |)
    if (/^\|?[^\n]+\|[^\n]*(?:\r?\n|$)/.test(rest) && rest.includes('\n')) {
      const lines = rest.split(/\r?\n/);
      if (lines.length >= 2 && lines[1].match(/^\s*\|?\s*:?-+:?\s*\|/)) {
        let tableLines = 0;
        for (const line of lines) {
          if (line.trim().length === 0 || !line.includes('|')) break;
          tableLines++;
        }
        if (tableLines >= 2) {
          let end = pos;
          for (let i = 0; i < tableLines; i++) {
            const nextNl = markdown.indexOf('\n', end);
            end = nextNl === -1 ? len : nextNl + 1;
          }
          end = consumeTrailingBlankLines(end);
          const raw = markdown.slice(blockStart, end);
          blocks.push({
            id: `block-${blockIndex++}`,
            from: blockStart,
            to: end,
            type: 'table',
            raw,
            hash: hashString(raw),
          });
          pos = end;
          continue;
        }
      }
    }

    // List (ordered or unordered)
    const listMatch = rest.match(/^(?:(?:[ \t]*(?:[*+-]|\d+\.)[ \t]+[^\n]*)(?:\r?\n|$))+/);
    if (listMatch) {
      let end = pos + listMatch[0].length;
      end = consumeTrailingBlankLines(end);
      const raw = markdown.slice(blockStart, end);
      blocks.push({
        id: `block-${blockIndex++}`,
        from: blockStart,
        to: end,
        type: 'list',
        raw,
        hash: hashString(raw),
      });
      pos = end;
      continue;
    }

    // Default: Paragraph up to double newline or next block indicator
    const paraMatch = rest.match(/^([\s\S]*?)(?:\r?\n\s*\r?\n|$)/);
    let end = pos + (paraMatch ? paraMatch[0].length : rest.length);
    if (end === pos) {
      end = pos + 1;
    }
    end = consumeTrailingBlankLines(end);
    const raw = markdown.slice(blockStart, end);
    blocks.push({
      id: `block-${blockIndex++}`,
      from: blockStart,
      to: end,
      type: 'paragraph',
      raw,
      hash: hashString(raw),
    });
    pos = end;
  }

  // Ensure last block reaches end of document if any trailing space remained
  if (blocks.length > 0 && blocks[blocks.length - 1].to < len) {
    const last = blocks[blocks.length - 1];
    last.to = len;
    last.raw = markdown.slice(last.from, len);
    last.hash = hashString(last.raw);
  }

  return { blocks, totalLength: len };
}
