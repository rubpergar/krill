# Plan de Tarea: Estructura REST API versionada bajo /api/v1

## Estado
`aprobado`

## Tarea
- ID: TASK-003
- Título: Implementar estructura REST API versionada bajo /api/v1
- Fuente del backlog: `agents/task/backlog.md`

## Resumen
Centralizar, estandarizar y documentar la estructura de la API REST bajo `/api/v1`, estableciendo helpers de respuesta reutilizables, un router versionado central, un endpoint de health check y registro OpenAPI para todas las rutas existentes. Esto sienta la base para que TASK-004+ agreguen incidencias sin duplicar infraestructura.

## Alcance
**Incluye:**
- API response utility (`shared/api-response.ts`) con helpers `success`, `error`, `paginated` que produzcan `{ data }`, `{ error }`, `{ data, pagination }` consistentes
- Router versionado central (`modules/v1/index.ts`) que monte todas las rutas bajo `/api/v1`
- Endpoint `GET /api/v1/health` que retorne `{ status: 'ok', timestamp }`
- Refactor de `app.ts` para montar el router v1 en lugar de rutas sueltas
- Refactor de rutas auth `/refresh` y `/logout` para usar `zValidator` (consistencia)
- Refactor de todas las rutas existentes para usar el helper `success` de `api-response.ts`
- Registro OpenAPI (`@hono/zod-openapi`) en rutas auth y admin: schemas de request/response, códigos de estado documentados
- Tests TDD para health endpoint y response helpers
- Actualización de `agents/docs/api.md` con endpoint health y nueva estructura

**Excluye (explicitamente excluido):**
- Cambios en lógica de negocio de auth o admin
- Cambios en middlewares de auth (`requireAuth`, `requireRole`)
- Cambios en esquema de BD o migraciones
- Incidencias (TASK-004+)
- Frontend (TASK-007)
- Paginación funcional (solo helper, sin implementación concreta aún)
- Swagger UI ya existe, no se modifica

## Comportamiento Actual
- `app.ts` monta `authRoutes` y `adminRoutes` directamente en `/api/v1/auth` y `/api/v1/admin`
- `/refresh` y `/logout` validan body manualmente (`if (!refreshToken || typeof ...`)
- Las respuestas usan `c.json({ data: result })` inline sin helper compartido
- Rutas usan `Hono` en vez de `OpenAPIHono`, no registran schemas OpenAPI
- No hay endpoint health
- No hay helper de paginación
- `api.md` no documenta health ni la estructura del router central

## Comportamiento Esperado
- `app.ts` monta un único `v1Routes` en `/api/v1`, que a su vez monta `authRoutes` en `/auth` y `adminRoutes` en `/admin`
- Existe `GET /api/v1/health` → `200 { status: 'ok', timestamp }`
- Existe `shared/api-response.ts` exportando `success(c, data, status?)`, `error(c, message, status)`, `paginated(c, data, pagination)`
- Todas las rutas existentes usan los helpers de respuesta
- `/refresh` y `/logout` usan `zValidator` en vez de validación manual
- Rutas auth y admin usan `OpenAPIHono` o `describeRoute` para documentar schemas
- Tests: health endpoint + response helpers
- `api.md` actualizado

## Criterios de Aceptación
1. `GET /api/v1/health` retorna 200 con `{ status: 'ok', timestamp: '<ISO>' }`
2. `success` helper retorna `{ data: ... }` con status code configurable
3. `error` helper retorna `{ error: ... }` con status code
4. `paginated` helper retorna `{ data: ..., pagination: { page, limit, total, totalPages } }`
5. `/refresh` y `/logout` rechazan body inválido con 400 (zValidator)
6. Tests existentes de auth y admin siguen pasando sin cambios
7. OpenAPI `/openapi` incluye schemas para auth y admin endpoints
8. `app.ts` solo monta `v1Routes` en `/api/v1`

## Casos Borde
- Health: always succeeds, sin estado degradado
- Response helpers: status code por defecto 200 para success, 400 para error
- `/refresh` con body vacío: 400 vía zValidator
- `/logout` con body vacío: 400 vía zValidator

## Supuestos / Riesgos
- No hay riesgo de regresión porque los tests existentes cubren auth y admin
- El refactor de `/refresh` y `/logout` a zValidator debe preservar el mensaje de error exacto si los tests lo verifican (no lo verifican, solo status)
- `api-response.ts` debe ser puro, sin dependencias externas

## Impacto en Base de Datos
No aplica — esta tarea no afecta la base de datos.

- Resumen de cambios: N/A
- Archivo de esquema de BD: N/A
- Archivo de registro de cambios de BD: N/A
- Estructuras/datos afectados: N/A
- Enfoque de migración de avance: N/A
- Enfoque de reversión: N/A
- Compatibilidad de datos persistentes: N/A
- Riesgos operativos: N/A
- Plan de validación: N/A
- Notas de respaldo/recuperación: N/A
- Actualizaciones de documentación requeridas: N/A

## Preguntas Abiertas
- (ninguna)

## Fuente de Verdad a Leer
- `agents/docs/DoD.md`
- `agents/docs/testing.md`
- `agents/docs/api.md`
- `agents/docs/decisions.md`
- `agents/task/TASK-003-checklist.md` (cuando se cree)

## Registros de Decisiones
- ADRs leídos de `agents/docs/decisions.md`: ninguno (no hay ADRs aún)
- Nuevas decisiones a registrar después de la aprobación del usuario: ninguna prevista
