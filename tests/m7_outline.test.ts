import { describe, it, expect } from 'vitest';
import { extractHeadings, slugify } from '../src/lib/markdown/toc_generator';

describe('Task M7.1: Document Outline & Table of Contents', () => {
  it('extracts H1-H6 headings with line numbers and hierarchy', () => {
    const md = `
# Main Title
Intro paragraph.

## Sub-section A
Text here.

### Nested Detail
Detail text.

\`\`\`markdown
# This is inside a code block, should be ignored
\`\`\`

## Sub-section B
More text.
`;
    const headings = extractHeadings(md);

    expect(headings.length).toBe(4);
    expect(headings[0].text).toBe('Main Title');
    expect(headings[0].level).toBe(1);
    expect(headings[0].id).toBe('main-title');

    expect(headings[1].text).toBe('Sub-section A');
    expect(headings[1].level).toBe(2);

    expect(headings[2].text).toBe('Nested Detail');
    expect(headings[2].level).toBe(3);

    expect(headings[3].text).toBe('Sub-section B');
    expect(headings[3].level).toBe(2);
  });

  it('slugifies Persian heading text correctly', () => {
    const persianText = 'مستندات معماری پروژه VMD';
    const slug = slugify(persianText);

    expect(slug).toBe('مستندات-معماری-پروژه-vmd');
  });

  it('disambiguates duplicate heading titles with suffix counter', () => {
    const md = `
# Duplicate
# Duplicate
# Duplicate
`;
    const headings = extractHeadings(md);
    expect(headings.length).toBe(3);
    expect(headings[0].id).toBe('duplicate');
    expect(headings[1].id).toBe('duplicate-1');
    expect(headings[2].id).toBe('duplicate-2');
  });
});
