from pathlib import Path
import subprocess

from paper_blog.publish import publish_paths


def _run(cwd: Path, *args: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run(args, cwd=cwd, text=True, capture_output=True, check=False)


def test_publish_paths_commits_and_pushes(tmp_path: Path):
    remote_dir = tmp_path / "remote.git"
    repo_dir = tmp_path / "repo"
    remote_dir.mkdir()
    repo_dir.mkdir()

    assert _run(tmp_path, "git", "init", "--bare", str(remote_dir)).returncode == 0
    assert _run(repo_dir, "git", "init", "-b", "master").returncode == 0
    assert _run(repo_dir, "git", "config", "user.name", "Codex").returncode == 0
    assert _run(repo_dir, "git", "config", "user.email", "codex@example.com").returncode == 0
    assert _run(repo_dir, "git", "remote", "add", "origin", str(remote_dir)).returncode == 0

    readme = repo_dir / "README.md"
    readme.write_text("hello\n", encoding="utf-8")
    assert _run(repo_dir, "git", "add", "README.md").returncode == 0
    assert _run(repo_dir, "git", "commit", "-m", "init").returncode == 0
    assert _run(repo_dir, "git", "push", "-u", "origin", "master").returncode == 0

    post_dir = repo_dir / "_posts"
    asset_dir = repo_dir / "assets" / "papers" / "sample"
    papers_dir = repo_dir / "papers"
    post_dir.mkdir(parents=True)
    asset_dir.mkdir(parents=True)
    papers_dir.mkdir(parents=True)
    post_path = post_dir / "2026-04-04-sample.md"
    post_path.write_text("---\ntitle: Sample\n---\n", encoding="utf-8")
    (asset_dir / "evidence.json").write_text("{}", encoding="utf-8")
    (papers_dir / "index.md").write_text("---\ntitle: Papers\n---\n", encoding="utf-8")

    branch = publish_paths(
        repo_dir=repo_dir,
        paths=[post_path, asset_dir, papers_dir / "index.md"],
        commit_message="Publish paper post: sample",
        remote="origin",
        branch="master",
    )

    assert branch == "master"
    log = _run(repo_dir, "git", "log", "--oneline", "-1")
    assert "Publish paper post: sample" in log.stdout
