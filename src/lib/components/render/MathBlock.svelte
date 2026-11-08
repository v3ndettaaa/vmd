<script lang="ts">
  import { renderKaTeX } from '../../renderers/katex_renderer';

  let { math = '' }: { math: string } = $props();

  const rendered = $derived(renderKaTeX(math, true));
</script>

<div class="math-block-container" dir="ltr">
  {#if rendered.html}
    {@html rendered.html}
  {/if}
</div>

<style>
  .math-block-container {
    margin: 1.25rem 0;
    padding: 1rem;
    overflow-x: auto;
    text-align: center;
    direction: ltr;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 8px;
    border: 1px solid var(--border-subtle, #272732);
  }
</style>
