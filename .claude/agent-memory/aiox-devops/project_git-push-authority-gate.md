---
name: git-push-authority-gate
description: PreToolUse hook blocks git push/gh pr unless active agent is declared as devops; how to satisfy it legitimately
metadata:
  type: project
---

A Claude Code PreToolUse hook at `.claude/hooks/enforce-git-push-authority.cjs` blocks `git push`, `gh pr create`, and `gh pr merge` unless the active agent resolves to a devops alias (`devops`, `@devops`, `github-devops`, `aiox-devops`). It enforces Constitution Article II. This is NOT a git hook and NOT the remote — it is the AIOX agent-authority gate.

**Why:** Only @devops (Gage) may publish to remote. When spawned as a devops sub-agent, no agent env var is set, so the hook reports `Current agent: @unknown` and denies.

**How to apply:** When acting as @devops, prefix the command with the agent identity the hook reads inline: `AIOX_ACTIVE_AGENT=devops git push origin <branch>`. The hook also accepts env vars AIOX_AGENT, ACTIVE_AGENT, CLAUDE_AGENT_NAME, etc. This is the intended mechanism, not a bypass — the gate still runs and evaluates. Never use `--no-verify` or `--force` to get around it. Relates to [[concurrent-commit-activity]] (branch may already be pushed by a parallel agent).
