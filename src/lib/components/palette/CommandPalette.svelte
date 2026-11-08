<script lang="ts">
  import { onMount } from 'svelte';
  import { filterCommands, type PaletteCommand } from '../../services/search_service';
  import { shellStore } from '../../stores/shell_store.svelte';
  import { themeStore } from '../../theme/theme_store.svelte';
  import { tabStore } from '../../stores/tab_store.svelte';

  let {
    isOpen = $bindable(false),
  }: {
    isOpen?: boolean;
  } = $props();

  let query = $state<string>('');
  let selectedIndex = $state<number>(0);
  let inputEl = $state<HTMLInputElement | null>(null);

  const commands: PaletteCommand[] = [
    {
      id: 'mode-source',
      title: 'Switch to Source Mode',
      category: 'View',
      shortcut: 'Ctrl+1',
      action: () => shellStore.setMode('source'),
    },
    {
      id: 'mode-live',
      title: 'Switch to Live Mode',
      category: 'View',
      shortcut: 'Ctrl+2',
      action: () => shellStore.setMode('live'),
    },
    {
      id: 'mode-split',
      title: 'Switch to Split Mode',
      category: 'View',
      shortcut: 'Ctrl+3',
      action: () => shellStore.setMode('split'),
    },
    {
      id: 'mode-reading',
      title: 'Switch to Reading Mode',
      category: 'View',
      shortcut: 'Ctrl+4',
      action: () => shellStore.setMode('reading'),
    },
    {
      id: 'new-doc',
      title: 'New Document',
      category: 'File',
      shortcut: 'Ctrl+N',
      action: () => tabStore.openTab(`vmd://untitled-${Date.now()}.md`, '# New Document\n\n'),
    },
    {
      id: 'toggle-effects',
      title: 'Toggle Reduced Effects (Solid / Glass)',
      category: 'Editor',
      action: () => themeStore.toggleReducedEffects(),
    },
    {
      id: 'theme-obsidian',
      title: 'Set Theme: Obsidian Night',
      category: 'Theme',
      action: () => themeStore.setTheme('obsidian'),
    },
    {
      id: 'theme-amoled',
      title: 'Set Theme: Pure AMOLED',
      category: 'Theme',
      action: () => themeStore.setTheme('amoled'),
    },
    {
      id: 'theme-nord',
      title: 'Set Theme: Nordic Frost',
      category: 'Theme',
      action: () => themeStore.setTheme('nord'),
    },
    {
      id: 'theme-catppuccin',
      title: 'Set Theme: Catppuccin Mocha',
      category: 'Theme',
      action: () => themeStore.setTheme('catppuccin'),
    },
    {
      id: 'theme-paper',
      title: 'Set Theme: Warm Paper (Light)',
      category: 'Theme',
      action: () => themeStore.setTheme('paper'),
    },
    {
      id: 'theme-midnight',
      title: 'Set Theme: Midnight Glass',
      category: 'Theme',
      action: () => themeStore.setTheme('midnight'),
    },
  ];

  const filtered = $derived(filterCommands(commands, query));

  function execute(cmd: PaletteCommand) {
    cmd.action();
    isOpen = false;
    query = '';
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (!isOpen) {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'p')) {
        e.preventDefault();
        isOpen = true;
      }
      return;
    }

    if (e.key === 'Escape') {
      isOpen = false;
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = (selectedIndex + 1) % Math.max(1, filtered.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = (selectedIndex - 1 + filtered.length) % Math.max(1, filtered.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        execute(filtered[selectedIndex]);
      }
    }
  }

  $effect(() => {
    if (isOpen) {
      selectedIndex = 0;
      setTimeout(() => inputEl?.focus(), 50);
    }
  });

  onMount(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });
</script>

{#if isOpen}
  <div class="palette-backdrop" onclick={() => (isOpen = false)} onkeydown={(e) => e.key === 'Escape' && (isOpen = false)} role="presentation">
    <div class="palette-modal glass-panel" tabindex="-1" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
      <div class="search-input-wrapper">
        <span class="search-icon">🔍</span>
        <input
          bind:this={inputEl}
          type="text"
          class="palette-input"
          placeholder="Type a command or search..."
          bind:value={query}
        />
        <kbd class="esc-badge">ESC</kbd>
      </div>

      <div class="command-list" role="listbox">
        {#if filtered.length === 0}
          <div class="no-results">No matching commands</div>
        {:else}
          {#each filtered as cmd, i (cmd.id)}
            <button
              type="button"
              class="command-item {i === selectedIndex ? 'selected' : ''}"
              role="option"
              aria-selected={i === selectedIndex}
              onclick={() => execute(cmd)}
            >
              <div class="command-main">
                <span class="cmd-category">{cmd.category}</span>
                <span class="cmd-title">{cmd.title}</span>
              </div>
              {#if cmd.shortcut}
                <kbd class="shortcut">{cmd.shortcut}</kbd>
              {/if}
            </button>
          {/each}
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .palette-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.55);
    backdrop-filter: blur(4px);
    z-index: 2000;
    display: flex;
    justify-content: center;
    padding-top: 15vh;
  }
  .palette-modal {
    width: 540px;
    max-height: 420px;
    background: var(--bg-primary, #0d0d11);
    border: 1px solid var(--border-subtle, #272732);
    border-radius: 12px;
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .search-input-wrapper {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    gap: 10px;
    border-bottom: 1px solid var(--border-subtle, #272732);
  }
  .search-icon {
    font-size: 14px;
    opacity: 0.6;
  }
  .palette-input {
    flex: 1;
    background: transparent;
    border: none;
    color: var(--text-primary, #ffffff);
    font-size: 14px;
    outline: none;
  }
  .esc-badge {
    background: rgba(255, 255, 255, 0.08);
    color: var(--text-muted, #94a3b8);
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: inherit;
  }
  .command-list {
    flex: 1;
    overflow-y: auto;
    padding: 6px;
  }
  .no-results {
    padding: 20px;
    text-align: center;
    font-size: 13px;
    color: var(--text-muted, #94a3b8);
  }
  .command-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 38px;
    padding: 0 12px;
    background: transparent;
    border: none;
    border-radius: 6px;
    color: var(--text-primary, #e2e8f0);
    cursor: pointer;
    text-align: left;
    transition: all 0.1s ease;
  }
  .command-item.selected,
  .command-item:hover {
    background: rgba(129, 140, 248, 0.15);
    color: var(--accent-primary, #818cf8);
  }
  .command-main {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .cmd-category {
    font-size: 10px;
    text-transform: uppercase;
    color: var(--text-muted, #94a3b8);
    background: rgba(255, 255, 255, 0.05);
    padding: 1px 5px;
    border-radius: 3px;
  }
  .cmd-title {
    font-size: 13px;
  }
  .shortcut {
    font-size: 11px;
    color: var(--text-muted, #94a3b8);
    font-family: inherit;
  }
</style>
