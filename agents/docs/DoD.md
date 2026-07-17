# Definition of Done

Task plans use four states: `draft`, `approved`, `in_progress`, and `closed`.

The criteria below define what must be true while a task is `in_progress` and what is required before it can be moved to `closed`.

## In Progress

The change is implemented, validated, and ready for administrative closeout.

- Task plan matches the implemented behavior.
- Checklist is complete or explains non-applicable items.
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

Administratively closed. User approved, task files archived.

- User approved backlog completion.
- Task plan status was updated to `closed` before archiving.
- Task plan/checklist were moved to `agents/task/archive/` in the same closeout step.
- Durable decisions were either recorded in the proper source-of-truth doc with user approval, or deliberately left task-local.
