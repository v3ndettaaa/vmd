<script lang="ts">
  import { onboardingStore } from './onboarding_store.svelte';
  import { THEMES } from '../../theme/theme_store.svelte';
  import type { ThemeId } from '../../theme/tokens';

  let currentStep = $state<number>(1);
  let selectedTheme = $state<ThemeId>('obsidian');
  let selectedLanguage = $state<'en' | 'fa'>('en');
  let selectedFontScale = $state<number>(1.0);
  let reducedEffects = $state<boolean>(false);

  const themeList = Object.values(THEMES);

  function finish(action: 'new' | 'open-file' | 'open-folder') {
    onboardingStore.completeOnboarding({
      theme: selectedTheme,
      language: selectedLanguage,
      fontScale: selectedFontScale,
      reducedEffects,
    });
  }
</script>

<div class="welcome-overlay">
  <div class="welcome-card glass-panel">
    <div class="welcome-header">
      <div class="logo-badge">
        <svg width="28" height="28" viewBox="0 0 512 512" fill="none">
          <rect width="480" height="480" x="16" y="16" rx="64" fill="var(--bg-secondary, #16161c)" stroke="var(--accent-primary, #818cf8)" stroke-width="24" />
          <path d="M160 160L256 360L352 160H300L256 260L212 160H160Z" fill="var(--accent-primary, #818cf8)" />
        </svg>
      </div>
      <h2>Welcome to VMD Workspace</h2>
      <p class="subtitle">Fast, offline Markdown workspace with first-class Persian & English typography</p>
    </div>

    <div class="step-progress">
      <span class="step-indicator {currentStep >= 1 ? 'active' : ''}">1. Theme</span>
      <span class="step-indicator {currentStep >= 2 ? 'active' : ''}">2. Language</span>
      <span class="step-indicator {currentStep >= 3 ? 'active' : ''}">3. Get Started</span>
    </div>

    {#if currentStep === 1}
      <div class="step-content">
        <h3>Choose your visual aesthetic</h3>
        <div class="theme-grid">
          {#each themeList as theme}
            <button
              type="button"
              class="theme-card {selectedTheme === theme.id ? 'selected' : ''}"
              onclick={() => (selectedTheme = theme.id)}
            >
              <div class="theme-swatch" style="background: {theme.tokens['--bg-primary']}; border-color: {theme.tokens['--border-subtle']}">
                <div class="swatch-accent" style="background: {theme.tokens['--accent-primary']}"></div>
              </div>
              <span class="theme-title">{theme.name}</span>
            </button>
          {/each}
        </div>
        <div class="actions">
          <button type="button" class="primary-btn" onclick={() => (currentStep = 2)}>Continue →</button>
        </div>
      </div>
    {:else if currentStep === 2}
      <div class="step-content">
        <h3>Language & Typography</h3>
        <div class="option-group">
          <span class="group-label">Primary Document Language</span>
          <div class="lang-selector">
            <button
              type="button"
              class="lang-card {selectedLanguage === 'en' ? 'selected' : ''}"
              onclick={() => (selectedLanguage = 'en')}
            >
              <strong>English</strong> (LTR)
              <p>Google Sans Flex & JetBrains Mono</p>
            </button>
            <button
              type="button"
              class="lang-card {selectedLanguage === 'fa' ? 'selected' : ''}"
              onclick={() => (selectedLanguage = 'fa')}
            >
              <strong>فارسی</strong> (RTL)
              <p>قلم وزیرمتن و فونت‌های استاندارد</p>
            </button>
          </div>
        </div>

        <div class="option-group">
          <label class="checkbox-label">
            <input type="checkbox" bind:checked={reducedEffects} />
            <span>Enable Reduced Effects (solid backgrounds, faster on low-end GPUs)</span>
          </label>
        </div>

        <div class="actions">
          <button type="button" class="secondary-btn" onclick={() => (currentStep = 1)}>← Back</button>
          <button type="button" class="primary-btn" onclick={() => (currentStep = 3)}>Continue →</button>
        </div>
      </div>
    {:else if currentStep === 3}
      <div class="step-content">
        <h3>Ready to write</h3>
        <p class="final-desc">All settings are saved locally and can be changed anytime in Settings.</p>
        <div class="quick-actions">
          <button type="button" class="action-card" onclick={() => finish('new')}>
            <span class="action-icon">📄</span>
            <div class="action-info">
              <strong>New Document</strong>
              <p>Create a blank Markdown note</p>
            </div>
          </button>
          <button type="button" class="action-card" onclick={() => finish('open-file')}>
            <span class="action-icon">📂</span>
            <div class="action-info">
              <strong>Open Markdown File</strong>
              <p>Open an existing .md file from disk</p>
            </div>
          </button>
          <button type="button" class="action-card" onclick={() => finish('open-folder')}>
            <span class="action-icon">📁</span>
            <div class="action-info">
              <strong>Open Workspace Folder</strong>
              <p>Browse a directory of documents</p>
            </div>
          </button>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .welcome-overlay {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(8px);
    z-index: 1000;
  }
  .welcome-card {
    width: 620px;
    padding: 32px;
    border-radius: 16px;
    background: var(--bg-primary, #0d0d11);
    border: 1px solid var(--border-subtle, #272732);
    color: var(--text-primary, #e2e8f0);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  }
  .welcome-header {
    text-align: center;
    margin-bottom: 24px;
  }
  .logo-badge {
    margin-bottom: 12px;
  }
  .welcome-header h2 {
    margin: 0 0 6px;
    font-size: 20px;
    font-weight: 600;
  }
  .subtitle {
    margin: 0;
    font-size: 13px;
    color: var(--text-muted, #94a3b8);
  }
  .step-progress {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-bottom: 24px;
    font-size: 12px;
  }
  .step-indicator {
    color: var(--text-muted, #94a3b8);
    padding: 4px 10px;
    border-radius: 12px;
  }
  .step-indicator.active {
    color: var(--accent-primary, #818cf8);
    font-weight: 600;
    background: rgba(129, 140, 248, 0.12);
  }
  .theme-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    margin-bottom: 24px;
  }
  .theme-card {
    background: var(--bg-secondary, #16161c);
    border: 1px solid var(--border-subtle, #272732);
    border-radius: 10px;
    padding: 12px;
    cursor: pointer;
    text-align: center;
    transition: all 0.15s ease;
  }
  .theme-card.selected {
    border-color: var(--accent-primary, #818cf8);
    box-shadow: 0 0 0 2px rgba(129, 140, 248, 0.3);
  }
  .theme-swatch {
    height: 48px;
    border-radius: 6px;
    border: 1px solid;
    position: relative;
    margin-bottom: 8px;
  }
  .swatch-accent {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    position: absolute;
    bottom: 6px;
    right: 6px;
  }
  .theme-title {
    font-size: 12px;
    color: var(--text-primary, #e2e8f0);
  }
  .option-group {
    margin-bottom: 20px;
  }
  .group-label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    color: var(--text-muted, #94a3b8);
    margin-bottom: 8px;
  }
  .lang-selector {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .lang-card {
    background: var(--bg-secondary, #16161c);
    border: 1px solid var(--border-subtle, #272732);
    border-radius: 10px;
    padding: 14px;
    cursor: pointer;
    text-align: left;
    color: inherit;
  }
  .lang-card.selected {
    border-color: var(--accent-primary, #818cf8);
    box-shadow: 0 0 0 2px rgba(129, 140, 248, 0.3);
  }
  .lang-card p {
    margin: 4px 0 0;
    font-size: 11px;
    color: var(--text-muted, #94a3b8);
  }
  .checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    cursor: pointer;
  }
  .quick-actions {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .action-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 14px 18px;
    background: var(--bg-secondary, #16161c);
    border: 1px solid var(--border-subtle, #272732);
    border-radius: 10px;
    cursor: pointer;
    text-align: left;
    color: inherit;
    transition: all 0.12s ease;
  }
  .action-card:hover {
    border-color: var(--accent-primary, #818cf8);
    background: rgba(129, 140, 248, 0.08);
  }
  .action-icon {
    font-size: 22px;
  }
  .action-info strong {
    display: block;
    font-size: 13px;
  }
  .action-info p {
    margin: 2px 0 0;
    font-size: 11px;
    color: var(--text-muted, #94a3b8);
  }
  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
  }
  .primary-btn {
    background: var(--accent-primary, #818cf8);
    color: #ffffff;
    border: none;
    padding: 8px 18px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
  }
  .secondary-btn {
    background: transparent;
    color: var(--text-muted, #94a3b8);
    border: 1px solid var(--border-subtle, #272732);
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 12px;
    cursor: pointer;
  }
</style>
