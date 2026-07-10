#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if [[ ! -f _config.yml ]]; then
  echo "error: repository root could not be resolved" >&2
  exit 1
fi

BUNDLE_BIN="$(command -v bundle || true)"
if [[ -z "$BUNDLE_BIN" ]]; then
  BUNDLE_BIN="$(ruby -e 'spec = Gem::Specification.find_by_name("bundler"); print File.join(spec.full_gem_path, "exe", "bundle")' 2>/dev/null || true)"
fi
if [[ -z "$BUNDLE_BIN" || ! -x "$BUNDLE_BIN" ]]; then
  echo "error: Bundler is not installed. Run: gem install bundler" >&2
  exit 1
fi

"$BUNDLE_BIN" check >/dev/null 2>&1 || "$BUNDLE_BIN" install
bash _scripts/verify.sh

echo "Production build completed in _site/."
echo "Push main/master to deploy through .github/workflows/pages.yml."
