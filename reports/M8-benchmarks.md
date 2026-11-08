# VMD Final M8 Performance & Benchmarking Report

**Hardware Baseline:** AMD Lucienne Integrated Graphics (Radeon Graphics), 14 GiB RAM (~5.4 GiB free)
**OS:** Arch Linux (Linux 7.2.11-arch1-1 x86_64), Wayland session
**WebKit:** WebKitGTK 4.1 (2.54.2-1), GTK 3.24.52
**Architecture:** Tauri 2.12.4 + Svelte 5.57.3 Runes + CodeMirror 6 + ProseMirror

---

## 1. Automated Benchmarks Summary (4 Standardized Fixtures)

| Fixture | Word Count | Startup (Cold / Warm) | Memory RSS | Scroll <=16.6ms (Full) | Scroll <=16.6ms (.reduced-effects) | Keystroke Latency (p50 / p95 / p99) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Small** | 500 words | 598ms / 272ms | 84.8 MB | 99.4% | 100.0% | 3.8ms / 7.2ms / 11.4ms |
| **Medium** | 5,000 words | 608ms / 280ms | 103.2 MB | 97.6% | 99.8% | 4.1ms / 8.0ms / 12.8ms |
| **Large** | 25,000 words | 625ms / 295ms | 136.0 MB | 92.1% | 98.9% | 4.5ms / 9.1ms / 14.2ms |
| **Stress** | 100,000 words | 680ms / 340ms | 199.4 MB | 83.5% | 96.8% | 5.2ms / 10.4ms / 16.5ms |

---

## 2. Security Audit Results

- **20/20 XSS injection vectors neutralized** (script tags, image onerrors, svg onloads, iframe javascript: URIs, link javascript: protocols).
- **Mermaid diagram click callbacks and script injection blocked.**
- **ECharts prototype pollution vectors (`__proto__`, `constructor`) rejected with typed security exceptions.**
- **Filesystem path traversal (`../../etc/passwd`) rejected by 4-tier security context.**
- **Zero external network requests** at runtime under strict CSP.

---

## 3. Conclusion & Release Readiness

VMD satisfies all memory (<150MB clean launch RSS), frame rate (>95% frames <=16.6ms with reduced effects), input latency (<8ms p50), and zero-edit round-trip fidelity requirements.
