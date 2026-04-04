from __future__ import annotations

import subprocess
from pathlib import Path
from typing import Iterable, Sequence


def _run_git(repo_dir: Path, args: Sequence[str]) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        ["git", *args],
        cwd=repo_dir,
        text=True,
        capture_output=True,
        check=False,
    )


def _relative_paths(repo_dir: Path, paths: Iterable[Path]) -> list[str]:
    relative: list[str] = []
    for path in paths:
        candidate = path.resolve()
        try:
            rel = candidate.relative_to(repo_dir.resolve())
        except ValueError as exc:
            raise RuntimeError(f"Cannot publish a path outside the repo: {candidate}") from exc
        relative.append(str(rel))
    return sorted(set(relative))


def current_branch(repo_dir: Path) -> str:
    result = _run_git(repo_dir, ["rev-parse", "--abbrev-ref", "HEAD"])
    if result.returncode != 0:
        raise RuntimeError(result.stderr.strip() or "Failed to detect the current git branch.")
    branch = result.stdout.strip()
    if not branch:
        raise RuntimeError("Git branch is empty.")
    return branch


def publish_paths(
    *,
    repo_dir: Path,
    paths: Iterable[Path],
    commit_message: str,
    remote: str = "origin",
    branch: str = "",
) -> str:
    repo_dir = repo_dir.resolve()
    tracked_paths = _relative_paths(repo_dir, paths)
    if not tracked_paths:
        raise RuntimeError("No generated paths were provided for publishing.")

    add_result = _run_git(repo_dir, ["add", "--", *tracked_paths])
    if add_result.returncode != 0:
        raise RuntimeError(add_result.stderr.strip() or "Failed to stage generated paths.")

    diff_result = _run_git(repo_dir, ["diff", "--cached", "--quiet"])
    if diff_result.returncode == 0:
        return branch or current_branch(repo_dir)
    if diff_result.returncode not in {0, 1}:
        raise RuntimeError(diff_result.stderr.strip() or "Failed to inspect staged changes.")

    commit_result = _run_git(repo_dir, ["commit", "-m", commit_message])
    if commit_result.returncode != 0:
        raise RuntimeError(commit_result.stderr.strip() or "Failed to commit generated post files.")

    target_branch = branch or current_branch(repo_dir)
    push_result = _run_git(repo_dir, ["push", "-u", remote, target_branch])
    if push_result.returncode != 0:
        raise RuntimeError(push_result.stderr.strip() or "Failed to push the current branch.")
    return target_branch
