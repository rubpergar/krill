# Definition of Done

This document defines the quality and completeness gates for setting an active task to `phase: ready_for_closeout`. The task lifecycle, state transitions, approval, archival, and removal rules belong exclusively to `agents/docs/task-lifecycle.md`.

## Ready for closeout (task remains `current/`)

The implementation is complete and ready for the administrative closeout. The task's Resume State must be `phase: ready_for_closeout`.

- The plan matches the implemented behavior, or every approved scope change is recorded with its approval and rationale.
- The Execution section preserves evidence for each planned behavior and each relevant RED → GREEN cycle.
- The task has no unresolved open question or blocker.
- Changes are scoped to the approved plan and public interfaces remain compatible unless the plan says otherwise.
- No unrelated refactor or unnecessary dependency was introduced.
- Security-sensitive behavior changed only with explicit plan coverage.
- Relevant tests were added or updated and valid test criteria are satisfied.
- TDD evidence or an approved exception is recorded for behavior changes.
- Targeted tests pass; the applicable full suite, lint, typecheck, and build pass when configured and relevant.
- Every skipped command has a reason and residual risk recorded.
- Converge has mapped every acceptance criterion to concrete evidence (a test, observable behavior, or a documented exception); a criterion without evidence is not done.
- Required source-of-truth documents are synchronized, including API, DB, domain, design, dependency, debt, or decisions documentation when affected.
- Temporary files, debug logs, scratch scripts, and test artifacts are cleaned up or intentionally promoted.
- `git status` contains only intentional changes.
- An independent review has completed; it is required before `ready_for_closeout` unless the task records an approved exception.
