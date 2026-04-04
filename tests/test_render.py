from pathlib import Path

from paper_blog.heuristics import score_visual_caption, slugify
from paper_blog.models import Claim, DraftSection, FeaturedVisual, FigureAsset, ReviewReport
from paper_blog.render import build_papers_index, render_post_markdown


def test_slugify_basic():
    assert slugify("FOCUS: Towards Universal Foreground Segmentation") == "focus-towards-universal-foreground-segmentation"


def test_render_post_has_featured_visuals(tmp_path: Path):
    review = ReviewReport(name="pass-1", status="pass", findings=[])
    featured = [
        FeaturedVisual(
            role="overview",
            title="대표 오버뷰 피규어",
            page=2,
            score=4.5,
            caption="Figure 1: Overview of the framework",
            alt="overview",
            asset_path="assets/papers/test/figures/overview.png",
            rel_path="assets/papers/test/figures/overview.png",
            source_note="source",
            selection_reason="caption contains overview keyword",
        ),
        FeaturedVisual(
            role="main_table",
            title="메인 실험 테이블",
            page=10,
            score=5.0,
            caption="Table 1: Main results on benchmark datasets",
            alt="table",
            asset_path="assets/papers/test/figures/table.png",
            rel_path="assets/papers/test/figures/table.png",
            source_note="source",
            selection_reason="caption contains main results keyword",
        ),
    ]
    markdown = render_post_markdown(
        title="Test Paper",
        slug="test-paper",
        post_date="2026-04-04",
        source_pdf="/tmp/test.pdf",
        source_url="https://example.com/abs",
        pdf_url="https://example.com/pdf",
        license_text="CC BY 4.0",
        model_name="Qwen/Qwen3-14B-Instruct-2507",
        model_path="",
        backend="heuristic",
        one_line_summary="이 논문은 전경 분할(foreground segmentation)을 다룬다.",
        key_claims=[Claim(text="전경 분할(foreground segmentation)을 다룬다.", source_pages=[1])],
        sections=[DraftSection(title="초록", body="초록 본문", bullets=["bullet"], source_pages=[1])],
        figures=[FigureAsset(page=1, index=1, filename="figure-01.png", asset_path="assets/papers/test/figures/figure-01.png", rel_path="assets/papers/test/figures/figure-01.png", caption="caption", alt="alt", source_note="source", license_note="license")],
        featured_visuals=featured,
        review_pass_1=review,
        review_pass_2=review,
        arxiv_id="2509.15753",
    )
    assert "paper: true" in markdown
    assert "categories: papers" in markdown
    assert "## 오버뷰" in markdown
    assert "메인 실험 테이블" in markdown
    assert "## 검수 로그" not in markdown
    assert 'lang: "ko"' in markdown


def test_build_papers_index(tmp_path: Path):
    site_dir = tmp_path
    posts_dir = site_dir / "_posts"
    posts_dir.mkdir()
    (posts_dir / "2026-04-04-a.md").write_text("---\ntitle: A\npaper: true\nsummary: hello\n---\n# A\n", encoding="utf-8")
    (posts_dir / "2026-04-03-b.md").write_text("---\ntitle: B\npaper: false\nsummary: world\n---\n# B\n", encoding="utf-8")
    index_md = build_papers_index(site_dir)
    assert "논문 포스트" in index_md
    assert "1편" in index_md
    assert "아직 생성된 논문 포스트" not in index_md


def test_score_visual_caption_prefers_overview():
    assert score_visual_caption("Figure 1: Overview of the architecture", "overview", 1) > score_visual_caption("Table 1: Main results", "overview", 10)
