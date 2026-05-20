# TASK-002 Checklist: Roles, permisos y protección de rutas usuario/admin

## Source
- Task: TASK-002
- Plan: `agents/task/TASK-002-plan.md`

## Rules
- Work in order unless blocked.
- Keep items derived from the approved plan.

## Checklist

### 1. Context
- [x] Re-read the approved plan and referenced source-of-truth docs.
- [x] Load and apply `agents/skills/test-driven-development/SKILL.md`.
- [x] Verify no open questions block implementation.

### 2. TDD Ledger

- [x] authenticate middleware retorna tras 401 (fix)
- [x] requireRole('admin') bloquea user regular → 403
- [x] requireRole('admin') permite admin → 200
- [x] requireRole('user') permite user regular → pasa (probado implícitamente en auth/me)
- [x] Seed crea admin si no existe
- [x] Seed no duplica admin
- [x] Cadena authenticate + requireRole: sin token → 401 (no llega a role)
- [x] Admin health endpoint funcional

### 3. Scope and Docs
- [x] All TDD cycles complete.
- [x] Changes stayed within approved scope.
- [x] Out-of-scope findings registered in `agents/docs/debt.md`.
- [x] Sync check: implemented code vs affected docs match.
- [x] Durable docs updated as needed.

### 4. Database Change Controls
Not applicable.

### 5. Validation (→ validated)
- [x] Targeted tests: `pnpm --filter backend test -- --run tests/role.test.ts` — 5 tests passed
- [x] Full test suite: 17 tests passed (backend)
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
TASK-002 completada. Se implementó middleware requireRole, seed de admin via env vars, y ruta placeholder /admin/health protegida. Fix en authenticate middleware para retornar tras 401.
