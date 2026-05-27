# Task Checklist

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
- [x] Re-read the approved plan and referenced source-of-truth docs (do not skip even if read during planning).
- [x] Load and apply `agents/skills/test-driven-development/SKILL.md`, or record why it does not apply.
- [x] Verify no open questions block implementation.

### 2. TDD Ledger

#### Cycle 1: Stock adjustment form and action
- [x] RED: Write test that GET /products/:id/stock returns 200 with form
- [x] RED: Write test that GET /products/:id/stock with invalid id returns 404
- [x] RED: Write test that POST /products/:id/stock with add operation increments stock
- [x] RED: Write test that POST /products/:id/stock with remove operation decrements stock
- [x] RED: Write test that POST /products/:id/stock with remove > current stock shows error
- [x] RED: Write test that POST /products/:id/stock with quantity <= 0 shows error
- [x] RED: Write test that POST /products/:id/stock with invalid id returns 404
- [x] Verify RED: stock adjustment tests fail
- [x] GREEN: Create `src/views/products/stock.ejs` with operation selector and quantity field
- [x] GREEN: Add stock routes to `src/routes/products.ts`
- [x] Verify GREEN: stock adjustment tests pass

#### Cycle 2: Low stock indicator and filter
- [x] RED: Write test that GET /products?low_stock=1 filters low stock products
- [x] RED: Write test that GET /products?low_stock=1&q= combines filters
- [x] RED: Write test that list shows "Stock bajo" badge for low stock products
- [x] Verify RED: low stock tests fail
- [x] GREEN: Update `src/routes/products.ts` list handler with low_stock filter
- [x] GREEN: Update `src/views/products/index.ejs` with low stock badge and low stock filter link
- [x] Verify GREEN: low stock tests pass

### 3. Scope and Docs
- [x] All TDD cycles complete or documented as approved exceptions.
- [x] Changes stayed within approved scope. No unrelated refactors.
- [x] Out-of-scope findings registered in `agents/docs/debt.md`.
- [x] Sync check: compare implemented code against affected source-of-truth docs from the plan. Discrepancies — stop and ask user. Resolve before proceeding.
- [x] Durable docs updated:
  - [x] `agents/docs/api.md` updated with stock routes and low_stock filter

### 4. Database Change Controls
- [x] Not applicable — no database schema changes in this task.

### 5. Validation (— validated)
- [x] Targeted tests: `pnpm test -- src/routes/products.test.ts` — 24/24 pass
- [x] Full test suite: `pnpm test` — 45/45 pass across 6 files
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
