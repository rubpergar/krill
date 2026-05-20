# TASK-004 Checklist: Implementar creación, validación y persistencia de incidencias

## Source
- Task: TASK-004
- Plan: `agents/task/TASK-004-plan.md`

## Rules
- Work in order unless blocked.
- Keep items derived from the approved plan.

## Checklist

### 1. Context
- [x] Re-read the approved plan and referenced source-of-truth docs.
- [x] Load and apply `agents/skills/test-driven-development/SKILL.md`.
- [x] Verify no open questions block implementation.

### 2. TDD Ledger

- [x] RED: Test title < 3 chars → 400
- [x] GREEN: Zod min(3) en schema
- [x] RED: Test title > 200 chars → 400
- [x] GREEN: Zod max(200) en schema
- [x] RED: Test description > 2000 chars → 400
- [x] GREEN: Zod max(2000) en schema
- [x] RED: Test transición inválida (in_progress → closed) → 400
- [x] GREEN: VALID_TRANSITIONS map en incidentService
- [x] RED: Test transición mismo status (no-op) → 200
- [x] GREEN: Incluir mismo status en transiciones válidas
- [x] RED: Test transición válida in_progress → resolved → 200
- [x] GREEN: Confirmar pasa

### 3. Scope and Docs
- [x] All TDD cycles complete.
- [x] Changes stayed within approved scope.
- [x] Out-of-scope findings registered in `agents/docs/debt.md` — none.
- [x] Sync check: implemented code vs affected docs match.
- [x] Durable docs updated:
  - [x] `agents/db/domain.md` — state machine rules added

### 4. Database Change Controls
Not applicable — in-memory storage.

### 5. Validation (→ validated)
- [x] Targeted tests: `pnpm --filter backend test -- --run tests/incidents.test.ts` — 35 tests passed
- [x] Full test suite: `pnpm --filter backend test` — 52 tests passed
- [x] Lint: 0 errors
- [x] Typecheck: 0 errors
- [x] Build: frontend build OK
- [x] DoD validated criteria checked

### 6. Closeout (→ closed)
- [ ] Ask user before marking backlog task done.
- [ ] Move task files to `agents/task/archive/` after user approves.

## States Reached
- [x] Implemented (sections 1-3 complete)
- [x] Validated (section 5 complete)
- [ ] Closed (section 6 complete + user approval)

## Resume Notes
TASK-004 completada:
- Zod: title min 3 / max 200, description max 2000
- State machine: VALID_TRANSITIONS map en service
- 9 tests nuevos (35 → 35 total en incidents.test.ts, 52 total backend)
- domain.md actualizado con reglas de transición
- lint/typecheck/build OK
