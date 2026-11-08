#!/usr/bin/env bash
set -euo pipefail

echo "=== Running VMD Automated Performance Benchmarks ==="

pnpm vitest run tests/benchmark/*.bench.ts

echo "=== Benchmarks Completed Successfully ==="
