/**
 * VMD Surgical Patch Synchronization Engine
 * Preserves untouched Markdown content byte-for-byte while synchronizing edits.
 */

import type { Node as ProseNode } from 'prosemirror-model';
import { vmdSchema } from './prosemirror_nodes';
import { parseBlockMap, hashString, type BlockMap, type SourceBlock } from './source_map';

export interface ParseResult {
  doc: ProseNode;
  map: BlockMap;
}

/**
 * Detects text direction based on the first strong directional character (Unicode Rule P2).
 */
export function detectDirection(text: string): 'rtl' | 'ltr' {
  const rtlRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  const ltrRegex = /[A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02B8]/;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (rtlRegex.test(ch)) return 'rtl';
    if (ltrRegex.test(ch)) return 'ltr';
  }
  return 'ltr';
}

/**
 * Parses raw Markdown into a ProseMirror document annotated with source map metadata.
 */
export function parseToProseMirrorWithSourceMap(markdown: string): ParseResult {
  const map = parseBlockMap(markdown);
  const nodes: ProseNode[] = [];

  for (const block of map.blocks) {
    const attrs = {
      blockId: block.id,
      sourceHash: block.hash,
      sourceFrom: block.from,
      sourceTo: block.to,
      dir: detectDirection(block.raw),
    };

    switch (block.type) {
      case 'heading': {
        const match = block.raw.match(/^(#{1,6})[ \t]+([^\r\n]*)/);
        const level = match ? match[1].length : 1;
        const textContent = match ? match[2].trim() : block.raw.trim();
        const textNode = textContent ? vmdSchema.text(textContent) : undefined;
        nodes.push(
          vmdSchema.nodes.heading.create(
            { ...attrs, level },
            textNode ? [textNode] : []
          )
        );
        break;
      }

      case 'code': {
        const fenceMatch = block.raw.match(/^([`~]{3,})([^\r\n]*)\r?\n([\s\S]*?)(?:\r?\n\1[ \t]*(?:\r?\n|$)|$)/);
        const params = fenceMatch ? fenceMatch[2].trim() : '';
        const codeText = fenceMatch ? fenceMatch[3] : block.raw;
        const textNode = codeText ? vmdSchema.text(codeText) : undefined;
        nodes.push(
          vmdSchema.nodes.code_block.create(
            { ...attrs, params },
            textNode ? [textNode] : []
          )
        );
        break;
      }

      case 'math': {
        const mathMatch = block.raw.match(/^\$\$[\r\n]*([\s\S]*?)(?:\r?\n\$\$[ \t]*(?:\r?\n|$)|$)/);
        const mathText = mathMatch ? mathMatch[1].trim() : block.raw.replace(/\$\$/g, '').trim();
        const textNode = mathText ? vmdSchema.text(mathText) : undefined;
        nodes.push(
          vmdSchema.nodes.math_block.create(
            attrs,
            textNode ? [textNode] : []
          )
        );
        break;
      }

      case 'paragraph': {
        const trimmed = block.raw.trim();
        const textNode = trimmed ? vmdSchema.text(trimmed) : undefined;
        nodes.push(
          vmdSchema.nodes.paragraph.create(
            attrs,
            textNode ? [textNode] : []
          )
        );
        break;
      }

      case 'blockquote': {
        const innerText = block.raw.replace(/^>[ \t]?/gm, '').trim();
        const textNode = innerText ? vmdSchema.text(innerText) : undefined;
        const innerPara = vmdSchema.nodes.paragraph.create(
          { dir: detectDirection(innerText) },
          textNode ? [textNode] : []
        );
        nodes.push(
          vmdSchema.nodes.blockquote.create(
            attrs,
            [innerPara]
          )
        );
        break;
      }

      default: {
        // frontmatter, table, list, html_comment, thematic_break, etc.
        nodes.push(
          vmdSchema.nodes.unsupported_block.create({
            ...attrs,
            blockType: block.type,
            raw: block.raw,
          })
        );
        break;
      }
    }
  }

  // Ensure at least one block exists
  if (nodes.length === 0) {
    nodes.push(vmdSchema.nodes.paragraph.create({
      blockId: 'block-0',
      sourceHash: hashString(''),
      sourceFrom: 0,
      sourceTo: 0,
      dir: 'ltr',
    }));
  }

  const doc = vmdSchema.nodes.doc.create({}, nodes);
  return { doc, map };
}

/**
 * Serializes a single modified ProseMirror block to Markdown, preserving trailing newlines
 */
function serializeBlockNode(node: ProseNode, originalBlock?: SourceBlock): string {
  // If the node is an unsupported block, always preserve original raw text
  if (node.type.name === 'unsupported_block') {
    return (node.attrs.raw as string) || (originalBlock ? originalBlock.raw : '');
  }

  // Calculate trailing newline preservation
  let trailingNewlines = '\n\n';
  if (originalBlock) {
    const trailingMatch = originalBlock.raw.match(/(\r?\n)+$/);
    if (trailingMatch) {
      trailingNewlines = trailingMatch[0];
    }
  }

  switch (node.type.name) {
    case 'heading': {
      const level = (node.attrs.level as number) || 1;
      const hashes = '#'.repeat(level);
      const text = node.textContent;
      return `${hashes} ${text}${trailingNewlines}`;
    }

    case 'paragraph': {
      const text = node.textContent;
      return `${text}${trailingNewlines}`;
    }

    case 'code_block': {
      const params = (node.attrs.params as string) || '';
      const text = node.textContent;
      // Preserve fence style if original was tildes
      const fenceMarker = originalBlock && originalBlock.raw.startsWith('~~~') ? '~~~' : '```';
      return `${fenceMarker}${params}\n${text}\n${fenceMarker}${trailingNewlines}`;
    }

    case 'math_block': {
      const text = node.textContent;
      return `$$\n${text}\n$$${trailingNewlines}`;
    }

    case 'blockquote': {
      const lines = node.textContent.split('\n');
      const quoted = lines.map(l => `> ${l}`).join('\n');
      return `${quoted}${trailingNewlines}`;
    }

    default:
      return originalBlock ? originalBlock.raw : node.textContent;
  }
}

/**
 * Surgical patch synchronizer:
 * Replaces ONLY modified block source slices in the original Markdown.
 * Untouched blocks remain 100% byte-for-byte identical.
 */
export function patchMarkdownFromProseMirror(
  originalMd: string,
  modifiedDoc: ProseNode,
  map: BlockMap
): string {
  // Fast check: zero-edit invariant
  const blockCount = modifiedDoc.childCount;
  const originalBlocks = map.blocks;

  if (blockCount === 0) return originalMd;

  // Build block map lookup
  const origBlockById = new Map<string, SourceBlock>();
  for (const b of originalBlocks) {
    origBlockById.set(b.id, b);
  }

  // Check which nodes are modified
  let hasModifications = false;
  interface BlockReplacement {
    from: number;
    to: number;
    newText: string;
  }
  const replacements: BlockReplacement[] = [];

  for (let i = 0; i < blockCount; i++) {
    const child = modifiedDoc.child(i);
    const blockId = child.attrs.blockId as string;
    const origBlock = origBlockById.get(blockId);

    if (!origBlock) {
      // New block inserted
      hasModifications = true;
      const prevChild = i > 0 ? modifiedDoc.child(i - 1) : null;
      const prevOrig = prevChild ? origBlockById.get(prevChild.attrs.blockId as string) : null;
      const insertAt = prevOrig ? prevOrig.to : (replacements.length > 0 ? replacements[replacements.length - 1].to : originalMd.length);
      const newText = serializeBlockNode(child);
      replacements.push({ from: insertAt, to: insertAt, newText });
      continue;
    }

    // Check if content changed
    const currentSerialized = serializeBlockNode(child, origBlock);
    const currentHash = hashString(currentSerialized);

    // If text or attributes changed
    if (currentHash !== origBlock.hash && currentSerialized !== origBlock.raw) {
      hasModifications = true;
      replacements.push({
        from: origBlock.from,
        to: origBlock.to,
        newText: currentSerialized,
      });
    }
  }

  // Also check if any original blocks were deleted
  const currentBlockIds = new Set<string>();
  for (let i = 0; i < blockCount; i++) {
    const id = modifiedDoc.child(i).attrs.blockId as string;
    if (id) currentBlockIds.add(id);
  }

  for (const origBlock of originalBlocks) {
    if (!currentBlockIds.has(origBlock.id)) {
      hasModifications = true;
      replacements.push({
        from: origBlock.from,
        to: origBlock.to,
        newText: '',
      });
    }
  }

  // If no modifications detected, return original byte-for-byte
  if (!hasModifications) {
    return originalMd;
  }

  // Sort replacements from bottom to top so offsets don't shift during string splicing
  replacements.sort((a, b) => b.from - a.from);

  let result = originalMd;
  for (const rep of replacements) {
    result = result.slice(0, rep.from) + rep.newText + result.slice(rep.to);
  }

  return result;
}
