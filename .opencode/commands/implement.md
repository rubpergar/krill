---
description: Generate the execution ledger and start TDD implementation for the active task
---

Generate the execution portion of `agents/tasks/current/TASK-XXX.md` for the active task and begin implementation following the SDD/TDD workflow.

Rules:
- Identify the active task: the single file in `agents/tasks/current/`.
- If `agents/tasks/current/` has zero or multiple tasks, stop and ask the user to select or create one.
- Extract the task ID (TASK-XXX) from the task file name.
- Verify that `agents/tasks/current/TASK-XXX.md` exists. If not, stop and suggest running `/plan` first.
- Read the task status before making any changes. Implementation may only start once the plan is approved (task in `current/` and approved by the user). If it is still `todo`, stop and ask the user to review the plan and approve it first.
- Read `agents/tasks/template.md` for the Execution section structure.
- Fill the `## Execution` section (Context, TDD Ledger, Converge, Validation, Closeout) with items derived from the approved Plan only. Do not add items not covered by the plan.
- ALL checklist items must start `[ ]` (unchecked). Never pre-mark items when generating.
- If the task affects the database, include Execution items for DB schema updates, DB change log updates, backup/recovery checks, and migration validation.
- Read and apply `agents/skills/test-driven-development/SKILL.md` once at the start of implementation.
- Follow the RED → GREEN → REFACTOR cycle from the TDD skill during implementation.
- After each GREEN pass, run the lightweight quality gate from `AGENTS.md`: prefer the simplest passing design, avoid premature abstractions, and question production code that exists only to support tests.
- Read `agents/docs/testing.md` for project-specific test, lint, typecheck, and build commands.
- Mark Execution items as they are completed during implementation.
- Do not change files outside the approved scope.
- Register out-of-scope findings in `agents/docs/debt.md` instead of modifying them.
- If test-first work is not feasible for a specific item, stop and document why unless the exception is already in the approved plan.
- Follow `AGENTS.md` for the canonical implementation workflow, TDD quality gate, and independent final review policy.

Converge step (required before closeout):
- After implementation and validation, run the Converge section: contrast the implemented code against the approved plan and acceptance criteria.
- Every acceptance criterion must have evidence (a test, observable behavior, or a documented exception in the plan).
- Confirm no unrelated refactors or out-of-scope changes.
- Confirm out-of-scope findings are registered in `agents/docs/debt.md`.
- Confirm durable docs (API, DB files, design, decisions) are updated as needed.
- Confirm any durable decisions are either recorded in `agents/docs/decisions.md` with user approval or deliberately left task-local.
- If the implementation diverges from the plan, stop and resolve the discrepancy with the user before closeout.

Flow:
1. Confirm exactly one active task in `agents/tasks/current/`.
2. Verify `agents/tasks/current/TASK-XXX.md` exists and the plan is approved. If not, stop.
3. Read the approved plan and `agents/tasks/template.md`.
4. Fill the `## Execution` section with items derived from the plan.
5. Read and apply `agents/skills/test-driven-development/SKILL.md` and `agents/docs/testing.md`.
6. Implement following the Execution order and the canonical workflow from `AGENTS.md`.
7. Mark completed items in the Execution section as you go.
8. When implementation is complete, run validation commands from `agents/docs/testing.md`.
9. Run the Converge step. If issues are found, fix them before ending `/implement`.
10. Leave the task in `current/` until `/closeout` finishes.
11. Report the final state: execution progress, validation results, converge outcome, and any open items or debt registered.
