# TASK-008 Checklist

## Source
- Task: TASK-008
- Plan: `agents/task/TASK-008-plan.md`

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
Track each behavior/subtask from the plan through RED → GREEN → REFACTOR cycles.

- [x] Behavior/subtask 1: Create `LeadResource` for `App\Models\Lead` under `app/Filament/Resources` and make it discoverable by the admin panel.
- [x] Behavior/subtask 2: Add the list page/table so authenticated active users can open the leads listing from `/admin`.
- [x] Behavior/subtask 3: Show the initial read-only columns: nombre, email, empresa, tipo de necesidad, estado, responsable y fecha de creación.
- [x] Behavior/subtask 4: Keep pagination enabled and default ordering by newest leads first.
- [x] Behavior/subtask 5: Handle null `empresa` and null `responsable` safely in the table display.
- [x] Behavior/subtask 6: Cover the resource with feature tests for access control and visible row data.

### 3. Scope and Docs
- [x] All TDD cycles complete or documented as approved exceptions.
- [x] Changes stayed within approved scope. No unrelated refactors.
- [x] Out-of-scope findings registered in `agents/docs/debt.md`.
- [x] Sync check: compare implemented code against affected source-of-truth docs from the plan. Discrepancies → stop and ask user. Resolve before proceeding.
- [x] Durable docs updated (`agents/docs/api.md`, DB files from the Source of Truth Map, `agents/docs/design.md`, etc.) as needed.

### 4. Database Change Controls
Use `Not applicable` when the task does not affect the database.

- [x] DB schema file from the Source of Truth Map updated to the resulting schema state.
- [x] DB change log file from the Source of Truth Map updated with forward SQL and rollback notes.
- [x] Persisted data compatibility reviewed, including backfill/default/null handling.
- [x] Backup or recovery expectation documented for destructive or risky changes.
- [x] Pre-check and post-check validation queries or steps recorded when needed.

### 5. Validation (→ validated)
- [x] Targeted tests: `php artisan test --filter=TASK_008` → 7 tests, 15 assertions, all passed
- [x] Full test suite: `php artisan test` → 44 tests, 171 assertions, all passed
- [x] Lint: `./vendor/bin/pint --test` → passed
- [x] Typecheck: `not available`
- [x] Build: `npm run build` → passed
- [x] DoD validated criteria checked: cambios scoped, tests creados, lint/build OK, sin cambios DB, durable docs sin cambios necesarios, sin findings fuera de scope

### 6. Closeout (→ closed)
- [ ] Ask user before marking backlog task done.
- [ ] Move task files to `agents/task/archive/` after user approves.

## States Reached
- [x] Implemented (sections 1-3 complete)
- [x] Validated (section 5 complete)
- [ ] Closed (section 6 complete + user approval)

## Resume Notes
...
