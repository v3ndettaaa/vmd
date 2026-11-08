/**
 * VMD Performance Benchmark Suite
 * Measures input latency, scroll frame rates, memory RSS, and startup time.
 */

export interface BenchmarkMetrics {
  fixtureName: string;
  wordCount: number;
  scroll60fpsRatio: number; // Percentage of frames <= 16.6ms
  scroll30fpsRatio: number; // Percentage of frames <= 33.3ms
  inputLatencyP50Ms: number;
  inputLatencyP95Ms: number;
  inputLatencyP99Ms: number;
  memoryRssMb: number;
}

/**
 * Calculates percentiles from sorted array of duration measurements
 */
export function calculatePercentile(values: number[], percentile: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.ceil((percentile / 100) * sorted.length) - 1;
  return sorted[Math.max(0, Math.min(index, sorted.length - 1))];
}

/**
 * Evaluates frame rate distribution against 60fps (16.6ms) and 30fps (33.3ms) thresholds
 */
export function evaluateFrameRates(frameDurationsMs: number[]): { fps60: number; fps30: number } {
  if (frameDurationsMs.length === 0) return { fps60: 100, fps30: 100 };

  const count60 = frameDurationsMs.filter(d => d <= 16.67).length;
  const count30 = frameDurationsMs.filter(d => d <= 33.34).length;

  return {
    fps60: Math.round((count60 / frameDurationsMs.length) * 10000) / 100,
    fps30: Math.round((count30 / frameDurationsMs.length) * 10000) / 100,
  };
}
