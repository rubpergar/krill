# Task Checklist

## Source
- Task: TASK-007
- Plan: `agents/task/TASK-007-plan.md`

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
- [x] **RED** — Write failing test: POST /products with negative stock shows error
- [x] **GREEN** — Add server-side validation for negative stock on product create
- [x] **RED** — Write failing test: POST /products with negative min_stock shows error
- [x] **GREEN** — Add server-side validation for negative min_stock on product create
- [x] **RED** — Write failing test: POST /products/:id (edit) with negative stock shows error
- [x] **GREEN** — Add server-side validation for negative stock on product edit
- [x] **RED** — Write failing test: POST /products/:id (edit) with negative min_stock shows error
- [x] **GREEN** — Add server-side validation for negative min_stock on product edit
- [x] **RED** — Write failing test: POST /products with non-numeric stock shows error
- [x] **GREEN** — Add server-side validation for non-numeric stock

### 3. Scope and Docs
- [x] All TDD cycles complete or documented as approved exceptions.
- [x] Changes stayed within approved scope. No unrelated refactors.
- [x] Out-of-scope findings registered in `agents/docs/debt.md`.
- [x] Sync check: compare implemented code against affected source-of-truth docs from the plan.
- [x] Durable docs updated (`agents/docs/api.md`, etc.) as needed.

### 4. Database Change Controls
Not applicable — no DB schema changes.

### 5. Validation (→ validated)
- [x] Targeted tests: `pnpm test -- products.test.ts`
- [x] Full test suite: `pnpm test`
- [x] Lint: `pnpm lint`
- [x] Typecheck: `pnpm typecheck`
- [x] Build: `pnpm build`
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
