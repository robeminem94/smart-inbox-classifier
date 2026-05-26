# PR Agent Workflow

This project uses a PR-centered GitHub and ClickUp workflow. GitHub operations should use the authenticated `gh` CLI. ClickUp updates should use the ClickUp MCP tools when they are available in the running opencode session.

## Standard Flow

1. Intake: read the PR, changed files, linked issues, review comments, check status, branch names, and any ClickUp task links.
2. Scout: inspect impacted files and nearby implementation patterns. Stay read-only.
3. Plan: produce a concrete plan with acceptance criteria, risks, and verification steps.
4. Build: only for fix/ship workflows. Checkout or create a branch, make minimal changes, commit, and push.
5. Review: review the final diff for bugs, regressions, missing tests, and risky behavior.
6. Verify: run the relevant tests, lint, typecheck, or build commands.
7. Report: post a final GitHub PR comment and update ClickUp if a linked task is found.

## GitHub Updates

Immediate GitHub comments are approved. Post a short start comment when a workflow begins and a final comment when it completes or blocks. Avoid noisy comments between every sub-step unless there is a blocker.

Use this comment shape:

```md
## Agent Update

Status: Planning | Building | Reviewing | Verifying | Blocked | Complete

Summary:
- ...

Changes:
- ...

Verification:
- ...

Risks:
- ...

Next:
- ...
```

## Branching And Commits

Builder workflows may create branches, commits, and pushes.

- Prefer `gh pr checkout <pr>` when fixing an existing PR branch and the branch is pushable.
- If a new branch is needed, use `agent/pr-<number>-fix` or `agent/pr-<number>-<short-slug>`.
- Inspect `git status --short` before edits.
- Do not overwrite or revert unrelated user changes.
- Commit only the files changed for this workflow.
- Match the repository's recent commit message style when possible.
- Never use destructive git commands such as `git reset --hard` or `git checkout -- <file>` unless the user explicitly asks.

## ClickUp Updates

Look for ClickUp task URLs or IDs in the PR body, comments, branch name, and linked issue text. If a linked task is found and ClickUp MCP tools are available, add a concise progress comment. Change a ClickUp status only when the target status name is obvious from the workspace.

If ClickUp MCP tools are unavailable or no task is linked, mention that in the final GitHub comment instead of blocking the workflow.

## Handoff Format

Every specialist agent should return this structure:

```md
## Objective
## Source Links
## Findings
## Files Investigated
## Proposed Changes
## Verification
## Risks
## Open Questions
## Next Agent Instruction
```

## Safety

- Keep changes minimal and directly tied to the PR objective.
- Prefer existing project patterns over new abstractions.
- Do not expose secrets or tokens in comments, commits, or logs.
- If auth, permissions, or push access fails, report the blocker immediately on the PR.
