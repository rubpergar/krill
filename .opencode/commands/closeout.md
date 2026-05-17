---
description: Close out the active task: update backlog, archive files, and finalize docs
---

Complete the closeout process for the active task.

Rules:
- Read `agents/task/backlog.md` and identify the single task under `## Current`.
- If `## Current` has zero or multiple tasks, stop and ask the user to clarify which task to close.
- Extract the task ID (TASK-XXX) from the backlog entry.
- Ask the user for explicit approval before marking the task done. Do not proceed without confirmation.
- Move the task entry from `## Current` to `## Done` in `agents/task/backlog.md`.
- Move `agents/task/TASK-XXX-plan.md` to `agents/task/archive/TASK-XXX-plan.md`.
- Move `agents/task/TASK-XXX-checklist.md` to `agents/task/archive/TASK-XXX-checklist.md`.
- If `agents/docs/decisions.md` has new decisions that were approved during the task, ensure they are recorded.
- If `agents/docs/debt.md` has out-of-scope findings registered during the task, confirm they are still accurate.
- If the task affected the database, verify that `agents/db/changes.sql` and the DB schema file from the Source of Truth Map are up to date.
- If the task affected the API, verify that `agents/docs/api.md` reflects the changes.
- If the task affected the UI design system, verify that `agents/docs/design.md` is updated.
- Do not create git commits or branches unless the user explicitly asks.
- If there are uncommitted code changes, inform the user and suggest running `/commit` separately.

Flow:
1. Read `agents/task/backlog.md` and confirm exactly one task under `## Current`.
2. Ask the user: "Do you approve closing TASK-XXX and moving it to Done?"
3. If the user approves:
   - Move the task from `## Current` to `## Done` in the backlog.
   - Move `TASK-XXX-plan.md` to `agents/task/archive/`.
   - Move `TASK-XXX-checklist.md` to `agents/task/archive/`.
   - Verify durable docs are updated (decisions, debt, API, DB, design) as applicable.
   - Report any uncommitted changes and suggest `/commit` if needed.
4. If the user does not approve, stop and ask what needs to be resolved before closeout.
5. Confirm all closeout actions completed and list the archived files.
