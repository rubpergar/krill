---
description: Generate checklist and start TDD implementation for the active task
---

Generate `agents/task/TASK-XXX-checklist.md` for the active task and begin implementation following the SDD/TDD workflow.

Rules:
- Read `agents/task/backlog.md` and identify the single task under `## Current`.
- If `## Current` has zero or multiple tasks, stop and ask the user to select or create one.
- Extract the task ID (TASK-XXX) from the backlog entry.
- Verify that `agents/task/TASK-XXX-plan.md` exists. If not, stop and suggest running `/plan` first.
- Set the plan status to `approved` in `agents/task/TASK-XXX-plan.md` (using this command implies the plan is ready).
- Read `agents/task/checklist.md` for the checklist template structure.
- Derive checklist items from the approved plan only. Do not add items that are not covered by the plan.
- **ALL checklist items must start `[ ]` (unchecked). Never pre-mark items when generating.**
- If the task affects the database, include checklist items for DB schema updates, DB change log updates, backup/recovery checks, and migration validation.
- Read and apply `agents/skills/test-driven-development/SKILL.md` once at the start of implementation and follow the RED → GREEN → REFACTOR cycle.
- Read `agents/docs/testing.md` for project-specific test, lint, typecheck, and build commands.
- Mark checklist items as they are completed during implementation.
- Do not change files outside the approved scope.
- Register out-of-scope findings in `agents/docs/debt.md` instead of modifying them.
- If test-first work is not feasible for a specific item, stop and document why unless the exception is already in the approved plan.

Flow:
1. Read `agents/task/backlog.md` and confirm exactly one task under `## Current`.
2. Verify `agents/task/TASK-XXX-plan.md` exists. If not, stop.
3. Set plan status to `approved`.
4. Read the approved plan and `agents/task/checklist.md`.
5. Generate `agents/task/TASK-XXX-checklist.md` with items derived from the plan.
6. Read and apply `agents/skills/test-driven-development/SKILL.md`.
7. Read `agents/docs/testing.md` for validation commands.
8. Implement following the checklist order and TDD cycles.
9. Mark completed items in the checklist as you go.
10. When implementation is complete, run validation commands from `agents/docs/testing.md`.
11. Report the final state: checklist progress, validation results, and any open items or debt registered.
