# TASK-013 Checklist

## Source
- Task: TASK-013
- Plan: `agents/task/TASK-013-plan.md`

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

- [x] Write feature test: action "Asignar responsable" visible on lead detail page.
- [x] Implement: add assignResponsable header action to ViewLead with Select of active users + "Sin responsable".
- [x] Write feature test: assigning a different responsible updates `leads.responsable_id`.
- [x] Implement: persist `responsable_id` on the lead model.
- [x] Write feature test: assignment creates an `EventoAuditoria` with correct fields.
- [x] Implement: create audit event with `accion = asignacion`, `campo = responsable_id`, names as values.
- [x] Write feature test: selecting same responsible is a no-op (no update, no audit).
- [x] Implement: skip update and audit when `responsable_id` does not change.
- [x] Write feature test: unassigning (null) creates an audit event with "Sin responsable".
- [x] Implement: handle null assignment as a valid change with audit.
- [x] Write feature test: lead without prior responsible gets assigned and creates audit.
- [x] Write feature test: inactive user gets 403 on detail page (existing access control preserved).
- [x] Write feature test: guest redirected to login (existing access control preserved).

### 3. Scope and Docs
- [x] All TDD cycles complete or documented as approved exceptions.
- [x] Changes stayed within approved scope. No unrelated refactors.
- [x] Out-of-scope findings registered in `agents/docs/debt.md` when needed. Sin hallazgos fuera de alcance.
- [x] Sync check: compare implemented code against affected source-of-truth docs from the plan. Sin discrepancias. No hay cambios duraderos que documentar (sin cambios de esquema, API, diseño ni reglas de dominio — la regla «Las asignaciones se registran en EventoAuditoria» ya está documentada en `agents/db/domain.md`).
- [x] Durable docs updated (`agents/docs/api.md`, DB files from the Source of Truth Map, `agents/docs/design.md`, etc.) as needed. No se requieren actualizaciones.

### 4. Database Change Controls
Use `Not applicable` when the task does not affect the database schema.

- [x] Not applicable: no schema change is expected.
- [x] Not applicable: no schema change is expected.
- [x] Persisted data compatibility reviewed, including backfill/default/null handling. Leads sin responsable previo se manejan con blank() -> null.
- [x] Backup or recovery expectation documented for destructive or risky changes. No aplica.
- [x] Pre-check and post-check validation queries or steps recorded when needed. No aplica.

### 5. Validation (→ validated)
- [x] Targeted tests: `php artisan test tests/Feature/TASK_013/LeadAssignmentTest.php` — 7/7 passed
- [x] Full test suite: `php artisan test` — 81/81 passed, 300 assertions
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
