#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

command -v node >/dev/null 2>&1 || { echo "error: Node.js is required for JavaScript syntax validation" >&2; exit 1; }
command -v bundle >/dev/null 2>&1 || { echo "error: Bundler is required" >&2; exit 1; }

printf '%s\n' '[1/4] JavaScript syntax'
node --check assets/js/app.js

printf '%s\n' '[2/4] Python helper syntax'
python3 -m py_compile _scripts/import_tistory.py _scripts/verify_site.py

printf '%s\n' '[3/4] Production Jekyll build'
rm -rf _site
JEKYLL_ENV=production bundle exec jekyll build --trace

printf '%s\n' '[4/4] Generated site integrity'
python3 _scripts/verify_site.py _site
