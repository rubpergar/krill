# TASK-012 Plan — Notas internas en detalle de solicitud

## Status
`validated`

## Task
- ID: TASK-012
- Title: Notas internas en detalle de solicitud
- Backlog source: `agents/task/backlog.md`

## Summary
Añadir notas internas al detalle privado de una solicitud para que el equipo pueda registrar contexto operativo y seguimiento sin alterar los datos enviados por el solicitante. Las notas se crearán y visualizarán dentro del panel Filament, asociadas al lead y al usuario interno autenticado.

## Scope
**In:**
- Mostrar las notas internas existentes de un `Lead` en su vista detalle (`/admin/leads/{record}`).
- Añadir una acción Filament para crear una nueva nota interna desde la vista detalle.
- Guardar cada nota en `notas_internas` con `lead_id`, `usuario_id` y `contenido`.
- Mostrar al menos contenido, autor y fecha de creación de cada nota.
- Ordenar las notas de más reciente a más antigua.
- Validar que el contenido de la nota sea obligatorio y no vacío.
- Mantener acceso restringido al panel: invitados redirigidos al login y usuarios inactivos con `403`.
- Añadir pruebas feature/Livewire para visualización, creación, validación y control de acceso.

**Out (explicitly excluded):**
- Editar notas internas existentes.
- Eliminar notas internas.
- Notificaciones por email o externas al crear una nota.
- Mostrar historial de auditoría completo.
- Cambiar estado o responsable.
- Cambios en el formulario público.
- Cambios de esquema de base de datos.
- Permisos por rol más allá del acceso de usuario activo/inactivo existente.

## Current Behavior
- La vista detalle de solicitud muestra datos principales del lead y permite cambiar estado con auditoría.
- `Lead` ya tiene relación `notas()` hacia `NotaInterna`.
- `NotaInterna` ya existe con `lead_id`, `usuario_id` y `contenido` como campos asignables.
- La tabla `notas_internas` ya existe y enlaza con `leads` y `users`.
- No hay UI en Filament para ver o crear notas internas desde el detalle.

## Target Behavior
- Un usuario interno activo puede entrar al detalle de una solicitud y ver una sección/listado de notas internas.
- Si no existen notas, la UI muestra un estado vacío tolerante.
- Desde el detalle, el usuario puede ejecutar una acción “Añadir nota interna” con un campo de texto multilínea.
- Al confirmar una nota válida, se crea una fila en `notas_internas` asociada al lead y al usuario autenticado.
- La nueva nota aparece en el detalle tras guardarse.
- Notas de distintos leads no se mezclan.
- Usuarios invitados o inactivos no pueden acceder a la vista ni crear notas.

## Acceptance Criteria
- La vista detalle de `LeadResource` muestra una sección de notas internas.
- Una nota existente asociada al lead se muestra con contenido, autor y fecha.
- Una nota asociada a otro lead no aparece en el detalle actual.
- Un usuario activo puede crear una nota desde el detalle.
- La nota creada guarda:
  - `lead_id` del lead actual.
  - `usuario_id` del usuario autenticado.
  - `contenido` enviado en el formulario.
- El contenido de la nota es obligatorio; valores vacíos o solo espacios son rechazados.
- Las notas se muestran ordenadas de más reciente a más antigua.
- Invitados siguen redirigidos a `/admin/login` al acceder al detalle.
- Usuarios inactivos siguen recibiendo `403` al acceder al detalle.
- La implementación no modifica el esquema de base de datos ni contratos públicos.

## Edge Cases
- Lead sin notas internas.
- Lead con múltiples notas de distintos autores.
- Nota con contenido largo.
- Nota con saltos de línea.
- Contenido vacío o solo espacios.
- Usuario activo con rol `usuario` no admin.
- Usuario inactivo intentando acceder al detalle.
- Lead inexistente en URL.

## Assumptions / Risks
- Cualquier usuario interno activo puede ver y crear notas internas; no se introduce control por rol en esta tarea.
- Las notas internas son privadas del panel y no deben exponerse en rutas públicas.
- No se registrará un `EventoAuditoria` al crear una nota en esta tarea, aunque el dominio menciona notas como eventos auditables; la tarea se limita a crear y listar notas. Si se decide auditar creación de notas, debe cubrirse explícitamente en una tarea o ajuste aprobado.
- La relación existente `Lead::notas()` y el modelo `NotaInterna` son suficientes; no se espera migración.
- La UI debe integrarse con el detalle Filament actual sin crear una pantalla separada.

## Database Impact
- Change summary: Se insertarán nuevas filas en `notas_internas`; no hay cambios de esquema.
- DB schema file from Source of Truth Map: `agents/db/schema.sql`.
- DB change log file from Source of Truth Map: `agents/db/changes.sql`.
- Affected structures/data: Tabla `notas_internas` (`lead_id`, `usuario_id`, `contenido`, timestamps).
- Forward migration approach: No aplica migración; se usa el esquema existente.
- Rollback approach: No hay rollback automático para notas operativas. En pruebas se usará `RefreshDatabase`; en producción, correcciones requerirían intervención operativa o futura funcionalidad de edición/eliminación.
- Persisted data compatibility: Compatible con datos existentes; leads sin notas deben seguir funcionando.
- Operational risks: Una nota incorrecta queda persistida porque editar/eliminar notas queda fuera de alcance.
- Validation plan: Pruebas feature/Livewire con base de datos real de test para verificar listado, creación, validación y aislamiento por lead.
- Backup/recovery notes: No se requieren backups especiales para desarrollo. En producción, recuperar/eliminar notas requeriría intervención directa hasta que existan tareas de edición/eliminación.
- Required doc updates: No se prevén cambios en `agents/db/schema.sql` ni `agents/db/changes.sql` porque el esquema ya existe. `agents/db/domain.md` ya documenta `NotaInterna` como entidad de seguimiento.

## Open Questions
- Ninguna. En TASK-012 la creación de notas internas no genera `EventoAuditoria`; esa trazabilidad queda fuera de alcance salvo aprobación explícita posterior.

## Source of Truth to Read
- `agents/docs/DoD.md`
- `agents/docs/testing.md`
- `agents/docs/design.md`
- `agents/db/domain.md`
- `agents/db/schema.sql`
- `agents/db/changes.sql`
- `app/Models/Lead.php`
- `app/Models/NotaInterna.php`
- `app/Models/EventoAuditoria.php`
- `app/Filament/Resources/LeadResource.php`
- `app/Filament/Resources/LeadResource/Pages/ViewLead.php`

## Decision Records
- ADRs read from `agents/docs/decisions.md`: ADR-000 Stack tecnológico PrawnForms.
- New decisions to record after user approval: Ninguna prevista.
