# Task Checklist

## Source
- Task: TASK-003
- Plan: `agents/task/TASK-003-plan.md`

## Rules
- Work in order unless blocked.
- Keep items derived from the approved plan.
- **ALL checkboxes must start `[ ]` (unchecked). Never pre-mark items when generating the checklist.**
- Mark completed items during implementation only.

## Checklist

### 1. Context
- [x] Re-read the approved plan and referenced source-of-truth docs (do not skip even if read during planning).
- [x] Load and apply `agents/skills/test-driven-development/SKILL.md`, or record why it does not apply.
- [x] Verify no open questions block implementation.

### 2. TDD Ledger

#### Cycle 1: Categories list (GET /categories) with DB
- [x] RED: Write test that GET /categories returns 200 with empty table
- [x] Verify RED: test fails because route is still placeholder
- [x] GREEN: Update `src/routes/categories.ts` to query DB and render categories list
- [x] GREEN: Update `src/views/categories/index.ejs` with table (name, status, actions)
- [x] Verify GREEN: list test passes

#### Cycle 2: Create category (GET /categories/new, POST /categories)
- [x] RED: Write test that GET /categories/new returns 200 with form
- [x] RED: Write test that POST /categories with valid data creates category and redirects
- [x] RED: Write test that POST /categories with empty name shows validation error
- [x] RED: Write test that POST /categories with duplicate name shows validation error
- [x] Verify RED: create tests fail
- [x] GREEN: Create `src/views/categories/form.ejs`
- [x] GREEN: Implement create route with validation
- [x] Verify GREEN: create tests pass

#### Cycle 3: Edit category (GET /categories/:id/edit, POST /categories/:id)
- [x] RED: Write test that GET /categories/:id/edit returns 200 with data
- [x] RED: Write test that GET /categories/:id/edit with invalid id returns 404
- [x] RED: Write test that POST /categories/:id updates name and redirects
- [x] Verify RED: edit tests fail
- [x] GREEN: Implement edit route with shared form
- [x] Verify GREEN: edit tests pass

#### Cycle 4: Toggle active/inactive (POST /categories/:id/toggle)
- [x] RED: Write test that POST /categories/:id/toggle flips active status
- [x] RED: Write test that toggle on invalid id returns 404
- [x] Verify RED: toggle tests fail
- [x] GREEN: Implement toggle route
- [x] Verify GREEN: toggle tests pass

### 3. Scope and Docs
- [x] All TDD cycles complete or documented as approved exceptions.
- [x] Changes stayed within approved scope. No unrelated refactors.
- [x] Out-of-scope findings registered in `agents/docs/debt.md`.
- [x] Sync check: compare implemented code against affected source-of-truth docs from the plan. Discrepancies — stop and ask user. Resolve before proceeding.
- [x] Durable docs updated:
  - [x] `agents/docs/api.md` updated with new category routes

### 4. Database Change Controls
- [x] Not applicable — no database schema changes in this task.

### 5. Validation (— validated)
- [x] Targeted tests: `pnpm test -- src/routes/categories.test.ts` — 10/10 pass
- [x] Full test suite: `pnpm test` — 21/21 pass across 5 files
- [x] Lint: `pnpm lint` — passes (no errors)
- [x] Typecheck: `pnpm typecheck` — passes (no errors)
- [x] Build: `pnpm build` — passes (no errors)
- [x] DoD validated criteria checked

### 6. Closeout (— closed)
- [ ] Ask user before marking backlog task done.
- [ ] Move task files to `agents/task/archive/` after user approves.

## States Reached
- [x] Implemented (sections 1-3 complete)
- [x] Validated (section 5 complete)
- [ ] Closed (section 6 complete + user approval)

## Resume Notes
