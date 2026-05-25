# TASK-015 Plan — Cierre como convertido/descartado con acción rápida

## Status
`validated`

## Task
- ID: TASK-015
- Title: Cierre como convertido/descartado con acción rápida
- Backlog source: `agents/task/backlog.md`

## Summary
Añadir acciones rápidas de un clic para marcar un lead como «Convertido» o «Descartado» directamente desde la tabla del listado y desde la cabecera del detalle, sin pasar por el formulario modal de «Cambiar estado».

## Scope
**In:**
- Añadir acción «Marcar como convertido» en la cabecera del detalle (`ViewLead`).
- Añadir acción «Marcar como descartado» en la cabecera del detalle (`ViewLead`).
- Añadir acción «Convertir» por fila en la tabla del listado (`LeadResource.table`).
- Añadir acción «Descartar» por fila en la tabla del listado (`LeadResource.table`).
- Cada acción rápida cambia `leads.estado` directamente al valor correspondiente (`Convertido` o `Descartado`).
- Cada acción rápida crea un `EventoAuditoria` con `accion = cambio_estado`, `campo = estado`.
- Si el lead ya está en ese estado, la acción es no-op (no actualiza ni audita).
- Las acciones del detalle son botones directos sin formulario (un clic, con confirmación).
- Las acciones de la tabla son botones en la fila con confirmación.
- Mantener la protección actual: invitados redirigidos al login, inactivos 403.
- Añadir pruebas para cambio correcto, no-op, y control de acceso desde ambos orígenes.

**Out (explicitly excluded):**
- Modificar el formulario «Cambiar estado» existente (sigue disponible para cambios a otros estados).
- Añadir acciones rápidas para otros estados (Nuevo, Revisado, Contactado, En seguimiento).
- Añadir acciones bulk/masivas en el listado.
- Notificaciones por email.
- Cambios de esquema o modelo.

## Current Behavior
- El lead se puede cambiar a cualquier estado mediante la acción «Cambiar estado» con un Select modal.
- No existe una forma de cambiar a Convertido o Descartado en un solo clic.
- No hay acciones en las filas de la tabla más allá de «Ver».

## Target Behavior
- Un usuario activo puede marcar un lead como «Convertido» o «Descartado» con un solo clic desde la cabecera del detalle (con confirmación).
- Un usuario activo puede marcar un lead como «Convertido» o «Descartado» con un clic desde cada fila de la tabla (con confirmación).
- Cada cambio real se audita igual que el cambio de estado actual.
- Si el lead ya está en ese estado, la acción no hace nada (ni actualiza, ni audita).

## Acceptance Criteria
- La página detalle de `LeadResource` muestra acciones «Marcar como convertido» y «Marcar como descartado» en la cabecera.
- Cada acción muestra un diálogo de confirmación antes de ejecutar.
- Al confirmar, el lead cambia al estado correspondiente y se crea un `EventoAuditoria`.
- Si el lead ya está en ese estado, la acción no tiene efecto.
- La tabla del listado muestra acciones «Convertir» y «Descartar» por fila.
- Invitados redirigidos al login, inactivos 403.

## Edge Cases
- Lead ya en estado «Convertido»: la acción «Marcar como convertido» es no-op.
- Lead ya en estado «Descartado»: la acción «Marcar como descartado» es no-op.
- Lead en cualquier otro estado previo (Nuevo, Revisado, Contactado, En seguimiento).
- Las acciones de tabla y detalle son independientes y ambas deben funcionar.

## Assumptions / Risks
- Se usa `requiresConfirmation()` en las acciones Filament para mostrar el diálogo de confirmación.
- El patrón de creación de `EventoAuditoria` replica exactamente el de `changeStatus` en ViewLead.
- Las acciones de tabla se añaden como `recordActions` adicionales en el `Table` de LeadResource.
- Tanto en tabla como en detalle se verifica `valor_anterior !== valor_nuevo` antes de persistir.

## Database Impact
- Change summary: No hay cambios de esquema. Solo actualizaciones a `leads.estado` e inserciones en `eventos_auditoria`.
- DB schema file: `agents/db/schema.sql`.
- DB change log file: `agents/db/changes.sql`.
- Affected structures/data: Tabla `leads` (`estado`), tabla `eventos_auditoria`.
- Forward migration approach: No aplica.
- Rollback approach: No aplica (cambios operativos auditados).
- Persisted data compatibility: Compatible.
- Operational risks: Ninguno adicional al cambio de estado normal.
- Validation plan: Pruebas feature desde Livewire (detalle) y HTTP (tabla).
- Backup/recovery notes: No aplica.
- Required doc updates: No se prevén.

## Open Questions
- Ninguna.

## Source of Truth to Read
- `agents/docs/DoD.md`
- `agents/docs/testing.md`
- `agents/db/domain.md`
- `app/Enums/LeadStatus.php`
- `app/Models/EventoAuditoria.php`
- `app/Filament/Resources/LeadResource.php`
- `app/Filament/Resources/LeadResource/Pages/ViewLead.php`
- `agents/task/archive/TASK-011-plan.md` (como referencia de patrón de auditoría)

## Decision Records
- ADRs read from `agents/docs/decisions.md`: ADR-000 Stack tecnológico PrawnForms.
- New decisions to record after user approval: Ninguna prevista.
