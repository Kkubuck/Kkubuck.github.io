#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

command -v ruby >/dev/null 2>&1 || { echo "error: Ruby is required" >&2; exit 1; }
command -v node >/dev/null 2>&1 || { echo "error: Node.js is required for JavaScript syntax validation" >&2; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo "error: Python 3 is required for generated-site validation" >&2; exit 1; }

BUNDLE_BIN="$(command -v bundle || true)"
if [[ -z "$BUNDLE_BIN" ]]; then
  BUNDLE_BIN="$(ruby -e 'spec = Gem::Specification.find_by_name("bundler"); print File.join(spec.full_gem_path, "exe", "bundle")' 2>/dev/null || true)"
fi
if [[ -z "$BUNDLE_BIN" || ! -x "$BUNDLE_BIN" ]]; then
  echo "error: Bundler is required" >&2
  exit 1
fi

printf '%s\n' '[1/5] Source integrity'
ruby _scripts/verify_source.rb

printf '%s\n' '[2/5] JavaScript syntax'
node --check assets/js/app.js

printf '%s\n' '[3/5] Helper script syntax'
python3 -m py_compile _scripts/import_tistory.py _scripts/verify_site.py
ruby -c _scripts/verify_source.rb >/dev/null
bash -n _scripts/verify.sh _scripts/publish.sh

printf '%s\n' '[4/5] Production Jekyll build'
rm -rf _site
JEKYLL_ENV=production "$BUNDLE_BIN" exec jekyll build --trace

printf '%s\n' '[5/5] Generated site integrity'
python3 _scripts/verify_site.py _site
