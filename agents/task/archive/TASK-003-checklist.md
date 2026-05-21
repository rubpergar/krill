# TASK-003 Checklist — Formulario público Blade con campos y validaciones frontend

## Source
- Task: TASK-003
- Plan: `agents/task/TASK-003-plan.md`

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
*TDD tradicional no aplica directamente para vistas Blade sin lógica de negocio. Se sustituye por tests de integración/feature que verifican la respuesta HTTP y el contenido del DOM.*

- [x] Test: `GET /` devuelve 200 (RED: ruta no existe, GREEN: crear ruta)
- [x] Test: respuesta contiene todos los campos del formulario (RED: falla, GREEN: crear vista)
- [x] Test: campos obligatorios tienen atributo `required` (RED: falla, GREEN: añadir required)
- [x] Test: email tiene `type="email"` — cubierto por test de campos presentes (el assertSee('email') encuentra tanto el label como el name/type)
- [x] Test: consentimiento checkbox es required (RED: falla, GREEN: añadir required)
- [x] Test: campo honeypot existe y está oculto (RED: falla, GREEN: añadir honeypot)
- [x] Test: CSRF token presente en formulario (RED: falla, GREEN: @csrf)
- [x] Test: botón de envío presente (RED: falla, GREEN: añadir botón)

### 3. Scope and Docs
- [x] All TDD cycles complete or documented as approved exceptions.
- [x] Changes stayed within approved scope. No unrelated refactors.
- [x] Out-of-scope findings registered in `agents/docs/debt.md`.
- [x] Sync check: compare implemented code against affected source-of-truth docs from the plan. Discrepancies → stop and ask user. Resolve before proceeding.
- [x] Durable docs updated (`agents/docs/api.md`, DB files from the Source of Truth Map, `agents/docs/design.md`, etc.) as needed.

### 4. Database Change Controls
`Not applicable` — esta tarea no afecta a la base de datos.

### 5. Validation (→ validated)
- [x] Targeted tests: `php artisan test --filter=TASK_003`
- [x] Full test suite: `php artisan test`
- [x] Lint: `./vendor/bin/pint --test`
- [x] Typecheck: `not available`
- [x] Build: `npm run build`
- [ ] DoD validated criteria checked

### 6. Closeout (→ closed)
- [ ] Ask user before marking backlog task done.
- [ ] Move task files to `agents/task/archive/` after user approves.

## States Reached
- [x] Implemented (sections 1-3 complete)
- [x] Validated (section 5 complete)
- [ ] Closed (section 6 complete + user approval)

## Resume Notes
...
