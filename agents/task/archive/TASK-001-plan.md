# TASK-001 Plan: Autenticación de usuarios y gestión de sesión/token

## Status
`approved`

## Task
- ID: TASK-001
- Title: Implementar autenticación de usuarios y gestión de sesión/token
- Backlog source: `agents/task/backlog.md`

## Summary
Implementar registro e inicio de sesión de usuarios con JWT. Usuarios en memoria (in-memory Map) con patrón repositorio intercambiable para migrar a base de datos después.

## Stack técnico
- `@fastify/jwt` — plugin Fastify para JWT (sign + verify + request decorator)
- `bcryptjs` — hashing de contraseñas (pure JS, sin compilación nativa)
- `zod` — ya instalado, schemas de validación

## Scope

**In:**
- `POST /api/v1/auth/register` — registro con `{ email, password, name }` → `{ user, token }`
- `POST /api/v1/auth/login` — login con `{ email, password }` → `{ user, token }`
- Middleware `authenticate` que verifica JWT y expone `request.user`
- Modelo `User` en memoria: `id, email, password(hasheada), name, role, createdAt`
- Roles: `user` y `admin` (el seed de admin se hará en TASK-002)
- Validación Zod: email válido, password >= 6 chars, name no vacío
- Errores: `409 DUPLICATE_EMAIL`, `401 INVALID_CREDENTIALS`, `400 VALIDATION_ERROR`
- Formato respuesta: `{ ok, data }` o `{ ok, error: { code, message } }`
- Config vía env: `JWT_SECRET` (fallback dev), `JWT_EXPIRES_IN` (default 7d)
- Tests TDD: register, login, email duplicado, credenciales inválidas, token inválido/ausente

**Out (explicitamente excluido):**
- Recuperación / reset de contraseña
- Refresh tokens
- Email verification / OAuth
- Persistencia en DB (se hará después)
- Rate limiting
- Seed de admin automático (se hará en TASK-002)

## Current Behavior
No existe lógica de autenticación. El servidor solo arranca con CORS y Swagger registrados.

## Target Behavior
El servidor expone dos endpoints públicos de auth. Los endpoints protegidos pueden usar el middleware `authenticate`. Los usuarios se registran y loguean con JWT.

## Acceptance Criteria
- [ ] Register con datos válidos → 201 + `{ ok, data: { user, token } }`
- [ ] Login con credenciales correctas → 200 + `{ ok, data: { user, token } }`
- [ ] Email duplicado → 409 + `DUPLICATE_EMAIL`
- [ ] Login email inexistente → 401 + `INVALID_CREDENTIALS`
- [ ] Login password incorrecta → 401 + `INVALID_CREDENTIALS`
- [ ] Campos inválidos (email mal formado, password < 6, name vacío) → 400 + `VALIDATION_ERROR`
- [ ] Token JWT contiene `id`, `email`, `role` en payload
- [ ] Middleware sin token → 401
- [ ] Middleware token inválido/expirado → 401
- [ ] Middleware token válido → `request.user` poblado

## Edge Cases
- Email con espacios: hacer trim
- Contraseña con caracteres especiales/unicode: bcryptjs los maneja
- Token expirado vs malformado: ambos → 401 (diferente código interno opcional)
- Header `Authorization` sin esquema `Bearer` → 401
- Request sin header Authorization → 401

## Assumptions / Risks
- In-memory storage: datos se pierden al reiniciar. Aceptable para desarrollo inicial.
- Sin base de datos: el patrón repositorio abstrae el almacenamiento para migración futura.
- bcryptjs más lento que bcrypt pero evita dependencias nativas (mejor para CI/despliegue).

## Database Impact
Not applicable (in-memory). Se usará repositorio con interfaz para migrar después.

## Open Questions
Resueltas con defaults recomendados:
- `JWT_SECRET` → env var con fallback `dev-secret-change-in-production`
- Admin inicial → seed opcional vía `ADMIN_EMAIL`/`ADMIN_PASSWORD` en TASK-002
- `JWT_EXPIRES_IN` → `7d` configurable

## Source of Truth to Read
- `agents/docs/DoD.md`
- `agents/docs/testing.md`
- `agents/docs/api.md`

## Decision Records
- ADRs read from `agents/docs/decisions.md`: none
- New decisions to record after user approval: none
