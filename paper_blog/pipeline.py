from __future__ import annotations

import shutil
from datetime import date
from pathlib import Path
from typing import Dict, List

from .extract import extract_figures, extract_pdf_structure, save_evidence_bundle, select_featured_visuals
from .fact_check import review_draft, write_review_report
from .heuristics import build_safe_summary_from_abstract, extract_key_claims, slugify
from .llm import LLMConfig, build_heuristic_draft, resolve_backend
from .models import Claim, DraftSection, FeaturedVisual, PaperExtraction, PipelineConfig, PipelineResult
from .render import render_post_markdown, write_papers_index


def _build_draft_sections(extraction: PaperExtraction, draft_payload: Dict) -> list[DraftSection]:
    sections: list[DraftSection] = []
    for section_data in draft_payload.get("sections", []):
        if isinstance(section_data, DraftSection):
            sections.append(section_data)
            continue
        sections.append(
            DraftSection(
                title=section_data.get("title", "본문"),
                body=section_data.get("body", ""),
                bullets=list(section_data.get("bullets", []) or []),
                source_pages=list(section_data.get("source_pages", []) or []),
            )
        )
    if not sections:
        section_map = {section.title: section for section in extraction.source_sections}
        for title in ["초록", "서론", "본론", "제안방법", "실험", "결론", "논의"]:
            source = section_map.get(title)
            if source is None:
                sections.append(DraftSection(title=title, body="원문에서 해당 섹션을 명확히 추출하지 못했다.", bullets=[], source_pages=[]))
            else:
                sections.append(DraftSection(title=title, body=source.text[:800], bullets=[], source_pages=source.source_pages))
    return sections


def _coerce_claims(raw_claims, fallback: List[Claim]) -> List[Claim]:
    if not raw_claims:
        return fallback
    claims: List[Claim] = []
    for item in raw_claims:
        if isinstance(item, Claim):
            claims.append(item)
            continue
        if isinstance(item, str):
            claims.append(Claim(text=item, source_pages=[1]))
            continue
        if isinstance(item, dict):
            claims.append(
                Claim(
                    text=str(item.get("text", "")).strip(),
                    source_pages=list(item.get("source_pages", []) or [1]),
                    source_hint=str(item.get("source_hint", "")),
                )
            )
    return claims or fallback


def run_pipeline(config: PipelineConfig) -> PipelineResult:
    site_dir = config.docs_dir
    site_dir.mkdir(parents=True, exist_ok=True)
    if not config.pdf_path.exists():
        raise FileNotFoundError(f"PDF not found: {config.pdf_path}")

    extraction = extract_pdf_structure(
        config.pdf_path,
        title=config.title,
        source_url=config.source_url,
        pdf_url=config.pdf_url,
        arxiv_id=config.arxiv_id,
        license_text=config.license,
    )
    if not extraction.abstract:
        extraction.abstract = build_safe_summary_from_abstract(extraction.pages[0].text if extraction.pages else "")
    if not extraction.title:
        extraction.title = config.title or extraction.slug
    extraction.slug = slugify(extraction.title)
    source_pdf_display = config.pdf_url or config.source_url or config.pdf_path.name
    extraction.source_pdf = source_pdf_display
    extraction.source_pdf_path = str(config.pdf_path)

    figures = extract_figures(
        config.pdf_path,
        docs_dir=site_dir,
        slug=extraction.slug,
        page_texts=extraction.pages,
        source_url=config.source_url or config.pdf_url,
        license_text=config.license,
    )
    featured_visuals = select_featured_visuals(
        config.pdf_path,
        docs_dir=site_dir,
        slug=extraction.slug,
        figures=figures,
        page_texts=extraction.pages,
        source_url=config.source_url or config.pdf_url,
        license_text=config.license,
    )
    extraction.figures = figures
    extraction.featured_visuals = featured_visuals

    assets_dir = site_dir / "assets" / "papers" / extraction.slug
    assets_dir.mkdir(parents=True, exist_ok=True)

    if config.keep_pdf_copy:
        copied_pdf = assets_dir / "source.pdf"
        shutil.copy2(config.pdf_path, copied_pdf)

    evidence_path = save_evidence_bundle(extraction, site_dir)

    backend_config = LLMConfig(backend=config.backend, model_name=config.model_name, model_path=config.model_path)
    backend = resolve_backend(backend_config)
    draft_payload = backend.draft(extraction)
    if not draft_payload:
        draft_payload = build_heuristic_draft(extraction)

    one_line_summary = draft_payload.get("one_line_summary") or build_safe_summary_from_abstract(extraction.abstract)
    one_line_summary = " ".join(str(one_line_summary).split())
    one_line_summary = one_line_summary[:240]
    key_claims = _coerce_claims(
        draft_payload.get("key_claims"),
        extract_key_claims(extraction.abstract, source_pages=[1]),
    )

    draft_sections = _build_draft_sections(extraction, draft_payload)
    review_pass_1 = review_draft(
        title=extraction.title,
        one_line_summary=one_line_summary,
        key_claims=key_claims,
        sections=draft_sections,
        figures=figures,
        featured_visuals=featured_visuals,
        source_sections=extraction.source_sections,
        pass_name="pass-1",
    )
    review_pass_2 = review_draft(
        title=extraction.title,
        one_line_summary=one_line_summary,
        key_claims=key_claims,
        sections=draft_sections,
        figures=figures,
        featured_visuals=featured_visuals,
        source_sections=extraction.source_sections,
        pass_name="pass-2",
    )

    post_date = date.today().isoformat()
    post_filename = f"{post_date}-{extraction.slug}.md"
    post_path = site_dir / "_posts" / post_filename
    post_path.parent.mkdir(parents=True, exist_ok=True)
    markdown = render_post_markdown(
        title=extraction.title,
        slug=extraction.slug,
        post_date=post_date,
        source_pdf=source_pdf_display,
        source_url=config.source_url,
        pdf_url=config.pdf_url,
        license_text=config.license,
        model_name=config.model_name,
        model_path=config.model_path,
        backend=config.backend,
        one_line_summary=one_line_summary,
        key_claims=key_claims,
        sections=draft_sections,
        figures=figures,
        featured_visuals=featured_visuals,
        review_pass_1=review_pass_1,
        review_pass_2=review_pass_2,
        arxiv_id=config.arxiv_id,
    )
    post_path.write_text(markdown, encoding="utf-8")

    pass1_path = assets_dir / "verification-pass-1.md"
    pass2_path = assets_dir / "verification-pass-2.md"
    write_review_report(review_pass_1, pass1_path)
    write_review_report(review_pass_2, pass2_path)
    write_papers_index(site_dir)

    return PipelineResult(
        title=extraction.title,
        slug=extraction.slug,
        post_path=post_path,
        evidence_path=evidence_path,
        verification_pass_1_path=pass1_path,
        verification_pass_2_path=pass2_path,
        assets_dir=assets_dir,
        figures_dir=assets_dir / "figures",
        markdown=markdown,
        evidence=extraction,
        draft_sections=draft_sections,
        key_claims=key_claims,
        review_pass_1=review_pass_1,
        review_pass_2=review_pass_2,
        one_line_summary=one_line_summary,
        model_name=config.model_name,
        model_path=config.model_path,
        backend=config.backend,
        source_pdf=source_pdf_display,
        source_url=config.source_url,
        pdf_url=config.pdf_url,
        license=config.license,
        featured_visuals=featured_visuals,
    )
