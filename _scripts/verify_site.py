#!/usr/bin/env python3
"""Validate the generated Jekyll site without third-party Python packages."""

from __future__ import annotations

import argparse
import json
import re
import sys
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlparse

SITE_HOSTS = {"kkubuck.github.io", "www.kkubuck.github.io"}
SKIP_SCHEMES = {"mailto", "tel", "javascript", "data", "blob"}
ASSET_ATTRS = {"src", "href", "poster"}


class DocumentParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.ids: list[str] = []
        self.references: list[tuple[str, str, int]] = []
        self.html_lang = ""
        self.title_depth = 0
        self.title = ""
        self.has_main = False
        self.has_h1 = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attr_map = {key.lower(): value or "" for key, value in attrs}
        if tag == "html":
            self.html_lang = attr_map.get("lang", "")
        elif tag == "title":
            self.title_depth += 1
        elif tag == "main":
            self.has_main = True
        elif tag == "h1":
            self.has_h1 = True

        element_id = attr_map.get("id")
        if element_id:
            self.ids.append(element_id)

        for name in ASSET_ATTRS:
            value = attr_map.get(name)
            if value:
                self.references.append((name, value.strip(), self.getpos()[0]))

        srcset = attr_map.get("srcset")
        if srcset:
            for candidate in srcset.split(","):
                value = candidate.strip().split()[0] if candidate.strip() else ""
                if value:
                    self.references.append(("srcset", value, self.getpos()[0]))

    def handle_endtag(self, tag: str) -> None:
        if tag == "title" and self.title_depth:
            self.title_depth -= 1

    def handle_data(self, data: str) -> None:
        if self.title_depth:
            self.title += data


def candidate_for_path(site: Path, web_path: str) -> Path | None:
    path = unquote(web_path).split("?", 1)[0]
    if not path or path == "/":
        return site / "index.html"

    normalized = path.lstrip("/")
    direct = site / normalized
    candidates = [direct]

    if path.endswith("/"):
        candidates.append(direct / "index.html")
    else:
        candidates.extend(
            [
                site / f"{normalized}.html",
                direct / "index.html",
            ]
        )

    for candidate in candidates:
        if candidate.is_file():
            return candidate
    return None


def resolve_reference(site: Path, page: Path, raw: str) -> tuple[Path | None, str]:
    parsed = urlparse(raw)
    if parsed.scheme.lower() in SKIP_SCHEMES:
        return None, ""
    if parsed.scheme in {"http", "https"} and parsed.netloc.lower() not in SITE_HOSTS:
        return None, ""
    if parsed.netloc and parsed.netloc.lower() not in SITE_HOSTS:
        return None, ""

    fragment = unquote(parsed.fragment)
    if parsed.scheme in {"http", "https"} or raw.startswith("//"):
        web_path = parsed.path or "/"
    elif raw.startswith("/"):
        web_path = parsed.path
    elif not parsed.path:
        return page, fragment
    else:
        current_web_dir = "/" + str(page.relative_to(site).parent).replace("\\", "/") + "/"
        web_path = urlparse(urljoin(current_web_dir, parsed.path)).path

    return candidate_for_path(site, web_path), fragment


def parse_html(path: Path) -> DocumentParser:
    parser = DocumentParser()
    parser.feed(path.read_text(encoding="utf-8", errors="replace"))
    return parser


def validate(site: Path) -> list[str]:
    errors: list[str] = []
    required = [
        "index.html",
        "papers/index.html",
        "blog/index.html",
        "projects/index.html",
        "tags/index.html",
        "cv/index.html",
        "about/index.html",
        "404.html",
        "assets/css/main.css",
        "assets/js/app.js",
        "assets/icons.svg",
        "assets/img/og-card.png",
        "search.json",
        "site.webmanifest",
    ]
    for item in required:
        if not (site / item).is_file():
            errors.append(f"missing required output: {item}")

    html_files = sorted(site.rglob("*.html"))
    if not html_files:
        return ["no HTML files were generated"]

    parsed_documents: dict[Path, DocumentParser] = {}
    for html_file in html_files:
        rel = html_file.relative_to(site)
        text = html_file.read_text(encoding="utf-8", errors="replace")
        if "{{" in text or "{%" in text:
            errors.append(f"unrendered Liquid marker: {rel}")

        parsed = parse_html(html_file)
        parsed_documents[html_file.resolve()] = parsed
        duplicates = [value for value, count in Counter(parsed.ids).items() if count > 1]
        if duplicates:
            errors.append(f"duplicate id(s) in {rel}: {', '.join(duplicates[:8])}")
        if not parsed.html_lang:
            errors.append(f"missing html[lang]: {rel}")
        if not parsed.title.strip():
            errors.append(f"missing <title>: {rel}")
        if not parsed.has_main:
            errors.append(f"missing <main>: {rel}")
        if not parsed.has_h1:
            errors.append(f"missing <h1>: {rel}")

    checked_references: set[tuple[Path, str]] = set()
    for html_file, parsed in parsed_documents.items():
        rel = html_file.relative_to(site.resolve())
        for attr, raw, line in parsed.references:
            if raw in {"#", "/#"}:
                continue
            target, fragment = resolve_reference(site.resolve(), html_file, raw)
            if target is None:
                parsed_url = urlparse(raw)
                if parsed_url.scheme or raw.startswith("//"):
                    continue
                errors.append(f"broken {attr} in {rel}:{line}: {raw}")
                continue

            key = (target.resolve(), fragment)
            if key in checked_references:
                continue
            checked_references.add(key)

            if not target.exists():
                errors.append(f"broken {attr} in {rel}:{line}: {raw}")
                continue

            if fragment and target.suffix.lower() in {".html", ""}:
                resolved = target.resolve()
                target_doc = parsed_documents.get(resolved)
                if target_doc is None and target.is_file() and target.suffix == ".html":
                    target_doc = parse_html(target)
                    parsed_documents[resolved] = target_doc
                if target_doc is not None and fragment not in set(target_doc.ids):
                    errors.append(f"missing fragment #{fragment} referenced by {rel}:{line}: {raw}")

    # Validate machine-readable outputs.
    search_path = site / "search.json"
    if search_path.is_file():
        try:
            search_data = json.loads(search_path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as exc:
            errors.append(f"invalid search.json: {exc}")
        else:
            if not isinstance(search_data, list) or len(search_data) < 1:
                errors.append("search.json must be a non-empty array")
            for index, item in enumerate(search_data):
                if not isinstance(item, dict) or not {"title", "url", "date"}.issubset(item):
                    errors.append(f"search.json item {index} is missing required fields")
                    break

    manifest_path = site / "site.webmanifest"
    if manifest_path.is_file():
        try:
            manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as exc:
            errors.append(f"invalid site.webmanifest: {exc}")
        else:
            for key in ("name", "short_name", "start_url", "icons"):
                if key not in manifest:
                    errors.append(f"site.webmanifest missing key: {key}")

    # Check local URLs embedded in compiled CSS.
    css_path = site / "assets/css/main.css"
    if css_path.is_file():
        css = css_path.read_text(encoding="utf-8", errors="replace")
        for raw in re.findall(r"url\((?:['\"])?([^)'\"]+)", css):
            raw = raw.strip()
            if raw.startswith(("data:", "http://", "https://", "//", "#", "%23")):
                continue
            parsed = urlparse(raw)
            if raw.startswith("/"):
                candidate = candidate_for_path(site, parsed.path)
            else:
                candidate = (css_path.parent / parsed.path).resolve()
            if candidate is None or not candidate.exists():
                errors.append(f"broken CSS url: {raw}")

    return errors


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("site", nargs="?", default="_site", type=Path)
    args = parser.parse_args()
    site = args.site.resolve()
    if not site.is_dir():
        print(f"error: site directory does not exist: {site}", file=sys.stderr)
        return 2

    errors = validate(site)
    if errors:
        print(f"Validation failed with {len(errors)} error(s):", file=sys.stderr)
        for error in errors:
            print(f"  - {error}", file=sys.stderr)
        return 1

    html_count = sum(1 for _ in site.rglob("*.html"))
    file_count = sum(1 for path in site.rglob("*") if path.is_file())
    print(f"Validation passed: {html_count} HTML documents, {file_count} generated files.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
