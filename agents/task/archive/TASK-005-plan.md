# Task Plan

## Status
`approved`

## Task
- ID: TASK-005
- Title: Implementar gestión simple de stock y aviso de stock bajo
- Backlog source: `agents/task/backlog.md`

## Summary
Añadir acciones de ajuste rápido de stock (incrementar/decrementar) desde la interfaz de productos, indicador visual de stock bajo en el listado, y filtro para mostrar solo productos con stock bajo. Aprovechar los campos `stock` y `min_stock` existentes en la tabla `products`.

## Scope
**In:**
- `src/routes/products.ts` — Nuevas rutas y modificaciones:
  - `POST /products/:id/stock` — Ajustar stock (sumar o restar una cantidad entera positiva)
  - `GET /products?low_stock=1` — Filtro para mostrar solo productos con stock ≤ min_stock
- `src/views/products/index.ejs` — Actualizar tabla:
  - Columna "Stock" muestra badge rojo "Stock bajo" cuando stock ≤ min_stock
  - Añadir enlace/botón "Ajustar stock" por producto (lleva a formulario inline o modal)
  - Checkbox o enlace para filtrar solo stock bajo
- `src/views/products/stock.ejs` — Nueva vista: formulario simple para ajustar stock (operación +cantidad o -cantidad)
- Tests para ajuste de stock y filtro low_stock (usando base de datos en memoria)
- Actualizar `agents/docs/api.md` con las nuevas rutas

**Out (explicitly excluded):**
- Dashboard con métricas reales de stock bajo (se actualizará en TASK-006)
- Historial de movimientos de stock (no hay tabla de movimientos)
- Notificaciones por email u otros canales
- Sugerencias automáticas de reorden
- Modificaciones al schema de base de datos (stock y min_stock ya existen)
- Autenticación

## Current Behavior
- Los productos tienen campos `stock` y `min_stock` configurables solo desde el formulario de edición de producto.
- El listado de productos muestra el número de stock sin indicador de estado.
- No hay forma rápida de incrementar/decrementar stock sin editar todo el producto.
- No hay filtro específico para productos con stock bajo.
- El dashboard muestra una cifra de stock bajo hardcodeada (3).

## Target Behavior
- `POST /products/:id/stock` acepta `operation=add` o `operation=remove` y `quantity` (entero positivo). Valida que quantity > 0 y que stock no baje de 0. Actualiza el stock y redirige al listado.
- `GET /products?low_stock=1` filtra el listado para mostrar solo productos donde stock ≤ min_stock. Es compatible con los filtros existentes `?q=` y `?category=`.
- El listado de productos muestra la columna "Stock" con el valor numérico y, si stock ≤ min_stock, un badge rojo "Stock bajo".
- Cada fila tiene un botón/enlace "Stock" que lleva a la página de ajuste de stock.
- `GET /products/:id/stock` muestra un formulario simple con selector de operación (añadir/retirar) y campo de cantidad.
- Los errores de validación (cantidad no positiva, stock resultante negativo, producto inexistente) muestran mensajes claros.

## Acceptance Criteria
1. `GET /products/:id/stock` devuelve 200 con formulario de ajuste (muestra nombre y stock actual)
2. `GET /products/:id/stock` con ID inválido devuelve 404
3. `POST /products/:id/stock` con `operation=add` y `quantity=5` incrementa stock en 5 y redirige
4. `POST /products/:id/stock` con `operation=remove` y `quantity=3` decrementa stock en 3 y redirige
5. `POST /products/:id/stock` con `operation=remove` y quantity > stock actual rechaza con error
6. `POST /products/:id/stock` con quantity ≤ 0 rechaza con error
7. `POST /products/:id/stock` con ID inválido devuelve 404
8. `GET /products?low_stock=1` filtra productos con stock ≤ min_stock (solo esos)
9. `GET /products?low_stock=1&q=...` combina filtro low_stock con búsqueda textual
10. El listado de productos muestra badge "Stock bajo" en rojo cuando stock ≤ min_stock
11. Los tests cubren ajuste de stock, validaciones y filtro low_stock

## Edge Cases
- Cantidad negativa en el formulario: validar que quantity > 0
- stock - quantity < 0: rechazar con mensaje "Stock insuficiente. Stock actual: X"
- stock + quantity sin límite superior (puede ser cualquier entero positivo)
- Producto inactivo: se permite ajustar stock (no depende del estado activo)
- low_stock=1 sin productos coincidentes: mostrar "No hay productos con stock bajo"
- Filtro low_stock combinado con búsqueda: solo productos que cumplan ambos criterios
- min_stock=0 y stock=0: se considera stock bajo (0 ≤ 0)

## Assumptions / Risks
- La tabla `products` ya existe con `stock` y `min_stock`. No hay migración nueva.
- Los tests usarán `DATABASE_URL=:memory:` para aislar operaciones.
- El dashboard mantiene su métrica de stock bajo hardcodeada (se actualizará en TASK-006).
- Riesgo bajo: el ajuste de stock es una operación simple sin side effects.

## Database Impact
Not applicable — no se modifica el schema de la base de datos.

## Open Questions
1. ¿El ajuste de stock debe ser una página independiente o un modal/inline en el listado? Propongo página independiente (`/products/:id/stock`) por simplicidad.
2. ¿Permitir stock negativo? Propongo NO — validar que stock nunca baje de 0.
3. ¿El badge "Stock bajo" debe mostrar también el stock mínimo? Propongo sí, como tooltip o texto adicional: "Stock bajo (mín: X)".

## Source of Truth to Read
- `agents/docs/DoD.md`
- `agents/docs/testing.md`
- `agents/docs/api.md`
- `src/db/schema.ts`
- `src/db/index.ts`
- `src/lib/render.ts`
- `src/app.ts`
- `src/routes/products.ts`
- `src/views/products/index.ejs`
- `src/views/products/form.ejs`
- `src/views/layout.ejs`

## Decision Records
- ADRs read from `agents/docs/decisions.md`: None (log vacío)
- New decisions to record after user approval: Pendiente
