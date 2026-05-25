## Status
`validated`

## Task
- ID: TASK-017
- Title: Dashboard con métricas básicas
- Backlog source: `agents/task/backlog.md`

## Summary
Agregar un dashboard administrativo con métricas básicas de leads para que el equipo vea el estado general sin entrar al listado.

## Scope
**In:**
- Crear uno o más widgets de Filament para el dashboard administrativo.
- Mostrar métricas derivadas de `Lead` con datos ya existentes.
- Registrar los widgets en el dashboard del panel admin.
- Mantener los widgets base existentes del panel.

**Out (explicitly excluded):**
- Gráficas avanzadas o series históricas.
- Filtros interactivos en el dashboard.
- Cambios de esquema o nuevas columnas.
- Exportaciones o alertas.

## Current Behavior
El panel `admin` ya expone `Dashboard::class`, pero solo muestra los widgets base (`AccountWidget` y `FilamentInfoWidget`). No hay métricas propias de negocio.

## Target Behavior
El dashboard mostrará tarjetas de métricas básicas calculadas desde los leads existentes, con foco en señal rápida para operación:
- total de leads
- leads nuevos
- leads en seguimiento / activos
- leads convertidos
- leads descartados
- leads sin responsable

## Acceptance Criteria
- El dashboard administrativo muestra métricas propias de negocio.
- Las métricas usan datos reales de `Lead` y no modifican información.
- Con cero leads, el dashboard renderiza sin errores y muestra ceros.
- El panel sigue accesible solo para usuarios autenticados.
- No se introducen cambios de base de datos.

## Edge Cases
- Base de datos vacía.
- Estados inexistentes en el conjunto actual de datos.
- Leads sin responsable asignado.

## Assumptions / Risks
- Se usará un alcance mínimo de métricas para evitar sobreingeniería.
- Si el equipo quiere gráficos históricos, eso quedará para una tarea posterior.
- El dashboard debe ser legible en desktop y móvil, alineado con el sistema de diseño existente.

## Database Impact
Use `Not applicable` when the task does not affect the database.

- Change summary: Not applicable.
- DB schema file from Source of Truth Map: Not applicable.
- DB change log file from Source of Truth Map: Not applicable.
- Affected structures/data: N/A.
- Forward migration approach: N/A.
- Rollback approach: N/A.
- Persisted data compatibility: No changes.
- Operational risks: None beyond query cost of simple counts.
- Validation plan: Run targeted feature tests for dashboard rendering and widget data, then full suite if needed.
- Backup/recovery notes: N/A.
- Required doc updates: None expected unless the dashboard pattern becomes a reusable design rule.

## Open Questions
- Ninguna por ahora.

## Source of Truth to Read
- `agents/docs/DoD.md`
- `agents/docs/testing.md`
- `agents/docs/design.md`
- `agents/docs/decisions.md`
- `app/Providers/Filament/AdminPanelProvider.php`
- `app/Models/Lead.php`
- `app/Enums/LeadStatus.php`

## Decision Records
- ADRs read from `agents/docs/decisions.md`: ADR-000
- New decisions to record after user approval: Ninguna
