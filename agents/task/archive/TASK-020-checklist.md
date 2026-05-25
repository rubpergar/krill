## Source
- Task: TASK-020
- Plan: `agents/task/TASK-020-plan.md`

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

- [x] Write test: invited users are redirected from `/admin/users` to `/admin/login`.
- [x] Write test: inactive users receive 403 on `/admin/users`.
- [x] Write test: active non-admin users receive 403 on `/admin/users`.
- [x] Write test: active admin users can list users.
- [x] Write test: create form validates name, email, password, role, and active state.
- [x] Write test: create hashes password and persists allowed role and active state.
- [x] Write test: edit form keeps existing password when password is blank.
- [x] Write test: admin can activate/deactivate another user.
- [x] Write test: self-deactivation is blocked or handled safely.
- [x] Implement: create Filament UserResource with list, create, edit, and view flows.
- [x] Implement: restrict UserResource access to active admins.
- [x] Implement: allow activation/deactivation without physical deletion.

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
- [x] Targeted tests: `php artisan test tests/Feature/TASK_020/UserResourceTest.php`
- [x] Full test suite: `php artisan test`
- [x] Lint: `./vendor/bin/pint --test`
- [x] Typecheck: not available
- [x] Build: `npm run build`
- [x] DoD validated criteria checked.

### 6. Closeout (→ closed)
- [ ] Ask user before marking backlog task done.
- [ ] Move task files to `agents/task/archive/` after user approves.

## States Reached
- [x] Implemented (sections 1-3 complete)
- [x] Validated (section 5 complete)
- [ ] Closed (section 6 complete + user approval)
