<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { CalloutType } from '../../markdown/plugins/remark_callouts';

  let {
    type = 'note',
    title,
    children,
  }: {
    type?: CalloutType;
    title?: string;
    children?: Snippet;
  } = $props();

  const CALLOUT_ICONS: Record<CalloutType, string> = {
    note: 'ℹ️',
    info: 'ℹ️',
    tip: '💡',
    warning: '⚠️',
    danger: '🛑',
    caution: '⚠️',
    success: '✅',
  };

  const displayTitle = $derived(title || type.toUpperCase());
</script>

<div class="callout callout-{type}" role="alert">
  <div class="callout-header">
    <span class="callout-icon">{CALLOUT_ICONS[type] || 'ℹ️'}</span>
    <span class="callout-title">{displayTitle}</span>
  </div>
  <div class="callout-body">
    {#if children}
      {@render children()}
    {/if}
  </div>
</div>

<style>
  .callout {
    margin: 1.25rem 0;
    padding: 12px 16px;
    border-radius: 8px;
    border-left: 4px solid var(--accent-primary, #818cf8);
    background: rgba(255, 255, 255, 0.03);
  }
  :global([dir="rtl"]) .callout {
    border-left: none;
    border-right: 4px solid var(--accent-primary, #818cf8);
  }
  .callout-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 6px;
  }
  .callout-body {
    font-size: 13px;
    line-height: 1.6;
    color: var(--text-muted, #94a3b8);
  }
  .callout-note,
  .callout-info {
    border-color: #38bdf8;
    background: rgba(56, 189, 248, 0.06);
  }
  .callout-tip {
    border-color: #10b981;
    background: rgba(16, 185, 129, 0.06);
  }
  .callout-warning,
  .callout-caution {
    border-color: #f59e0b;
    background: rgba(245, 158, 11, 0.06);
  }
  .callout-danger {
    border-color: #ef4444;
    background: rgba(239, 68, 68, 0.06);
  }
  .callout-success {
    border-color: #22c55e;
    background: rgba(34, 197, 94, 0.06);
  }
</style>
