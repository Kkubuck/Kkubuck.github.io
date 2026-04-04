from __future__ import annotations

import hashlib
import json
import re
from pathlib import Path
from typing import List, Sequence

from .heuristics import (
    build_safe_summary_from_abstract,
    infer_caption,
    infer_table_caption,
    normalize_whitespace,
    score_page_for_role,
    score_visual_caption,
    slugify,
    split_section_blocks,
    guess_title_from_pages,
)
from .models import FeaturedVisual, FigureAsset, PageText, PaperExtraction, SourceSection


def _load_fitz():
    try:
        import fitz  # type: ignore
    except Exception as exc:  # pragma: no cover - import guard
        raise RuntimeError(
            "PyMuPDF is required for PDF extraction. Install the project with `pip install -e .` first."
        ) from exc
    return fitz


def extract_pdf_structure(
    pdf_path: Path,
    *,
    title: str = "",
    source_url: str = "",
    pdf_url: str = "",
    arxiv_id: str = "",
    license_text: str = "",
) -> PaperExtraction:
    fitz = _load_fitz()
    doc = fitz.open(str(pdf_path))
    metadata = dict(doc.metadata or {})
    pages: List[PageText] = []
    for index in range(doc.page_count):
        page = doc.load_page(index)
        text = normalize_whitespace(page.get_text("text"))
        pages.append(PageText(number=index + 1, text=text))
    metadata_title = normalize_whitespace(metadata.get("title", ""))
    final_title = title or metadata_title or guess_title_from_pages(pages)
    final_slug = slugify(final_title)
    authors: List[str] = []
    author_field = normalize_whitespace(metadata.get("author", ""))
    if author_field:
        for item in re.split(r"[,;]", author_field):
            item = item.strip()
            if item:
                authors.append(item)
    source_sections = split_section_blocks(pages)
    abstract = ""
    for section in source_sections:
        if section.title == "초록":
            abstract = section.text
            break
    if not abstract:
        abstract = build_safe_summary_from_abstract(pages[0].text if pages else "")
    return PaperExtraction(
        title=final_title,
        slug=final_slug,
        authors=authors,
        abstract=abstract,
        source_pdf=str(pdf_path),
        source_pdf_path=str(pdf_path),
        pdf_url=pdf_url,
        source_url=source_url,
        arxiv_id=arxiv_id,
        license=license_text,
        pages=pages,
        source_sections=source_sections,
        raw_text_path="",
        metadata=metadata,
    )


def extract_figures(
    pdf_path: Path,
    *,
    docs_dir: Path,
    slug: str,
    page_texts: Sequence[PageText],
    source_url: str = "",
    license_text: str = "",
) -> List[FigureAsset]:
    fitz = _load_fitz()
    doc = fitz.open(str(pdf_path))
    figures_root = docs_dir / "assets" / "papers" / slug / "figures"
    figures_root.mkdir(parents=True, exist_ok=True)
    figures: List[FigureAsset] = []
    seen_digests = set()
    figure_index = 0

    for page_number in range(doc.page_count):
        page = doc.load_page(page_number)
        page_text = page_texts[page_number].text if page_number < len(page_texts) else page.get_text("text")
        for _, image_info in enumerate(page.get_images(full=True), start=1):
            xref = image_info[0]
            try:
                extracted = doc.extract_image(xref)
            except Exception:
                continue
            image_bytes = extracted.get("image")
            if not image_bytes:
                continue
            digest = hashlib.sha1(image_bytes).hexdigest()
            if digest in seen_digests:
                continue
            seen_digests.add(digest)
            figure_index += 1
            ext = extracted.get("ext", "png")
            filename = f"figure-{figure_index:02d}.{ext}"
            out_path = figures_root / filename
            out_path.write_bytes(image_bytes)
            asset_path = f"assets/papers/{slug}/figures/{filename}"
            caption = infer_caption(page_text)
            figures.append(
                FigureAsset(
                    page=page_number + 1,
                    index=figure_index,
                    filename=filename,
                    asset_path=asset_path,
                    rel_path=asset_path,
                    caption=caption,
                    alt=caption or f"paper figure {figure_index}",
                    source_note=source_url or str(pdf_path),
                    license_note=license_text,
                    extracted_from="embedded-image",
                )
            )

    if not figures:
        for page_number in range(min(2, doc.page_count)):
            page = doc.load_page(page_number)
            pix = page.get_pixmap(matrix=fitz.Matrix(1.6, 1.6), alpha=False)
            if pix.width < 120 or pix.height < 120:
                continue
            figure_index += 1
            filename = f"page-{page_number + 1:02d}.png"
            out_path = figures_root / filename
            pix.save(str(out_path))
            asset_path = f"assets/papers/{slug}/figures/{filename}"
            figures.append(
                FigureAsset(
                    page=page_number + 1,
                    index=figure_index,
                    filename=filename,
                    asset_path=asset_path,
                    rel_path=asset_path,
                    caption=f"Page {page_number + 1} preview",
                    alt=f"page {page_number + 1} preview",
                    source_note=source_url or str(pdf_path),
                    license_note=license_text,
                    extracted_from="page-render",
                )
            )

    manifest_path = docs_dir / "assets" / "papers" / slug / "figures" / "manifest.json"
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    manifest_path.write_text(json.dumps([figure.to_dict() for figure in figures], ensure_ascii=False, indent=2), encoding="utf-8")
    return figures


def _render_page_snapshot(doc, page_number: int, out_path: Path) -> None:
    fitz = _load_fitz()
    page = doc.load_page(page_number)
    pix = page.get_pixmap(matrix=fitz.Matrix(1.8, 1.8), alpha=False)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    pix.save(str(out_path))


def _visual_from_figure(figure: FigureAsset, role: str, score: float, reason: str) -> FeaturedVisual:
    title = "대표 오버뷰 피규어" if role == "overview" else "메인 실험 테이블"
    return FeaturedVisual(
        role=role,
        title=title,
        page=figure.page,
        score=score,
        caption=figure.caption or title,
        alt=figure.alt or title,
        asset_path=figure.asset_path,
        rel_path=figure.rel_path,
        source_note=figure.source_note,
        license_note=figure.license_note,
        selection_reason=reason,
        extracted_from=figure.extracted_from,
    )


def _pick_best_figure(figures: Sequence[FigureAsset], role: str) -> tuple[FigureAsset | None, float, str]:
    best: FigureAsset | None = None
    best_score = float("-inf")
    best_reason = ""
    for figure in figures:
        score = score_visual_caption(figure.caption or figure.alt, role, figure.page)
        if figure.extracted_from == "embedded-image":
            score += 0.35
        if role == "overview" and figure.page <= 2:
            score += 0.4
        if role == "main_table" and figure.page >= 4:
            score += 0.4
        reason_parts = []
        if figure.caption:
            reason_parts.append(f"caption='{figure.caption[:80]}'")
        reason_parts.append(f"page={figure.page}")
        reason_parts.append(f"score={score:.2f}")
        reason = ", ".join(reason_parts)
        if score > best_score:
            best = figure
            best_score = score
            best_reason = reason
    return best, best_score, best_reason


def _pick_best_page(page_texts: Sequence[PageText], role: str) -> tuple[int, float, str]:
    best_page = 1
    best_score = float("-inf")
    best_reason = ""
    for page in page_texts:
        score = score_page_for_role(page.text, role, page.number)
        reason = f"page={page.number}, score={score:.2f}"
        if role == "main_table":
            table_caption = infer_table_caption(page.text)
            if table_caption:
                reason += f", caption='{table_caption[:80]}'"
            if re.search(r"table\s*\d+", page.text, flags=re.IGNORECASE):
                reason += ", table-match"
        else:
            figure_caption = infer_caption(page.text)
            if figure_caption:
                reason += f", caption='{figure_caption[:80]}'"
        if score > best_score:
            best_score = score
            best_page = page.number
            best_reason = reason
    return best_page, best_score, best_reason


def select_featured_visuals(
    pdf_path: Path,
    *,
    docs_dir: Path,
    slug: str,
    figures: Sequence[FigureAsset],
    page_texts: Sequence[PageText],
    source_url: str = "",
    license_text: str = "",
) -> List[FeaturedVisual]:
    fitz = _load_fitz()
    doc = fitz.open(str(pdf_path))
    visual_root = docs_dir / "assets" / "papers" / slug / "figures"
    visual_root.mkdir(parents=True, exist_ok=True)

    overview_figure, overview_score, overview_reason = _pick_best_figure(figures, "overview")
    if overview_figure is None:
        overview_page, overview_page_score, overview_page_reason = _pick_best_page(page_texts, "overview")
        filename = f"overview-page-{overview_page:02d}.png"
        out_path = visual_root / filename
        _render_page_snapshot(doc, overview_page - 1, out_path)
        asset_path = f"assets/papers/{slug}/figures/{filename}"
        caption = infer_caption(page_texts[overview_page - 1].text) if overview_page - 1 < len(page_texts) else ""
        if not caption:
            caption = f"Overview snapshot, page {overview_page}"
        overview_visual = FeaturedVisual(
            role="overview",
            title="대표 오버뷰 피규어",
            page=overview_page,
            score=overview_page_score,
            caption=caption,
            alt=f"overview snapshot page {overview_page}",
            asset_path=asset_path,
            rel_path=asset_path,
            source_note=source_url or str(pdf_path),
            license_note=license_text,
            selection_reason=overview_page_reason,
            extracted_from="page-render",
        )
    else:
        overview_visual = _visual_from_figure(
            overview_figure,
            "overview",
            overview_score,
            overview_reason + ", selected-role=overview",
        )

    table_figure, table_score, table_reason = _pick_best_figure(figures, "main_table")
    table_page, table_page_score, table_page_reason = _pick_best_page(page_texts, "main_table")

    if table_figure is not None and table_score >= table_page_score + 0.5:
        table_visual = _visual_from_figure(
            table_figure,
            "main_table",
            table_score,
            table_reason + ", selected-role=main_table",
        )
    else:
        filename = f"main-table-page-{table_page:02d}.png"
        out_path = visual_root / filename
        _render_page_snapshot(doc, table_page - 1, out_path)
        asset_path = f"assets/papers/{slug}/figures/{filename}"
        caption = infer_table_caption(page_texts[table_page - 1].text) if table_page - 1 < len(page_texts) else ""
        if not caption:
            caption = f"Main results table snapshot, page {table_page}"
        table_visual = FeaturedVisual(
            role="main_table",
            title="메인 실험 테이블",
            page=table_page,
            score=table_page_score,
            caption=caption,
            alt=f"main table snapshot page {table_page}",
            asset_path=asset_path,
            rel_path=asset_path,
            source_note=source_url or str(pdf_path),
            license_note=license_text,
            selection_reason=table_page_reason,
            extracted_from="page-render",
        )

    manifest_path = docs_dir / "assets" / "papers" / slug / "featured-visuals.json"
    manifest_path.write_text(
        json.dumps([overview_visual.to_dict(), table_visual.to_dict()], ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    return [overview_visual, table_visual]


def save_evidence_bundle(extraction: PaperExtraction, docs_dir: Path) -> Path:
    assets_root = docs_dir / "assets" / "papers" / extraction.slug
    assets_root.mkdir(parents=True, exist_ok=True)
    evidence_path = assets_root / "evidence.json"
    raw_path = assets_root / "raw-text.txt"
    raw_path.write_text("\n\n".join(f"[Page {page.number}]\n{page.text}" for page in extraction.pages), encoding="utf-8")
    extraction.raw_text_path = str(raw_path)
    evidence_path.write_text(json.dumps(extraction.to_dict(), ensure_ascii=False, indent=2), encoding="utf-8")
    return evidence_path
