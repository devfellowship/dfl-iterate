#!/usr/bin/env bash
# verify-docs.sh — Validate that documentation matches reality.
# Usage: ./verify-docs.sh [DOCS_FILE] (default: CLAUDE.md)
set -euo pipefail

DOCS="${1:-CLAUDE.md}"
ERRORS=0

if [ ! -f "$DOCS" ]; then
  echo "FATAL: $DOCS not found"; exit 1
fi

echo "=== Verifying $DOCS ==="

# 1. Check file path references exist
echo "--- File path references ---"
grep -oE '(src|lib|app|packages|scripts|config|public)/[A-Za-z0-9_./-]+' "$DOCS" | sort -u | while read -r p; do
  if [ ! -e "$p" ]; then
    echo "MISSING: $p"
    ERRORS=$((ERRORS + 1))
  fi
done

# 2. Check env vars are actually read in source
echo "--- Environment variables ---"
grep -oE '[A-Z_]{2,}=[^ ]*' "$DOCS" | cut -d= -f1 | sort -u | while read -r var; do
  if ! grep -rq "$var" src/ lib/ app/ 2>/dev/null; then
    echo "UNUSED ENV: $var (documented but not found in source)"
  fi
done

# 3. Check documented API routes exist in code
echo "--- API routes ---"
grep -oE '(GET|POST|PUT|PATCH|DELETE) /api/[^ )\`]*' "$DOCS" | while read -r method route; do
  if ! grep -rq "${route}" src/ app/ pages/ 2>/dev/null; then
    echo "MISSING ROUTE: $method $route"
  fi
done

# 4. Check setup commands actually run (dry-run parse only)
echo "--- Setup commands ---"
grep -E '^\s*(npm|pnpm|yarn|bun|npx|make|cargo|pip) ' "$DOCS" | head -5 | while read -r cmd; do
  tool=$(echo "$cmd" | awk '{print $1}')
  if ! command -v "$tool" &>/dev/null; then
    echo "TOOL NOT FOUND: $tool (used in setup commands)"
  fi
done

# 5. Check package.json scripts referenced in docs
echo "--- Package scripts ---"
if [ -f "package.json" ]; then
  grep -oE 'npm run [a-z:_-]+' "$DOCS" | sed 's/npm run //' | while read -r script; do
    if ! jq -e ".scripts.\"$script\"" package.json &>/dev/null; then
      echo "MISSING SCRIPT: npm run $script"
    fi
  done
fi

echo "=== Done ==="
