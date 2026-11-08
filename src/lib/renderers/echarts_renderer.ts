/**
 * VMD ECharts Declarative JSON Renderer
 * Safely parses and initializes ECharts instances with prototype pollution guards.
 */

import * as echarts from 'echarts';

export interface ChartParseResult {
  options?: Record<string, unknown>;
  error?: string;
}

const DANGEROUS_KEYS: Record<string, true> = {
  __proto__: true,
  constructor: true,
  prototype: true,
};

/**
 * Validates an object recursively against prototype pollution keys.
 */
function validateSafeObject(obj: unknown): boolean {
  if (!obj || typeof obj !== 'object') return true;

  if (Array.isArray(obj)) {
    return obj.every(validateSafeObject);
  }

  for (const key of Object.keys(obj)) {
    if (DANGEROUS_KEYS[key] === true) {
      return false;
    }
    const val = (obj as Record<string, unknown>)[key];
    if (typeof val === 'object' && val !== null) {
      if (!validateSafeObject(val)) return false;
    }
  }

  return true;
}

export function parseChartOptions(rawJson: string): ChartParseResult {
  // Check for dangerous keys in raw JSON string before and during parse
  if (/["'](?:__proto__|constructor|prototype)["']\s*:/i.test(rawJson)) {
    return { error: 'Security exception: Prototype pollution attempt detected in chart JSON' };
  }

  try {
    const parsed = JSON.parse(rawJson);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return { error: 'ECharts configuration must be a valid JSON object' };
    }

    if (Object.getPrototypeOf(parsed) !== Object.prototype && Object.getPrototypeOf(parsed) !== null) {
      return { error: 'Security exception: Prototype pollution attempt detected in chart JSON' };
    }

    if (!validateSafeObject(parsed)) {
      return { error: 'Security exception: Prototype pollution attempt detected in chart JSON' };
    }

    return { options: parsed as Record<string, unknown> };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { error: `Invalid JSON syntax: ${msg}` };
  }
}

/**
 * Initializes an ECharts chart instance in the provided container element.
 */
export function initChart(
  container: HTMLElement,
  options: Record<string, unknown>,
  theme: 'dark' | 'light' = 'dark'
): echarts.ECharts {
  const chart = echarts.init(container, theme, { renderer: 'canvas' });
  chart.setOption(options);
  return chart;
}
