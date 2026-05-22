# TASK-009 Plan

## Status
`draft`

## Task
- ID: TASK-009
- Title: Filtros combinables en listado (estado, tipo, texto, fecha, responsable)
- Backlog source: `agents/task/backlog.md`

## Summary
Añadir filtros combinables al listado Filament de solicitudes creado en TASK-008 para que usuarios internos puedan acotar leads por estado, tipo de necesidad, texto libre, rango de fecha de creación y responsable. La tarea amplía únicamente la tabla existente de `LeadResource`, sin cambiar el modelo de datos ni añadir acciones de gestión.

## Scope
**In:**
- Añadir filtros al `LeadResource` existente en `app/Filament/Resources/LeadResource.php`.
- Filtro por `estado` usando las opciones de `App\Enums\LeadStatus`.
- Filtro por `tipo_necesidad` usando las opciones de `App\Enums\TipoNecesidad`.
- Filtro por texto libre sobre campos existentes del lead.
- Filtro por fecha de creación con rango `created_from` / `created_until`.
- Filtro por responsable usando la relación existente `responsable` con `User`.
- Mantener todos los filtros combinables entre sí mediante la query Eloquent de la tabla.
- Cubrir con tests feature que cada filtro reduce el listado esperado y que una combinación de filtros funciona.

**Out (explicitly excluded):**
- Cambios de esquema de base de datos o migraciones.
- Crear índices de BD para optimización.
- Filtros por campos no incluidos en el backlog.
- Persistencia personalizada de filtros fuera del comportamiento estándar de Filament.
- Guardar vistas/filtros predefinidos por usuario.
- Cambios en columnas del listado salvo ajustes mínimos necesarios para compatibilidad con filtros.
- Página de detalle, edición, creación, eliminación o acciones bulk.
- Cambio de estado, asignación de responsable, notas internas o auditoría.
- Cambios en roles o políticas de autorización.
- Cambios de diseño global o tokens en `agents/docs/design.md`.

## Current Behavior
- Existe `LeadResource` con listado en `/admin/leads`.
- La tabla muestra columnas de lectura: nombre, email, empresa, tipo de necesidad, estado, responsable y fecha de creación.
- La tabla está paginada y ordenada por `created_at` descendente.
- `nombre` y `email` ya son columnas `searchable()`, pero no existe un filtro explícito de texto libre definido por la tarea.
- No hay filtros en la tabla.
- El panel sigue protegido por autenticación Filament y `User::canAccessPanel()`.

## Target Behavior
- Usuarios activos autenticados pueden abrir `/admin/leads` y filtrar el listado sin abandonar la página.
- El filtro de estado muestra las opciones del enum `LeadStatus` y devuelve solo leads con el estado seleccionado.
- El filtro de tipo muestra las opciones del enum `TipoNecesidad` y devuelve solo leads con el tipo seleccionado.
- El filtro de texto libre busca en campos textuales útiles del lead, propuestos: `nombre`, `email`, `empresa`, `telefono` y `mensaje`.
- El filtro de fecha permite acotar por fecha de creación inicial y final, ambos inclusivos por día.
- El filtro de responsable permite seleccionar usuarios existentes por nombre y devuelve solo leads asignados a ese usuario.
- Los filtros se pueden combinar y la tabla aplica todas las condiciones activas a la vez.
- Invitados e inactivos mantienen el comportamiento de acceso ya validado en TASK-008.

## Acceptance Criteria
- El `LeadResource` define filtros para `estado`, `tipo_necesidad`, texto libre, rango de `created_at` y `responsable`.
- El filtro `estado` usa las opciones actuales de `LeadStatus` sin duplicar strings manuales innecesariamente.
- El filtro `tipo_necesidad` usa las opciones actuales de `TipoNecesidad` sin duplicar strings manuales innecesariamente.
- El filtro de texto libre encuentra leads por al menos nombre, email y empresa.
- El filtro de texto libre no rompe si `empresa`, `telefono` o `mensaje` son nulos.
- El filtro de fecha `created_from` incluye leads creados ese día o después.
- El filtro de fecha `created_until` incluye leads creados ese día o antes.
- El filtro de responsable usa la relación `responsable` y permite filtrar por `User` asignado.
- Dos o más filtros activos se comportan como intersección, no como unión.
- El listado sigue paginado y ordenado por fecha descendente cuando los filtros se aplican.
- No se añaden acciones de create/edit/delete/view.
- No se crean migraciones ni cambios de esquema.

## Edge Cases
- Lead sin `empresa`.
- Lead sin `telefono`.
- Lead sin `responsable_id`.
- Texto libre con mayúsculas/minúsculas diferentes según soporte del driver local.
- Fecha `created_from` igual a la fecha de creación del lead.
- Fecha `created_until` igual a la fecha de creación del lead.
- Combinación sin resultados.
- Usuario responsable inactivo pero todavía referenciado por un lead.
- Enums casteados en el modelo, almacenados como strings en base de datos.

## Assumptions / Risks
- Se usará la API estándar de filtros de Filament 5: `SelectFilter`, `Filter` con `DatePicker` y callbacks `query()` sobre Eloquent.
- Para responsable, se prioriza `SelectFilter::make('responsable_id')->relationship('responsable', 'name')` si funciona correctamente con la relación existente.
- El filtro de texto libre probablemente se implementará como `Filter` custom con un input y `where` agrupado sobre varios campos, no como búsqueda global de tabla, porque el backlog pide un filtro explícito de texto.
- En SQLite local, la sensibilidad a mayúsculas/minúsculas puede diferir de PostgreSQL. Los tests deben usar valores claros y no depender de diferencias sutiles entre drivers.
- No se optimiza rendimiento con índices en esta tarea; si el volumen futuro lo requiere, se registrará deuda o una tarea separada.
- Las opciones de enum pueden necesitar un helper local mínimo para convertir `cases()` a `value => value`; no se introduce una abstracción global salvo necesidad repetida.

## Database Impact
Use `Not applicable` when the task does not affect the database.

- Change summary: Not applicable. Solo se añaden condiciones de consulta al listado existente.
- DB schema file from Source of Truth Map: `agents/db/schema.sql` sin cambios previstos.
- DB change log file from Source of Truth Map: `agents/db/changes.sql` sin cambios previstos.
- Affected structures/data: lectura de tabla `leads` y relación `responsable` con `users`.
- Forward migration approach: Not applicable.
- Rollback approach: retirar filtros/tests asociados del Resource si se revierte la tarea.
- Persisted data compatibility: compatible con datos existentes; debe tolerar nulos en campos opcionales.
- Operational risks: consultas con `LIKE` y filtros sobre columnas sin índice pueden degradar con grandes volúmenes; aceptado para esta fase inicial y mitigado por paginación.
- Validation plan: tests feature de filtros individuales y filtro combinado, más suite completa.
- Backup/recovery notes: Not applicable; no hay escritura ni migraciones.
- Required doc updates: no se prevén cambios en docs de DB. Actualizar docs solo si se decide un contrato durable nuevo para filtros o rendimiento.

## Open Questions
- ¿El filtro de texto debe buscar también en `mensaje` y `telefono`? Propuesta para implementar: sí, además de `nombre`, `email` y `empresa`, porque el backlog pide texto y esos campos ya existen.
- ¿El filtro de responsable debe incluir usuarios inactivos? Propuesta para implementar: sí, porque un lead histórico puede seguir asignado a un usuario inactivo.
- ¿Debe existir una opción explícita para “sin responsable”? Propuesta para TASK-009: no, el backlog pide responsable; “sin responsable” puede tratarse en una tarea posterior si hace falta.

## Source of Truth to Read
- `agents/docs/DoD.md`
- `agents/docs/testing.md`
- `agents/docs/decisions.md`
- `agents/db/domain.md`
- `agents/db/schema.sql`
- `agents/docs/design.md`
- `agents/task/archive/TASK-008-plan.md`
- `app/Filament/Resources/LeadResource.php`
- `app/Models/Lead.php`
- `app/Models/User.php`
- `app/Enums/LeadStatus.php`
- `app/Enums/TipoNecesidad.php`
- `database/factories/LeadFactory.php`
- Context7 docs: `/filamentphp/filament/v5.1.1`, table filters, `SelectFilter`, relationship filters, custom filter schemas and date pickers.

## Decision Records
- ADRs read from `agents/docs/decisions.md`:
  - ADR-000: Stack tecnológico PrawnForms. Confirma Laravel 13 + Filament 5 + PostgreSQL/Pest/Blade y Filament como panel privado.
- New decisions to record after user approval:
  - None expected. Los filtros y campos de búsqueda son comportamiento local del Resource salvo que el usuario quiera convertirlos en contrato durable.
