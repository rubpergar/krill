# Definition of Done

Task files use three lifecycle states: `todo` (planned), `current` (active), and `done` (completed and distilled). The task file lives in `agents/tasks/todo/` while `todo`, moves to `agents/tasks/current/` while active, and is distilled to a compact historical summary in `agents/tasks/archive/` when `done`.

The criteria below define what must be true while a task is `current` and what is required before it can be distilled and removed from `agents/tasks/current/`.

## In Progress (task `current`)

The change is implemented, validated, and ready for administrative closeout.

- Task plan matches the implemented behavior.
- Execution section is complete or explains non-applicable items.
- Assumptions, edge cases, scope changes, and TDD exceptions are recorded.
- Changes are scoped to the approved plan.
- Existing public interfaces stay compatible unless the plan says otherwise.
- No unrelated refactors.
- No unnecessary dependencies.
- Security-sensitive behavior changed only with explicit plan coverage.
- Relevant tests were added or updated.
- TDD evidence or approved exception is recorded for behavior changes.
- Affected tests pass.
- Lint/typecheck/build pass when available and relevant.
- Any command that could not run is recorded with reason and residual risk.
- Code-to-doc sync verified for affected source-of-truth docs (see plan "Affected Areas"). If discrepancies found, stop and ask user whether to update the doc or fix the code. Do not proceed until resolved.
- Affected source-of-truth docs updated according to the documentation rules in `AGENTS.md`.
- Temporary files, debug logs, scratch scripts, and test artifacts cleaned or promoted.
- `git status` contains only intentional changes.

## Closed

Administratively closed. User approved, task distilled to a compact historical summary.

- User approved task completion.
- Task status was set to `done` before distilling.
- `agents/tasks/current/TASK-XXX.md` was distilled into a compact historical summary in `agents/tasks/archive/` in the same closeout step.
- Archived summaries are cold context: not source of truth, not read automatically.
- Durable decisions were either recorded in the proper source-of-truth doc with user approval, or deliberately left task-local.
