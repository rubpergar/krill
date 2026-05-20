# Task Checklist TASK-006

## Source
- Task: TASK-006
- Plan: `agents/task/TASK-006-plan.md`

## Rules
- Work in order unless blocked.
- Keep items derived from the approved plan.
- **ALL checkboxes must start `[ ]` (unchecked). Never pre-mark items when generating the checklist.**
- Mark completed items during implementation only.

## Checklist

### 1. Context
- [x] Re-read the approved plan and referenced source-of-truth docs.
- [x] Load and apply `agents/skills/test-driven-development/SKILL.md`.
- [x] Verify no open questions block implementation.

### 2. TDD Ledger

**Cycle 1: listAllFiltered service method + admin route with query params**
- [x] RED: 8 tests fail — no meta, no filter, no validation in admin list
- [x] GREEN: Add `listAllFiltered()` in incidents.service.ts + update admin route
- [x] REFACTOR: Extract `applyFiltersAndPaginate()` shared helper, removing ~60 lines of duplication

**Cycle 2: Edge cases and auth**
- [x] RED: Tests for invalid params, beyond-last-page, empty results
- [x] GREEN: Handled by schema validation + service logic
- [x] REFACTOR: Clean

### 3. Scope and Docs
- [x] All TDD cycles complete.
- [x] Changes stayed within approved scope. No unrelated refactors.
- [x] Out-of-scope findings registered in `agents/docs/debt.md`.
- [x] Sync check: compare implemented code against affected source-of-truth docs.
- [x] Durable docs updated (`agents/docs/api.md`).

### 4. Database Change Controls
Not applicable — no DB.

### 5. Validation (→ validated)
- [x] Targeted tests: 11 admin list tests (8 new + 3 existing auth)
- [x] Full test suite: 81/81 pass
- [x] Lint: clean
- [x] Typecheck: clean
- [x] Build: frontend builds
- [x] DoD validated criteria checked

### 6. Closeout (→ closed)
- [ ] Ask user before marking backlog task done.
- [ ] Move task files to `agents/task/archive/` after user approves.

## States Reached
- [x] Implemented (sections 1-3 complete)
- [x] Validated (section 5 complete)
- [ ] Closed (section 6 complete + user approval)

## Resume Notes
...
