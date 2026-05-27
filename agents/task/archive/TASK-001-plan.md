# Task Plan

## Status
`approved`

## Task
- ID: TASK-001
- Title: Definir modelo de datos y persistencia
- Backlog source: `agents/task/backlog.md`

## Summary
Establecer la capa de persistencia del proyecto: esquema de base de datos SQLite usando Drizzle ORM, conexión a base de datos, migración inicial y actualización de los documentos fuente de verdad del dominio y esquema.

## Scope
**In:**
- Definir las entidades `products` y `categories` en Drizzle schema (`src/db/schema.ts`)
- Establecer tipos TypeScript derivados del schema (InferSelectModel / InferInsertModel)
- Crear módulo de conexión a base de datos (`src/db/index.ts`) que exporte la instancia de Drizzle
- Generar migración inicial con `drizzle-kit`
- Actualizar `agents/db/schema.sql` con el SQL reflejado de la migración
- Actualizar `agents/db/changes.sql` con la entrada de cambio
- Actualizar `agents/db/domain.md` con entidades, relaciones y reglas de negocio
- Crear tests unitarios para el módulo de conexión (que verifique que la DB se inicializa correctamente)

**Out (explicitly excluded):**
- CRUDs, servicios, controladores, rutas o vistas
- Seeders o datos de prueba
- Lógica de negocio (stock bajo, validaciones de dominio)
- Relaciones many-to-many, histórico, movimientos de almacén
- Configuración de Tailwind, EJS o estilos
- Endpoints de API

## Current Behavior
No existe ninguna capa de persistencia. El repositorio está en estado esqueleto sin código de producto, tablas ni migraciones.

## Target Behavior
- `src/db/schema.ts` define las tablas `products` y `categories` con Drizzle ORM
- `src/db/index.ts` exporta `db` (instancia Drizzle) y `sqlite` (conexión better-sqlite3)
- La migración inicial se genera bajo `drizzle/` y puede aplicarse con `drizzle-kit push` o `drizzle-kit migrate`
- Los documentos fuente de verdad reflejan el estado actual del esquema y dominio

## Acceptance Criteria
1. `src/db/schema.ts` existe y exporta las tablas `products` y `categories` con sus columnas
2. `src/db/index.ts` existe, inicializa better-sqlite3 y exporta `db` (Drizzle instance)
3. La migración inicial se genera correctamente con `pnpm drizzle-kit generate`
4. `agents/db/schema.sql` contiene el SQL DDL de las tablas
5. `agents/db/changes.sql` contiene la entrada TASK-001 con SQL forward y rollback
6. `agents/db/domain.md` documenta las entidades `Product` y `Category` con sus atributos y reglas de negocio
7. Los tests verifican que la conexión a DB se inicializa sin errores

## Edge Cases
- La ruta del archivo SQLite (`data/inventory.db`) debe crearse si no existe
- Si ya existe un archivo `.db`, no debe sobrescribirse
- Los nombres de columna en Drizzle deben coincidir con la convención snake_case en SQL

## Assumptions / Risks
- Se usa `better-sqlite3` como driver síncrono para SQLite — no requiere async/await
- La base de datos se almacenará en `data/inventory.db` (definido en `drizzle.config.ts`)
- La migración inicial es irrompible (no hay datos previos que preservar)
- Las convenciones de nomenclatura: snake_case en DB, camelCase en TypeScript (Drizzle maneja la conversión con `casing` o manualmente)

## Database Impact

- **Change summary:** Creación de las tablas `categories` y `products` con sus columnas, índices y FK
- **DB schema file:** `agents/db/schema.sql`
- **DB change log file:** `agents/db/changes.sql`
- **Affected structures/data:** Ninguna (primera migración, sin datos previos)
- **Forward migration approach:** `drizzle-kit generate` + `drizzle-kit migrate` (o `drizzle-kit push` para desarrollo)
- **Rollback approach:** `DROP TABLE IF EXISTS products; DROP TABLE IF EXISTS categories;`
- **Persisted data compatibility:** No aplica (primera migración)
- **Operational risks:** Mínimo. La migración es hacia adelante solamente hasta que haya datos en producción
- **Validation plan:** Ejecutar `drizzle-kit generate`, verificar que el SQL generado coincide con lo esperado en `schema.sql`
- **Backup/recovery notes:** No aplica en esta fase. En futuras migraciones se documentará
- **Required doc updates:** `agents/db/schema.sql`, `agents/db/changes.sql`, `agents/db/domain.md`

### Tabla `categories`

| Columna | Tipo | Restricciones |
|---|---|---|
| id | integer | PK, autoincrement |
| name | text | NOT NULL, UNIQUE |
| active | integer | NOT NULL, DEFAULT 1 |
| created_at | text | NOT NULL, DEFAULT (datetime('now')) |
| updated_at | text | NOT NULL, DEFAULT (datetime('now')) |

### Tabla `products`

| Columna | Tipo | Restricciones |
|---|---|---|
| id | integer | PK, autoincrement |
| name | text | NOT NULL |
| sku | text | NOT NULL, UNIQUE |
| description | text | NULLABLE |
| category_id | integer | NULLABLE, FK → categories.id, ON DELETE SET NULL |
| stock | integer | NOT NULL, DEFAULT 0 |
| min_stock | integer | NOT NULL, DEFAULT 0 |
| active | integer | NOT NULL, DEFAULT 1 |
| created_at | text | NOT NULL, DEFAULT (datetime('now')) |
| updated_at | text | NOT NULL, DEFAULT (datetime('now')) |

### Índices
- `products.sku` — Unique index (implícito por UNIQUE)
- `products.category_id` — Index para joins y filtros por categoría
- `products.active` — Index para filtrar productos activos/inactivos
- `categories.active` — Index para filtrar categorías activas/inactivas

## Open Questions
1. ¿Preferencias sobre el formato de fecha/hora en SQLite (ISO 8601 text vs integer epoch)? → Propongo ISO 8601 text por legibilidad. Pendiente de confirmación.
2. ¿Nombre exacto del SKU/código interno? ¿Se prefiere `sku`, `code`, o `internal_code`? → Propongo `sku`. Pendiente de confirmación.

## Source of Truth to Read
- `agents/docs/DoD.md`
- `agents/docs/testing.md`
- `agents/db/schema.sql`
- `agents/db/changes.sql`
- `agents/db/domain.md`
- `agents/docs/decisions.md`
- `drizzle.config.ts`

## Decision Records
- ADRs read from `agents/docs/decisions.md`: None (log vacío)
- New decisions to record after user approval: Pendiente de determinar si alguna decisión del plan merece ADR
