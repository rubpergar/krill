# Plan de Tarea: Listado y detalle de incidencias del usuario

## Estado
`borrador`

## Tarea
- ID: TASK-005
- Título: Implementar endpoints de listado y detalle de incidencias del usuario
- Fuente del backlog: `agents/task/backlog.md`

## Resumen
Agregar `GET /api/v1/incidents` (listado paginado de las incidencias del usuario autenticado) y `GET /api/v1/incidents/:id` (detalle de una incidencia del usuario). Completar así el CRUD de incidencias del lado del usuario.

## Alcance
**Incluye:**
- `GET /api/v1/incidents` con paginación (page, limit, default page=1, limit=10)
- `GET /api/v1/incidents` scopeado al usuario autenticado (solo sus incidencias)
- `GET /api/v1/incidents/:id` retorna detalle de incidencia si pertenece al usuario
- `GET /api/v1/incidents/:id` retorna 404 si no existe o no pertenece al usuario
- Soporte de query params opcionales: `status`, `priority` para filtrar listado
- Uso del helper `paginated()` de api-response
- Tests TDD

**Excluye:**
- Endpoints admin con listado de todas las incidencias (TASK-006)
- Filtros por fecha, búsqueda textual (no planificado)
- Endpoints de modificación/eliminación (no planificado)
- Frontend (TASK-007)

## Comportamiento Actual
- Solo existe `POST /api/v1/incidents`
- No hay endpoints GET

## Comportamiento Esperado
- `GET /api/v1/incidents?page=1&limit=10` → `200 { data: [...], pagination: { page, limit, total, totalPages } }`
- `GET /api/v1/incidents?status=open` → filtra por status
- `GET /api/v1/incidents?priority=high` → filtra por priority
- `GET /api/v1/incidents/:id` → `200 { data: { incident } }` si el usuario es el dueño
- `GET /api/v1/incidents/:id` → `404 { error: '...' }` si no existe o no es del usuario
- Listado vacío retorna data vacío y paginación con total=0
- El orden del listado es por created_at descendente

## Criterios de Aceptación
1. `GET /api/v1/incidents` con token → 200 con array de incidencias del usuario
2. `GET /api/v1/incidents` sin token → 401
3. `GET /api/v1/incidents` retorna paginación correcta
4. `GET /api/v1/incidents?page=1&limit=1` retorna solo 1 incidencia
5. `GET /api/v1/incidents` para usuario sin incidencias → 200 con array vacío
6. `GET /api/v1/incidents?status=open` filtra correctamente
7. `GET /api/v1/incidents/:id` con id válido y dueño → 200 con detalle
8. `GET /api/v1/incidents/:id` con id inexistente → 404
9. `GET /api/v1/incidents/:id` con id de incidencia de otro usuario → 404
10. `GET /api/v1/incidents/:id` sin token → 401

## Casos Borde
- page/limit inválidos → se ignoran y usan defaults
- page=0 o negativa → default a 1
- limit > 100 → limitar a 100
- status/priority inválidos → se ignoran (no error)

## Supuestos / Riesgos
- No hay modificación de incidencias aún
- No hay soft-delete, solo se consultan registros existentes
- La paginación es simple (offset-based)

## Impacto en Base de Datos
No aplica — no se modifican tablas, solo consultas.

## Preguntas Abiertas
- Ninguna

## Fuente de Verdad a Leer
- `agents/docs/DoD.md`
- `agents/docs/testing.md`
- `agents/docs/api.md` (actual)
- `agents/docs/decisions.md`
- `agents/task/TASK-005-checklist.md` (cuando se cree)

## Registros de Decisiones
- ADRs leídos: ninguno
- Nuevas decisiones: ninguna prevista
