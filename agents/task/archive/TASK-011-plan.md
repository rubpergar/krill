# TASK-011 Plan — Cambio de estado con registro en auditoría

## Status
`validated`

## Task
- ID: TASK-011
- Title: Cambio de estado con registro en auditoría
- Backlog source: `agents/task/backlog.md`

## Summary
Permitir que un usuario interno activo cambie el estado de una solicitud desde el panel Filament y registrar cada cambio real en `eventos_auditoria`. La tarea convierte el estado del lead en una operación trazable, manteniendo el detalle de solicitud como punto principal de gestión y sin introducir todavía notas, asignaciones ni historial visible.

## Scope
**In:**
- Añadir una acción Filament para cambiar el `estado` de un `Lead`.
- Hacer disponible la acción desde la vista detalle de la solicitud (`/admin/leads/{record}`).
- Permitir seleccionar cualquier valor del enum `LeadStatus`: `Nuevo`, `Revisado`, `Contactado`, `En seguimiento`, `Convertido`, `Descartado`.
- Persistir el nuevo estado en `leads.estado`.
- Crear un `EventoAuditoria` solo cuando el estado cambie realmente.
- Registrar en auditoría: `lead_id`, `usuario_id`, `accion`, `campo`, `valor_anterior`, `valor_nuevo`.
- Usar `accion = cambio_estado` y `campo = estado`.
- Mantener la protección actual del panel: invitados redirigidos al login y usuarios inactivos con `403`.
- Añadir pruebas para cambio correcto, auditoría, no-op, acceso y valores inválidos.

**Out (explicitly excluded):**
- Mostrar el historial de auditoría en la UI.
- Cambiar responsable.
- Crear o mostrar notas internas.
- Definir restricciones de transición entre estados.
- Añadir permisos por rol más allá de usuario activo/inactivo.
- Enviar notificaciones o emails por cambio de estado.
- Cambios de esquema de base de datos.
- Cambios en el formulario público.

## Current Behavior
- La vista detalle de solicitud es read-only.
- `Lead` ya tiene el campo `estado` casteado a `LeadStatus`.
- `EventoAuditoria` ya existe y permite guardar `lead_id`, `usuario_id`, `accion`, `campo`, `valor_anterior` y `valor_nuevo`.
- El dominio ya declara que los cambios de estado se registran siempre en `EventoAuditoria`.
- No existe una acción de UI para modificar el estado ni una implementación que cree auditoría al cambiarlo.

## Target Behavior
- Un usuario interno activo puede abrir el detalle de una solicitud y ejecutar una acción “Cambiar estado”.
- La acción muestra un selector con los estados válidos de `LeadStatus`.
- Al confirmar un estado distinto al actual, el sistema actualiza `leads.estado` y crea un evento de auditoría asociado.
- El evento conserva el usuario autenticado como `usuario_id`, el valor anterior y el valor nuevo como strings del enum.
- Si el usuario selecciona el mismo estado actual, no se crea un evento de auditoría y no se realiza una actualización innecesaria.
- Si se intenta enviar un estado inválido, la validación falla y no se modifica el lead ni se crea auditoría.
- Invitados y usuarios inactivos no pueden ejecutar ni acceder a la acción.

## Acceptance Criteria
- La página detalle de `LeadResource` expone una acción visible para cambiar estado.
- La acción permite seleccionar únicamente valores válidos de `LeadStatus`.
- Cambiar de `Nuevo` a `Contactado` actualiza `leads.estado` a `Contactado`.
- Cada cambio real crea exactamente un `EventoAuditoria` con:
  - `lead_id` del lead modificado.
  - `usuario_id` del usuario autenticado.
  - `accion = cambio_estado`.
  - `campo = estado`.
  - `valor_anterior` con el estado previo.
  - `valor_nuevo` con el estado nuevo.
- Repetir el estado actual no crea auditoría nueva.
- Un estado inválido es rechazado por validación y no altera datos persistidos.
- Invitados siguen redirigidos a `/admin/login` al acceder al detalle.
- Usuarios inactivos siguen recibiendo `403` al acceder al detalle.
- Las pruebas cubren persistencia del cambio, registro de auditoría, ausencia de auditoría en no-op, validación de estado inválido y control de acceso.

## Edge Cases
- Lead con estado casteado como `LeadStatus` en memoria y almacenado como string en base de datos.
- Cambio hacia estados con espacios, especialmente `En seguimiento`.
- Usuario autenticado activo sin rol admin.
- Usuario inactivo intentando acceder a la vista o ejecutar la acción.
- Envío de estado igual al actual.
- Envío de valor que no pertenece al enum.
- Lead inexistente en URL.

## Assumptions / Risks
- Cualquier usuario interno activo puede cambiar estado; no se añade control por rol en esta tarea.
- No hay reglas de transición entre estados; todos los cambios entre valores válidos son permitidos.
- La acción se implementará preferentemente en la vista detalle para mantener el flujo operativo claro tras TASK-010.
- `EventoAuditoria` no requiere cambios de esquema para registrar el cambio.
- La tarea modifica datos persistidos (`leads` y `eventos_auditoria`), pero no cambia la estructura de la base de datos.
- No se requiere ADR nuevo porque la tarea aplica una regla de dominio ya documentada.

## Database Impact
- Change summary: Se actualizarán filas existentes de `leads.estado` y se insertarán nuevas filas en `eventos_auditoria` cuando haya cambios reales de estado.
- DB schema file from Source of Truth Map: `agents/db/schema.sql`.
- DB change log file from Source of Truth Map: `agents/db/changes.sql`.
- Affected structures/data: Tabla `leads` (`estado`) y tabla `eventos_auditoria` (`lead_id`, `usuario_id`, `accion`, `campo`, `valor_anterior`, `valor_nuevo`).
- Forward migration approach: No aplica migración; se usa el esquema existente.
- Rollback approach: No hay rollback automático para cambios operativos de estado; una reversión funcional sería otro cambio de estado auditado. En pruebas se usará `RefreshDatabase`.
- Persisted data compatibility: Compatible con datos existentes mientras `leads.estado` contenga valores válidos de `LeadStatus`.
- Operational risks: Cambios erróneos de estado quedan persistidos; la auditoría permite trazabilidad, pero no deshace el cambio automáticamente.
- Validation plan: Pruebas feature/Livewire con base de datos real de test para verificar actualización de lead y creación/no creación de eventos.
- Backup/recovery notes: No se requieren backups especiales para desarrollo. En producción, restaurar estados requeriría intervención operativa o un nuevo cambio auditado.
- Required doc updates: No se prevén cambios en `agents/db/schema.sql` ni `agents/db/changes.sql` porque no cambia el esquema. `agents/db/domain.md` ya documenta que los cambios de estado se auditan.

## Open Questions
- Ninguna.

## Source of Truth to Read
- `agents/docs/DoD.md`
- `agents/docs/testing.md`
- `agents/db/domain.md`
- `agents/db/schema.sql`
- `agents/db/changes.sql`
- `agents/docs/design.md`
- `app/Enums/LeadStatus.php`
- `app/Models/Lead.php`
- `app/Models/EventoAuditoria.php`
- `app/Filament/Resources/LeadResource.php`
- `app/Filament/Resources/LeadResource/Pages/ViewLead.php`

## Decision Records
- ADRs read from `agents/docs/decisions.md`: ADR-000 Stack tecnológico PrawnForms.
- New decisions to record after user approval: Ninguna prevista.
