---
description: Full autonomous maintenance pipeline: audit, fix the top issue, verify, create PR, and sync ClickUp.
agent: guide
---

Run the `autonomous-maintenance` workflow for this repository.

Read `.opencode/AUTONOMOUS_WORKFLOW.md`. Launch all subagents in order:

1. `repo-monitor`
2. `issue-classifier`
3. `clickup-task-manager`
4. `fix-planner`
5. `fix-builder`
6. `fix-verifier` (max 3 retries with builder on failure)
7. `pr-reviewer`
8. `pr-reporter`

Branch creation, commits, pushes, and PR creation are approved. Keep changes minimal and tied to one issue per run.
