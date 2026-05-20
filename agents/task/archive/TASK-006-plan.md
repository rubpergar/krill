# Plan de Tarea: Endpoints admin para gestión de incidencias

## Estado
`borrador`

## Tarea
- ID: TASK-006
- Título: Implementar endpoints admin para gestión, filtros, prioridades y cambios de estado
- Fuente del backlog: `agents/task/backlog.md`

## Resumen
Agregar endpoints bajo `/api/v1/admin/incidents` para que un admin pueda listar todas las incidencias, ver detalle de cualquiera, cambiarles el estado y prioridad, y asignarlas a un admin.

## Alcance
**Incluye:**
- `GET /api/v1/admin/incidents` — listado paginado de TODAS las incidencias (sin scope por usuario), con filtros opcionales (status, priority, created_by)
- `GET /api/v1/admin/incidents/:id` — detalle de cualquier incidencia (sin ownership check)
- `PATCH /api/v1/admin/incidents/:id/status` — cambiar status (body: `{ status }`, enum válido)
- `PATCH /api/v1/admin/incidents/:id/priority` — cambiar priority (body: `{ priority }`, enum válido)
- `PATCH /api/v1/admin/incidents/:id/assign` — asignar incidencia (body: `{ assignedTo? }`, default al admin autenticado)
- Todas las rutas protegidas con `requireAuth` + `requireRole('admin')`
- Tests TDD

**Excluye:**
- Eliminación de incidencias (no planificado)
- Frontend (TASK-007)
- Historial de cambios (no planificado)

## Comportamiento Actual
- No hay rutas admin para incidencias
- Solo existe `GET /api/v1/admin/me`

## Comportamiento Esperado
- Admin puede listar/ver cualquier incidencia
- Admin puede cambiar status: open → in_progress → resolved → closed
- Admin puede cambiar priority: low, medium, high, critical
- Admin puede asignarse incidencias a sí mismo o a otro admin
- Error 403 para usuarios no admin
- Error 404 para incidencias inexistentes

## Criterios de Aceptación
1. GET list todas las incidencias (admin) → 200 paginado
2. GET list filtrando por status/priority/created_by → filtra correctamente
3. GET detail de cualquier incidencia → 200
4. GET detail de incidencia inexistente → 404
5. PATCH status con status válido → 200 con nuevo status
6. PATCH status con status inválido → 400
7. PATCH priority con priority válido → 200 con nueva priority
8. PATCH priority con priority inválido → 400
9. PATCH assign sin body → asigna al admin autenticado → 200
10. PATCH assign con assignedTo específico → asigna a ese admin → 200
11. Cualquier ruta sin token → 401
12. Cualquier ruta con token de usuario no admin → 403

## Casos Borde
- PATCH status con mismo status actual → OK (idempotente)
- PATCH assign a admin inexistente → 404
- List page/limit inválidos → defaults seguros

## Supuestos / Riesgos
- assigned_to es solo registro de quién está trabajando en la incidencia, no tiene lógica de negocio adicional
- No hay validación de transiciones de estado (cualquier → cualquier por ahora)
- `findAllIncidents` en repositorio no filtra por userId (a diferencia de findIncidentsByUserId)

## Impacto en Base de Datos
No aplica — no se modifican tablas, solo inserts/updates.

## Preguntas Abiertas
- Ninguna

## Fuente de Verdad a Leer
- `agents/docs/DoD.md`
- `agents/docs/testing.md`
- `agents/docs/api.md`
- `agents/docs/decisions.md`
- `agents/task/TASK-006-checklist.md`
- `apps/api/src/modules/admin/admin.routes.ts`

## Registros de Decisiones
- ADRs leídos: ninguno
- Nuevas decisiones: ninguna prevista
