# Plan de Tarea: Creación, validación y persistencia de incidencias

## Estado
`borrador`

## Tarea
- ID: TASK-004
- Título: Implementar creación, validación y persistencia de incidencias
- Fuente del backlog: `agents/task/backlog.md`

## Resumen
Agregar la entidad `incident` al sistema: esquema BD, validación Zod, repositorio, servicio y endpoint `POST /api/v1/incidents` para que un usuario autenticado pueda reportar una incidencia.

## Alcance
**Incluye:**
- Tabla `incidents` en Drizzle schema + auto-creación en `db/index.ts`
- Schema Zod: title, description, priority (opcional, default 'medium')
- Repositorio: inserción y consulta por id
- Servicio: creación con validación de negocio
- Ruta `POST /api/v1/incidents` protegida por `requireAuth`
- Montaje en `modules/v1/index.ts`
- Tests TDD

**Excluye:**
- Listado/detalle de incidencias (TASK-005)
- Endpoints admin (TASK-006)
- Filtros y paginación (TASK-005)
- Asignación a admin (TASK-006)
- Comentarios (no planificado)
- Frontend (TASK-007)

## Comportamiento Actual
- No existe entidad `incident` en BD, schema, repositorio, servicio ni rutas

## Comportamiento Esperado
- `POST /api/v1/incidents` con body `{ title, description, priority? }` → `201 { data: { incident } }`
- Incident retornado: id, title, description, status ('open'), priority, created_by, created_at, updated_at
- Validación: title 1-200 chars, description 1-2000 chars, priority opcional enum (low/medium/high/critical)
- Usuario autenticado vía JWT, created_by del token
- Tabla `incidents` creada automáticamente al conectar BD

## Criterios de Aceptación
1. POST con datos válidos → 201 con datos de incidencia
2. POST sin token → 401
3. POST con token inválido → 401
4. POST con title vacío → 400
5. POST con title > 200 chars → 400
6. POST sin description → 400
7. POST con priority inválido → 400
8. POST con priority válido → 201 con priority correcto
9. POST sin priority → 201 con default 'medium'
10. Incidencia creada con status 'open' y created_by del token

## Casos Borde
- Body vacío → 400
- Campos extra ignorados
- Usuario eliminado entre token y uso → 404

## Supuestos / Riesgos
- Tabla se crea vía Drizzle + `CREATE TABLE IF NOT EXISTS`
- No hay datos previos ni migración
- `assigned_to` se agrega en TASK-006

## Impacto en Base de Datos
- Nueva tabla `incidents`
- Archivos a actualizar: `agents/db/schema.sql`, `agents/db/changes.sql`, `agents/db/domain.md`
- Forward: `CREATE TABLE IF NOT EXISTS incidents (...)`
- Rollback: `DROP TABLE IF EXISTS incidents;`

## Preguntas Abiertas
- Ninguna

## Fuente de Verdad a Leer
- `agents/docs/DoD.md`
- `agents/docs/testing.md`
- `agents/docs/api.md`
- `agents/docs/decisions.md`
- `agents/db/schema.sql`, `changes.sql`, `domain.md`
- `agents/task/TASK-004-checklist.md` (cuando se cree)

## Registros de Decisiones
- ADRs leídos: ninguno
- Nuevas decisiones: ninguna prevista
