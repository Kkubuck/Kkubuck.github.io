from __future__ import annotations

import re
from typing import Dict, Iterable, List, Sequence, Tuple

from .models import Claim, DraftSection, PageText, SourceSection


SECTION_ALIASES: Dict[str, str] = {
    "abstract": "초록",
    "summary": "초록",
    "introduction": "서론",
    "background": "본론",
    "related work": "본론",
    "related works": "본론",
    "related work and background": "본론",
    "method": "제안방법",
    "methods": "제안방법",
    "approach": "제안방법",
    "proposed method": "제안방법",
    "experiments": "실험",
    "experiment": "실험",
    "results": "실험",
    "evaluation": "실험",
    "conclusion": "결론",
    "conclusions": "결론",
    "discussion": "논의",
    "limitations": "논의",
    "appendix": "논의",
}

CANONICAL_ORDER = ["초록", "서론", "본론", "제안방법", "실험", "결론", "논의"]
TECH_REPLACEMENTS: Sequence[Tuple[str, str]] = (
    ("foreground segmentation", "전경 분할(foreground segmentation)"),
    ("task-specific", "과업별(task-specific)"),
    ("multi-scale", "다중 스케일(multi-scale)"),
    ("semantic network", "의미 네트워크(semantic network)"),
    ("contrastive learning", "대조 학습(contrastive learning)"),
    ("distillation", "증류(distillation)"),
    ("boundary-aware", "경계 인지(boundary-aware)"),
    ("state-of-the-art", "최신 기법(state-of-the-art)"),
    ("universal", "범용(universal)"),
)

OVERVIEW_KEYWORDS: Sequence[str] = (
    "overview",
    "architecture",
    "framework",
    "pipeline",
    "proposed",
    "method",
    "system",
    "illustration",
    "concept",
    "flow",
    "overview figure",
)
TABLE_KEYWORDS: Sequence[str] = (
    "table",
    "main results",
    "comparison",
    "ablation",
    "quantitative",
    "performance",
    "benchmark",
    "evaluation",
    "results",
    "metrics",
)

HEADING_RE = re.compile(r"^\s*(?:\d+(?:\.\d+)*)\s+(.+?)\s*$")
CAPTION_RE = re.compile(r"(?:Figure|Fig\.?)[\s\u00A0]*(\d+[\w\.-]*)(.*)$", re.IGNORECASE)
TABLE_CAPTION_RE = re.compile(r"(?:Table|Tab\.?)[\s\u00A0]*(\d+[\w\.-]*)(.*)$", re.IGNORECASE)
SENTENCE_SPLIT_RE = re.compile(r"(?<=[.!?])\s+(?=[A-Z가-힣0-9])")
TOKEN_RE = re.compile(r"[A-Za-z0-9][A-Za-z0-9\-]+")


def slugify(text: str) -> str:
    text = text.strip().lower()
    text = re.sub(r"[^a-z0-9가-힣]+", "-", text)
    text = re.sub(r"-+", "-", text)
    return text.strip("-") or "paper"


def normalize_whitespace(text: str) -> str:
    text = text.replace("\u00a0", " ")
    text = re.sub(r"(\w)-\n(\w)", r"\1\2", text)
    text = re.sub(r"[\t\r]+", " ", text)
    text = re.sub(r"\s+\n", "\n", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = re.sub(r"[ \t]{2,}", " ", text)
    return text.strip()


def split_sentences(text: str) -> List[str]:
    text = normalize_whitespace(text)
    if not text:
        return []
    parts = SENTENCE_SPLIT_RE.split(text)
    sentences = [part.strip() for part in parts if part.strip()]
    return sentences or [text]


def canonicalize_heading(raw_heading: str) -> str:
    heading = normalize_whitespace(raw_heading).strip(" :.-")
    lowered = heading.lower()
    lowered = HEADING_RE.sub(r"\1", lowered)
    if lowered in SECTION_ALIASES:
        return SECTION_ALIASES[lowered]
    for key, value in SECTION_ALIASES.items():
        if lowered.startswith(key):
            return value
    return heading if heading else "본문"


def koreanize(text: str) -> str:
    result = normalize_whitespace(text)
    protected: dict[str, str] = {}
    for index, (_, dst) in enumerate(TECH_REPLACEMENTS):
        placeholder = f"[[PBL_PROTECTED_{index}]]"
        if dst in result:
            result = result.replace(dst, placeholder)
            protected[placeholder] = dst
    for src, dst in TECH_REPLACEMENTS:
        result = re.sub(src, dst, result, flags=re.IGNORECASE)
    result = re.sub(r"\bWe\b", "저자들은", result)
    result = re.sub(r"\bwe\b", "저자들은", result)
    result = re.sub(r"\bour\b", "저자들의", result, flags=re.IGNORECASE)
    result = re.sub(r"\bintroduce\b", "제안한다", result, flags=re.IGNORECASE)
    result = re.sub(r"\bpropose\b", "제안한다", result, flags=re.IGNORECASE)
    result = re.sub(r"\bdemonstrate\b", "보여준다", result, flags=re.IGNORECASE)
    result = re.sub(r"\bshow\b", "보여준다", result, flags=re.IGNORECASE)
    result = re.sub(r"\boutperforms\b", "능가한다", result, flags=re.IGNORECASE)
    result = re.sub(r"\bconsistently\b", "일관되게", result, flags=re.IGNORECASE)
    for placeholder, dst in protected.items():
        result = result.replace(placeholder, dst)
    return result


def guess_title_from_pages(pages: Sequence[PageText]) -> str:
    if not pages:
        return "Unknown Paper"
    first_page = normalize_whitespace(pages[0].text)
    lines = [line.strip() for line in first_page.splitlines() if line.strip()]
    candidates: List[str] = []
    for line in lines[:16]:
        if "arXiv" in line:
            continue
        if len(line) < 8:
            continue
        if re.match(r"^\d+$", line):
            continue
        if line.lower() in {"abstract", "introduction", "contents"}:
            continue
        candidates.append(line)
    if candidates:
        candidates.sort(key=lambda item: (-len(item.split()), -len(item)))
        return candidates[0]
    return lines[0] if lines else "Unknown Paper"


def extract_abstract_from_sections(sections: Sequence[SourceSection], pages: Sequence[PageText]) -> str:
    for section in sections:
        if section.title == "초록" and section.text.strip():
            return normalize_whitespace(section.text)
    first_page = pages[0].text if pages else ""
    match = re.search(
        r"Abstract\s*(.*?)(?:\n\s*(?:\d+(?:\.\d+)*\s+)?(?:Introduction|I\.?\s*Introduction|1\s+Introduction|Related Work|Method|Methods|Approach|Experiments|Results|Conclusion|Discussion)\b|\Z)",
        first_page,
        flags=re.IGNORECASE | re.DOTALL,
    )
    if match:
        return normalize_whitespace(match.group(1))
    if pages:
        head = pages[0].text.splitlines()
        if len(head) > 3:
            return normalize_whitespace(" ".join(head[3:8]))
    return ""


def split_section_blocks(pages: Sequence[PageText]) -> List[SourceSection]:
    blocks: List[SourceSection] = []
    current_title = "본문"
    current_raw = "본문"
    current_lines: List[str] = []
    current_pages: List[int] = []

    def flush() -> None:
        nonlocal current_lines, current_pages, current_title, current_raw
        text = normalize_whitespace("\n".join(current_lines))
        if text:
            blocks.append(
                SourceSection(
                    title=current_title,
                    raw_heading=current_raw,
                    text=text,
                    source_pages=sorted(set(current_pages)),
                )
            )
        current_lines = []
        current_pages = []

    for page in pages:
        lines = [line.rstrip() for line in page.text.splitlines()]
        for line in lines:
            stripped = line.strip()
            if not stripped:
                current_lines.append("")
                continue
            canonical = None
            raw = stripped
            if stripped.lower() == "abstract":
                canonical = "초록"
                raw = stripped
            else:
                lower = stripped.lower().strip(" :.-")
                if lower in SECTION_ALIASES:
                    canonical = SECTION_ALIASES[lower]
                else:
                    numbered = HEADING_RE.match(stripped)
                    if numbered:
                        candidate = numbered.group(1).strip()
                        candidate_lower = normalize_whitespace(candidate).lower().strip(" :.-")
                        if candidate_lower in SECTION_ALIASES:
                            canonical = SECTION_ALIASES[candidate_lower]
                            raw = candidate
            if canonical and current_lines:
                flush()
                current_title = canonical
                current_raw = raw
                current_lines = []
                current_pages = []
                continue
            if canonical and not current_lines:
                current_title = canonical
                current_raw = raw
                current_lines = []
                current_pages = []
                continue
            current_lines.append(stripped)
            current_pages.append(page.number)
    flush()

    filtered: List[SourceSection] = []
    for block in blocks:
        text = block.text
        if block.title == "본문" and len(text) < 120:
            continue
        filtered.append(block)

    merged: List[SourceSection] = []
    index_by_title: dict[str, SourceSection] = {}
    for block in filtered:
        existing = index_by_title.get(block.title)
        if existing is None:
            merged_block = SourceSection(
                title=block.title,
                raw_heading=block.raw_heading,
                text=block.text,
                source_pages=list(block.source_pages),
            )
            index_by_title[block.title] = merged_block
            merged.append(merged_block)
            continue
        if block.text and block.text not in existing.text:
            existing.text = normalize_whitespace(f"{existing.text}\n\n{block.text}")
        existing.source_pages = sorted(set(existing.source_pages).union(block.source_pages))
    return merged


def extract_key_claims(abstract: str, source_pages: Iterable[int] = (1,)) -> List[Claim]:
    sentences = split_sentences(abstract)
    claims: List[Claim] = []
    pages = sorted(set(source_pages)) or [1]
    for sentence in sentences[:4]:
        claims.append(Claim(text=koreanize(sentence), source_pages=pages.copy(), source_hint="abstract"))
    return claims


def summarize_section(section: SourceSection, limit: int = 3) -> DraftSection:
    sentences = split_sentences(section.text)
    cleaned = [sentence for sentence in sentences if len(sentence.split()) > 4]
    if not cleaned:
        cleaned = [section.text]
    body = koreanize(" ".join(cleaned[:2]))
    bullets = [koreanize(sentence) for sentence in cleaned[:limit]]
    return DraftSection(
        title=section.title,
        body=body,
        bullets=bullets,
        source_pages=section.source_pages,
    )


def build_safe_summary_from_abstract(abstract: str) -> str:
    sentences = split_sentences(abstract)
    if not sentences:
        return "논문의 초록을 추출하지 못해 원문 근거 중심으로 정리했다."
    first = koreanize(sentences[0])
    if len(sentences) > 1:
        second = koreanize(sentences[1])
        return f"{first} {second}"
    return first


def infer_caption(page_text: str) -> str:
    text = normalize_whitespace(page_text)
    if not text:
        return ""
    match = CAPTION_RE.search(text)
    if match:
        number = match.group(1)
        tail = normalize_whitespace(match.group(2))
        caption = f"Figure {number} {tail}".strip()
        return caption[:260]
    for line in text.splitlines():
        if re.search(r"(Figure|Fig\.)\s*\d+", line, flags=re.IGNORECASE):
            return normalize_whitespace(line)[:260]
    return ""


def infer_table_caption(page_text: str) -> str:
    text = normalize_whitespace(page_text)
    if not text:
        return ""
    match = TABLE_CAPTION_RE.search(text)
    if match:
        number = match.group(1)
        tail = normalize_whitespace(match.group(2))
        caption = f"Table {number} {tail}".strip()
        return caption[:260]
    for line in text.splitlines():
        if re.search(r"(Table|Tab\.)\s*\d+", line, flags=re.IGNORECASE):
            return normalize_whitespace(line)[:260]
    return ""


def score_visual_caption(caption: str, role: str, page_number: int = 0) -> float:
    lowered = normalize_whitespace(caption).lower()
    score = 0.0
    if role == "overview":
        for keyword in OVERVIEW_KEYWORDS:
            if keyword in lowered:
                score += 2.0
        if "table" in lowered:
            score -= 1.5
        if "figure" in lowered or "fig." in lowered:
            score += 0.6
        if page_number and page_number <= 2:
            score += 1.0
        elif page_number and page_number <= 4:
            score += 0.5
    elif role == "main_table":
        if "table" in lowered or "tab." in lowered:
            score += 3.0
        for keyword in TABLE_KEYWORDS:
            if keyword in lowered:
                score += 1.5
        if "overview" in lowered or "architecture" in lowered or "figure" in lowered:
            score -= 1.0
        if page_number and page_number >= 4:
            score += 0.8
    else:
        for keyword in OVERVIEW_KEYWORDS + TABLE_KEYWORDS:
            if keyword in lowered:
                score += 1.0
    if len(lowered) > 20:
        score += 0.25
    return score


def score_page_for_role(page_text: str, role: str, page_number: int = 0) -> float:
    text = normalize_whitespace(page_text).lower()
    caption = infer_caption(page_text) if role == "overview" else infer_table_caption(page_text)
    score = score_visual_caption(caption, role, page_number)
    if role == "overview":
        for keyword in OVERVIEW_KEYWORDS:
            if keyword in text:
                score += 0.75
        if "table" in text:
            score -= 0.5
        if page_number and page_number <= 2:
            score += 0.5
    elif role == "main_table":
        for keyword in TABLE_KEYWORDS:
            if keyword in text:
                score += 0.9
        if re.search(r"table\s*\d+", text):
            score += 2.0
        if any(token in text for token in ("experiment", "evaluation", "benchmark", "ablation")):
            score += 1.2
        if page_number and page_number >= 4:
            score += 0.5
    return score


def extract_tokens(text: str) -> List[str]:
    return TOKEN_RE.findall(text.lower())
