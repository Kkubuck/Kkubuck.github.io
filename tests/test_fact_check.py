from paper_blog.fact_check import review_draft
from paper_blog.models import Claim, DraftSection, FeaturedVisual, SourceSection


def test_review_requires_featured_visuals():
    report = review_draft(
        title="Test",
        one_line_summary="이 논문은 전경 분할을 다룬다.",
        key_claims=[Claim(text="전경 분할을 다룬다.", source_pages=[1])],
        sections=[DraftSection(title="초록", body="초록", bullets=[], source_pages=[1])],
        figures=[],
        featured_visuals=[],
        source_sections=[SourceSection(title="초록", raw_heading="Abstract", text="This paper studies foreground segmentation.", source_pages=[1])],
        pass_name="pass-2",
    )
    assert report.status == "needs-review"
    assert any("대표 오버뷰 피규어" in finding for finding in report.findings)


def test_review_accepts_featured_visuals():
    visuals = [
        FeaturedVisual(
            role="overview",
            title="대표 오버뷰 피규어",
            page=1,
            score=4.0,
            caption="Figure 1: Overview",
            alt="overview",
            asset_path="assets/papers/test/overview.png",
            rel_path="assets/papers/test/overview.png",
            source_note="source",
            selection_reason="caption contains overview",
        ),
        FeaturedVisual(
            role="main_table",
            title="메인 실험 테이블",
            page=5,
            score=4.0,
            caption="Table 1: Main results",
            alt="table",
            asset_path="assets/papers/test/table.png",
            rel_path="assets/papers/test/table.png",
            source_note="source",
            selection_reason="caption contains main results",
        ),
    ]
    report = review_draft(
        title="Test",
        one_line_summary="This paper studies foreground segmentation.",
        key_claims=[Claim(text="This paper studies foreground segmentation.", source_pages=[1])],
        sections=[DraftSection(title="초록", body="Abstract", bullets=[], source_pages=[1])],
        figures=[],
        featured_visuals=visuals,
        source_sections=[SourceSection(title="초록", raw_heading="Abstract", text="This paper studies foreground segmentation.", source_pages=[1])],
        pass_name="pass-1",
    )
    assert report.status in {"pass", "needs-review"}
    assert all("대표 오버뷰 피규어" not in finding for finding in report.findings)
