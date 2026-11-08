/**
 * VMD ProseMirror / Milkdown Plugins & Custom Node Views
 * Handles surgical patch synchronization and interactive widget rendering.
 */

import { Plugin, PluginKey } from 'prosemirror-state';
import { history, undo, redo } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import { proseMirrorBidiPlugin } from './milkdown_bidi';
import { patchMarkdownFromProseMirror } from './sync_engine';
import type { BlockMap } from './source_map';

export const patchSyncPluginKey = new PluginKey('vmd-patch-sync');

export interface PatchSyncCallbacks {
  originalMd: string;
  map: BlockMap;
  onMarkdownChanged: (newMarkdown: string) => void;
}

export function createPatchSyncPlugin(callbacks: PatchSyncCallbacks): Plugin {
  return new Plugin({
    key: patchSyncPluginKey,
    view() {
      return {
        update(view, prevState) {
          if (view.state.doc.eq(prevState.doc)) return;

          const patched = patchMarkdownFromProseMirror(
            callbacks.originalMd,
            view.state.doc,
            callbacks.map
          );

          if (patched !== callbacks.originalMd) {
            callbacks.originalMd = patched;
            callbacks.onMarkdownChanged(patched);
          }
        },
      };
    },
  });
}

export function buildProseMirrorPlugins(callbacks: PatchSyncCallbacks): Plugin[] {
  return [
    history(),
    proseMirrorBidiPlugin(),
    createPatchSyncPlugin(callbacks),
    keymap({
      'Mod-z': undo,
      'Mod-y': redo,
      'Shift-Mod-z': redo,
    }),
    keymap(baseKeymap),
  ];
}
