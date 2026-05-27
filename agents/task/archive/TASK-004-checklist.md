# Task Checklist

## Source
- Task: TASK-004
- Plan: `agents/task/TASK-004-plan.md`

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

#### Cycle 1: Products list with search and filters (GET /products)
- [x] RED: Write test that GET /products returns 200 with empty table
- [x] RED: Write test that GET /products with `?q=` filters by name/SKU
- [x] RED: Write test that GET /products with `?category=` filters by category
- [x] Verify RED: list tests fail (placeholder still active)
- [x] GREEN: Update `src/routes/products.ts` with list, search and category filter using Drizzle
- [x] GREEN: Update `src/views/products/index.ejs` with table, search field and category dropdown
- [x] Verify GREEN: list tests pass

#### Cycle 2: Create product (GET /products/new, POST /products)
- [x] RED: Write test that GET /products/new returns 200 with form and category dropdown
- [x] RED: Write test that POST /products with valid data creates product and redirects
- [x] RED: Write test that POST /products with empty name shows validation error
- [x] RED: Write test that POST /products with empty SKU shows validation error
- [x] RED: Write test that POST /products with duplicate SKU shows validation error
- [x] Verify RED: create tests fail
- [x] GREEN: Create `src/views/products/form.ejs` with all fields (name, SKU, description, category, stock, min_stock)
- [x] GREEN: Implement create route with validation
- [x] Verify GREEN: create tests pass

#### Cycle 3: Edit product (GET /products/:id/edit, POST /products/:id)
- [x] RED: Write test that GET /products/:id/edit returns 200 with prefilled data
- [x] RED: Write test that GET /products/:id/edit with invalid id returns 404
- [x] RED: Write test that POST /products/:id updates fields and redirects
- [x] Verify RED: edit tests fail
- [x] GREEN: Implement edit route using shared form
- [x] Verify GREEN: edit tests pass

#### Cycle 4: Toggle active/inactive (POST /products/:id/toggle)
- [x] RED: Write test that POST /products/:id/toggle flips active status
- [x] RED: Write test that POST /products/:id/toggle with invalid id returns 404
- [x] Verify RED: toggle tests fail
- [x] GREEN: Implement toggle route
- [x] Verify GREEN: toggle tests pass

### 3. Scope and Docs
- [x] All TDD cycles complete or documented as approved exceptions.
- [x] Changes stayed within approved scope. No unrelated refactors.
- [x] Out-of-scope findings registered in `agents/docs/debt.md`.
- [x] Sync check: compare implemented code against affected source-of-truth docs from the plan. Discrepancies — stop and ask user. Resolve before proceeding.
- [x] Durable docs updated:
  - [x] `agents/docs/api.md` updated with new product routes

### 4. Database Change Controls
- [x] Not applicable — no database schema changes in this task.

### 5. Validation (— validated)
- [x] Targeted tests: `pnpm test -- src/routes/products.test.ts` — 14/14 pass
- [x] Full test suite: `pnpm test` — 35/35 pass across 6 files
- [x] Lint: `pnpm lint` — passes (1 fix applied)
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
