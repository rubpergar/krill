# Task Plan TASK-006

## Status
`draft`

## Task
- ID: TASK-006
- Title: Implementar endpoints admin para gestión, filtros, prioridades y cambios de estado
- Backlog source: `agents/task/backlog.md`

## Summary
El endpoint `GET /api/v1/admin/incidents` actualmente devuelve todas las incidencias sin filtros ni paginación. Se añadirán los mismos filtros (status, priority, category, dateFrom, dateTo) y paginación con meta response que ya existen en el listado de usuario. Los endpoints de cambio de estado/prioridad (`PATCH /incidents/:id/status`, `PATCH /incidents/:id/priority`) ya funcionan para admin vía el flag `isAdmin`, por lo que no requieren nuevos endpoints.

## Scope

**In:**
1. Método `listAllFiltered()` en `incidents.service.ts` que reusa la lógica de filtrado/paginación de `listByUserFiltered()` pero opera sobre todas las incidencias sin filtrar por userId
2. Actualizar `GET /api/v1/admin/incidents` para aceptar query params: `page`, `limit`, `status`, `priority`, `category`, `dateFrom`, `dateTo`
3. Response con `meta`: `{ page, limit, total, pages }`
4. Tests: paginación admin, filtros individuales y combinados, edge cases (invalid params, sin coincidencias, auth)

**Out (explicitly excluded):**
- Nuevos endpoints de status/priority — los existentes ya aceptan admin
- Endpoint de borrado de incidencias
- Frontend

## Current Behavior
- `GET /api/v1/admin/incidents` devuelve `{ ok, data: { incidents[] } }` sin filtros ni paginación
- El service tiene `listAll()` que llama a `repository.findAll()` sin filtros
- No hay schema para query params en admin

## Target Behavior
- `GET /api/v1/admin/incidents` acepta los mismos query params que `GET /incidents` y devuelve `{ ok, data: { incidents[], meta: { page, limit, total, pages } } }`
- Admin puede filtrar por status, priority, category y rango de fechas sobre todas las incidencias
- Admin puede paginar resultados con page/limit

## Acceptance Criteria
1. Sin query params, GET /admin/incidents devuelve page=1, limit=20 con total correcto
2. `?page=2&limit=5` devuelve página 2 con 5 items (o menos si es la última)
3. `?status=open,resolved` filtra por esos estados
4. `?priority=high,critical` filtra por esas prioridades
5. `?category=hardware,network` filtra por esas categorías
6. `?dateFrom=2026-01-01&dateTo=2026-12-31` filtra por rango de createdAt
7. Filtros combinables entre sí
8. `page=-1` o `limit=0` o `limit=200` devuelve 400
9. Sin token devuelve 401, user regular devuelve 403

## Edge Cases
- Página más allá del total → incidents[] vacío, meta con page solicitada
- Filtro sin coincidencias → incidents[] vacío, meta con total 0
- status/priority/category con valor no válido → 400
- dateFrom sin dateTo (y viceversa): se permite, filtra solo con el límite proporcionado

## Assumptions / Risks
- El filtrado es en memoria (no DB). El mismo enfoque que TASK-005.
- Los valores del filtro se validan con el mismo schema (`listIncidentsQuerySchema`) que ya existe en el módulo de incidents.

## Database Impact
Not applicable — no DB.

## Open Questions
Ninguna.

## Source of Truth to Read
- `agents/docs/DoD.md`
- `agents/docs/testing.md`
- `agents/docs/api.md` (para actualizar tras implementación)

## Decision Records
- ADRs read from `agents/docs/decisions.md`: None
- New decisions to record after user approval: None
