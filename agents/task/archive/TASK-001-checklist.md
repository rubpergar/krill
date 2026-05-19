# TASK-001 Checklist: Autenticación de usuarios y gestión de sesión/token

## Source
- Task: TASK-001
- Plan: `agents/task/TASK-001-plan.md`

## Rules
- Work in order unless blocked.
- Keep items derived from the approved plan.
- Mark completed items during implementation only.

## Checklist

### 1. Context
- [x] Re-read the approved plan and referenced source-of-truth docs (do not skip even if read during planning).
- [x] Load and apply `agents/skills/test-driven-development/SKILL.md`, or record why it does not apply.
- [x] Verify no open questions block implementation.

### 2. TDD Ledger

- [x] Register: valid data → 201 + user + token
- [x] Register: email duplicado → 409
- [x] Register: datos inválidos → 400
- [x] Login: credenciales correctas → 200 + token
- [x] Login: email inexistente → 401
- [x] Login: password incorrecta → 401
- [x] Middleware: sin token → 401
- [x] Middleware: token inválido → 401
- [x] Middleware: token válido → request.user poblado

### 3. Scope and Docs
- [x] All TDD cycles complete or documented as approved exceptions.
- [x] Changes stayed within approved scope. No unrelated refactors.
- [x] Out-of-scope findings registered in `agents/docs/debt.md`.
- [x] Sync check: compare implemented code against affected source-of-truth docs from the plan. Discrepancies → stop and ask user. Resolve before proceeding.
- [x] Durable docs updated (`agents/docs/api.md`, DB files from the Source of Truth Map, `agents/docs/design.md`, etc.) as needed.

### 4. Database Change Controls
Not applicable (in-memory storage).

### 5. Validation (→ validated)
- [x] Targeted tests: `pnpm --filter backend test -- --run tests/auth.test.ts` — 11 tests passed
- [x] Full test suite: 12 tests passed (backend) + 1 passed (frontend)
- [x] Lint: `pnpm lint` — 0 errors
- [x] Typecheck: `pnpm typecheck` — 0 errors
- [x] Build: `pnpm --filter frontend build` — OK
- [x] DoD validated criteria checked

### 6. Closeout (→ closed)
- [ ] Ask user before marking backlog task done.
- [ ] Move task files to `agents/task/archive/` after user approves.

## States Reached
- [x] Implemented (sections 1-3 complete)
- [x] Validated (section 5 complete)
- [ ] Closed (section 6 complete + user approval)

## Resume Notes
TASK-001 completada. Se implementó auth con endpoints /api/v1/auth/register, /api/v1/auth/login y /api/v1/auth/me con middleware JWT. Usuarios en memoria (Map), migrable a DB después. Pendiente: admin seed en TASK-002.
