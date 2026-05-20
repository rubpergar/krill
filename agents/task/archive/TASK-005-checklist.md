# Task Checklist TASK-005

## Source
- Task: TASK-005
- Plan: `agents/task/TASK-005-plan.md`

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

**Cycle 1: Schema for list query params**
- [x] RED: Write test that Zod schema validates/invalidates query params
- [x] GREEN: Add `listIncidentsQuerySchema` in schema file
- [x] REFACTOR: Clean up if needed

**Cycle 2: IncidentListFilters type + service pagination/filters**
- [x] RED: Write test that service filters and paginates correctly
- [x] GREEN: Add `IncidentListFilters` type + `listByUserFiltered` in service
- [x] REFACTOR: Clean up if needed

**Cycle 3: Route handler for GET / (list with filters + pagination)**
- [x] RED: Write route integration test for filtered/paginated list
- [x] GREEN: Update route to parse query params and call service
- [x] REFACTOR: Clean up if needed

**Cycle 4: Detail endpoint includes comments**
- [x] RED: Write test that GET /:id includes comments
- [x] GREEN: Update route to include comments in detail response
- [x] REFACTOR: Clean up if needed

**Cycle 5: Edge cases and validation errors**
- [x] RED: Write tests for invalid params, beyond-last page, empty results
- [x] GREEN: Handle in schema validation and route
- [x] REFACTOR: Clean up if needed

### 3. Scope and Docs
- [x] All TDD cycles complete.
- [x] Changes stayed within approved scope. No unrelated refactors.
- [x] Out-of-scope findings registered in `agents/docs/debt.md`.
- [x] Sync check: compare implemented code against affected source-of-truth docs.
- [x] Durable docs updated (`agents/docs/api.md`).

### 4. Database Change Controls
Not applicable — no DB.

### 5. Validation (→ validated)
- [x] Targeted tests: 73 tests pass (57 old + 16 new)
- [x] Full test suite: 73/73 pass
- [x] Lint: clean
- [x] Typecheck: clean
- [x] Build: frontend builds successfully
- [x] DoD validated criteria checked:

### 6. Closeout (→ closed)
- [ ] Ask user before marking backlog task done.
- [ ] Move task files to `agents/task/archive/` after user approves.

## States Reached
- [x] Implemented (sections 1-3 complete)
- [x] Validated (section 5 complete)
- [ ] Closed (section 6 complete + user approval)

## Resume Notes
...
