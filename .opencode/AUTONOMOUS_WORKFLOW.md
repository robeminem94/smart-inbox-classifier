# Autonomous Repo Maintenance Workflow

This workflow does not wait for existing PRs. It scans the repository autonomously, detects real issues, creates ClickUp tasks, implements safe fixes, creates GitHub PRs, and syncs progress to ClickUp.

## Agent Flow Order

1. `repo-monitor` — scan repo, find issues
2. `issue-classifier` — classify severity/type, filter noise
3. `clickup-task-manager` — create/update ClickUp tasks
4. `fix-planner` — select top issue, make fix plan
5. `fix-builder` — create branch, implement fix, commit, push
6. `fix-verifier` — run build/lint/test/typecheck
7. `pr-reviewer` — review diff before PR
8. `pr-reporter` — create PR, post comment, sync ClickUp

## Commands

### `/audit-repo`
Steps 1–3 only. No code changes, no branches, no PRs.

### `/autonomous-maintenance`
Steps 1–8. Full pipeline. Max one fix per run.

## Handoff Format

Every subagent returns a JSON block in its final message:

```json
{
  "repo": "repo-name",
  "source_branch": "main",
  "finding_id": "",
  "clickup_task_id": "",
  "severity": "critical|high|medium|low",
  "issue_type": "bug|refactor|test|docs|security|performance",
  "affected_files": [],
  "proposed_branch": "",
  "plan": [],
  "verification_commands": [],
  "verification_result": "",
  "pr_url": "",
  "status": "scanned|classified|task_created|planned|built|verified|reviewed|pr_created|blocked"
}
```

## Branch Convention

Use: `agent/<short-slug>`

Examples: `agent/fix-missing-validation`, `agent/remove-dead-import`

Keep slugs under 50 chars. Use kebab-case.

## PR Format

PR body must include:

```md
## Summary
## Changes
## Files Changed
## Verification
## Risks
## ClickUp Task
## Rollback
```

## ClickUp Task Format

List: Smart Inbox Classifier (in GitHub Portfolio folder, Team Space)

Task title: `[Type] Short description`
- Types: Bugfix, Refactor, Test, Security, Docs, Performance

Description includes:
- repo name
- severity
- affected files
- branch name
- PR URL (after creation)
- verification results

Statuses: Backlog → Planned → Building → Verifying → In Review → Done

Tags: agent-detected, bug, refactor, test, docs, security, performance

## Safety Rules

- Only `fix-builder` may edit files.
- `fix-verifier` must pass before PR creation.
- `pr-reviewer` may reject diffs that are too large, too risky, or unrelated.
- Max one fix per `/autonomous-maintenance` run.
- No force pushes, no destructive git commands.
- Never expose secrets in logs, comments, commits, or PRs.
- If a verification step is unavailable (no test script), report it and proceed.
- If build fails, report the failure back to fix-builder. Max 3 retry cycles.
