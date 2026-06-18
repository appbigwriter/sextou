---
name: concurrent-commit-activity
description: This repo has multiple agents/processes committing and pushing to main simultaneously — verify working-tree ownership before committing
metadata:
  type: project
---

Multiple concurrent workstreams operate on this repo at the same time and commit/push directly to `main`. During a 2026-06-18 selective-commit mission, another process committed the entire intended scope (`d7a43b6`, `5ef99fa`, `712e164`) and pushed it while inspection was in progress — the working tree was wiped clean mid-task.

**Why:** The project works directly on `main` (no feature branches) and several agent frChat fronts (sextou-tools-pro suite, social-network-studio, marketing/youtube/fastquote studios) run in parallel.

**How to apply:** Before staging files for a selective commit, re-run `git status` / `git rev-list --left-right --count origin/main...HEAD` immediately before `git add`. If the intended files have already been committed by another process, do NOT recreate commits — verify the scope landed at HEAD (e.g. `git show HEAD:path | grep symbol`) and confirm `origin/main == HEAD`. A "nothing to commit" + new unexpected commits in `git log` is the signature of concurrent activity, not an error. Related: [[feedback-selective-staging]].
