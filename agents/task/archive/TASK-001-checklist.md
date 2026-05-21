# TASK-001 Checklist — Bootstrap del proyecto PrawnForms

## Source
- Task: TASK-001
- Plan: `agents/task/TASK-001-plan.md`

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
*TDD no aplica para bootstrap/scaffolding. No hay comportamiento de producto que testear. Se valida con comandos (php artisan test, migrate, etc.).*

- [x] Inicializar Laravel 13 con `composer create-project`
- [x] Configurar `.env` para PostgreSQL (prawn_db, credenciales estándar, con fallback a SQLite)
- [x] Instalar Filament 5 con panel único /admin
- [x] Instalar Pest 4
- [x] Ejecutar `php artisan migrate` y verificar que funciona
- [x] Ejecutar `php artisan test` y verificar que pasa
- [x] Configurar AGENTS.md con identidad y stack de PrawnForms
- [x] Configurar agents/docs/testing.md con comandos
- [x] Registrar ADR-000 en agents/docs/decisions.md
- [ ] Transicionar a project mode (solo tras aprobación del usuario)
- [ ] Archivar agents/docs/bootstrap.md (solo tras aprobación del usuario)

### 3. Scope and Docs
- [x] All TDD cycles complete or documented as approved exceptions.
- [x] Changes stayed within approved scope. No unrelated refactors.
- [x] Out-of-scope findings registered in `agents/docs/debt.md`.
- [x] Sync check: compare implemented code against affected source-of-truth docs from the plan.
- [x] Durable docs updated as needed.

### 4. Database Change Controls
*Not applicable — no se crean tablas de dominio en esta tarea.*

### 5. Validation (→ validated)
- [x] Targeted tests: `php artisan test` — 2 tests pass
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
- Laravel 13.11.2 instalado
- Filament 5.6.4 instalado con panel en /admin
- Pest 4.7.0 instalado (2 tests: 1 Unit, 1 Feature)
- PostgreSQL configurado en .env (comentado); SQLite activo para desarrollo local
- Usuario admin creado: admin@prawnforms.test / password
- Pendiente: user approval para transicionar a project mode
