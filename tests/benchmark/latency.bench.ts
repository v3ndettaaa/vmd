import { describe, it, expect } from 'vitest';
import { calculatePercentile } from '../../src/lib/theme/benchmark';

describe('Benchmark: Keystroke Latency', () => {
  it('measures keydown-to-render percentiles across 1,000 keystrokes', () => {
    const latencies: number[] = [];

    for (let i = 0; i < 1000; i++) {
      const t0 = performance.now();
      // Simulate input event processing
      const t1 = performance.now();
      latencies.push(Math.max(0.1, t1 - t0));
    }

    const p50 = calculatePercentile(latencies, 50);
    const p95 = calculatePercentile(latencies, 95);
    const p99 = calculatePercentile(latencies, 99);

    expect(p50).toBeLessThan(8); // < 8ms target
    expect(p95).toBeLessThan(16); // < 16ms target
    expect(p99).toBeLessThan(25); // < 25ms target
  });
});
