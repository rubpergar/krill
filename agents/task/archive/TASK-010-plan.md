# TASK-010 Plan — Vista detalle de solicitud

## Status
`validated`

## Task
- ID: TASK-010
- Title: Vista detalle de solicitud
- Backlog source: `agents/task/backlog.md`

## Summary
Crear una vista privada de detalle para cada solicitud dentro del panel Filament, accesible desde el listado de solicitudes. La vista permitirá consultar todos los datos relevantes de un lead sin modificar su estado, responsable, notas ni auditoría.

## Scope
**In:**
- Añadir página de detalle read-only para `LeadResource` en Filament.
- Registrar la ruta de detalle bajo `/admin/leads/{record}`.
- Permitir acceder al detalle desde el listado existente.
- Mostrar los campos principales del lead: nombre, email, teléfono, empresa, tipo de necesidad, estado, responsable, mensaje, origen, fecha de creación y datos de consentimiento.
- Mantener el acceso protegido por la autenticación y la regla de usuario activo ya existente para el panel.
- Añadir pruebas feature/Livewire para acceso, contenido visible y protección de invitados/inactivos.

**Out (explicitly excluded):**
- Editar solicitudes.
- Cambiar estado.
- Asignar responsable.
- Crear, listar o editar notas internas.
- Mostrar historial de auditoría.
- Archivar, eliminar o exportar solicitudes.
- Cambios en el formulario público.
- Cambios de base de datos.

## Current Behavior
- `/admin/leads` muestra el listado paginado de solicitudes con columnas, búsqueda y filtros.
- `LeadResource` solo registra la página `index` mediante `ListLeads::route('/')`.
- No existe una ruta o página de detalle para consultar todos los campos de una solicitud.
- Los invitados son redirigidos a `/admin/login` y los usuarios inactivos reciben `403` al acceder al panel.

## Target Behavior
- Un usuario interno activo puede abrir `/admin/leads/{record}` y ver una ficha read-only de la solicitud.
- La vista muestra la información suficiente para que el equipo interno entienda la solicitud recibida sin salir del panel.
- Desde el listado se ofrece una acción/enlace de visualización hacia el detalle.
- La página mantiene el diseño y componentes Filament existentes, aprovechando el tema visual ya aplicado.
- Los invitados no pueden acceder al detalle y son redirigidos al login.
- Los usuarios inactivos autenticados no pueden acceder al detalle y reciben `403`.
- Si el lead no existe, se conserva el comportamiento estándar de Filament/Laravel para registro no encontrado.

## Acceptance Criteria
- `LeadResource::getPages()` registra una página `view` para `/admin/leads/{record}`.
- Existe una página Filament de detalle para leads, read-only.
- El listado de solicitudes permite navegar al detalle mediante una acción visible o comportamiento equivalente claro.
- La vista detalle muestra, como mínimo: nombre, email, teléfono, empresa, tipo de necesidad, estado, responsable, mensaje, fecha de creación, consentimiento aceptado y fecha de consentimiento.
- Los campos opcionales nulos se muestran de forma tolerante con placeholder o ausencia segura, sin errores.
- `GET /admin/leads/{id}` devuelve `200` para usuario activo autenticado.
- `GET /admin/leads/{id}` redirige a `/admin/login` para invitados.
- `GET /admin/leads/{id}` devuelve `403` para usuario inactivo autenticado.
- Las pruebas cubren que los datos principales del lead aparecen en la página de detalle.
- La implementación no modifica el esquema de base de datos ni los contratos públicos documentados.

## Edge Cases
- Lead con `empresa`, `telefono` o `responsable_id` nulos.
- Mensaje largo enviado por el solicitante.
- Campos enum casteados como objetos (`LeadStatus`, `TipoNecesidad`) o valores serializados por Filament.
- Lead inexistente en URL.
- Usuario autenticado pero inactivo.

## Assumptions / Risks
- Se usará la página estándar de Filament para visualización de registros si encaja con el recurso actual.
- La vista será consultiva; cualquier acción de mutación queda reservada para tareas posteriores.
- La exposición de IP y user agent no queda incluida en el mínimo visible para evitar mostrar datos técnicos/sensibles si no son necesarios para operación diaria.
- No se requiere ADR nuevo porque la tarea sigue la decisión aceptada de usar Laravel + Filament para el panel privado.

## Database Impact
Not applicable.

- Change summary: No hay cambios de esquema ni datos.
- DB schema file from Source of Truth Map: `agents/db/schema.sql`
- DB change log file from Source of Truth Map: `agents/db/changes.sql`
- Affected structures/data: Ninguna.
- Forward migration approach: No aplica.
- Rollback approach: No aplica.
- Persisted data compatibility: Sin impacto.
- Operational risks: Sin impacto de datos persistidos.
- Validation plan: Pruebas feature/Livewire y validación del panel.
- Backup/recovery notes: No aplica.
- Required doc updates: No se prevén actualizaciones de documentación persistente salvo que durante implementación cambie el contrato operativo del panel.

## Open Questions
- Ninguna. Para esta tarea, `ip_origen` y `user_agent` quedan fuera del detalle hasta una tarea específica de auditoría/privacidad.

## Source of Truth to Read
- `agents/docs/DoD.md`
- `agents/docs/testing.md`
- `agents/docs/design.md`
- `agents/docs/api.md`
- `agents/db/domain.md`
- `app/Filament/Resources/LeadResource.php`
- `app/Filament/Resources/LeadResource/Pages/ListLeads.php`
- `app/Models/Lead.php`

## Decision Records
- ADRs read from `agents/docs/decisions.md`: ADR-000 Stack tecnológico PrawnForms.
- New decisions to record after user approval: Ninguna prevista.
