from __future__ import annotations

import re
from pathlib import Path
from typing import List, Sequence

from .heuristics import extract_tokens
from .models import Claim, DraftSection, FeaturedVisual, FigureAsset, ReviewReport, SourceSection

NUMBER_RE = re.compile(r"\b\d+(?:\.\d+)?%?\b")
PAREN_ENG_RE = re.compile(r"\(([^()]*[A-Za-z][^()]*)\)")
LATIN_PHRASE_RE = re.compile(r"[A-Za-z][A-Za-z0-9\-]*(?:\s+[A-Za-z0-9\-]+){0,4}")


def _aggregate_source_text(source_sections: Sequence[SourceSection]) -> str:
    return "\n".join(section.text for section in source_sections)


def _source_phrases(source_sections: Sequence[SourceSection]) -> List[str]:
    text = _aggregate_source_text(source_sections)
    tokens = extract_tokens(text)
    phrases = set()
    for index in range(len(tokens) - 1):
        phrase2 = f"{tokens[index]} {tokens[index + 1]}"
        phrases.add(phrase2)
        if index < len(tokens) - 2:
            phrase3 = f"{tokens[index]} {tokens[index + 1]} {tokens[index + 2]}"
            phrases.add(phrase3)
    return sorted(phrases, key=len, reverse=True)


def _claim_support_score(claim_text: str, source_phrases: Sequence[str]) -> float:
    lowered = claim_text.lower()
    source_text = " ".join(source_phrases).lower()
    candidates: List[str] = []
    for match in PAREN_ENG_RE.findall(claim_text):
        phrase = re.sub(r"\s+", " ", match).strip().lower()
        if len(phrase) >= 4:
            candidates.append(phrase)
    for match in LATIN_PHRASE_RE.findall(claim_text):
        phrase = re.sub(r"\s+", " ", match).strip().lower()
        if len(phrase) >= 4 and phrase not in candidates:
            candidates.append(phrase)
    if not candidates:
        for phrase in source_phrases[:80]:
            if len(phrase) < 4:
                continue
            if phrase in lowered:
                candidates.append(phrase)
    if not candidates:
        return 0.0
    matches = 0.0
    for phrase in candidates:
        if phrase in source_text or phrase in lowered:
            matches += 1.0
    return matches / len(candidates)


def _check_numbers(text: str, source_text: str) -> List[str]:
    findings: List[str] = []
    numbers = NUMBER_RE.findall(text)
    for number in numbers:
        if number not in source_text:
            findings.append(f"숫자 `{number}`가 원문 근거에서 직접 확인되지 않는다.")
    return findings


def review_draft(
    *,
    title: str,
    one_line_summary: str,
    key_claims: Sequence[Claim],
    sections: Sequence[DraftSection],
    figures: Sequence[FigureAsset],
    featured_visuals: Sequence[FeaturedVisual],
    source_sections: Sequence[SourceSection],
    pass_name: str,
) -> ReviewReport:
    source_text = _aggregate_source_text(source_sections)
    source_phrases = _source_phrases(source_sections)
    findings: List[str] = []

    required_sections = ["초록", "서론", "본론", "제안방법", "실험", "결론", "논의"]
    present = {section.title for section in sections}
    for required in required_sections:
        if required not in present:
            findings.append(f"필수 섹션 `{required}`이 비어 있다.")

    if not key_claims:
        findings.append("핵심 주장 목록이 비어 있다.")

    if figures and any(not figure.source_note for figure in figures):
        findings.append("일부 그림에 출처 메모가 빠져 있다.")

    if len(featured_visuals) < 2:
        findings.append("대표 오버뷰 피규어와 메인 실험 테이블이 모두 선택되지 않았다.")
    else:
        roles = {visual.role for visual in featured_visuals}
        if "overview" not in roles:
            findings.append("대표 오버뷰 피규어가 선택되지 않았다.")
        if "main_table" not in roles:
            findings.append("메인 실험 테이블이 선택되지 않았다.")
        for visual in featured_visuals:
            if not visual.selection_reason:
                findings.append(f"{visual.role} 시각자료의 선택 이유가 비어 있다.")
            if not visual.source_note:
                findings.append(f"{visual.role} 시각자료의 출처 메모가 비어 있다.")

    for claim in key_claims:
        score = _claim_support_score(claim.text, source_phrases)
        if score < 0.03:
            findings.append(f"핵심 주장 `{claim.text}`의 용어 겹침이 낮아 근거가 약하다.")
        findings.extend(_check_numbers(claim.text, source_text))

    summary_score = _claim_support_score(one_line_summary, source_phrases)
    if summary_score < 0.02:
        findings.append("한 줄 요약이 원문 용어와 충분히 겹치지 않는다.")

    if pass_name == "pass-2":
        suspicious_words = ["완벽", "무조건", "절대", "always", "never", "혁신적", "압도적"]
        combined_text = "\n".join([one_line_summary] + [claim.text for claim in key_claims] + [section.body for section in sections])
        for word in suspicious_words:
            if word in combined_text:
                findings.append(f"과장 표현 후보 `{word}`가 남아 있다.")
        if not figures:
            findings.append("그림이 하나도 추출되지 않아 시각 자료가 비어 있다.")
        if len(featured_visuals) < 2:
            findings.append("2차 검수 기준에서 대표 시각자료 2개를 채우지 못했다.")

    status = "pass" if not findings else "needs-review"
    return ReviewReport(name=pass_name, status=status, findings=findings)


def write_review_report(report: ReviewReport, path: Path) -> Path:
    path.parent.mkdir(parents=True, exist_ok=True)
    lines = [f"# {report.name}", "", f"Status: {report.status}", ""]
    if report.findings:
        lines.append("## Findings")
        for finding in report.findings:
            lines.append(f"- {finding}")
    else:
        lines.append("No blocking findings.")
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return path
