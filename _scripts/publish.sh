#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if [[ ! -f _config.yml ]]; then
  echo "error: repository root could not be resolved" >&2
  exit 1
fi

if ! command -v bundle >/dev/null 2>&1; then
  echo "error: Bundler is not installed. Run: gem install bundler" >&2
  exit 1
fi

bundle check >/dev/null 2>&1 || bundle install
bash _scripts/verify.sh

echo "Production build completed in _site/."
echo "Push main/master to deploy through .github/workflows/pages.yml."
