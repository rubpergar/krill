# TASK-002 Plan — Migraciones y modelos

## Status
`implemented | validated`

## Task
- ID: TASK-002
- Title: Migraciones y modelos (Lead, User, NotaInterna, EventoAuditoria, enums, factory, seeder)
- Backlog source: `agents/task/backlog.md`

## Summary
Crear las entidades de dominio del sistema: Lead (solicitud), extender User con rol y activo, NotaInterna y EventoAuditoria. Incluye migraciones, modelos con relaciones, enums PHP, factory y seeder inicial.

## Scope
**In:**
1. Migración para añadir `rol` (enum: admin/usuario) y `activo` (boolean) a `users`
2. PHP enum `LeadStatus` (Nuevo, Revisado, Contactado, EnSeguimiento, Convertido, Descartado)
3. PHP enum `TipoNecesidad` (consulta, presupuesto, colaboracion, soporte, otro)
4. Migración `create_leads_table` con todos los campos del análisis
5. Migración `create_notas_internas_table`
6. Migración `create_eventos_auditoria_table`
7. Modelo `Lead` con fillable, casts (enums), relaciones (responsable, notas, eventos)
8. Modelo `NotaInterna` con relación a Lead y User
9. Modelo `EventoAuditoria` con relación a Lead y User
10. Actualizar `User` modelo con campos `rol`, `activo` y relaciones (leads, notas, eventos)
11. Factory `LeadFactory`
12. Seeder `DatabaseSeeder` con usuario admin por defecto
13. Actualizar `agents/db/schema.sql` con el esquema resultante
14. Actualizar `agents/db/domain.md` con vocabulario y reglas de negocio

**Out (explicitly excluded):**
- Lógica de negocio (servicios, controladores, validaciones de formulario)
- Vistas, rutas o endpoints
- Panel Filament (Resources, widgets)
- Tests (se harán en TDD dentro del checklist de esta tarea)

## Current Behavior
- Tabla `users` con campos básicos (name, email, password)
- Sin modelo de dominio del proyecto
- Sin migraciones de leads, notas, auditoría
- `agents/db/schema.sql` y `agents/db/domain.md` vacíos

## Target Behavior
- Tablas `leads`, `notas_internas`, `eventos_auditoria` creadas
- Tabla `users` con columnas `rol` y `activo`
- Modelos Eloquent con relaciones y casts
- Factory y seeder funcionales
- `agents/db/schema.sql` y `agents/db/domain.md` actualizados

## Acceptance Criteria
1. `php artisan migrate:fresh` ejecuta sin errores y crea todas las tablas
2. `php artisan db:seed` ejecuta sin errores y crea usuario admin
3. `php artisan tinker --execute="App\Models\Lead::factory()->create()"` funciona
4. `php artisan tinker --execute="(new App\Models\Lead)->estado instanceof App\Enums\LeadStatus"` devuelve `true`
5. Modelos tienen las relaciones definidas y funcionan
6. `agents/db/schema.sql` refleja el esquema final
7. `agents/db/domain.md` documenta entidades y reglas

## Edge Cases
- **SQLite vs PostgreSQL:** Usar `string` con validation para enums en vez de native DB enums (compatible con ambos motores)
- **Rollback de users:** La migración que añade columnas debe ser reversible (drop columns)
- **Usuario admin existente:** El seeder debe actualizar si ya existe (firstOrCreate)
- **Responsable null:** Lead.responsable_id debe ser nullable (foreignId->nullable())

## Assumptions / Risks
- Laravel 13 y Filament 5 están instalados
- SQLite como BD de desarrollo (PostgreSQL en producción)
- Los nombres de tablas y columnas siguen convención Laravel (snake_case, plural)
- **Riesgo bajo:** migraciones estándar, modelos simples

## Database Impact
- Change summary: 4 migraciones (1 alter users, 3 create tables)
- DB schema file from Source of Truth Map: `agents/db/schema.sql`
- DB change log file from Source of Truth Map: `agents/db/changes.sql`
- Affected structures/data: users (alter), leads (create), notas_internas (create), eventos_auditoria (create)
- Forward migration approach: `php artisan make:migration` + `Schema::create`
- Rollback approach: `php artisan migrate:rollback` (drop columns, drop tables)
- Persisted data compatibility: La alteración de users es aditiva (nuevas columnas con default)
- Operational risks: Ninguno (desarrollo local)
- Validation plan: `php artisan migrate:fresh --seed`
- Backup/recovery notes: No aplica
- Required doc updates: `agents/db/schema.sql`, `agents/db/changes.sql`, `agents/db/domain.md`

## Open Questions
Ninguna — los campos y entidades están definidos en `analisis_proyecto_s5.md`.

## Source of Truth to Read
- `analisis_proyecto_s5.md` (secciones 7, 8, 9: entidades, relaciones, estados)
- `agents/docs/DoD.md`
- `agents/docs/testing.md`
- `agents/skills/test-driven-development/SKILL.md`

## Decision Records
- ADRs read from `agents/docs/decisions.md`: ADR-000 (stack)
- New decisions to record after user approval: Ninguno
