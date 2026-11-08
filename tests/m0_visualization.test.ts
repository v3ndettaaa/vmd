import { describe, it, expect } from 'vitest';
import { renderKaTeX } from '../src/lib/renderers/katex_renderer';
import { parseChartOptions } from '../src/lib/renderers/echarts_renderer';

describe('Task M0.4: Strict Offline Visual Components Proof', () => {
  it('renders complex math formulas offline with bundled KaTeX', () => {
    const formula = '\\int_0^\\infty e^{-x} dx = 1';
    const result = renderKaTeX(formula, true);

    expect(result.error).toBeUndefined();
    expect(result.html).toContain('class="katex"');
    expect(result.html).toContain('class="katex-display"');
  });

  it('handles KaTeX syntax errors gracefully without throwing', () => {
    const invalidFormula = '\\int_{';
    const result = renderKaTeX(invalidFormula);

    // KaTeX with throwOnError: false returns error html or error span
    expect(result.html).toBeDefined();
    expect(result.html.length).toBeGreaterThan(0);
  });

  it('parses valid declarative ECharts JSON safely', () => {
    const validJson = JSON.stringify({
      title: { text: 'Monthly Notes Created' },
      xAxis: { data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
      yAxis: {},
      series: [{ type: 'bar', data: [5, 20, 36, 10, 10] }],
    });
    const result = parseChartOptions(validJson);
    expect(result.error).toBeUndefined();
    expect(result.options).toBeDefined();
    const titleObj = (result.options as Record<string, Record<string, unknown>>)?.title;
    expect(titleObj?.text).toBe('Monthly Notes Created');
  });

  it('blocks prototype pollution payloads in ECharts JSON', () => {
    const maliciousJson = '{"__proto__": {"polluted": true}, "series": []}';
    const result = parseChartOptions(maliciousJson);

    expect(result.error).toContain('Prototype pollution attempt detected');
    expect(result.options).toBeUndefined();
    expect('polluted' in Object.prototype).toBe(false);
  });

  it('blocks nested prototype pollution attempts in ECharts JSON', () => {
    const maliciousJson = '{"series": [{"type": "line", "constructor": {"prototype": {"admin": true}}}]}';
    const result = parseChartOptions(maliciousJson);

    expect(result.error).toContain('Prototype pollution attempt detected');
    expect(result.options).toBeUndefined();
  });
});
