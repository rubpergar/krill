# TASK-021 Checklist — Archivar/eliminar solicitudes con permisos

## Source
- Task: TASK-021
- Plan: `agents/task/TASK-021-plan.md`

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

- [x] Behavior/subtask 1: default list excludes archived leads.
- [x] Behavior/subtask 2: add filter to show active, archived, or all leads.
- [x] Behavior/subtask 3: add archive action from list and detail.
- [x] Behavior/subtask 4: add restore action from list and detail.
- [x] Behavior/subtask 5: add physical delete action only for active admins and only when archived.
- [x] Behavior/subtask 6: record audit events for archive, restore, and delete.
- [x] Behavior/subtask 7: add permission and behavior tests.

### 3. Scope and Docs
- [x] All TDD cycles complete or documented as approved exceptions.
- [x] Changes stayed within approved scope. No unrelated refactors.
- [x] Out-of-scope findings registered in `agents/docs/debt.md`.
- [x] Sync check: compare implemented code against affected source-of-truth docs from the plan. Discrepancies -> stop and ask user. Resolve before proceeding.
- [x] Durable docs updated (`agents/docs/api.md`, DB files from the Source of Truth Map, `agents/docs/design.md`, etc.) as needed.

### 4. Database Change Controls
Use `Not applicable` when the task does not affect the database.

- [x] Not applicable: DB schema file from the Source of Truth Map updated to the resulting schema state.
- [x] Not applicable: DB change log file from the Source of Truth Map updated with forward SQL and rollback notes.
- [x] Persisted data compatibility reviewed, including backfill/default/null handling.
- [x] Backup or recovery expectation documented for destructive or risky changes.
- [x] Pre-check and post-check validation queries or steps recorded when needed.

### 5. Validation (-> validated)
- [x] Targeted tests: `php artisan test tests/Feature/TASK_021/LeadArchiveDeleteTest.php --stop-on-failure --compact`
- [x] Full test suite: `php artisan test`
- [x] Lint: `./vendor/bin/pint --test`
- [x] Typecheck: not available
- [x] Build: `npm run build`
- [x] DoD validated criteria checked: `agents/docs/DoD.md`

### 6. Closeout (-> closed)
- [x] Ask user before marking backlog task done.
- [x] Move task files to `agents/task/archive/` after user approves.

## States Reached
- [x] Implemented (sections 1-3 complete)
- [x] Validated (section 5 complete)
- [x] Closed (section 6 complete + user approval)

## Resume Notes
- Implemented recommended behavior: active users can archive/restore; active admins can physically delete archived leads only.
- Hard delete records an audit event before deletion, but the event is deleted by cascade with the lead under the current schema.
