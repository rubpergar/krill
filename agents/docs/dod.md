# Definition of Done

This document is the agent's completion criterion for implementing a task: it answers "is the implementation work finished?" independently of any review. The task lifecycle, phase transitions, approval, and removal rules belong exclusively to `agents/docs/task-lifecycle.md`.

## Implementation complete

The implementation step is done when these criteria pass.

- The plan matches the implemented behavior, or every approved scope change is recorded with its approval and rationale.
- The Execution section preserves evidence for each planned behavior and each relevant RED → GREEN cycle.
- Changes are scoped to the approved plan and public interfaces remain compatible unless the plan says otherwise.
- No unrelated refactor or unnecessary dependency was introduced.
- Security-sensitive behavior changed only with explicit plan coverage.
- Relevant tests were added or updated and the valid-test criteria in `.opencode/skills/tdd/tests.md` are satisfied.
- For behavior changes, RED/GREEN evidence is recorded, or an exception permitted by `.opencode/skills/tdd/SKILL.md` was explicitly approved and recorded in the task file.
- Targeted tests pass; the applicable full suite, lint, typecheck, and build pass when configured and relevant.
- Every skipped command has a reason and residual risk recorded.
- Converge has mapped every acceptance criterion to concrete evidence (a test, observable behavior, or a documented exception); a criterion without evidence is not done.
- Durable documentation matches the plan's `Documentation impact` or an approved change, and follows the `AGENTS.md` documentation rule; a task without the field uses its plan's documentation section.
- Temporary files, debug logs, scratch scripts, and test artifacts are cleaned up or intentionally promoted.
- `git status` contains only intentional changes.
