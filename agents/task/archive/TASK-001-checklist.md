# Task Checklist

## Source
- Task: TASK-001
- Plan: `agents/task/TASK-001-plan.md`

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

#### Cycle 1: Schema module
- [x] RED: Write test that imports schema and verifies `products` and `categories` tables exist with expected columns
- [x] Verify RED: test fails because schema module does not exist yet
- [x] GREEN: Create `src/db/schema.ts` with Drizzle table definitions for `products` and `categories`
- [x] Verify GREEN: test passes
- [x] REFACTOR: clean up if needed

#### Cycle 2: Connection module
- [x] RED: Write test that initializes DB connection with env var `DATABASE_URL` pointing to `:memory:`
- [x] Verify RED: test fails because connection module does not exist yet
- [x] GREEN: Create `src/db/index.ts` exporting `db` (Drizzle instance) and `sqlite` (better-sqlite3 connection)
- [x] Verify GREEN: test passes
- [x] REFACTOR: clean up if needed

#### Cycle 3: Migration generation
- [x] Create `data/` directory with `.gitkeep` for DB storage
- [x] Generate initial migration with `pnpm drizzle-kit generate`
- [x] Verify migration SQL is correct (matches expected schema from plan)

### 3. Scope and Docs
- [x] All TDD cycles complete or documented as approved exceptions.
- [x] Changes stayed within approved scope. No unrelated refactors.
- [ ] Out-of-scope findings registered in `agents/docs/debt.md`. (N/A — no findings)
- [x] Sync check: compare implemented code against affected source-of-truth docs from the plan. Discrepancies — stop and ask user. Resolve before proceeding.
- [x] Durable docs updated:
  - [x] `agents/db/schema.sql` updated with resulting SQL DDL
  - [x] `agents/db/changes.sql` updated with TASK-001 entry (forward + rollback)
  - [x] `agents/db/domain.md` updated with entities, relationships, glossary

### 4. Database Change Controls
- [x] DB schema file (`agents/db/schema.sql`) updated to the resulting schema state.
- [x] DB change log file (`agents/db/changes.sql`) updated with forward SQL and rollback notes.
- [x] Persisted data compatibility reviewed (N/A — first migration).
- [x] Backup or recovery expectation documented for destructive or risky changes (N/A — first migration).
- [x] Pre-check and post-check validation queries or steps recorded when needed (N/A).

### 5. Validation (— validated)
- [x] Targeted tests: `pnpm test -- src/db/`
- [x] Full test suite: `pnpm test`
- [x] Lint: `pnpm lint`
- [x] Typecheck: `pnpm typecheck`
- [x] Build: `pnpm build`
- [x] DoD validated criteria checked

### 6. Closeout (— closed)
- [ ] Ask user before marking backlog task done.
- [ ] Move task files to `agents/task/archive/` after user approves.

## States Reached
- [x] Implemented (sections 1-3 complete)
- [x] Validated (section 5 complete)
- [ ] Closed (section 6 complete + user approval)

## Resume Notes
