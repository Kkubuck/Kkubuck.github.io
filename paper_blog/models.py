from __future__ import annotations

from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import Any, Dict, List


@dataclass
class PageText:
    number: int
    text: str

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class SourceSection:
    title: str
    raw_heading: str
    text: str
    source_pages: List[int] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class FigureAsset:
    page: int
    index: int
    filename: str
    asset_path: str
    rel_path: str
    caption: str = ""
    alt: str = ""
    source_note: str = ""
    license_note: str = ""
    extracted_from: str = "embedded-image"

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class FeaturedVisual:
    role: str
    title: str
    page: int
    score: float
    caption: str
    alt: str
    asset_path: str
    rel_path: str
    source_note: str = ""
    license_note: str = ""
    selection_reason: str = ""
    extracted_from: str = "selected"

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class Claim:
    text: str
    source_pages: List[int] = field(default_factory=list)
    source_hint: str = ""

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class DraftSection:
    title: str
    body: str
    bullets: List[str] = field(default_factory=list)
    source_pages: List[int] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class ReviewReport:
    name: str
    status: str
    findings: List[str] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


@dataclass
class PaperExtraction:
    title: str
    slug: str
    authors: List[str]
    abstract: str
    source_pdf: str
    source_pdf_path: str = ""
    pdf_url: str = ""
    source_url: str = ""
    arxiv_id: str = ""
    license: str = ""
    pages: List[PageText] = field(default_factory=list)
    source_sections: List[SourceSection] = field(default_factory=list)
    figures: List[FigureAsset] = field(default_factory=list)
    featured_visuals: List[FeaturedVisual] = field(default_factory=list)
    raw_text_path: str = ""
    metadata: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        data = asdict(self)
        data["pages"] = [page.to_dict() for page in self.pages]
        data["source_sections"] = [section.to_dict() for section in self.source_sections]
        data["figures"] = [figure.to_dict() for figure in self.figures]
        data["featured_visuals"] = [visual.to_dict() for visual in self.featured_visuals]
        return data


@dataclass
class PipelineConfig:
    docs_dir: Path
    pdf_path: Path
    title: str = ""
    source_url: str = ""
    pdf_url: str = ""
    arxiv_id: str = ""
    license: str = ""
    backend: str = "auto"
    model_name: str = "Qwen/Qwen3-14B-Instruct-2507"
    model_path: str = ""
    figure_policy: str = "caption-priority"
    keep_pdf_copy: bool = False
    topic: str = ""


@dataclass
class PipelineResult:
    title: str
    slug: str
    post_path: Path
    evidence_path: Path
    verification_pass_1_path: Path
    verification_pass_2_path: Path
    assets_dir: Path
    figures_dir: Path
    markdown: str
    evidence: PaperExtraction
    draft_sections: List[DraftSection]
    key_claims: List[Claim]
    review_pass_1: ReviewReport
    review_pass_2: ReviewReport
    one_line_summary: str
    model_name: str
    model_path: str
    backend: str
    resolved_backend: str
    source_pdf: str
    source_url: str
    pdf_url: str
    license: str
    featured_visuals: List[FeaturedVisual] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "title": self.title,
            "slug": self.slug,
            "post_path": str(self.post_path),
            "evidence_path": str(self.evidence_path),
            "verification_pass_1_path": str(self.verification_pass_1_path),
            "verification_pass_2_path": str(self.verification_pass_2_path),
            "assets_dir": str(self.assets_dir),
            "figures_dir": str(self.figures_dir),
            "markdown": self.markdown,
            "evidence": self.evidence.to_dict(),
            "draft_sections": [section.to_dict() for section in self.draft_sections],
            "key_claims": [claim.to_dict() for claim in self.key_claims],
            "review_pass_1": self.review_pass_1.to_dict(),
            "review_pass_2": self.review_pass_2.to_dict(),
            "one_line_summary": self.one_line_summary,
            "model_name": self.model_name,
            "model_path": self.model_path,
            "backend": self.backend,
            "resolved_backend": self.resolved_backend,
            "source_pdf": self.source_pdf,
            "source_url": self.source_url,
            "pdf_url": self.pdf_url,
            "license": self.license,
            "featured_visuals": [visual.to_dict() for visual in self.featured_visuals],
        }


@dataclass
class PostSummary:
    date: str
    title: str
    path: Path
    summary: str
    slug: str
    paper: bool = True

    def to_dict(self) -> Dict[str, Any]:
        data = asdict(self)
        data["path"] = str(self.path)
        return data
