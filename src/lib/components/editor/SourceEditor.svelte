<script lang="ts">
  import { onMount } from 'svelte';
  import { EditorView } from '@codemirror/view';
  import { EditorState } from '@codemirror/state';
  import { buildEditorExtensions } from './codemirror_extensions';
  import { shellStore } from '../../stores/shell_store.svelte';

  let {
    value = $bindable(''),
    onchange,
    onscroll,
  }: {
    value?: string;
    onchange?: (val: string) => void;
    onscroll?: (top: number, height: number, clientHeight: number) => void;
  } = $props();

  let editorContainer = $state<HTMLDivElement | null>(null);
  let view: EditorView | null = null;
  let isInternalUpdate = false;

  onMount(() => {
    if (!editorContainer) return;

    const extensions = buildEditorExtensions({
      onChange: (newVal) => {
        isInternalUpdate = true;
        value = newVal;
        onchange?.(newVal);
        isInternalUpdate = false;
      },
      onCursor: (stats) => {
        shellStore.updateStats({
          cursorLine: stats.line,
          cursorCol: stats.col,
          lines: stats.lines,
          chars: stats.chars,
          words: stats.words,
        });
      },
    });

    view = new EditorView({
      state: EditorState.create({
        doc: value,
        extensions: [
          ...extensions,
          EditorView.domEventHandlers({
            scroll: (event) => {
              const target = event.target as HTMLElement;
              if (target && onscroll) {
                onscroll(target.scrollTop, target.scrollHeight, target.clientHeight);
              }
            },
          }),
        ],
      }),
      parent: editorContainer,
    });

    return () => {
      view?.destroy();
    };
  });

  $effect(() => {
    if (view && !isInternalUpdate && value !== view.state.doc.toString()) {
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: value },
      });
    }
  });

  export function getEditorView(): EditorView | null {
    return view;
  }
</script>

<div class="source-editor-wrapper" bind:this={editorContainer}></div>

<style>
  .source-editor-wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .source-editor-wrapper :global(.cm-editor) {
    height: 100%;
    width: 100%;
  }
</style>
