import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { calculatePercentile, evaluateFrameRates } from '../src/lib/theme/benchmark';

describe('Task M0.6: WebKitGTK Performance Baselines & Reduced-Effects Fallback', () => {
  it('verifies effects.css provides glassmorphism and reduced-effects override rules', () => {
    const cssPath = resolve(__dirname, '../src/lib/theme/effects.css');
    const css = readFileSync(cssPath, 'utf-8');

    expect(css).toContain('--glass-blur: 16px');
    expect(css).toContain('--glass-bg: rgba(20, 20, 25, 0.72)');
    expect(css).toContain('--surface-solid: #141419');
    expect(css).toContain('.reduced-effects');
    expect(css).toContain('--glass-blur: 0px !important');
    expect(css).toContain('--glass-bg: var(--surface-solid) !important');
  });

  it('accurately computes latency percentiles and frame distributions', () => {
    const durations = [10, 12, 14, 16, 18, 20, 25, 30, 40, 50];
    const p50 = calculatePercentile(durations, 50);
    const p95 = calculatePercentile(durations, 95);
    const p99 = calculatePercentile(durations, 99);

    expect(p50).toBe(18);
    expect(p95).toBe(50);
    expect(p99).toBe(50);

    const frameSamples = [12, 14, 16, 16.5, 17, 22, 33, 40];
    const rates = evaluateFrameRates(frameSamples);

    // 4 out of 8 <= 16.67ms -> 50%
    expect(rates.fps60).toBe(50);
    // 7 out of 8 <= 33.34ms -> 87.5%
    expect(rates.fps30).toBe(87.5);
  });
});
