import { describe, it, expect } from 'vitest';
import { renderKaTeX } from '../src/lib/renderers/katex_renderer';
import { parseChartOptions } from '../src/lib/renderers/echarts_renderer';

describe('Task M3.3: Rich Interactive Components', () => {
  it('renders complex math equations via KaTeX', () => {
    const math = 'E = mc^2';
    const res = renderKaTeX(math, true);
    expect(res.html).toContain('class="katex"');
    expect(res.error).toBeUndefined();
  });

  it('validates and safely parses ECharts configuration', () => {
    const json = JSON.stringify({
      xAxis: { type: 'category', data: ['A', 'B', 'C'] },
      yAxis: { type: 'value' },
      series: [{ data: [120, 200, 150], type: 'line' }],
    });
    const parsed = parseChartOptions(json);
    expect(parsed.options).toBeDefined();
    expect(parsed.error).toBeUndefined();
  });
});
