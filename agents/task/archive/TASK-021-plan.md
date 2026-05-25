# TASK-021 Plan — Archivar/eliminar solicitudes con permisos

## Status
`closed`

## Task
- ID: TASK-021
- Title: Archivar/eliminar solicitudes con permisos
- Backlog source: `agents/task/backlog.md`

## Summary
Añadir gestión segura de archivado y eliminación de solicitudes en el panel Filament. El archivado usará el campo existente `leads.archivado` como baja lógica reversible. La eliminación física quedará restringida a administradores activos y solo estará disponible para solicitudes ya archivadas, reduciendo el riesgo de pérdida accidental de datos.

## Scope
**In:**
- Mostrar por defecto solo solicitudes no archivadas en `LeadResource`.
- Añadir filtro para ver solicitudes activas, archivadas o todas.
- Añadir acción para archivar solicitudes desde listado y detalle.
- Añadir acción para restaurar solicitudes archivadas desde listado y detalle.
- Añadir acción de eliminación física con confirmación fuerte, solo para administradores activos y solo cuando la solicitud ya esté archivada.
- Registrar eventos de auditoría para archivar, restaurar y eliminar.
- Añadir tests de permisos y comportamiento.

**Out (explicitly excluded):**
- Cambios en el formulario público.
- Nuevos roles o permisos granulares persistidos en base de datos.
- Papelera separada fuera del `LeadResource`.
- Eliminación masiva.
- Cambios de esquema salvo que la implementación demuestre que el campo `archivado` existente es insuficiente.

## Current Behavior
- `Lead` ya tiene campo booleano `archivado` en modelo, schema y dominio.
- `LeadResource` lista todas las solicitudes sin filtrar por `archivado`.
- No hay acciones para archivar, restaurar ni eliminar solicitudes.
- No existe `LeadPolicy`; las acciones actuales de solicitudes se exponen dentro del resource/página a usuarios autenticados del panel.
- La auditoría registra creación, cambios de estado, asignaciones y notas, pero no archivado/restauración/eliminación.

## Target Behavior
- Usuarios internos activos pueden ver y gestionar solicitudes no archivadas.
- El listado excluye solicitudes archivadas por defecto.
- Un filtro permite alternar entre activas, archivadas y todas.
- Usuarios internos activos pueden archivar y restaurar solicitudes.
- Solo administradores activos pueden eliminar físicamente una solicitud.
- La eliminación física solo se permite si la solicitud está archivada.
- Las acciones de archivar/restaurar/eliminar requieren confirmación.
- Cada acción registra `EventoAuditoria` antes de la mutación destructiva o semidestructiva:
  - `accion`: `archivado`, `restaurado`, `eliminado`
  - `campo`: `archivado` para archivar/restaurar; `null` o `registro` para eliminar
  - `valor_anterior` / `valor_nuevo`: valores legibles (`false` → `true`, `true` → `false`, o identificador/resumen para eliminación)
- Tras eliminación física, notas y eventos relacionados se eliminan por cascada según el esquema actual.

## Acceptance Criteria
- Invitados no pueden acceder a las acciones de archivado/eliminación porque `/admin/leads` sigue protegido por login.
- Usuario activo no admin puede archivar una solicitud.
- Usuario activo no admin puede restaurar una solicitud archivada.
- Usuario activo no admin no ve ni puede ejecutar eliminación física.
- Admin activo puede eliminar físicamente una solicitud archivada.
- Admin activo no puede eliminar físicamente una solicitud no archivada.
- Las solicitudes archivadas no aparecen en el listado por defecto.
- El filtro permite ver solicitudes archivadas.
- Archivar/restaurar crea evento de auditoría.
- Eliminar crea evento de auditoría antes del borrado o deja una alternativa documentada si no es posible conservar el evento por cascada.
- Tests targeted de TASK-021 pasan.
- Suite completa, Pint y build pasan antes de validar.

## Edge Cases
- Archivar una solicitud ya archivada no debe duplicar auditoría ni cambiar estado.
- Restaurar una solicitud no archivada no debe duplicar auditoría ni cambiar estado.
- Intentar eliminar una solicitud no archivada debe quedar bloqueado por UI y por lógica de acción.
- Si el actor autenticado desaparece o no está disponible, la auditoría debe tolerar `usuario_id` nulo solo si el modelo/acción existente lo permite; en panel normal debe usar `auth()->id()`.
- El borrado físico elimina notas/eventos asociados por cascada; esta pérdida debe estar cubierta por confirmación y restricción a admin.

## Assumptions / Risks
- Se asume que `archivado` es la baja lógica oficial para solicitudes, según `agents/db/domain.md`.
- Se asume que usuarios internos activos no administradores pueden archivar/restaurar, pero no eliminar físicamente.
- Riesgo: si el evento de auditoría se asocia al lead eliminado, el evento también se borrará por cascada. Para conservar trazabilidad de eliminación haría falta cambiar el modelo de auditoría o no hacer hard delete, lo cual queda fuera salvo aprobación explícita.
- Riesgo: Filament puede ocultar acciones en UI, pero los tests deben cubrir también ejecución directa de acciones Livewire cuando aplique.

## Database Impact
- Change summary: no se espera cambio de esquema; se reutiliza `leads.archivado`.
- DB schema file from Source of Truth Map: `agents/db/schema.sql`.
- DB change log file from Source of Truth Map: `agents/db/changes.sql`.
- Affected structures/data: filas existentes de `leads`; cascada existente de `notas_internas` y `eventos_auditoria` al eliminar físicamente.
- Forward migration approach: no migration expected.
- Rollback approach: no schema rollback expected; restaurar archivado implica cambiar `archivado` a `false` mientras el lead exista.
- Persisted data compatibility: compatible con datos existentes porque `archivado` ya existe y default es `false`.
- Operational risks: hard delete es irreversible y borra datos relacionados por cascada.
- Validation plan: tests de recurso Filament y verificación de filtros/acciones; suite completa.
- Backup/recovery notes: antes de usar eliminación física en datos reales debe existir backup operativo; en desarrollo no aplica.
- Required doc updates: actualizar `agents/db/domain.md` si se confirma como regla durable que usuarios no admin pueden archivar/restaurar y solo admin puede eliminar físicamente solicitudes archivadas.

## Open Questions
- Resolved: usuarios activos pueden archivar/restaurar; solo admins activos pueden eliminar físicamente solicitudes ya archivadas.
- Resolved: se implementa hard delete real con restricción fuerte, aceptando que las relaciones con notas y auditoría del lead se pierden por cascada según el esquema actual.

## Source of Truth to Read
- `agents/docs/DoD.md`
- `agents/docs/testing.md`
- `agents/docs/decisions.md`
- `agents/db/schema.sql`
- `agents/db/changes.sql`
- `agents/db/domain.md`
- `agents/docs/api.md`

## Decision Records
- ADRs read from `agents/docs/decisions.md`: ADR-000 Stack tecnológico PrawnForms.
- New decisions to record after user approval: none expected unless deletion/audit retention becomes a durable cross-task rule.
