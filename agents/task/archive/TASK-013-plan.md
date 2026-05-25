# TASK-013 Plan — Asignación de responsable con auditoría

## Status
`validated`

## Task
- ID: TASK-013
- Title: Asignación de responsable con auditoría
- Backlog source: `agents/task/backlog.md`

## Summary
Añadir una acción en la vista detalle de la solicitud para asignar o cambiar el responsable (`responsable_id`) de un Lead, registrando cada cambio real en `eventos_auditoria`. La tarea replica el patrón de TASK-011 (cambio de estado con auditoría) pero sobre el campo `responsable_id`.

## Scope
**In:**
- Añadir una acción Filament `Asignar responsable` en la cabecera de la vista detalle (`ViewLead`).
- La acción muestra un `Select` con los usuarios activos (`User::where('activo', true)`) y una opción para desasignar («Sin responsable»).
- Al confirmar un responsable distinto al actual, actualizar `leads.responsable_id` y crear un `EventoAuditoria`.
- Registrar en auditoría: `lead_id`, `usuario_id` (autenticado), `accion = asignacion`, `campo = responsable_id`, `valor_anterior` (nombre o ID del responsable previo o null), `valor_nuevo` (nombre o ID del nuevo responsable o null).
- Si se selecciona el mismo responsable (mismo ID), no realizar ninguna operación (no-op).
- La desasignación (pasar de un responsable a «Sin responsable») se considera un cambio real y se audita.
- Mantener la protección actual: invitados redirigidos al login, usuarios inactivos con `403`.
- Añadir pruebas para cambio correcto, auditoría, no-op, desasignación, y control de acceso.

**Out (explicitly excluded):**
- Mostrar el historial de auditoría en la UI (será TASK-014).
- Añadir permisos por rol más allá de activo/inactivo.
- Notificar al responsable asignado.
- Cambiar el formulario público.
- Validar que el responsable pertenezca a un equipo o tenga un rol específico.
- Modificar el esquema de base de datos.

## Current Behavior
- `Lead` tiene el campo `responsable_id` nullable FK a `users` y la relación `responsable()`.
- El `LeadResource::infolist()` ya muestra el responsable actual (`responsable.name`).
- La tabla `eventos_auditoria` acepta registros con `accion`, `campo`, `valor_anterior`, `valor_nuevo`.
- `ViewLead` ya expone acciones de cabecera (`changeStatus`, `addInternalNote`).
- No existe una acción de UI para modificar el responsable ni registros de auditoría específicos para asignación.

## Target Behavior
- Un usuario interno activo puede abrir el detalle de una solicitud y ejecutar una acción «Asignar responsable».
- La acción muestra un selector con usuarios activos (`activo = true`) más la opción «Sin responsable».
- Al confirmar un responsable distinto al actual, se actualiza `leads.responsable_id` y se crea un evento de auditoría asociado.
- El evento conserva: `lead_id`, `usuario_id` (autenticado), `accion = asignacion`, `campo = responsable_id`, `valor_anterior` (nombre del responsable anterior o cadena vacía), `valor_nuevo` (nombre del nuevo responsable o «Sin responsable»).
- Si se selecciona el mismo responsable, no se modifica el lead ni se crea auditoría.
- Invitados y usuarios inactivos no pueden ejecutar ni acceder a la acción.

## Acceptance Criteria
- La página detalle de `LeadResource` expone una acción visible «Asignar responsable».
- La acción permite seleccionar cualquier usuario activo más la opción «Sin responsable».
- Asignar un responsable distinto al actual actualiza `leads.responsable_id`.
- Cada cambio real crea exactamente un `EventoAuditoria` con:
  - `lead_id` del lead modificado.
  - `usuario_id` del usuario autenticado.
  - `accion = asignacion`.
  - `campo = responsable_id`.
  - `valor_anterior` con el nombre del responsable previo (o cadena vacía si era null).
  - `valor_nuevo` con el nombre del nuevo responsable (o «Sin responsable» si se desasigna).
- Repetir el mismo responsable no crea auditoría nueva.
- Desasignar (pasar a «Sin responsable») crea un evento de auditoría.
- Invitados siguen redirigidos a `/admin/login`.
- Usuarios inactivos siguen recibiendo `403`.

## Edge Cases
- Lead sin responsable asignado inicialmente (`responsable_id = null`).
- Seleccionar «Sin responsable» cuando ya no hay responsable (no-op).
- Usuario autenticado se asigna a sí mismo como responsable.
- Usuario inactivo no aparece en el selector (solo activos).
- El responsable seleccionado fue desactivado después de la asignación (en la vista se muestra el nombre, pero no se permite reasignarlo a través del Select — esto es coherente con no mostrar inactivos en el selector).

## Assumptions / Risks
- Se usa `accion = asignacion` como valor distinguible en auditoría (no «cambio_estado»).
- El valor almacenado en `valor_anterior`/`valor_nuevo` será el nombre del usuario o una cadena descriptiva, no el ID numérico, para legibilidad. Esto es coherente con el enfoque de TASK-011 donde se guardan strings del enum.
- Cualquier usuario interno activo puede reasignar; no se añade control por rol.
- No se requiere cambio de esquema porque `leads.responsable_id` ya existe.
- El `Select` cargará los usuarios con `activo = true` vía una query simple.

## Database Impact
- Change summary: Se actualizarán filas existentes de `leads.responsable_id` y se insertarán nuevas filas en `eventos_auditoria` cuando haya cambios reales de asignación.
- DB schema file: `agents/db/schema.sql`.
- DB change log file: `agents/db/changes.sql`.
- Affected structures/data: Tabla `leads` (`responsable_id`) y tabla `eventos_auditoria` (`lead_id`, `usuario_id`, `accion`, `campo`, `valor_anterior`, `valor_nuevo`).
- Forward migration approach: No aplica migración; se usa el esquema existente.
- Rollback approach: No hay rollback automático para cambios operativos de asignación; una reversión sería otra asignación auditada. En pruebas se usará `RefreshDatabase`.
- Persisted data compatibility: Compatible con datos existentes (leads con o sin responsable).
- Operational risks: Asignaciones erróneas quedan persistidas; la auditoría permite trazabilidad.
- Validation plan: Pruebas feature/Livewire con base de datos real de test para verificar actualización de lead y creación/no creación de eventos.
- Backup/recovery notes: No se requieren backups especiales para desarrollo.
- Required doc updates: No se prevén cambios en los archivos de esquema. `agents/db/domain.md` ya declara que las asignaciones se registran en `EventoAuditoria` (regla de negocio «Los cambios de estado y asignaciones se registran siempre en EventoAuditoria»).

## Open Questions
- Ninguna.

## Source of Truth to Read
- `agents/docs/DoD.md`
- `agents/docs/testing.md`
- `agents/db/domain.md`
- `agents/db/schema.sql`
- `agents/docs/design.md`
- `agents/task/archive/TASK-011-plan.md` (como referencia de patrón similar)
- `app/Models/Lead.php`
- `app/Models/EventoAuditoria.php`
- `app/Models/User.php`
- `app/Filament/Resources/LeadResource.php`
- `app/Filament/Resources/LeadResource/Pages/ViewLead.php`
- `database/factories/LeadFactory.php`

## Decision Records
- ADRs read from `agents/docs/decisions.md`: ADR-000 Stack tecnológico PrawnForms.
- New decisions to record after user approval: Ninguna prevista.
