#!/usr/bin/env python3
"""Import public Tistory posts into this Jekyll blog.

The importer keeps the original HTML body so code blocks, tables, iframes, and
images survive the move with minimal loss. It removes Tistory-only wrappers and
unsafe event attributes, then writes deterministic `_posts` files.
"""

from __future__ import annotations

import html
import json
import mimetypes
import re
import sys
import time
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from dataclasses import dataclass
from datetime import datetime
from email.utils import parsedate_to_datetime
from pathlib import Path

from bs4 import BeautifulSoup


BLOG_URL = "https://jms3084.tistory.com"
ROOT = Path(__file__).resolve().parents[1]
POSTS_DIR = ROOT / "_posts"
IMAGE_DIR = ROOT / "assets" / "img" / "tistory"
USER_AGENT = "Mozilla/5.0 (compatible; KkubuckJekyllImporter/1.0)"


@dataclass
class ImportedPost:
    entry_id: int
    title: str
    date: datetime
    category_label: str
    tags: list[str]
    source_url: str
    body_html: str
    summary: str


def fetch(url: str) -> str:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read().decode("utf-8", errors="replace")


def post_urls_from_sitemap() -> list[str]:
    xml_text = fetch(f"{BLOG_URL}/sitemap.xml")
    root = ET.fromstring(xml_text)
    urls: list[str] = []
    seen: set[str] = set()
    for loc in root.findall(".//{*}loc"):
        if not loc.text:
            continue
        parsed = urllib.parse.urlparse(loc.text.strip())
        if parsed.netloc != "jms3084.tistory.com":
            continue
        if not re.fullmatch(r"/[0-9]+", parsed.path):
            continue
        url = f"{parsed.scheme}://{parsed.netloc}{parsed.path}"
        if url not in seen:
            seen.add(url)
            urls.append(url)
    return sorted(urls, key=lambda value: int(value.rstrip("/").rsplit("/", 1)[-1]))


def meta_content(soup: BeautifulSoup, selector: str) -> str:
    node = soup.select_one(selector)
    return node.get("content", "").strip() if node else ""


def parse_entry_info(html_text: str) -> dict[str, object]:
    match = re.search(r"window\.T\.entryInfo\s*=\s*(\{.*?\});", html_text)
    if not match:
        return {}
    try:
        return json.loads(match.group(1))
    except json.JSONDecodeError:
        return {}


def parse_tiara_tags(html_text: str) -> list[str]:
    match = re.search(r'"tags"\s*:\s*(\[[^\]]*\])', html_text)
    if not match:
        return []
    try:
        raw_tags = json.loads(match.group(1))
    except json.JSONDecodeError:
        return []

    tags: list[str] = []
    for raw in raw_tags:
        for part in re.split(r"#|,", str(raw)):
            tag = part.strip()
            if tag:
                tags.append(tag)
    return tags


def parse_date(soup: BeautifulSoup) -> datetime:
    value = meta_content(soup, 'meta[property="article:published_time"]')
    if value:
        return datetime.fromisoformat(value)

    date_text = soup.select_one(".heading time.date")
    if date_text:
        parsed = datetime.strptime(date_text.get_text(" ", strip=True), "%Y. %m. %d. %H:%M")
        return parsed.replace(tzinfo=datetime.now().astimezone().tzinfo)

    rss = fetch(f"{BLOG_URL}/rss")
    for item in ET.fromstring(rss).find("channel").findall("item"):
        if item.findtext("link", "").rstrip("/") == meta_content(soup, 'meta[property="og:url"]').rstrip("/"):
            return parsedate_to_datetime(item.findtext("pubDate"))

    raise ValueError("Could not parse post date")


def clean_body(content: BeautifulSoup) -> str:
    for node in content.select("script, style, iframe[src='about:blank']"):
        node.decompose()

    for wrapper in content.select("span[data-url]"):
        wrapper.unwrap()

    for empty in content.find_all(["p", "div"]):
        if empty.find(["img", "iframe", "pre", "table", "figure"]):
            continue
        if empty.get_text(strip=True) in {"", "\xa0"}:
            empty.decompose()

    allowed_attrs = {
        "a": {"href", "title", "target", "rel"},
        "img": {"src", "alt", "title", "loading"},
        "iframe": {"src", "title", "loading", "allow", "allowfullscreen"},
        "code": {"class"},
        "pre": {"class"},
        "figure": {"class"},
        "figcaption": set(),
        "table": set(),
        "thead": set(),
        "tbody": set(),
        "tr": set(),
        "th": set(),
        "td": {"colspan", "rowspan"},
        "blockquote": set(),
        "ol": set(),
        "ul": set(),
        "li": set(),
        "h1": set(),
        "h2": set(),
        "h3": set(),
        "h4": set(),
        "p": set(),
        "strong": set(),
        "b": set(),
        "em": set(),
        "i": set(),
        "br": set(),
    }

    for node in content.find_all(True):
        tag = node.name.lower()
        if tag not in allowed_attrs:
            node.unwrap()
            continue

        for attr in list(node.attrs):
            if attr.startswith("on") or attr not in allowed_attrs[tag]:
                del node.attrs[attr]

        if tag == "img":
            node["loading"] = "lazy"
            if not node.get("alt"):
                node["alt"] = ""
        if tag == "iframe":
            node["loading"] = "lazy"
            if not node.get("title"):
                node["title"] = "Embedded content"
        if tag == "a" and node.get("target") == "_blank":
            node["rel"] = "noopener noreferrer"

    body = content.decode_contents(formatter="html").strip()
    return body


def image_extension(url: str, content_type: str) -> str:
    parsed = urllib.parse.urlparse(url)
    suffix = Path(parsed.path).suffix.lower()
    if suffix in {".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"}:
        return suffix
    guessed = mimetypes.guess_extension(content_type.split(";", 1)[0].strip())
    if guessed == ".jpe":
        return ".jpg"
    return guessed or ".png"


def download_binary(url: str) -> tuple[bytes, str]:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read(), response.headers.get("Content-Type", "")


def localize_images(content: BeautifulSoup, entry_id: int) -> None:
    post_image_dir = IMAGE_DIR / str(entry_id)
    image_index = 1

    for img in content.find_all("img"):
        src = img.get("src", "").strip()
        if not src or src.startswith("data:"):
            continue
        if src.startswith("//"):
            src = f"https:{src}"

        parsed = urllib.parse.urlparse(src)
        query = urllib.parse.parse_qs(parsed.query)
        if parsed.netloc.startswith("img") and query.get("fname"):
            src = query["fname"][0]

        try:
            data, content_type = download_binary(src)
        except Exception as exc:  # noqa: BLE001
            print(f"WARN image download failed for post {entry_id}: {src} ({exc})", file=sys.stderr)
            continue

        post_image_dir.mkdir(parents=True, exist_ok=True)
        extension = image_extension(src, content_type)
        filename = f"image-{image_index:02d}{extension}"
        image_index += 1
        target = post_image_dir / filename
        target.write_bytes(data)

        img["src"] = f"/assets/img/tistory/{entry_id}/{filename}"
        if img.has_attr("srcset"):
            del img["srcset"]


def category_to_jekyll(category_label: str) -> list[str]:
    if category_label.startswith("Paper review"):
        return ["papers", "tistory"]
    if category_label.startswith("Coding test"):
        return ["tistory", "coding-test"]
    if category_label.startswith("Major class"):
        return ["tistory", "course"]
    if category_label.startswith("Lab"):
        return ["tistory", "study"]
    return ["tistory"]


def category_tags(category_label: str) -> list[str]:
    parts = [part.strip() for part in category_label.split("/") if part.strip()]
    return parts


def dedupe(values: list[str]) -> list[str]:
    seen: set[str] = set()
    result: list[str] = []
    for value in values:
        normalized = value.strip()
        if not normalized or normalized in seen:
            continue
        seen.add(normalized)
        result.append(normalized)
    return result


def summarize(content: BeautifulSoup) -> str:
    text = re.sub(r"\s+", " ", content.get_text(" ", strip=True)).strip()
    return text[:180].rstrip()


def parse_post(url: str) -> ImportedPost:
    html_text = fetch(url)
    soup = BeautifulSoup(html_text, "html.parser")
    entry_info = parse_entry_info(html_text)

    title = meta_content(soup, 'meta[property="og:title"]') or soup.title.get_text(strip=True)
    title = title.replace(" — Jisanglee", "").strip()
    date = parse_date(soup)
    category_label = str(entry_info.get("categoryLabel") or "")
    if not category_label:
        category_node = soup.select_one(".heading a.category")
        category_label = category_node.get_text(" ", strip=True) if category_node else "Tistory"

    content = soup.select_one(".tt_article_useless_p_margin.contents_style")
    if content is None:
        content = soup.select_one("#mainContent .article_view") or soup.select_one("article.content")
    if content is None:
        raise ValueError(f"Could not find article body for {url}")

    summary = summarize(content)
    if not summary or summary == "새 창에서 열기":
        summary = f"{title} 자료를 기존 Tistory 블로그에서 이전했습니다."
    localize_images(content, int(url.rstrip("/").rsplit("/", 1)[-1]))
    body_html = clean_body(content)
    tags = dedupe(category_tags(category_label) + parse_tiara_tags(html_text))

    return ImportedPost(
        entry_id=int(url.rstrip("/").rsplit("/", 1)[-1]),
        title=html.unescape(title),
        date=date,
        category_label=category_label,
        tags=tags,
        source_url=url,
        body_html=body_html,
        summary=summary,
    )


def yaml_string(value: str) -> str:
    return json.dumps(value, ensure_ascii=False)


def write_post(post: ImportedPost) -> Path:
    categories = category_to_jekyll(post.category_label)
    date_prefix = post.date.strftime("%Y-%m-%d")
    filename = f"{date_prefix}-tistory-{post.entry_id}.md"
    path = POSTS_DIR / filename
    date_value = post.date.strftime("%Y-%m-%d %H:%M:%S %z")

    front_matter = [
        "---",
        "layout: post",
        f"title: {yaml_string(post.title)}",
        f"date: {yaml_string(date_value)}",
        f"summary: {yaml_string(post.summary)}",
        f"description: {yaml_string(post.summary)}",
        f"source_url: {yaml_string(post.source_url)}",
        f"source_blog: {yaml_string('Jisanglee Tistory')}",
        f"tistory_id: {post.entry_id}",
        f"tistory_category: {yaml_string(post.category_label)}",
        "categories:",
        *[f"  - {yaml_string(category)}" for category in categories],
        "tags:",
        *[f"  - {yaml_string(tag)}" for tag in post.tags],
        "---",
        "",
        f'<p class="imported-note">이 글은 기존 Tistory 블로그에서 옮겨온 글입니다. 원문: <a href="{post.source_url}" target="_blank" rel="noopener noreferrer">{post.source_url}</a></p>',
        "",
    ]

    path.write_text("\n".join(front_matter) + post.body_html + "\n", encoding="utf-8")
    return path


def main() -> int:
    urls = post_urls_from_sitemap()
    print(f"Found {len(urls)} public posts")
    written: list[Path] = []

    for index, url in enumerate(urls, start=1):
        try:
            post = parse_post(url)
            path = write_post(post)
            written.append(path)
            print(f"[{index:02d}/{len(urls)}] {path.name} <- {post.title}")
            time.sleep(0.15)
        except Exception as exc:  # noqa: BLE001
            print(f"ERROR {url}: {exc}", file=sys.stderr)
            return 1

    print(f"Wrote {len(written)} posts")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
