# TASK-002 Checklist — Migraciones y modelos

## Source
- Task: TASK-002
- Plan: `agents/task/TASK-002-plan.md`

## Rules
- Work in order unless blocked.
- Keep items derived from the approved plan.
- Mark completed items during implementation only.

## Checklist

### 1. Context
- [x] Re-read the approved plan and referenced source-of-truth docs.
- [x] Load and apply `agents/skills/test-driven-development/SKILL.md`, or record why it does not apply.
- [x] Verify no open questions block implementation.

### 2. TDD Ledger
- [x] Cycle 1: Enum LeadStatus — RED (class not found), GREEN (created), REFACTOR
- [x] Cycle 2: Enum TipoNecesidad — RED (class not found), GREEN (created), REFACTOR
- [x] Cycle 3: Migración add rol/activo to users — RED (columns missing), GREEN (created), REFACTOR
- [x] Cycle 4: Migración create_leads_table — RED (table missing), GREEN (created), REFACTOR
- [x] Cycle 5: Migración create_notas_internas — RED, GREEN, REFACTOR
- [x] Cycle 6: Migración create_eventos_auditoria — RED, GREEN, REFACTOR
- [x] Cycle 7: Modelo Lead con relaciones — RED (class missing), GREEN (created), REFACTOR
- [x] Cycle 8: Modelos NotaInterna y EventoAuditoria — RED, GREEN, REFACTOR
- [x] Cycle 9: User model actualizado — RED (trait conflict), GREEN (fixed), REFACTOR
- [x] Cycle 10: Factory LeadFactory — GREEN (created, tested via model test)
- [x] Cycle 11: Seeder con admin — GREEN (created, tested via migrate:fresh --seed)

### 3. Scope and Docs
- [x] All TDD cycles complete or documented as approved exceptions.
- [x] Changes stayed within approved scope. No unrelated refactors.
- [x] Out-of-scope findings registered in `agents/docs/debt.md`.
- [x] Sync check: compare implemented code against affected source-of-truth docs from the plan.
- [x] Durable docs updated: `agents/db/schema.sql`, `agents/db/domain.md`, `agents/db/changes.sql`.

### 4. Database Change Controls
- [x] DB schema file (schema.sql) updated to the resulting schema state.
- [x] DB change log file (changes.sql) updated with forward SQL and rollback notes.
- [x] Persisted data compatibility reviewed (additive changes to users table).
- [x] Backup or recovery expectation documented.
- [x] Validation: `php artisan migrate:fresh --seed` funciona.

### 5. Validation (→ validated)
- [x] Targeted tests: 14 tests pass (53 assertions)
- [x] Full test suite: `php artisan test` — passes
- [x] Lint: `./vendor/bin/pint --test` — passes
- [x] Typecheck: `not available`
- [x] Build: `npm run build` — passes
- [x] DoD validated criteria checked

### 6. Closeout (→ closed)
- [ ] Ask user before marking backlog task done.
- [ ] Move task files to `agents/task/archive/` after user approves.

## States Reached
- [x] Implemented (sections 1-3 complete)
- [x] Validated (section 5 complete)
- [ ] Closed (section 6 complete + user approval)

## Resume Notes
- Enums: LeadStatus (6 estados), TipoNecesidad (5 tipos)
- Migraciones: add_rol_activo_to_users, create_leads, create_notas_internas, create_eventos_auditoria
- Modelos: Lead, NotaInterna, EventoAuditoria (con casts y relaciones)
- User: añadidos campos rol, activo y relaciones
- Factories: LeadFactory, NotaInternaFactory, EventoAuditoriaFactory (UserFactory extendido)
- Seeder: admin@prawnforms.test creado via firstOrCreate
- Docs: schema.sql, changes.sql, domain.md actualizados
