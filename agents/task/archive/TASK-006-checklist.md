# TASK-006 Checklist — Anti-spam básico (honeypot + rate limiting)

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
Track each behavior/subtask from the plan through RED → GREEN → REFACTOR cycles.

- [x] Behavior/subtask 1: Rechazar envíos con honeypot `website_url` informado.
- [x] Behavior/subtask 2: Mantener el flujo legítimo con `website_url` vacío.
- [x] Behavior/subtask 3: Aplicar rate limiting al `POST /`.
- [x] Behavior/subtask 4: Evitar creación de leads al superar el rate limit.
- [x] Behavior/subtask 5: Mantener el redirect normal de validación a `/` con errores.
- [x] Behavior/subtask 6: Documentar en API el comportamiento si cambia el contrato por spam/rate limit.

### 3. Scope and Docs
- [x] All TDD cycles complete or documented as approved exceptions.
- [x] Changes stayed within approved scope. No unrelated refactors.
- [x] Out-of-scope findings registered in `agents/docs/debt.md`.
- [x] Sync check: compare implemented code against affected source-of-truth docs from the plan. Discrepancies → stop and ask user. Resolve before proceeding.
- [x] Durable docs updated (`agents/docs/api.md`, DB files from the Source of Truth Map, `agents/docs/design.md`, etc.) as needed.

### 4. Database Change Controls
`Not applicable` — esta tarea no cambia esquema ni persistencia esperada.

- [x] DB schema file from the Source of Truth Map updated to the resulting schema state.
- [x] DB change log file from the Source of Truth Map updated with forward SQL and rollback notes.
- [x] Persisted data compatibility reviewed, including backfill/default/null handling.
- [x] Backup or recovery expectation documented for destructive or risky changes.
- [x] Pre-check and post-check validation queries or steps recorded when needed.

### 5. Validation (→ validated)
- [x] Targeted tests: `php artisan test tests/Feature/TASK_006/AntiSpamTest.php`
- [x] Full test suite: `php artisan test`
- [x] Lint: `./vendor/bin/pint --test`
- [x] Typecheck: `not available`
- [x] Build: `npm run build`
- [x] DoD validated criteria checked: código, tests y docs sincronizados.

### 6. Closeout (→ closed)
- [ ] Ask user before marking backlog task done.
- [ ] Move task files to `agents/task/archive/` after user approves.

## States Reached
- [x] Implemented (sections 1-3 complete)
- [x] Validated (section 5 complete)
- [ ] Closed (section 6 complete + user approval)

## Resume Notes
...
