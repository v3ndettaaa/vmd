<script lang="ts">
  import { onMount } from 'svelte';
  import { EditorState } from 'prosemirror-state';
  import { EditorView } from 'prosemirror-view';
  import { vmdSchema } from '../../editor/prosemirror_nodes';
  import { parseToProseMirrorWithSourceMap } from '../../editor/sync_engine';
  import { buildProseMirrorPlugins } from '../../editor/milkdown_plugins';
  import { milkdownThemeCss } from '../../editor/milkdown_theme';

  let {
    value = $bindable(''),
    onchange,
  }: {
    value?: string;
    onchange?: (val: string) => void;
  } = $props();

  let containerEl = $state<HTMLDivElement | null>(null);
  let view: EditorView | null = null;
  let isInternalUpdate = false;

  onMount(() => {
    if (!containerEl) return;

    const { doc, map } = parseToProseMirrorWithSourceMap(value);

    const plugins = buildProseMirrorPlugins({
      originalMd: value,
      map,
      onMarkdownChanged: (newMd) => {
        isInternalUpdate = true;
        value = newMd;
        onchange?.(newMd);
        isInternalUpdate = false;
      },
    });

    const state = EditorState.create({
      schema: vmdSchema,
      doc,
      plugins,
    });

    view = new EditorView(containerEl, {
      state,
    });

    return () => {
      view?.destroy();
    };
  });

  $effect(() => {
    if (view && !isInternalUpdate) {
      const { doc: newDoc, map } = parseToProseMirrorWithSourceMap(value);
      if (!view.state.doc.eq(newDoc)) {
        const tr = view.state.tr.replaceWith(0, view.state.doc.content.size, newDoc.content);
        view.dispatch(tr);
      }
    }
  });

  export function getEditorView(): EditorView | null {
    return view;
  }
</script>

<svelte:head>
  {@html `<style>${milkdownThemeCss}</style>`}
</svelte:head>

<div class="live-editor-container" bind:this={containerEl}></div>

<style>
  .live-editor-container {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    background: var(--bg-primary, #0d0d11);
  }
  .live-editor-container :global(.ProseMirror) {
    min-height: 100%;
    padding: 32px 48px;
    max-width: 800px;
    margin: 0 auto;
    outline: none;
    color: var(--text-primary, #e2e8f0);
    font-size: 15px;
    line-height: 1.7;
  }
</style>
