# Task Plan

## Status
`approved`

## Task
- ID: TASK-004
- Title: Implementar CRUD de productos con búsqueda y filtros
- Backlog source: `agents/task/backlog.md`

## Summary
Reemplazar la página placeholder de productos con un CRUD funcional: listado con búsqueda por nombre/SKU y filtro por categoría, formularios de creación y edición, y toggle de estado. Conectar las rutas a la base de datos SQLite mediante Drizzle ORM.

## Scope
**In:**
- `src/routes/products.ts` — Rutas CRUD completas:
  - `GET /products` — Listar productos con búsqueda (`?q=`) y filtro por categoría (`?category=`)
  - `GET /products/new` — Mostrar formulario de creación (con dropdown de categorías activas)
  - `POST /products` — Crear producto con validación de campos obligatorios y SKU único
  - `GET /products/:id/edit` — Mostrar formulario de edición precargado
  - `POST /products/:id` — Actualizar producto
  - `POST /products/:id/toggle` — Activar/desactivar producto
- `src/views/products/index.ejs` — Listado con tabla (nombre, SKU, categoría, stock, estado, acciones), campo de búsqueda y filtro por categoría
- `src/views/products/form.ejs` — Formulario compartido crear/editar con campos: nombre, SKU, descripción, categoría (dropdown), stock, stock mínimo
- Tests para cada operación CRUD (usando base de datos en memoria)
- Actualizar `agents/docs/api.md` con las nuevas rutas

**Out (explicitly excluded):**
- Gestión avanzada de stock y alertas de stock bajo (TASK-005)
- Dashboard con métricas reales (TASK-006)
- Paginación (se añadirá si hay más de 100 productos — asumimos número manejable por ahora)
- Eliminación física de productos (solo toggle activo/inactivo)
- Autenticación
- Modificaciones al schema de base de datos (no se necesitan)

## Current Behavior
`GET /products` devuelve una página placeholder con el texto "Listado de productos próximamente." Sin conexión a base de datos, sin formularios ni operaciones CRUD.

## Target Behavior
- `GET /products` lista productos en una tabla con columnas: nombre, SKU, categoría, stock, estado (activo/inactivo), acciones (editar, toggle). Incluye campo de búsqueda que filtra por nombre o SKU, y dropdown para filtrar por categoría. Los filtros son acumulativos.
- `GET /products/new` muestra formulario con campos: nombre (requerido), SKU (requerido, único), descripción (opcional), categoría (dropdown con categorías activas), stock (número, default 0), stock mínimo (número, default 0)
- `POST /products` valida y guarda el producto en la BD, redirige al listado
- `GET /products/:id/edit` muestra formulario precargado con datos actuales y dropdown de categorías
- `POST /products/:id` valida y actualiza el producto en la BD, redirige al listado
- `POST /products/:id/toggle` cambia el estado activo/inactivo, redirige al listado
- Los errores de validación (nombre vacío, SKU vacío, SKU duplicado) muestran mensajes en el formulario y mantienen los datos ingresados
- El nombre de la categoría se muestra en el listado (JOIN con tabla categories)
- Las rutas están conectadas a la base de datos real

## Acceptance Criteria
1. `GET /products` devuelve 200 con tabla que lista todos los productos
2. `GET /products` con `?q=` filtra por nombre o SKU (LIKE)
3. `GET /products` con `?category=` filtra por categoría
4. `GET /products` con `?q=` y `?category=` combina ambos filtros
5. `GET /products/new` devuelve 200 con formulario y dropdown de categorías activas
6. `POST /products` con datos válidos crea el producto y redirige
7. `POST /products` con nombre vacío muestra error de validación
8. `POST /products` con SKU vacío muestra error de validación
9. `POST /products` con SKU duplicado muestra error de validación
10. `GET /products/:id/edit` devuelve 200 con formulario precargado
11. `GET /products/:id/edit` con ID inválido devuelve 404
12. `POST /products/:id` actualiza campos y redirige
13. `POST /products/:id/toggle` cambia active (1→0 o 0→1) y redirige
14. `POST /products/:id/toggle` con ID inválido devuelve 404
15. Los tests cubren todas las operaciones CRUD con base de datos en memoria

## Edge Cases
- Nombre vacío en creación/edición: mostrar error y mantener el formulario
- SKU vacío en creación/edición: mostrar error específico
- SKU duplicado (unique constraint): capturar error de Drizzle y mostrar mensaje amigable "Ya existe un producto con ese SKU"
- ID inexistente en edición/toggle: devolver 404
- Categoría inexistente o inactiva: el dropdown solo muestra categorías activas. Si el producto tiene category_id de una categoría que fue desactivada, se muestra el nombre igual (no se elimina la FK)
- Inyección de HTML/JS en campos de texto: EJS escapa por defecto con `<%=`
- Búsqueda con string vacío: se comporta como listado completo
- Filtro de categoría con ID inválido: se ignora el filtro (muestra todo)
- Stock y stock mínimo aceptan 0 como valor válido

## Assumptions / Risks
- La tabla `products` ya existe en la BD (creada en TASK-001). No hay migración nueva.
- Los tests usarán `DATABASE_URL=:memory:` para aislar operaciones de la BD de desarrollo.
- El helper `render()` se usa tal cual (no necesita cambios).
- La tabla `categories` ya existe y tiene datos (puede estar vacía).
- No se necesita paginación porque se espera un número manejable de productos (< 100).
- Riesgo bajo: el JOIN con categories requiere manejar el caso donde category_id es NULL o la categoría fue eliminada (onDelete: set null) — se usa LEFT JOIN para no excluir productos sin categoría.

## Database Impact
Not applicable — no se modifica el schema de la base de datos. La tabla `products` ya existe con todas las columnas necesarias.

## Open Questions
1. ¿Orden del listado de productos? Propongo alfabético por nombre (ascendente).
2. ¿Mostrar solo productos activos por defecto en el listado, o todos? Propongo mostrar todos, con indicador visual de estado.
3. ¿El filtro de categoría debe mostrar todas las categorías (activas e inactivas) o solo activas? Propongo solo activas en el dropdown del formulario y del filtro.

## Source of Truth to Read
- `agents/docs/DoD.md`
- `agents/docs/testing.md`
- `agents/docs/api.md`
- `src/db/schema.ts`
- `src/db/index.ts`
- `src/lib/render.ts`
- `src/app.ts`
- `src/routes/products.ts`
- `src/routes/categories.ts` (como patrón de referencia)
- `src/views/products/index.ejs`
- `src/views/layout.ejs`
- `src/views/categories/form.ejs` (como patrón de referencia)

## Decision Records
- ADRs read from `agents/docs/decisions.md`: None (log vacío)
- New decisions to record after user approval: Pendiente
