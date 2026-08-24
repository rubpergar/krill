---
description: Close out the active task: distill to historical summary, remove from current, and finalize docs
---

Complete the closeout process for the active task.

Rules:
- Identify the active task: the single file in `agents/tasks/current/`.
- If `agents/tasks/current/` has zero or multiple tasks, stop and ask the user to clarify which task to close.
- Extract the task ID (TASK-XXX) from the task file name.
- Ask the user for explicit approval before marking the task done. Do not proceed without confirmation.
- If `agents/docs/decisions.md` has new decisions that were approved during the task, ensure they are recorded.
- If `agents/docs/debt.md` has out-of-scope findings registered during the task, confirm they are still accurate.
- If the task affected the database, verify that `agents/db/changes.sql` and the DB schema file from the Source of Truth Map are up to date.
- If the task affected the API, verify that `agents/docs/api.md` reflects the changes.
- If the task affected the UI design system, verify that `agents/docs/design.md` is updated.
- Do not create git commits or branches unless the user explicitly asks.
- If there are uncommitted code changes, inform the user and suggest running `/commit` separately.
- Follow `AGENTS.md` and `agents/docs/dod.md` for the canonical closeout and documentation rules.

Closeout = distill (not raw archive):
- Do NOT archive the full working task file verbatim. Compress `agents/tasks/current/TASK-XXX.md` into a compact historical summary in `agents/tasks/archive/TASK-XXX.md`.
- The archived summary is **cold context**: it is not source of truth, not read automatically during planning, and may describe obsolete code. Consult it only when historical rationale or similar prior work is specifically relevant. Current code, docs, and tests always take precedence.
- Keep in the summary: task identity, problem/outcome, scope (in/out that matters), key decisions, gotchas, references to ADR/commit/PR, and acceptance criteria outcome.
- Discard from the summary: trivial checkboxes, temporary results, resume notes, scaffolding, resolved questions, mechanical steps, and the RED/GREEN ledger.
- Promote durable knowledge into the proper source-of-truth docs (tests, ADRs, API/DB/design docs) during closeout.

Flow:
1. Confirm exactly one active task in `agents/tasks/current/`.
2. Ask the user: "Do you approve closing TASK-XXX?"
3. If the user approves:
   - Verify the task meets the `## In Progress` criteria from `agents/docs/dod.md`.
   - Run the Converge step (see `/implement` and `agents/tasks/template.md`) to confirm the implementation matches the approved plan.
   - Before moving, set the task status to `done`.
   - Distill `agents/tasks/current/TASK-XXX.md` to a compact historical summary in `agents/tasks/archive/TASK-XXX.md`.
   - Remove the task file from `agents/tasks/current/` (do NOT keep a `## Done` list; completed tasks leave the active area).
   - Verify durable docs are updated as required by `AGENTS.md`, including API, DB, design, decisions, and debt when applicable.
   - Report any uncommitted changes and suggest `/commit` if needed.
4. If the user does not approve, stop and ask what needs to be resolved before closeout.
5. Confirm all closeout actions completed and list the archived summary.
