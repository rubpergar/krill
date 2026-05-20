# TASK-002 Plan: Roles, permisos y protección de rutas usuario/admin

## Status
`approved`

## Task
- ID: TASK-002
- Title: Implementar roles, permisos y protección de rutas usuario/admin
- Backlog source: `agents/task/backlog.md`

## Summary
Partiendo de TASK-001 (JWT con `role` en payload), implementar middleware de autorización por roles, seed automático de admin, y ruta placeholder protegida. Dejar infraestructura lista para que TASK-006 implemente los endpoints CRUD reales de admin.

## Scope

**In:**
- Middleware `requireRole(...roles)` — preHandler que verifica `request.user.role`
- Fix en `authenticate`: agregar `return` tras `reply.status(401).send()`
- Seed automático de admin via `ADMIN_EMAIL` y `ADMIN_PASSWORD` en env (idempotente)
- Ruta placeholder `GET /api/v1/admin/health` protegida por `[authenticate, requireRole('admin')]`
- Tests:
  - User regular → 403 en ruta admin
  - Admin → 200 en ruta admin
  - Sin token → 401 (antes del role check)
  - Seed crea admin si no existe
  - Seed no duplica admin si ya existe

**Out (explicitamente excluido):**
- CRUD de incidencias admin (TASK-006)
- Gestión de usuarios admin
- Roles adicionales (solo `user` y `admin`)
- Panel admin frontend

## Current Behavior
- JWT payload incluye `{ id, email, role }`
- `authenticate` no retorna tras enviar 401 (error latente)
- No existe middleware de roles
- No existe seed de admin
- No existen rutas admin protegidas

## Target Behavior
1. `authenticate` retorna tras 401 (frena cadena de preHandlers)
2. `requireRole('admin')` retorna 403 si el rol no coincide
3. Si `ADMIN_EMAIL` y `ADMIN_PASSWORD` están en env, se crea admin en memoria al arrancar
4. `GET /api/v1/admin/health` responde `{ ok: true }` solo para admins

## Acceptance Criteria
- [ ] `authenticate` frena request sin token → 401, no ejecuta el siguiente preHandler
- [ ] `requireRole('admin')` con user regular → 403 + `FORBIDDEN`
- [ ] `requireRole('admin')` con admin → pasa
- [ ] `requireRole('user')` con user regular → pasa
- [ ] Seed: `ADMIN_EMAIL` + `ADMIN_PASSWORD` en env → admin creado al arrancar
- [ ] Seed: admin ya existe → no duplica
- [ ] Seed: solo una de las dos vars presente → no se ejecuta seed
- [ ] `GET /api/v1/admin/health` → 200 admin, 401 sin token, 403 user regular
- [ ] Auth previa sigue funcionando (register, login, me)

## Edge Cases
- Env `ADMIN_EMAIL` sin `ADMIN_PASSWORD` → seed no se ejecuta
- Email en mayúsculas → normalizado a minúsculas
- Cadena `[authenticate, requireRole('admin')]`: si falla authenticate, no se ejecuta requireRole
- Admin de seed no puede crearse via register (register siempre crea `role: 'user'`)

## Assumptions / Risks
- Seed in-memory: admin se pierde al reiniciar. Aceptable hasta que haya DB.
- Sin autenticación en el seed: el admin se crea con credenciales de env en claro. Solo seguro en desarrollo.

## Database Impact
Not applicable (in-memory).

## Open Questions
Resueltas:
- Seed condicional vía env vars `ADMIN_EMAIL` + `ADMIN_PASSWORD` (ambas presentes)
- Admin nunca hardcodeado

## Source of Truth to Read
- `agents/docs/DoD.md`
- `agents/docs/testing.md`
- `agents/docs/api.md`

## Decision Records
- ADRs read from `agents/docs/decisions.md`: none
- New decisions to record after user approval: none
