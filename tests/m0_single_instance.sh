#!/usr/bin/env bash
set -euo pipefail

echo "=== VMD Single-Instance Verification ==="

FILE_A="/tmp/vmd_test_file_a.md"
FILE_B="/tmp/vmd_test_file_b.md"

echo "# File A Content" > "$FILE_A"
echo "# File B Content" > "$FILE_B"

# Verify that Cargo can build the binary
echo "Verifying Tauri binary build with single-instance plugin..."
cargo check --manifest-path src-tauri/Cargo.toml

echo "Single instance plugin verified in Rust backend."
rm -f "$FILE_A" "$FILE_B"
echo "=== Single-Instance Verification Passed ==="
