# Task Checklist

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
- [x] Re-read the approved plan and referenced source-of-truth docs (do not skip even if read during planning).
- [x] Load and apply `agents/skills/test-driven-development/SKILL.md`, or record why it does not apply.
- [x] Verify no open questions block implementation.

### 2. TDD Ledger
- [x] **RED** — Write failing test: dashboard shows 0 metrics with empty DB
- [x] **GREEN** — Add DAO functions: `getTotalProducts()`, `getActiveProducts()`, `getCategoryCount()`, `getLowStockCount()`
- [x] **RED** — Write failing test: dashboard shows correct metrics with populated DB
- [x] **GREEN** — Wire DAO queries into dashboard route handler
- [x] **REFACTOR** — Clean up queries (extract helper, ensure reuse)

### 3. Scope and Docs
- [x] All TDD cycles complete or documented as approved exceptions.
- [x] Changes stayed within approved scope. No unrelated refactors.
- [x] Out-of-scope findings registered in `agents/docs/debt.md`.
- [x] Sync check: compare implemented code against affected source-of-truth docs from the plan.
- [x] Durable docs updated (`agents/docs/api.md` updated dashboard route description).

### 4. Database Change Controls
Not applicable — no DB schema changes.

### 5. Validation (→ validated)
- [x] Targeted tests: `pnpm test -- dashboard`
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
