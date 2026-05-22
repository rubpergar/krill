# TASK-008 Plan

## Status
`draft`

## Task
- ID: TASK-008
- Title: Resource Lead — listado paginado con columnas
- Backlog source: `agents/task/backlog.md`

## Summary
Crear el primer Resource de Filament para `Lead` dentro del panel `/admin`, centrado únicamente en el listado paginado de solicitudes. El objetivo es que usuarios internos autenticados puedan ver una tabla administrativa con las columnas clave para seguimiento inicial, sin crear todavía filtros, detalle, edición, cambio de estado, notas, auditoría ni asignación.

## Scope
**In:**
- Crear `LeadResource` en `app/Filament/Resources` para el modelo `App\Models\Lead`.
- Crear la página de listado necesaria para que Filament registre y sirva el recurso.
- Mostrar una tabla paginada con columnas de lectura para:
  - Nombre
  - Email
  - Empresa
  - Tipo de necesidad
  - Estado
  - Responsable
  - Fecha de creación
- Mantener la paginación por defecto de Filament.
- Ordenar inicialmente por `created_at` descendente para ver primero las solicitudes recientes.
- Ocultar o representar de forma segura valores nulos, especialmente `empresa` y `responsable`.
- Proteger el recurso con la autenticación y autorización existente del panel Filament.
- Cubrir con tests feature el acceso al listado y la visibilidad de columnas/datos clave.

**Out (explicitly excluded):**
- Crear, editar o eliminar leads desde el panel.
- Página de detalle del lead.
- Filtros combinables, búsqueda avanzada o tabs por estado.
- Cambio de estado.
- Notas internas.
- Asignación de responsable.
- Historial de auditoría visible.
- Acciones bulk.
- Exportación CSV.
- Cambios de esquema de base de datos.
- Cambios de diseño global o tokens en `agents/docs/design.md`.

## Current Behavior
- `/admin` existe y está protegido por Filament.
- Solo usuarios activos pueden acceder al panel gracias a `User::canAccessPanel()`.
- No existe ningún Resource Filament en `app/Filament/Resources`.
- Los leads se crean desde el formulario público y quedan persistidos en la tabla `leads`.
- Los usuarios internos no tienen todavía una pantalla de listado de solicitudes en el panel.

## Target Behavior
- El panel Filament muestra una entrada de navegación para solicitudes/leads.
- Un usuario activo autenticado puede acceder al listado de leads desde `/admin`.
- El listado muestra registros existentes en una tabla paginada.
- La tabla expone las columnas necesarias para una revisión inicial: nombre, email, empresa, tipo, estado, responsable y fecha de creación.
- Un usuario invitado sigue siendo redirigido al login del panel.
- Un usuario inactivo sigue recibiendo `403` al intentar acceder al panel o al recurso.

## Acceptance Criteria
- Existe un Resource Filament para `Lead` descubierto por `AdminPanelProvider`.
- El listado de leads responde `200` para un usuario activo autenticado.
- El listado no es accesible para visitantes sin autenticar.
- El listado no es accesible para usuarios inactivos.
- Al crear leads mediante factory, el listado muestra nombre, email, empresa, tipo de necesidad y estado.
- Si un lead tiene responsable, el listado muestra el nombre del responsable.
- Si `empresa` o `responsable` son nulos, la pantalla no falla y muestra un placeholder razonable o deja el valor vacío según patrón Filament.
- La tabla conserva paginación; no se desactiva con `paginated(false)`.
- No se añaden acciones de create/edit/delete/view en esta tarea salvo las mínimas que Filament requiera técnicamente para servir el listado.
- No hay migraciones ni cambios en modelos de dominio salvo que un test descubra una incompatibilidad estrictamente necesaria para renderizar relaciones existentes.

## Edge Cases
- Lead sin `empresa`.
- Lead sin `responsable_id`.
- Estado y tipo de necesidad casteados como enums PHP.
- Listado con múltiples leads para confirmar orden reciente primero.
- Acceso directo por URL al recurso sin pasar por el dashboard.
- Usuario autenticado pero `activo = false`.

## Assumptions / Risks
- Filament 5 permite definir el Resource y la tabla con `TextColumn` y página `ListRecords` sin necesidad de CRUD completo.
- La URL exacta del Resource puede depender del slug generado por Filament; los tests deben preferir helpers/rutas del Resource si están disponibles o confirmar la ruta real tras crear el Resource.
- Las columnas enum pueden renderizar correctamente usando el valor casteado; si no, se resolverá con formatting local en la columna sin cambiar los enums.
- Esta tarea no define políticas por rol (`admin` vs `usuario`); ambos usuarios activos pueden ver el listado mientras el panel los admita.
- No se introduce diseño personalizado: se usa UI estándar de Filament.

## Database Impact
Use `Not applicable` when the task does not affect the database.

- Change summary: Not applicable. Solo se añade UI administrativa de lectura sobre datos existentes.
- DB schema file from Source of Truth Map: `agents/db/schema.sql` sin cambios previstos.
- DB change log file from Source of Truth Map: `agents/db/changes.sql` sin cambios previstos.
- Affected structures/data: tabla existente `leads`, relación existente `responsable` con `users`.
- Forward migration approach: Not applicable.
- Rollback approach: retirar el Resource/página/tests si se revierte la tarea.
- Persisted data compatibility: compatible con leads ya existentes; debe tolerar `empresa` y `responsable_id` nulos.
- Operational risks: carga de listado sobre tabla `leads`; mitigado por paginación por defecto de Filament.
- Validation plan: tests feature del Resource y suite completa.
- Backup/recovery notes: Not applicable; no hay escritura ni migraciones.
- Required doc updates: no se prevén cambios en docs de DB. Actualizar docs solo si se decide un contrato durable nuevo para navegación o permisos.

## Open Questions
- ¿El label visible debe ser `Solicitudes` o `Leads`? Propuesta para implementar: `Solicitudes`, por coherencia con el dominio.
- ¿La columna `mensaje` debe aparecer en el listado como extracto? Propuesta para TASK-008: no, se reserva para la vista detalle de TASK-010.
- ¿Debe mostrarse `telefono` en el listado? Propuesta para TASK-008: no, para mantener densidad baja y evitar exponer más datos personales de los necesarios en la tabla inicial.

## Source of Truth to Read
- `agents/docs/DoD.md`
- `agents/docs/testing.md`
- `agents/docs/decisions.md`
- `agents/db/domain.md`
- `agents/db/schema.sql`
- `agents/docs/design.md`
- `app/Models/Lead.php`
- `app/Models/User.php`
- `app/Providers/Filament/AdminPanelProvider.php`
- Context7 docs: `/filamentphp/filament/v5.1.1`, Resource tables and pagination.

## Decision Records
- ADRs read from `agents/docs/decisions.md`:
  - ADR-000: Stack tecnológico PrawnForms. Confirma Laravel 13 + Filament 5 + PostgreSQL/Pest/Blade y Filament como panel privado.
- New decisions to record after user approval:
  - None expected. Labels/columnas de esta tarea son decisiones locales salvo que el usuario quiera convertirlas en contrato durable.
