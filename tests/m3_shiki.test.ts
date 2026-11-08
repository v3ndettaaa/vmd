import { describe, it, expect } from 'vitest';
import { highlightCode } from '../src/lib/markdown/shiki_highlighter';

describe('Task M3.2: Syntax Highlighting with Bundled Shiki', () => {
  it('highlights TypeScript code with bundled dark theme', async () => {
    const code = 'const count: number = 42;';
    const html = await highlightCode(code, 'typescript', true);

    expect(html).toContain('class="shiki');
    expect(html).toContain('count');
    expect(html).toContain('number');
  });

  it('highlights Rust code with bundled light theme', async () => {
    const code = 'fn main() { println!("Hello VMD"); }';
    const html = await highlightCode(code, 'rust', false);

    expect(html).toContain('class="shiki');
    expect(html).toContain('main');
  });

  it('highlights Python code correctly', async () => {
    const code = 'def greet(name: str):\n    return f"Hello {name}"';
    const html = await highlightCode(code, 'python', true);

    expect(html).toContain('class="shiki');
    expect(html).toContain('greet');
  });

  it('falls back safely for unknown language without throwing', async () => {
    const code = 'custom unknown code snippet';
    const html = await highlightCode(code, 'unknownlang', true);

    expect(html).toBeDefined();
    expect(html).toContain('custom unknown code snippet');
  });
});
