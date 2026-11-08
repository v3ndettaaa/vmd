<script lang="ts">
  import { onMount } from 'svelte';
  import type { ECharts } from 'echarts';
  import { parseChartOptions, initChart } from '../../renderers/echarts_renderer';
  import { themeStore } from '../../theme/theme_store.svelte';

  let { config = '' }: { config: string } = $props();

  let containerEl = $state<HTMLDivElement | null>(null);
  let errorMsg = $state<string | null>(null);
  let chartInstance: ECharts | null = null;

  function renderChart() {
    if (!containerEl || !config.trim()) return;

    const parsed = parseChartOptions(config);
    if (parsed.error || !parsed.options) {
      errorMsg = parsed.error || 'Failed to parse chart';
      return;
    }

    errorMsg = null;
    if (chartInstance) {
      chartInstance.dispose();
    }

    try {
      chartInstance = initChart(
        containerEl,
        parsed.options,
        themeStore.currentTheme.isDark ? 'dark' : 'light'
      );
    } catch (err: unknown) {
      errorMsg = err instanceof Error ? err.message : String(err);
    }
  }

  $effect(() => {
    if (config) {
      renderChart();
    }
  });

  onMount(() => {
    renderChart();
    const handleResize = () => chartInstance?.resize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstance?.dispose();
    };
  });
</script>

<div class="echarts-block-container" dir="ltr">
  <div class="echarts-header">
    <span class="echarts-label">CHART</span>
  </div>
  {#if errorMsg}
    <div class="chart-error">
      <strong>Chart Error:</strong> {errorMsg}
    </div>
  {:else}
    <div class="chart-canvas" bind:this={containerEl}></div>
  {/if}
</div>

<style>
  .echarts-block-container {
    margin: 1.5rem 0;
    border-radius: 8px;
    border: 1px solid var(--border-subtle, #272732);
    background: var(--bg-secondary, #16161c);
    overflow: hidden;
    direction: ltr;
  }
  .echarts-header {
    height: 30px;
    padding: 0 12px;
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.03);
    border-bottom: 1px solid var(--border-subtle, #272732);
    font-size: 11px;
    color: var(--text-muted, #94a3b8);
  }
  .echarts-label {
    font-weight: 600;
    font-family: 'JetBrains Mono', monospace;
  }
  .chart-canvas {
    width: 100%;
    height: 320px;
  }
  .chart-error {
    padding: 16px;
    color: #ef4444;
    font-size: 12px;
  }
</style>
