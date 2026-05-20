# TASK-003 Checklist: Implementar estructura REST API versionada bajo `/api/v1`

## Source
- Task: TASK-003
- Plan: `agents/task/TASK-003-plan.md`

## Rules
- Work in order unless blocked.
- Keep items derived from the approved plan.

## Checklist

### 1. Context
- [x] Re-read the approved plan and referenced source-of-truth docs.
- [x] Loaded and read `agents/skills/test-driven-development/SKILL.md`.
- [x] Verify no open questions block implementation.

### 2. TDD Ledger

- [x] RED: Test crear incidencia → falla (no hay ruta)
- [x] GREEN: Types + Repository + Service + Schema + Route para create
- [x] RED: Test listar incidencias propias → falla
- [x] GREEN: IncidentService.listByUser + route handler
- [x] RED: Test detalle incidencia (propia, ajena, inexistente) → falla
- [x] GREEN: IncidentService.getById + route handler con aislamiento
- [x] RED: Test update status → falla
- [x] GREEN: IncidentService.updateStatus + route handler
- [x] RED: Test update priority → falla
- [x] GREEN: IncidentService.updatePriority + route handler
- [x] RED: Test add comment a incidencia → falla
- [x] GREEN: CommentService.add + schema + route handler
- [x] RED: Test list comments de incidencia → falla
- [x] GREEN: CommentService.listByIncident + route handler
- [x] RED: Test admin list all → falla
- [x] GREEN: Admin incidents route + route handler

### 3. Scope and Docs
- [x] All TDD cycles complete.
- [x] Changes stayed within approved scope.
- [x] Out-of-scope findings registered in `agents/docs/debt.md` — none found.
- [x] Sync check: implemented code vs affected docs match.
- [x] Durable docs updated:
  - [x] `agents/docs/api.md`
  - [x] `agents/db/domain.md`

### 4. Database Change Controls
Not applicable — in-memory storage.

### 5. Validation (→ validated)
- [x] Targeted tests: `pnpm --filter backend test -- --run tests/incidents.test.ts` — 26 tests passed
- [x] Full test suite: `pnpm --filter backend test` — 43 tests passed
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
TASK-003 completada. Se implementaron:
- 9 nuevos archivos: tipos, repos, servicios y rutas para incidents y comments
- 2 archivos modificados: app.ts (registro rutas), admin.routes.ts (list all)
- 26 tests de integración (43 total en backend)
- Lint/typecheck/build OK
- docs actualizados: api.md y domain.md
