# TASK-014 Checklist

## Source
- Task: TASK-014
- Plan: `agents/task/TASK-014-plan.md`

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

- [x] Write feature test: historial section visible on lead detail page when events exist.
- [x] Implement: add eventos RepeatableEntry to LeadResource infolist with state callback.
- [x] Write feature test: each event shows accion, campo, valor_anterior, valor_nuevo, autor, fecha.
- [x] Implement: configure RepeatableEntry schema with all event fields.
- [x] Write feature test: events ordered newest first.
- [x] Implement: load eventos with `latest()` scope.
- [x] Write feature test: events are isolated to the current lead only.
- [x] Implement: state callback filters eventos by lead relationship.
- [x] Write feature test: lead without events shows placeholder text.
- [x] Implement: add empty-state TextEntry hidden when eventos exist.
- [x] Write feature test: event with null usuario_id shows «Sistema» as author.
- [x] Implement: handle null usuario in state mapping.
- [x] Write feature test: inactive user gets 403 (existing access control preserved).
- [x] Write feature test: guest redirected to login (existing access control preserved).

### 3. Scope and Docs
- [x] All TDD cycles complete or documented as approved exceptions.
- [x] Changes stayed within approved scope. No unrelated refactors.
- [x] Out-of-scope findings registered in `agents/docs/debt.md` when needed. Sin hallazgos fuera de alcance.
- [x] Sync check: compare implemented code against affected source-of-truth docs from the plan. Sin discrepancias. No hay cambios duraderos que documentar.
- [x] Durable docs updated (`agents/docs/api.md`, DB files from the Source of Truth Map, `agents/docs/design.md`, etc.) as needed. No se requieren actualizaciones.

### 4. Database Change Controls
Use `Not applicable` when the task does not affect the database schema.

- [x] Not applicable: no schema change is expected.
- [x] Not applicable: no schema change is expected.
- [x] Persisted data compatibility reviewed, including backfill/default/null handling. Solo lectura de eventos existentes.
- [x] Backup or recovery expectation documented for destructive or risky changes. No aplica.
- [x] Pre-check and post-check validation queries or steps recorded when needed. No aplica.

### 5. Validation (→ validated)
- [x] Targeted tests: `php artisan test tests/Feature/TASK_014/LeadAuditHistoryTest.php` — 7/7 passed
- [x] Full test suite: `php artisan test` — 88/88 passed, 318 assertions
- [x] Lint: `./vendor/bin/pint --test` — passed
- [x] Typecheck: Not available en el proyecto.
- [x] Build: `npm run build` — passed
- [x] DoD validated criteria checked.

### 6. Closeout (→ closed)
- [ ] Ask user before marking backlog task done.
- [ ] Move task files to `agents/task/archive/` after user approves.

## States Reached
- [x] Implemented (sections 1-3 complete)
- [x] Validated (section 5 complete)
- [ ] Closed (section 6 complete + user approval)

## Resume Notes
...
