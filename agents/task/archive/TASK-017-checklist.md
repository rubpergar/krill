## Source
- Task: TASK-017
- Plan: `agents/task/TASK-017-plan.md`

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

- [x] Write test: dashboard renders basic lead metrics for populated data.
- [x] Write test: dashboard renders zero metrics without leads.
- [x] Implement: create a Filament stats widget for lead counts.
- [x] Implement: register the widget on the admin dashboard.
- [x] Implement: keep existing base widgets available.

### 3. Scope and Docs
- [x] All TDD cycles complete or documented as approved exceptions.
- [x] Changes stayed within approved scope. No unrelated refactors.
- [x] Out-of-scope findings registered in `agents/docs/debt.md`.
- [x] Sync check: compare implemented code against affected source-of-truth docs from the plan. Discrepancies → stop and ask user. Resolve before proceeding.
- [x] Durable docs updated (`agents/docs/api.md`, DB files from the Source of Truth Map, `agents/docs/design.md`, etc.) as needed.

### 4. Database Change Controls
Use `Not applicable` when the task does not affect the database.

- [x] Not applicable: no schema change is expected.
- [x] Not applicable: no schema change is expected.
- [x] Persisted data compatibility reviewed.
- [x] Backup or recovery expectation documented for destructive or risky changes.
- [x] Pre-check and post-check validation queries or steps recorded when needed.

### 5. Validation (→ validated)
- [x] Targeted tests: `php artisan test tests/Feature/TASK_017/DashboardMetricsTest.php`
- [x] Full test suite: `php artisan test`
- [x] Lint: `./vendor/bin/pint --test`
- [x] Typecheck: not available
- [x] Build: `npm run build`
- [x] DoD validated criteria checked.

### 6. Closeout (→ closed)
- [ ] Ask user before marking backlog task done.
- [ ] Move task files to `agents/task/archive/` after user approves.

## States Reached
- [ ] Implemented (sections 1-3 complete)
- [ ] Validated (section 5 complete)
- [ ] Closed (section 6 complete + user approval)
