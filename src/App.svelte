<script lang="ts">
  import { onMount } from 'svelte';
  import { invoke } from '@tauri-apps/api/core';
  import { themeStore } from './lib/theme/theme_store.svelte';
  import { onboardingStore } from './lib/components/welcome/onboarding_store.svelte';
  import { tabStore } from './lib/stores/tab_store.svelte';
  import { workspaceStore } from './lib/stores/workspace_store.svelte';
  import TitleBar from './lib/components/shell/TitleBar.svelte';
  import StatusBar from './lib/components/shell/StatusBar.svelte';
  import TabBar from './lib/components/tabs/TabBar.svelte';
  import FolderTree from './lib/components/sidebar/FolderTree.svelte';
  import DocumentOutline from './lib/components/outline/DocumentOutline.svelte';
  import EditorContainer from './lib/components/editor/EditorContainer.svelte';
  import CommandPalette from './lib/components/palette/CommandPalette.svelte';
  import WelcomeView from './lib/components/welcome/WelcomeView.svelte';

  let isPaletteOpen = $state<boolean>(false);
  let showOutline = $state<boolean>(true);

  onMount(async () => {
    themeStore.applyToDOM();
    try {
      await invoke<string>('ping');
    } catch {
      // Browser environment fallback
    }

    // Default sample note if no tabs open
    if (tabStore.tabs.length === 0) {
      await tabStore.openTab(
        'vmd://welcome.md',
        `# Welcome to VMD Workspace

VMD is an exceptionally fast, offline-first Markdown desktop workspace with first-class Persian/English bidirectional typography.

## Features
- **4 Editing Modes:** Source, Live (WYSIWYG), Split, and Reading
- **Bidi Typography:** Seamless Persian (وزیرمتن) and English (Google Sans Flex)
- **Rich Offline Visuals:** KaTeX math, Mermaid diagrams, and ECharts
- **Zero-edit Preservation:** Non-destructive surgical patch synchronization

### Sample Persian Paragraph
نرم‌افزار VMD یک ویرایشگر پیشرفته Markdown با پشتیبانی کامل از خط و زبان فارسی است.

### Mathematics
$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$
`
      );
    }
  });
</script>

<svelte:head>
  <link rel="stylesheet" href="/src/lib/typography/fonts.css" />
  <link rel="stylesheet" href="/src/lib/theme/effects.css" />
</svelte:head>

<div class="vmd-shell">
  <TitleBar />
  <TabBar />

  <main class="vmd-workspace">
    <FolderTree />

    <section class="editor-viewport">
      <EditorContainer />
    </section>

    {#if showOutline && tabStore.activeTab}
      <DocumentOutline markdown={tabStore.activeTab.content} />
    {/if}

    {#if !onboardingStore.hasCompletedOnboarding}
      <WelcomeView />
    {/if}

    <CommandPalette bind:isOpen={isPaletteOpen} />
  </main>

  <StatusBar />
</div>

<style>
  :global(:root) {
    --bg-primary: #0d0d11;
    --bg-secondary: #16161c;
    --surface-glass: rgba(22, 22, 28, 0.72);
    --border-subtle: #272732;
    --text-primary: #e2e8f0;
    --text-muted: #94a3b8;
    --accent-primary: #818cf8;
    --accent-hover: #6366f1;
    --selection-bg: rgba(129, 140, 248, 0.28);
    --code-bg: #121217;
  }

  :global(body) {
    margin: 0;
    padding: 0;
    font-family: var(--font-english, -apple-system, system-ui, sans-serif);
    background-color: var(--bg-primary);
    color: var(--text-primary);
    overflow: hidden;
    height: 100vh;
    width: 100vw;
  }

  .vmd-shell {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100vw;
  }

  .vmd-workspace {
    flex: 1;
    display: flex;
    overflow: hidden;
    position: relative;
  }

  .editor-viewport {
    flex: 1;
    height: 100%;
    overflow: hidden;
    display: flex;
  }
</style>
