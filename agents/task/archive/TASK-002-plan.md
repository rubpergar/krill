# Task Plan

## Status
`approved`

## Task
- ID: TASK-002
- Title: Crear base del panel privado y navegación
- Backlog source: `agents/task/backlog.md`

## Summary
Establecer el punto de entrada del servidor Hono con renderizado de plantillas EJS, servir archivos estáticos, crear el layout base con navegación entre secciones y la página de dashboard con métricas iniciales.

## Scope
**In:**
- `src/server.ts` — Entry point del servidor Hono con `@hono/node-server`
- Configuración de EJS como motor de plantillas (helper `src/lib/render.ts`)
- `static/` — Directorio para archivos estáticos con `serveStatic` de Hono
- `src/views/layout.ejs` — Layout HTML base con Tailwind CDN y navegación lateral/superior
- `src/views/dashboard.ejs` — Página de dashboard con métricas: total productos, productos activos, categorías, productos con stock bajo
- `src/views/products/index.ejs` — Página placeholder de listado de productos
- `src/views/categories/index.ejs` — Página placeholder de listado de categorías
- `src/routes/dashboard.ts` — Ruta GET `/` que renderiza dashboard con datos mock del controlador
- `src/routes/products.ts` — Ruta GET `/products` que renderiza listado placeholder
- `src/routes/categories.ts` — Ruta GET `/categories` que renderiza listado placeholder
- Tests para verificar que el servidor arranca y las rutas responden 200
- Actualizar `agents/docs/api.md` con las rutas del panel

**Out (explicitly excluded):**
- CRUD real de productos, categorías o stock (solo placeholders)
- Conexión a base de datos en las rutas (datos mock en el dashboard)
- Búsqueda, filtros, paginación
- Autenticación o login
- Diseño responsive avanzado
- PostCSS o build de Tailwind (se usa CDN)
- `agents/docs/design.md` (se actualizará cuando haya componentes reutilizables)

## Current Behavior
No existe servidor, rutas, vistas ni navegación. `src/` está vacío.

## Target Behavior
- `pnpm dev` inicia un servidor Hono en `http://localhost:3000`
- La ruta `/` muestra el dashboard con métricas mock
- Las rutas `/products` y `/categories` muestran páginas placeholder
- La navegación permite moverse entre las tres secciones
- Tailwind CDN proporciona estilos utility-first
- Un archivo `static/css/style.css` permite personalización adicional

## Acceptance Criteria
1. `pnpm dev` arranca el servidor sin errores y responde en `http://localhost:3000`
2. `GET /` devuelve HTML 200 con el dashboard y métricas visibles
3. `GET /products` devuelve HTML 200 con página placeholder
4. `GET /categories` devuelve HTML 200 con página placeholder
5. La navegación incluye enlaces a Dashboard, Productos y Categorías
6. El layout incluye Tailwind CSS via CDN y un archivo CSS propio
7. Los tests verifican que el servidor arranca y las rutas responden 200
8. `agents/docs/api.md` documenta las rutas del panel

## Edge Cases
- Si el directorio `static/` no existe, el servidor debe arrancar igual (graceful fallback de serveStatic)
- Las rutas desconocidas deben devolver 404 con una página de error amigable
- Los datos mock del dashboard deben ser valores numéricos coherentes (ej: stock bajo no puede superar total productos)

## Assumptions / Risks
- El dashboard usa datos mock (hardcoded) porque aún no hay DB conectada a las rutas. Se reemplazarán con datos reales en TASK-004/TASK-005.
- Se usa Tailwind via CDN para evitar configurar PostCSS ahora. Es aceptable para herramienta interna sin requisitos de rendimiento crítico.
- El helper de renderizado usa `fs.promises.readFile` con caché simple para evitar leer del disco en cada request.
- `serveStatic` de Hono se usa para servir `static/` en desarrollo. Para producción se podría considerar un proxy inverso.

## Database Impact
Not applicable — no se modifica la base de datos en esta tarea.

## Open Questions
1. Ruta raíz: ¿el dashboard debe estar en `/` o en `/dashboard`? → Propongo `/` por ser la página principal.
2. Puerto del servidor: ¿usar `3000` u otro? → Propongo `3000` con configuración via env var `PORT`.
3. Tailwind CDN: ¿convenir usar la versión CDN o prefieres setup con PostCSS desde ahora? → Propongo CDN para simplificar.

## Source of Truth to Read
- `agents/docs/DoD.md`
- `agents/docs/testing.md`
- `agents/docs/api.md`
- `agents/docs/decisions.md`
- `src/db/schema.ts` (para conocer las entidades y sus campos al diseñar el dashboard mock)

## Decision Records
- ADRs read from `agents/docs/decisions.md`: None (log vacío)
- New decisions to record after user approval: Pendiente
