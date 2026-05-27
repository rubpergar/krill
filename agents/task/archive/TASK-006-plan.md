# Task Plan

## Status
`approved`

## Task
- ID: TASK-006
- Title: Crear dashboard básico con métricas principales
- Backlog source: `agents/task/backlog.md`

## Summary
Reemplazar las métricas hardcodeadas del dashboard con consultas reales a la base de datos. El dashboard mostrará el total de productos, productos activos, total de categorías y cantidad de productos con stock bajo, todos calculados directamente desde la BD.

## Scope
**In:**
- `src/routes/dashboard.ts` — Reemplazar valores mock por consultas Drizzle:
  - `totalProducts`: `COUNT(*) FROM products`
  - `activeProducts`: `COUNT(*) FROM products WHERE active = 1`
  - `categories`: `COUNT(*) FROM categories`
  - `lowStock`: `COUNT(*) FROM products WHERE stock <= min_stock`
- Tests para métricas del dashboard (con DB en memoria, con y sin datos)
- Actualizar `agents/docs/api.md` con descripción actualizada del dashboard

**Out (explicitly excluded):**
- Gráficos, charts o visualizaciones adicionales
- Lista de productos recientes o actividad en el dashboard
- Filtros o interactividad en el dashboard
- Modificaciones al schema de base de datos
- Cambios en la vista `dashboard.ejs` (ya es compatible)
- Autenticación

## Current Behavior
El endpoint `GET /` devuelve métricas hardcodeadas (totalProducts: 42, activeProducts: 38, categories: 8, lowStock: 3) sin conexión a la base de datos. No hay tests para el dashboard más allá de verificar que el HTML contiene los textos esperados.

## Target Behavior
- `GET /` consulta la base de datos real y devuelve:
  - Total de productos registrados
  - Productos con estado activo (`active = 1`)
  - Total de categorías registradas
  - Productos con stock bajo (`stock <= min_stock`)
- Con BD vacía: todas las métricas muestran 0
- Con datos: métricas reflejan el estado actual de la BD
- La vista `dashboard.ejs` no cambia — solo se actualizan los valores que recibe

## Acceptance Criteria
1. `GET /` devuelve 200 con HTML que contiene "Dashboard" y las 4 tarjetas de métricas
2. Con BD vacía, todas las métricas muestran 0
3. Con 3 productos (2 activos, 1 inactivo), `totalProducts` = 3 y `activeProducts` = 2
4. Con 5 categorías, `categories` = 5
5. Con 2 productos con stock ≤ min_stock, `lowStock` = 2
6. Los tests cubren dashboard con BD vacía y con datos poblados

## Edge Cases
- BD vacía: todas las métricas devuelven 0 (COUNT de tabla vacía = 0)
- Sin productos con stock bajo: lowStock = 0
- Sin categorías: categories cuenta 0
- Todos los productos inactivos: activeProducts = 0
- La consulta lowStock usa `lte(stock, minStock)` para incluir casos donde stock === minStock

## Assumptions / Risks
- Las tablas `products` y `categories` ya existen con las columnas necesarias.
- Los tests usarán `DATABASE_URL=:memory:` para aislar operaciones.
- La vista `dashboard.ejs` no necesita cambios (misma estructura de datos).
- No hay paginación ni caché necesaria (el volumen de datos es pequeño).
- Riesgo bajo: solo se añaden consultas SELECT, sin mutaciones.

## Database Impact
Not applicable — no se modifica el schema de la base de datos.

## Open Questions
1. ¿La métrica de categorías debe contar todas o solo las activas? Propongo TODAS (el dashboard muestra el total del catálogo).
2. ¿Añadir enlaces en las tarjetas para ir directamente al listado filtrado? Propongo NO por ahora (se puede añadir después como mejora).

## Source of Truth to Read
- `agents/docs/DoD.md`
- `agents/docs/testing.md`
- `agents/docs/api.md`
- `src/db/schema.ts`
- `src/db/index.ts`
- `src/app.ts`
- `src/routes/dashboard.ts`
- `src/views/dashboard.ejs`
- `src/routes/routes.test.ts` (tests existentes del dashboard)
- `src/lib/render.ts`

## Decision Records
- ADRs read from `agents/docs/decisions.md`: None (log vacío)
- New decisions to record after user approval: Pendiente
