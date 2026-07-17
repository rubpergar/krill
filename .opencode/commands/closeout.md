---
description: Close out the active task: update backlog, archive files, and finalize docs
---

Complete the closeout process for the active task.

Rules:
- Read `agents/task/backlog.md` and identify the single task under `## Current`.
- If `## Current` has zero or multiple tasks, stop and ask the user to clarify which task to close.
- Extract the task ID (TASK-XXX) from the backlog entry.
- Ask the user for explicit approval before marking the task done. Do not proceed without confirmation.
- If `agents/docs/decisions.md` has new decisions that were approved during the task, ensure they are recorded.
- If `agents/docs/debt.md` has out-of-scope findings registered during the task, confirm they are still accurate.
- If the task affected the database, verify that `agents/db/changes.sql` and the DB schema file from the Source of Truth Map are up to date.
- If the task affected the API, verify that `agents/docs/api.md` reflects the changes.
- If the task affected the UI design system, verify that `agents/docs/design.md` is updated.
- Do not create git commits or branches unless the user explicitly asks.
- If there are uncommitted code changes, inform the user and suggest running `/commit` separately.
- Follow `AGENTS.md` and `agents/docs/DoD.md` for the canonical closeout and documentation rules.

Flow:
1. Read `agents/task/backlog.md` and confirm exactly one task under `## Current`.
2. Ask the user: "Do you approve closing TASK-XXX and moving it to Done?"
3. If the user approves:
   - Verify the task meets the `## In Progress` criteria from `agents/docs/DoD.md`.
   - Before moving, set the plan status to `closed`.
   - Before moving, read `TASK-XXX-checklist.md` and mark any unchecked items in section 6 (Closeout) as `[x]` if they were completed in this step.
   - Move the task from `## Current` to `## Done` in the backlog.
   - Move `TASK-XXX-plan.md` to `agents/task/archive/`.
   - Move `TASK-XXX-checklist.md` to `agents/task/archive/`.
   - Verify durable docs are updated as required by `AGENTS.md`, including API, DB, design, decisions, and debt when applicable.
   - Report any uncommitted changes and suggest `/commit` if needed.
4. If the user does not approve, stop and ask what needs to be resolved before closeout.
5. Confirm all closeout actions completed and list the archived files.
