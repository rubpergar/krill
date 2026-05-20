# Task Plan TASK-005

## Status
`draft`

## Task
- ID: TASK-005
- Title: Implementar endpoints de listado y detalle de incidencias del usuario
- Backlog source: `agents/task/backlog.md`

## Summary
El endpoint `GET /api/v1/incidents` actualmente devuelve una lista plana sin filtros ni paginación. Se añadirán filtros por status, priority, category y rango de fechas, más paginación con meta response. El endpoint `GET /api/v1/incidents/:id` se enriquecerá incluyendo los comentarios de la incidencia.

## Scope

**In:**
1. Query params `page` (default 1), `limit` (default 20, max 100) en `GET /api/v1/incidents`
2. Response meta: `{ page, limit, total, pages }`
3. Filtros opcionales combinables: `status`, `priority`, `category` (comma-separated para múltiples valores, OR lógico dentro del grupo), `dateFrom`, `dateTo` (ISO 8601, filtran sobre `createdAt`)
4. `GET /api/v1/incidents/:id` incluirá `comments[]` en la respuesta
5. Zod schema para validación de query params
6. Type `IncidentListFilters` en types
7. Tests: paginación, filtros individuales y combinados, fechas inválidas, sin parámetros, valores de límite inválidos

**Out (explicitly excluded):**
- Admin filters/pagination en `/api/v1/admin/incidents` (TASK-006)
- Sorting por campo
- Búsqueda full-text
- Frontend

## Current Behavior
- `GET /api/v1/incidents` devuelve todas las incidencias del usuario sin filtros ni paginación
- `GET /api/v1/incidents/:id` devuelve solo la incidencia, sin comentarios
- El service tiene `listByUser(userId)` que llama a `repository.findByUser(userId)`
- No hay schema para query params

## Target Behavior
- `GET /api/v1/incidents` acepta query params opcionales y devuelve `{ ok, data: { incidents[], meta: { page, limit, total, pages } } }`
- Los filtros se aplican en el service sobre la lista completa del usuario
- `GET /api/v1/incidents/:id` devuelve `{ ok, data: { incident: { ...incidentProps, comments: [...] } } }`
- Schema valida que page/limit sean enteros positivos, que dateFrom/dateTo sean fechas ISO válidas, que status/priority/category sean valores válidos del enum

## Acceptance Criteria
1. Sin query params, GET /incidents devuelve page=1, limit=20, con total correcto
2. `?page=2&limit=5` devuelve página 2 con 5 items (o menos si es la última)
3. `?status=open,resolved` filtra por esos estados (OR lógico)
4. `?priority=high,critical` filtra por esas prioridades
5. `?category=hardware,network` filtra por esas categorías
6. `?dateFrom=2026-01-01&dateTo=2026-12-31` filtra por rango de createdAt
7. Filtros combinables entre sí (AND lógico entre grupos)
8. `page=-1` o `limit=0` o `limit=200` devuelve 400 VALIDATION_ERROR
9. `dateFrom=fecha-invalida` devuelve 400 VALIDATION_ERROR
10. GET /incidents/:id incluye array comments[] en la respuesta
11. IDs inválidos siguen devolviendo 404 NOT_FOUND

## Edge Cases
- Página más allá del total → incidents[] vacío, meta con page solicitada
- Filtro que no coincide con nada → incidents[] vacío, meta con total 0
- status/priority/category con valor no válido → 400
- dateFrom sin dateTo (y viceversa): se permite, filtra solo con el límite proporcionado
- limit=1 → functional, un item por página
- Varios valores repetidos en filtro (ej. `?status=open,open`) → no causa duplicados

## Assumptions / Risks
- El filtrado es en memoria (no DB). Si en futuro hay DB real, se moverá al query. Bajo el volumen esperado de un coworking (< 1000 incidencias/usuario), es aceptable.
- No hay índices ni ordenación. El usuario obtiene sus incidencias en orden de inserción.
- Los comentarios se incluyen en el detail mediante el commentService existente.

## Database Impact
Not applicable — no DB. Todo es en memoria.

## Open Questions
Ninguna.

## Source of Truth to Read
- `agents/docs/DoD.md`
- `agents/docs/testing.md`
- `agents/docs/api.md` (para actualizar tras implementación)

## Decision Records
- ADRs read from `agents/docs/decisions.md`: None
- New decisions to record after user approval: None
