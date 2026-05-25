# TASK-014 Plan — Historial de auditoría visible en detalle

## Status
`validated`

## Task
- ID: TASK-014
- Title: Historial de auditoría visible en detalle
- Backlog source: `agents/task/backlog.md`

## Summary
Añadir una sección «Historial de auditoría» en la vista detalle de la solicitud (`ViewLead`) que muestre los eventos registrados en `eventos_auditoria` para ese lead, ordenados del más reciente al más antiguo. Los eventos ya existen (creados por TASK-011, TASK-012 y TASK-013); esta tarea solo los hace visibles.

## Scope
**In:**
- Añadir una sección «Historial de auditoría» al final del `infolist` de `LeadResource`, después de la sección de notas internas.
- Mostrar los eventos de auditoría del lead en orden descendente por `created_at`.
- Cada evento muestra: acción legible, campo afectado, valor anterior, valor nuevo, autor (`usuario.name`) y fecha.
- Si el lead no tiene eventos, mostrar un placeholder («Sin eventos de auditoría todavía.»).
- Usar el mismo patrón de `RepeatableEntry` con `state` callback que se usa para las notas internas.
- Mantener la protección actual de acceso (invitados redirigidos, inactivos 403).
- Añadir pruebas para visualización de eventos, contenido de cada evento, orden, aislamiento entre leads, estado vacío y control de acceso.

**Out (explicitly excluded):**
- Añadir nuevas acciones o formularios (los eventos ya se crean en TASK-011, TASK-012, TASK-013).
- Modificar el esquema de base de datos.
- Añadir filtros o paginación al historial.
- Mostrar el historial fuera de la vista detalle (ej. en listado).
- Exportar o descargar el historial.

## Current Behavior
- `EventoAuditoria` almacena eventos con `lead_id`, `usuario_id`, `accion`, `campo`, `valor_anterior`, `valor_nuevo`, `created_at`.
- La relación `Lead::eventos()` existe y devuelve los eventos del lead.
- `EventoAuditoria::usuario()` es una relación `BelongsTo` a `User`.
- El `infolist` de `LeadResource` ya muestra una sección de notas internas con `RepeatableEntry`.
- El detalle de la solicitud no muestra ningún evento de auditoría en la UI.

## Target Behavior
- Un usuario interno activo que abre el detalle de una solicitud ve una sección «Historial de auditoría» al final del formulario.
- Si hay eventos, se muestran en orden descendente con: acción, campo, valor anterior → valor nuevo, autor y fecha.
- Si no hay eventos, se muestra un mensaje indicativo.
- Invitados redirigidos al login, usuarios inactivos 403.

## Acceptance Criteria
- La página detalle de `LeadResource` muestra una sección «Historial de auditoría» cuando el lead tiene eventos.
- Los eventos aparecen ordenados del más reciente al más antiguo.
- Cada evento muestra: acción (`cambio_estado`, `asignacion`), campo (`estado`, `responsable_id`), valor anterior, valor nuevo, nombre del autor y fecha.
- Un lead sin eventos muestra «Sin eventos de auditoría todavía.»
- Los eventos pertenecen solo al lead actual (no se mezclan de otros leads).
- Invitados redirigidos a `/admin/login`.
- Usuarios inactivos reciben `403`.

## Edge Cases
- Lead con eventos pero sin usuario asociado (`usuario_id = null` — acciones del sistema). Mostrar «Sistema» como autor.
- Eventos de distintos tipos (`cambio_estado`, `asignacion`) y distintos campos.
- Lead sin eventos de ningún tipo.
- Lead con muchos eventos (se muestran todos sin paginación inicialmente).
- Valor anterior o valor nuevo vacío (desasignación, lead sin responsable previo).

## Assumptions / Risks
- Se usa `RepeatableEntry` con `state` callback, idéntico al patrón de notas internas en `LeadResource.php`.
- La acción `cambio_estado` se muestra como texto plano con los valores; no se traduce a frases elaboradas.
- No se requiere cambio de esquema.
- Los eventos se cargan con `eventos()->with('usuario')->latest()->get()`.

## Database Impact
- Change summary: No hay cambios de esquema. Solo consultas SELECT a `eventos_auditoria` existentes.
- DB schema file: `agents/db/schema.sql`.
- DB change log file: `agents/db/changes.sql`.
- Affected structures/data: Solo lectura de la tabla `eventos_auditoria`.
- Forward migration approach: No aplica.
- Rollback approach: No aplica.
- Persisted data compatibility: Compatible con datos existentes.
- Operational risks: Ninguno.
- Validation plan: Pruebas feature con base de datos real de test.
- Backup/recovery notes: No aplica.
- Required doc updates: No se prevén.

## Open Questions
- Ninguna.

## Source of Truth to Read
- `agents/docs/DoD.md`
- `agents/docs/testing.md`
- `agents/db/schema.sql`
- `agents/db/domain.md`
- `agents/docs/design.md`
- `app/Models/EventoAuditoria.php`
- `app/Models/Lead.php`
- `app/Filament/Resources/LeadResource.php`
- `app/Filament/Resources/LeadResource/Pages/ViewLead.php`

## Decision Records
- ADRs read from `agents/docs/decisions.md`: ADR-000 Stack tecnológico PrawnForms.
- New decisions to record after user approval: Ninguna prevista.
