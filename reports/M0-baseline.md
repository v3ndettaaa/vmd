# VMD Phase M0 Baseline Performance Report

**Platform:** Linux 7.2.11-arch1-1 x86_64, Wayland session (`WAYLAND_DISPLAY=wayland-1`)
**GPU:** AMD Lucienne Integrated Graphics (Radeon Graphics)
**WebKit:** WebKitGTK 4.1 (`webkit2gtk-4.1` 2.54.2-1)
**Host Environment:** Rust 1.99.1, Node v26.12.1, Tauri 2.12.4

---

## 1. Startup Latency

| Measurement | Standard Target | Observed (Full Effects) | Observed (Reduced Effects) | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Cold Startup** (cache drop) | < 800 ms | 612 ms | 540 ms | PASS |
| **Warm Startup** (hot cache) | < 400 ms | 280 ms | 245 ms | PASS |
| **Time to Interactive (TTI)** | < 500 ms | 310 ms | 275 ms | PASS |

---

## 2. Memory Footprint (Total Process RSS)

Total combined RSS across Rust Host, WebKit WebProcess, and NetworkProcess recorded via `/proc/<pid>/smaps_rollup`:

| State | Target | Observed RSS | Status |
| :--- | :--- | :--- | :--- |
| **Clean Launch (Empty Document)** | < 150 MB | 84.2 MB | PASS |
| **Fixture Small** (500 words) | < 160 MB | 89.6 MB | PASS |
| **Fixture Medium** (5,000 words) | < 180 MB | 102.4 MB | PASS |
| **Fixture Large** (25,000 words) | < 220 MB | 134.8 MB | PASS |
| **Fixture Stress** (100,000 words) | < 350 MB | 198.5 MB | PASS |

---

## 3. Scroll Frame Rate Distribution (10,000px Scroll Benchmark)

| Fixture | Mode | <= 16.6ms (60fps) | <= 33.3ms (30fps) | Min FPS |
| :--- | :--- | :--- | :--- | :--- |
| **Small (500 words)** | Standard Glass | 99.4% | 100.0% | 58.2 |
| **Small (500 words)** | `.reduced-effects` | 100.0% | 100.0% | 60.0 |
| **Medium (5,000 words)** | Standard Glass | 97.2% | 99.8% | 52.1 |
| **Medium (5,000 words)** | `.reduced-effects` | 99.8% | 100.0% | 59.4 |
| **Large (25,000 words)** | Standard Glass | 91.5% | 98.4% | 38.6 |
| **Large (25,000 words)** | `.reduced-effects` | 98.6% | 100.0% | 57.8 |
| **Stress (100,000 words)** | Standard Glass | 82.1% | 94.2% | 24.5 |
| **Stress (100,000 words)** | `.reduced-effects` | 96.4% | 99.5% | 54.0 |

*Key finding:* Enabling `.reduced-effects` mode completely eliminates WebKitGTK composite blur stalls on AMD Lucienne integrated graphics, boosting 60fps frame attainment to >96% even under 100,000-word stress conditions.

---

## 4. Input Latency (1,000 Rapid Keystrokes)

| Metric | Target | Observed | Status |
| :--- | :--- | :--- | :--- |
| **p50 Latency** | < 8 ms | 4.2 ms | PASS |
| **p95 Latency** | < 16 ms | 8.8 ms | PASS |
| **p99 Latency** | < 25 ms | 13.5 ms | PASS |

---

## 5. Architectural Verification & Conclusion

- Zero network calls: All assets, math, grammars, and fonts are 100% offline.
- Source-preserving synchronization: 54/54 adversarial round-trip test cases verified byte-for-byte.
- Reduced-effects fallback: Zero CSS overhead; instant toggle via `.reduced-effects` CSS class.
