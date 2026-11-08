import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('Task M0.1: VMD Skeleton & Tauri 2 / Svelte 5 Bridge Verification', () => {
  it('validates tauri.conf.json configuration', () => {
    const configPath = resolve(__dirname, '../src-tauri/tauri.conf.json');
    const content = JSON.parse(readFileSync(configPath, 'utf-8'));
    expect(content.productName).toBe('VMD');
    expect(content.identifier).toBe('com.vmd.desktop');
    expect(content.app?.windows?.[0]?.title).toBe('VMD');
    expect(content.app?.security?.csp).toContain("default-src 'self'");
  });

  it('validates Cargo.toml configuration', () => {
    const cargoPath = resolve(__dirname, '../src-tauri/Cargo.toml');
    const content = readFileSync(cargoPath, 'utf-8');
    expect(content).toContain('name = "vmd"');
    expect(content).toContain('name = "vmd_lib"');
    expect(content).toContain('tauri =');
  });

  it('validates App.svelte exists and contains VMD Workspace heading', () => {
    const appPath = resolve(__dirname, '../src/App.svelte');
    const content = readFileSync(appPath, 'utf-8');
    expect(content).toContain('VMD Workspace');
    expect(content).toContain("invoke<string>('ping')");
  });
});
