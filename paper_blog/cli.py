from __future__ import annotations

import argparse
import json
import re
import tempfile
from pathlib import Path

from .arxiv import download_arxiv_pdf, search_arxiv
from .models import PipelineConfig
from .pipeline import run_pipeline
from .publish import publish_paths
from .render import write_papers_index

DEFAULT_SITE_DIR = Path(".")
DEFAULT_MODEL_NAME = "Qwen/Qwen3-14B-Instruct-2507"
DEFAULT_SAMPLE_ARXIV_ID = "2509.15753"


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="paper-blog",
        description="Generate Korean paper blog posts for the Kkubuck Jekyll site.",
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    doctor = subparsers.add_parser("doctor", help="Check local dependencies and the repo layout.")
    doctor.add_argument("--site-dir", "--docs-dir", dest="site_dir", type=Path, default=DEFAULT_SITE_DIR)
    doctor.set_defaults(func=cmd_doctor)

    draft = subparsers.add_parser("draft", help="Generate a blog draft from a PDF or arXiv source.")
    draft.add_argument("--pdf", type=Path, help="Path to a local PDF.")
    draft.add_argument("--site-dir", "--docs-dir", dest="site_dir", type=Path, default=DEFAULT_SITE_DIR)
    draft.add_argument("--title", default="")
    draft.add_argument("--source-url", default="")
    draft.add_argument("--pdf-url", default="")
    draft.add_argument("--arxiv-id", default="")
    draft.add_argument("--arxiv-url", default="")
    draft.add_argument("--topic", default="")
    draft.add_argument("--license", default="")
    draft.add_argument(
        "--backend",
        default="auto",
        choices=["auto", "heuristic", "transformers", "llama", "llama_cpp", "gguf", "mlx"],
    )
    draft.add_argument("--model-name", default=DEFAULT_MODEL_NAME)
    draft.add_argument("--model-path", default="")
    draft.add_argument("--max-results", type=int, default=5)
    draft.add_argument("--keep-pdf-copy", action="store_true")
    draft.add_argument("--publish", action="store_true", help="Commit and push the generated post after drafting.")
    draft.add_argument("--allow-heuristic-publish", action="store_true", help="Allow publishing even when the draft fell back to the heuristic backend.")
    draft.add_argument("--remote", default="origin")
    draft.add_argument("--branch", default="")
    draft.add_argument("--commit-message", default="")
    draft.set_defaults(func=cmd_draft)

    sample = subparsers.add_parser("sample-paper", help="Fetch and draft a sample arXiv paper.")
    sample.add_argument("--site-dir", "--docs-dir", dest="site_dir", type=Path, default=DEFAULT_SITE_DIR)
    sample.add_argument("--arxiv-id", default=DEFAULT_SAMPLE_ARXIV_ID)
    sample.add_argument("--title", default="")
    sample.add_argument("--backend", default="auto", choices=["auto", "heuristic", "transformers", "llama", "llama_cpp", "gguf", "mlx"])
    sample.add_argument("--model-name", default=DEFAULT_MODEL_NAME)
    sample.add_argument("--model-path", default="")
    sample.add_argument("--publish", action="store_true", help="Commit and push the generated sample post after drafting.")
    sample.add_argument("--allow-heuristic-publish", action="store_true", help="Allow publishing even when the draft fell back to the heuristic backend.")
    sample.add_argument("--remote", default="origin")
    sample.add_argument("--branch", default="")
    sample.add_argument("--commit-message", default="")
    sample.set_defaults(func=cmd_sample_paper)

    build_index = subparsers.add_parser("build-index", help="Rebuild papers/index.md.")
    build_index.add_argument("--site-dir", "--docs-dir", dest="site_dir", type=Path, default=DEFAULT_SITE_DIR)
    build_index.set_defaults(func=cmd_build_index)

    discover = subparsers.add_parser("discover", help="Search arXiv and print candidates.")
    discover.add_argument("topic")
    discover.add_argument("--max-results", type=int, default=5)
    discover.set_defaults(func=cmd_discover)

    return parser


def cmd_doctor(args: argparse.Namespace) -> int:
    status = []
    try:
        import fitz  # type: ignore

        status.append(f"PyMuPDF: {fitz.__doc__.splitlines()[0] if getattr(fitz, '__doc__', None) else 'installed'}")
    except Exception as exc:
        status.append(f"PyMuPDF: missing ({exc})")
    try:
        import jinja2  # type: ignore

        status.append(f"Jinja2: {jinja2.__version__}")
    except Exception as exc:
        status.append(f"Jinja2: missing ({exc})")
    try:
        import transformers  # type: ignore

        status.append(f"transformers: {transformers.__version__}")
    except Exception:
        status.append("transformers: not installed")
    try:
        import torch  # type: ignore

        status.append(f"torch: {torch.__version__}")
    except Exception:
        status.append("torch: not installed")
    try:
        import llama_cpp  # type: ignore

        status.append(f"llama_cpp: {llama_cpp.__version__}")
    except Exception:
        status.append("llama_cpp: not installed")
    try:
        import mlx_lm  # type: ignore

        status.append(f"mlx_lm: {mlx_lm.__version__}")
    except Exception:
        status.append("mlx_lm: not installed")
    print("\n".join(status))
    print(f"Site dir exists: {args.site_dir.exists()}")
    return 0


def _normalize_arxiv_url(value: str) -> str:
    value = value.strip()
    if not value:
        return ""
    match = re.search(r"arxiv\.org/(?:abs|pdf)/([0-9]{4}\.[0-9]{4,5}(?:v\d+)?)", value)
    if match:
        return match.group(1)
    if re.fullmatch(r"[0-9]{4}\.[0-9]{4,5}(?:v\d+)?", value):
        return value
    return ""


def _resolve_pdf_for_draft(args: argparse.Namespace) -> tuple[Path, str, str, str, str]:
    site_dir = args.site_dir
    site_dir.mkdir(parents=True, exist_ok=True)

    if args.pdf:
        return args.pdf, args.source_url, args.pdf_url, args.arxiv_id, args.license

    arxiv_id = args.arxiv_id or _normalize_arxiv_url(args.arxiv_url)
    if arxiv_id:
        download_dir = Path("downloads") / "arxiv"
        pdf_path = download_arxiv_pdf(arxiv_id, download_dir / f"{arxiv_id}.pdf")
        source_url = args.source_url or f"https://arxiv.org/abs/{arxiv_id}"
        pdf_url = args.pdf_url or f"https://arxiv.org/pdf/{arxiv_id}.pdf"
        return pdf_path, source_url, pdf_url, arxiv_id, args.license

    if args.topic:
        candidates = search_arxiv(args.topic, max_results=args.max_results)
        if not candidates:
            raise SystemExit(f"No arXiv results for topic: {args.topic}")
        chosen = candidates[0]
        download_dir = Path("downloads") / "arxiv"
        pdf_path = download_arxiv_pdf(chosen.arxiv_id, download_dir / f"{chosen.arxiv_id}.pdf")
        return pdf_path, chosen.abs_url, chosen.pdf_url, chosen.arxiv_id, args.license

    raise SystemExit("Provide --pdf, --arxiv-id, --arxiv-url, or --topic.")


def _maybe_publish_result(args: argparse.Namespace, result) -> None:
    if not getattr(args, "publish", False):
        return
    if result.resolved_backend == "heuristic" and not getattr(args, "allow_heuristic_publish", False):
        raise SystemExit(
            "Refusing to auto-publish a heuristic-only draft. "
            "Install a local Qwen runtime and rerun with --backend mlx/transformers/llama, "
            "or pass --allow-heuristic-publish if you want to publish the fallback draft."
        )
    commit_message = args.commit_message or f"Publish paper post: {result.slug}"
    target_branch = publish_paths(
        repo_dir=args.site_dir,
        paths=[result.post_path, result.assets_dir, args.site_dir / "papers" / "index.md"],
        commit_message=commit_message,
        remote=args.remote,
        branch=args.branch,
    )
    print(f"published:{target_branch}")


def cmd_draft(args: argparse.Namespace) -> int:
    pdf_path, source_url, pdf_url, arxiv_id, license_text = _resolve_pdf_for_draft(args)
    config = PipelineConfig(
        docs_dir=args.site_dir,
        pdf_path=pdf_path,
        title=args.title,
        source_url=source_url,
        pdf_url=pdf_url,
        arxiv_id=arxiv_id,
        license=license_text,
        backend=args.backend,
        model_name=args.model_name,
        model_path=args.model_path,
        keep_pdf_copy=args.keep_pdf_copy,
        topic=args.topic,
    )
    result = run_pipeline(config)
    print(result.post_path)
    print(result.evidence_path)
    print(result.verification_pass_1_path)
    print(result.verification_pass_2_path)
    if result.featured_visuals:
        for visual in result.featured_visuals:
            print(f"{visual.role}: {visual.rel_path}")
    _maybe_publish_result(args, result)
    return 0


def cmd_sample_paper(args: argparse.Namespace) -> int:
    with tempfile.TemporaryDirectory(prefix="paper-blog-sample-") as temp_dir:
        temp_pdf = Path(temp_dir) / f"{args.arxiv_id}.pdf"
        download_arxiv_pdf(args.arxiv_id, temp_pdf)
        config = PipelineConfig(
            docs_dir=args.site_dir,
            pdf_path=temp_pdf,
            title=args.title,
            source_url=f"https://arxiv.org/abs/{args.arxiv_id}",
            pdf_url=f"https://arxiv.org/pdf/{args.arxiv_id}.pdf",
            arxiv_id=args.arxiv_id,
            license="",
            backend=args.backend,
            model_name=args.model_name,
            model_path=args.model_path,
            keep_pdf_copy=False,
        )
        result = run_pipeline(config)
        print(result.post_path)
        print(result.evidence_path)
        print(result.verification_pass_1_path)
        print(result.verification_pass_2_path)
        if result.featured_visuals:
            for visual in result.featured_visuals:
                print(f"{visual.role}: {visual.rel_path}")
        _maybe_publish_result(args, result)
        return 0


def cmd_build_index(args: argparse.Namespace) -> int:
    path = write_papers_index(args.site_dir)
    print(path)
    return 0


def cmd_discover(args: argparse.Namespace) -> int:
    candidates = search_arxiv(args.topic, max_results=args.max_results)
    for candidate in candidates:
        print(json.dumps(candidate.__dict__, ensure_ascii=False, indent=2))
    return 0


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    return int(args.func(args))


if __name__ == "__main__":  # pragma: no cover
    raise SystemExit(main())
