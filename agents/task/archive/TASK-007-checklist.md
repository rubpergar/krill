# TASK-007 Checklist — Autenticación Filament (login, logout, protección de rutas)

## Source
- Task: TASK-007
- Plan: `agents/task/TASK-007-plan.md`

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

- [x] Behavior/subtask 1: Redirigir visitante no autenticado desde `/admin` al login de Filament.
- [x] Behavior/subtask 2: Permitir acceso al panel a usuario activo autenticado.
- [x] Behavior/subtask 3: Bloquear acceso al panel a usuario inactivo autenticado.
- [x] Behavior/subtask 4: Implementar `FilamentUser::canAccessPanel()` en `User`.
- [x] Behavior/subtask 5: Verificar logout del panel y pérdida de acceso posterior.
- [x] Behavior/subtask 6: Mantener el contrato actual del panel Filament sin cambios de esquema.

### 3. Scope and Docs
- [x] All TDD cycles complete or documented as approved exceptions.
- [x] Changes stayed within approved scope. No unrelated refactors.
- [x] Out-of-scope findings registered in `agents/docs/debt.md`.
- [x] Sync check: compare implemented code against affected source-of-truth docs from the plan. Discrepancies → stop and ask user. Resolve before proceeding.
- [x] Durable docs updated (`agents/docs/api.md`, DB files from the Source of Truth Map, `agents/docs/design.md`, etc.) as needed.

### 4. Database Change Controls
`Not applicable` — esta tarea usa columnas existentes (`rol`, `activo`) y no cambia esquema.

- [x] DB schema file from the Source of Truth Map updated to the resulting schema state.
- [x] DB change log file from the Source of Truth Map updated with forward SQL and rollback notes.
- [x] Persisted data compatibility reviewed, including backfill/default/null handling.
- [x] Backup or recovery expectation documented for destructive or risky changes.
- [x] Pre-check and post-check validation queries or steps recorded when needed.

### 5. Validation (→ validated)
- [x] Targeted tests: `php artisan test tests/Feature/TASK_007/FilamentAuthTest.php`
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
