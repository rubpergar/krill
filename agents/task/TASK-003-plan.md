# Task Plan

## Status
`approved`

## Task
- ID: TASK-003
- Title: Implementar CRUD de categorías
- Backlog source: `agents/task/backlog.md`

## Summary
Reemplazar la página placeholder de categorías con un CRUD funcional: listado de categorías con estado activo/inactivo, formularios de creación y edición, y toggle de estado. Conectar las rutas a la base de datos SQLite mediante Drizzle ORM.

## Scope
**In:**
- `src/routes/categories.ts` — Rutas CRUD completas:
  - `GET /categories` — Listar todas las categorías
  - `GET /categories/new` — Mostrar formulario de creación
  - `POST /categories` — Crear categoría
  - `GET /categories/:id/edit` — Mostrar formulario de edición
  - `POST /categories/:id` — Actualizar categoría
  - `POST /categories/:id/toggle` — Activar/desactivar categoría
- `src/views/categories/index.ejs` — Listado con tabla (nombre, estado, acciones)
- `src/views/categories/form.ejs` — Formulario compartido crear/editar
- Tests para cada operación CRUD (usando base de datos en memoria)
- Actualizar `agents/docs/api.md` con las nuevas rutas

**Out (explicitly excluded):**
- CRUD de productos (TASK-004)
- Dashboard con datos reales (se actualizará en TASK-006)
- Paginación o búsqueda en el listado (se añadirá si es necesario después)
- Autenticación
- Eliminación física de categorías (solo toggle activo/inactivo)
- Modificaciones al schema de base de datos (no se necesitan)

## Current Behavior
`GET /categories` devuelve una página placeholder con el texto "Listado de categorías próximamente." Sin conexión a base de datos, sin formularios ni operaciones CRUD.

## Target Behavior
- `GET /categories` lista todas las categorías en una tabla con columnas: nombre, estado (activo/inactivo), acciones (editar, toggle)
- `GET /categories/new` muestra formulario para crear categoría
- `POST /categories` valida y guarda la categoría en la BD, redirige al listado
- `GET /categories/:id/edit` muestra formulario precargado con datos actuales
- `POST /categories/:id` valida y actualiza la categoría en la BD, redirige al listado
- `POST /categories/:id/toggle` cambia el estado activo/inactivo, redirige al listado
- Los errores de validación (nombre vacío, nombre duplicado) muestran mensajes en el formulario
- Las rutas están conectadas a la base de datos real

## Acceptance Criteria
1. `GET /categories` devuelve 200 con tabla que lista todas las categorías
2. `GET /categories/new` devuelve 200 con formulario vacío
3. `POST /categories` con datos válidos crea la categoría y redirige a lista
4. `POST /categories` con nombre vacío muestra error de validación
5. `POST /categories` con nombre duplicado muestra error de validación
6. `GET /categories/:id/edit` devuelve 200 con formulario precargado
7. `POST /categories/:id` actualiza el nombre y redirige
8. `POST /categories/:id/toggle` cambia el estado activo/inactivo y redirige
9. Las categorías inactivas se muestran en el listado con indicador visual
10. Los tests cubren todas las operaciones CRUD con base de datos en memoria

## Edge Cases
- Nombre vacío en creación/edición: mostrar error y mantener el formulario
- Nombre duplicado (unique constraint): capturar error de Drizzle y mostrar mensaje amigable
- ID inexistente en edición/toggle: devolver 404
- Inyección de HTML/JS en el nombre: EJS escapa por defecto con `<%=`
- La categoría puede tener productos asociados (FK en products). Al desactivarla no se afectan los productos (el toggle solo cambia active, no borra la FK)

## Assumptions / Risks
- La tabla `categories` ya existe en la BD (creada en TASK-001). No hay migración nueva.
- Los tests usarán `DATABASE_URL=:memory:` para aislar operaciones de la BD de desarrollo.
- El helper `render()` se usa tal cual (no necesita cambios).
- No se necesita paginación porque se espera un número manejable de categorías (< 100).

## Database Impact
Not applicable — no se modifica el schema de la base de datos. La tabla `categories` ya existe con todas las columnas necesarias.

## Open Questions
1. Orden del listado: ¿orden alfabético por nombre, por fecha de creación, o mantener el orden de inserción? → Propongo alfabético por nombre.
2. Mensajes flash (feedback al usuario tras crear/editar): ¿usar query params tipo `?success=created` o session/cookies? → Propongo query params simples por ahora.

## Source of Truth to Read
- `agents/docs/DoD.md`
- `agents/docs/testing.md`
- `agents/docs/api.md`
- `src/db/schema.ts`
- `src/db/index.ts`
- `src/lib/render.ts`
- `src/app.ts`
- `src/routes/categories.ts`
- `src/views/categories/index.ejs`
- `src/views/layout.ejs`
- `src/views/partials/nav.ejs`

## Decision Records
- ADRs read from `agents/docs/decisions.md`: None (log vacío)
- New decisions to record after user approval: Pendiente
