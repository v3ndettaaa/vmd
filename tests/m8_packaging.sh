#!/usr/bin/env bash
set -euo pipefail

echo "=== Verifying Arch Linux Packaging Assets ==="

test -f packaging/arch/PKGBUILD
test -f packaging/arch/vmd.desktop
test -f packaging/arch/vmd.xml
test -f packaging/arch/vmd.svg
test -f LICENSE
test -f THIRD_PARTY_LICENSES.md

# Validate desktop file
if command -v desktop-file-validate >/dev/null 2>&1; then
  desktop-file-validate packaging/arch/vmd.desktop
  echo "Desktop entry syntax: VALID"
fi

# Validate XML MIME info
if command -v xmllint >/dev/null 2>&1; then
  xmllint --noout packaging/arch/vmd.xml
  xmllint --noout packaging/arch/vmd.svg
  echo "XML & SVG syntax: VALID"
fi

grep -q "VMD" packaging/arch/vmd.desktop
grep -q "text/markdown" packaging/arch/vmd.xml
grep -q "Google Sans Flex" THIRD_PARTY_LICENSES.md
grep -q "Vazirmatn" THIRD_PARTY_LICENSES.md

echo "=== Arch Linux Packaging Verification Passed ==="
