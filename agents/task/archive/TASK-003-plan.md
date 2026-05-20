# TASK-003 Plan: Implementar estructura REST API versionada bajo `/api/v1`

## Status
`approved`

## Task
- ID: TASK-003
- Title: Implementar estructura REST API versionada bajo `/api/v1`
- Backlog source: `agents/task/backlog.md`

## Summary
Crear la estructura completa de la API versionada para incidencias y comentarios: tipos, repositorios in-memory, servicios con CRUD básico, schemas Zod, route handlers funcionales y registro en app.ts. Todas las rutas listadas en `api.md` quedarán operativas a nivel básico.

## Scope

**In:**
- Definir types para `Incident` y `Comment` (con enums para status/priority/category)
- Crear `IncidentRepository` y `CommentRepository` (in-memory con Map)
- Crear `IncidentService` con: create, getById, listByUser, updateStatus, updatePriority
- Crear `CommentService` con: add, listByIncident
- Crear schemas Zod para body/params/query de cada endpoint
- Crear route handlers para todos los endpoints del API v1
- Registrar todas las rutas en `app.ts` con prefijo `/api/v1`
- Autenticación JWT obligatoria en endpoints protegidos
- Aislar datos por usuario (user ve solo sus incidencias, admin ve todas)
- Admin routes: listado básico de todas las incidencias
- Swagger documentación reflejando las nuevas rutas
- Tests de integración para todos los endpoints nuevos (crear, listar, detalle, status, prioridad, comentarios, admin)
- Actualizar `agents/docs/api.md` y `agents/db/domain.md`

**Out (explicitamente excluido):**
- Paginación avanzada (page/limit) — será en TASK-005
- Filtros por query params (status, priority, category, dateFrom, dateTo) — será en TASK-005
- Admin: filtros avanzados, gestión masiva de prioridad/estado — será en TASK-006
- Máquina de estados de status (transiciones válidas/inválidas) — implementación básica directa ahora, lógica completa en TASK-004
- Frontend — TASK-007
- E2E tests — TASK-008
- DB persistence — se mantiene in-memory

## Current Behavior
- Solo existen rutas `/api/v1/auth/*` y `/api/v1/admin/health`
- Directorios `incidents/` y `comments/` existen pero están vacíos
- No hay tipos, repositorios ni servicios para incidencias/comentarios

## Target Behavior
- Todos los endpoints de `api.md` responden con lógica CRUD básica funcional
- Tipos de incidencia y comentario definidos con validación Zod
- Datos aislados por usuario (autoría)
- Admin puede ver todas las incidencias
- Swagger actualizado con todas las rutas
- Tests de integración cubren flujos básicos y casos error

## Acceptance Criteria
- `POST /api/v1/incidents` crea incidencia, devuelve 201 con datos
- `GET /api/v1/incidents` devuelve solo las incidencias del usuario autenticado
- `GET /api/v1/incidents/:id` devuelve detalle (si es del usuario o admin)
- `PATCH /api/v1/incidents/:id/status` cambia estado
- `PATCH /api/v1/incidents/:id/priority` cambia prioridad
- `POST /api/v1/incidents/:id/comments` añade comentario
- `GET /api/v1/admin/incidents` devuelve todas las incidencias (admin only)
- 401 sin token, 403 para user en rutas admin
- 404 para incidencia inexistente o no perteneciente al usuario
- Zod rejecta bodies inválidos con 400
- Tests: 10+ tests de integración pasando

## Edge Cases
- Incidencia no existente → 404
- Incidencia de otro usuario → 404 (no 403, para no filtrar existencia)
- Token inválido/expirado → 401
- Body incompleto o con tipos incorrectos → 400
- Actualizar incidencia cerrada → permitido (sin máquina de estados por ahora)
- Comentario en incidencia inexistente → 404
- Admin list sin token → 401; con token user → 403

## Assumptions / Risks
- Los repositorios in-memory se resetearán entre suites de test (cada test suite usa `buildApp()` fresca)
- No hay DB, todos los datos viven en Map<>
- La relación userId en Incident/Comment se refiere al id del User en authRepository
- El seed admin corre antes de cualquier request en tests que lo requieran

## Database Impact
Not applicable — se mantiene almacenamiento in-memory.

## Source of Truth to Read
- `agents/docs/DoD.md`
- `agents/docs/testing.md`

## Decision Records
- ADRs read from `agents/docs/decisions.md`: none (log vacío)
- New decisions to record after user approval: ninguno por ahora
