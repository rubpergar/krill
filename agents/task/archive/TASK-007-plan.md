# Task Plan

## Status
`approved`

## Task
- ID: TASK-007
- Title: Añadir validación, tests y ajustes finales
- Backlog source: `agents/task/backlog.md`

## Summary
Cerrar gaps de validación server-side, añadir tests para casos borde faltantes y aplicar ajustes finales de UI/UX para completar el MVP.

## Scope
**In:**
- Validación server-side: rechazar stock y min_stock negativos en crear/editar producto (con mensaje de error)
- Validación server-side: rechazar stock/min_stock no numéricos (NaN) en crear/editar producto
- Tests para validación de stock/min_stock negativos en crear producto
- Tests para validación de stock/min_stock negativos en editar producto
- Tests para NaN en stock/min_stock
- Quitar texto placeholder del dashboard ("Panel principal de inventario...")
- Actualizar `agents/docs/api.md` si la descripción de rutas cambia

**Out (explicitly excluded):**
- Paginación de listados
- Ordenación interactiva de tablas
- Autenticación
- Cambios en schema de BD
- Refactor mayor de rutas
- Diseño responsive avanzado
- Modales o confirmaciones JS

## Current Behavior
- Product create/edit permite enviar stock y min_stock negativos (el HTML tiene `min="0"` pero no hay validación server-side)
- Valores no numéricos en stock/min_stock producen NaN silenciosamente
- Dashboard muestra texto placeholder "Panel principal de inventario..."

## Target Behavior
- POST /products y POST /products/:id rechazan stock < 0 y min_stock < 0 con mensaje de error claro
- POST /products y POST /products/:id rechazan valores no numéricos en stock/min_stock
- Dashboard sin texto placeholder (las métricas reales son auto-explicativas)

## Acceptance Criteria
1. Crear producto con stock = -5 → error "El stock no puede ser negativo"
2. Crear producto con min_stock = -1 → error "El stock mínimo no puede ser negativo"
3. Editar producto con stock = "abc" → error "El stock debe ser un número válido"
4. Editar producto con min_stock = -3 → error "El stock mínimo no puede ser negativo"
5. Dashboard no contiene el texto "Panel principal de inventario"
6. Todas las validaciones existentes siguen funcionando

## Edge Cases
- stock = 0 → permitido (valor por defecto)
- min_stock = 0 → permitido (valor por defecto)
- stock = "" → debe tratarse como 0 o rechazarse
- min_stock vacío → debe tratarse como 0

## Assumptions / Risks
- La UI ya tiene `min="0"` en los inputs HTML; esta validación server-side es la barrera definitiva
- Los tests existentes de creación/edición no usan valores negativos, por lo tanto no se rompen
- El texto placeholder del dashboard se puede eliminar sin romper nada

## Database Impact
Not applicable — no schema changes.

## Open Questions
- (ninguna — las preguntas de la planificación inicial se respondieron implícitamente al aprobar el plan)

## Source of Truth to Read
- `agents/docs/DoD.md`
- `agents/docs/testing.md`
- `agents/docs/api.md`
- `src/routes/products.ts`
- `src/views/products/form.ejs`
- `src/views/dashboard.ejs`
- `src/routes/products.test.ts`
- `src/routes/dashboard.test.ts`
- `src/routes/routes.test.ts`

## Decision Records
- ADRs read from `agents/docs/decisions.md`: None (empty log)
- New decisions to record after user approval: None
