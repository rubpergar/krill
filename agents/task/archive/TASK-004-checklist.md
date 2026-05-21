# TASK-004 Checklist — Endpoint POST de envío con validación backend y guardado de lead

## Source
- Task: TASK-004
- Plan: `agents/task/TASK-004-plan.md`

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

- [x] Behavior/subtask 1: POST del formulario público con validación backend.
- [x] Behavior/subtask 2: Crear `Lead` válido con estado inicial `Nuevo`.
- [x] Behavior/subtask 3: Persistir consentimiento aceptado y fecha de consentimiento.
- [x] Behavior/subtask 4: Guardar metadatos de origen (`ip_origen`, `user_agent`, `origen`) cuando estén disponibles.
- [x] Behavior/subtask 5: Rechazar payload inválido sin crear registros.
- [x] Behavior/subtask 6: Resolver la respuesta de éxito temporal mientras no exista TASK-005.

### 3. Scope and Docs
- [x] All TDD cycles complete or documented as approved exceptions.
- [x] Changes stayed within approved scope. No unrelated refactors.
- [x] Out-of-scope findings registered in `agents/docs/debt.md`.
- [x] Sync check: compare implemented code against affected source-of-truth docs from the plan. Discrepancies → stop and ask user. Resolve before proceeding.
- [x] Durable docs updated (`agents/docs/api.md`, DB files from the Source of Truth Map, `agents/docs/design.md`, etc.) as needed.

### 4. Database Change Controls
`Not applicable` for schema changes; this task only writes to existing tables.

- [x] Existing schema reviewed and confirmed sufficient; no schema update required.
- [x] DB change log review completed; no forward SQL or rollback notes required because there is no migration.
- [x] Persisted data compatibility reviewed, including nullable schema vs required validation handling.
- [x] Backup or recovery expectation documented; no destructive or risky DB change introduced.
- [x] Pre-check and post-check validation steps covered by feature tests and database assertions.

### 5. Validation (→ validated)
- [x] Targeted tests: `php artisan test tests/Feature/TASK_004/EnviarFormularioTest.php`
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
