from __future__ import annotations

import re
from datetime import date
from pathlib import Path
from typing import List, Sequence

from jinja2 import Environment, PackageLoader, select_autoescape

from .heuristics import slugify
from .models import DraftSection, FeaturedVisual, FigureAsset, PostSummary, ReviewReport


def _environment() -> Environment:
    return Environment(
        loader=PackageLoader("paper_blog", "templates"),
        autoescape=select_autoescape(disabled_extensions=("md", "j2"), default_for_string=False, default=False),
        trim_blocks=True,
        lstrip_blocks=True,
    )


def _format_key_claims(key_claims: Sequence) -> str:
    lines: List[str] = []
    for claim in key_claims:
        if isinstance(claim, dict):
            text = str(claim.get("text", "")).strip()
            pages = list(claim.get("source_pages", []) or [])
        else:
            text = str(getattr(claim, "text", "")).strip()
            pages = list(getattr(claim, "source_pages", []) or [])
        if not text:
            continue
        line = f"- {text}"
        if pages:
            line += f" (p. {', '.join(str(page) for page in pages)})"
        lines.append(line)
    return "\n".join(lines)


def render_post_markdown(
    *,
    title: str,
    slug: str,
    post_date: str,
    source_pdf: str,
    source_url: str,
    pdf_url: str,
    license_text: str,
    model_name: str,
    model_path: str,
    backend: str,
    one_line_summary: str,
    key_claims: Sequence,
    sections: Sequence[DraftSection],
    figures: Sequence[FigureAsset],
    featured_visuals: Sequence[FeaturedVisual],
    review_pass_1: ReviewReport,
    review_pass_2: ReviewReport,
    arxiv_id: str = "",
) -> str:
    env = _environment()
    template = env.get_template("post.md.j2")
    featured_list = list(featured_visuals)
    image = featured_list[0].rel_path if featured_list else (figures[0].rel_path if figures else "")
    return template.render(
        title=title,
        slug=slug,
        date=post_date,
        source_pdf=source_pdf,
        source_url=source_url or pdf_url,
        pdf_url=pdf_url,
        license=license_text or "unknown",
        model_name=model_name,
        model_path=model_path,
        backend=backend,
        review_status=review_pass_2.status if review_pass_2.findings else review_pass_1.status,
        one_line_summary=one_line_summary,
        key_claims=key_claims,
        key_claim_lines=_format_key_claims(key_claims),
        sections=sections,
        figures=figures,
        featured_visuals=featured_list,
        review_pass_1=review_pass_1,
        review_pass_2=review_pass_2,
        image=image,
        arxiv_id=arxiv_id,
    )


def _parse_front_matter_value(value: str) -> str:
    value = value.strip()
    if value.startswith('"') and value.endswith('"'):
        value = value[1:-1]
    if value.startswith("'") and value.endswith("'"):
        value = value[1:-1]
    return value.strip()


def build_post_summary_from_file(path: Path) -> PostSummary:
    text = path.read_text(encoding="utf-8")
    title = path.stem
    summary = ""
    date_str = path.stem[:10] if re.match(r"^\d{4}-\d{2}-\d{2}-", path.stem) else date.today().isoformat()
    front_matter = extract_front_matter(text)
    title = front_matter.get("title", title)
    summary = front_matter.get("summary", "")
    slug = front_matter.get("slug", slugify(title))
    paper = front_matter.get("paper", "").lower() in {"true", "yes", "1"} or "papers" in front_matter.get("categories", "")
    return PostSummary(date=date_str, title=title, path=path, summary=summary, slug=slug, paper=paper)


def extract_front_matter(text: str) -> dict:
    lines = text.splitlines()
    if not lines or lines[0].strip() != "---":
        return {}
    end_index = None
    for idx, line in enumerate(lines[1:], start=1):
        if line.strip() == "---":
            end_index = idx
            break
    if end_index is None:
        return {}
    data = {}
    for raw in lines[1:end_index]:
        if ":" not in raw:
            continue
        key, value = raw.split(":", 1)
        data[key.strip()] = _parse_front_matter_value(value)
    return data


def build_papers_index(site_dir: Path) -> str:
    posts_dir = site_dir / "_posts"
    items: List[PostSummary] = []
    if posts_dir.exists():
        for path in sorted(posts_dir.glob("*.md")):
            items.append(build_post_summary_from_file(path))
    items = [item for item in items if item.paper or item.path.name.startswith("paper-")]
    items.sort(key=lambda item: item.date, reverse=True)
    count = len(items)

    lines = [
        "---",
        "title: 논문 포스트",
        "layout: paper-archive",
        "lead: 생성기가 만든 논문 포스트를 한눈에 볼 수 있는 아카이브입니다.",
        "---",
        "",
        f"Jekyll `_posts`에 쌓인 논문 요약 {count}편을 모았습니다.",
        "",
        "이 페이지는 `paper-blog build-index` 실행 시 갱신됩니다.",
    ]
    lines.append("")
    if count == 0:
        lines.append("아직 생성된 논문 포스트가 없습니다.")
    return "\n".join(lines) + "\n"


def write_papers_index(site_dir: Path) -> Path:
    index_path = site_dir / "papers" / "index.md"
    index_path.parent.mkdir(parents=True, exist_ok=True)
    index_path.write_text(build_papers_index(site_dir), encoding="utf-8")
    return index_path
