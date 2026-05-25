# TASK-015 Checklist

## Source
- Task: TASK-015
- Plan: `agents/task/TASK-015-plan.md`

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

- [x] Write test: detail page shows "Marcar como convertido" action.
- [x] Implement: add convert action in ViewLead header with confirmation.
- [x] Write test: detail page shows "Marcar como descartado" action.
- [x] Implement: add discard action in ViewLead header with confirmation.
- [x] Write test: clicking convert from detail changes estado and creates audit.
- [x] Write test: clicking discard from detail changes estado and creates audit.
- [x] Write test: convert no-op when already Convertido.
- [x] Write test: discard no-op when already Descartado.
- [x] Implement: no-op check in both actions.
- [x] Write test: table list shows "Convertir" and "Descartar" row actions.
- [x] Implement: add table record actions for convert and discard.
- [x] Write test: table row action convert changes estado and creates audit.
- [x] Write test: table row action discard changes estado and creates audit.
- [x] Write test: inactive user gets 403 on detail and list.
- [x] Write test: guest redirected to login.

### 3. Scope and Docs
- [x] All TDD cycles complete or documented as approved exceptions.
- [x] Changes stayed within approved scope. No unrelated refactors.
- [x] Out-of-scope findings registered in `agents/docs/debt.md` when needed. Sin hallazgos.
- [x] Sync check: compare implemented code against affected source-of-truth docs from the plan. Sin discrepancias.
- [x] Durable docs updated as needed. No se requieren.

### 4. Database Change Controls
Use `Not applicable` when the task does not affect the database schema.

- [x] Not applicable: no schema change is expected.
- [x] Not applicable: no schema change is expected.
- [x] Persisted data compatibility reviewed.
- [x] Backup or recovery expectation documented.
- [x] Pre-check and post-check steps recorded.

### 5. Validation (→ validated)
- [x] Targeted tests: `php artisan test tests/Feature/TASK_015/LeadQuickCloseTest.php` — 12/12 passed
- [x] Full test suite: `php artisan test` — 100/100 passed, 378 assertions
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
