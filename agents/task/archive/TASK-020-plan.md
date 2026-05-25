# TASK-020 Plan — Resource Usuarios Filament

## Status
`validated`

## Task
- ID: TASK-020
- Title: Resource Usuarios Filament (CRUD, roles, activar/desactivar)
- Backlog source: `agents/task/backlog.md`

## Summary
Crear un Resource de Filament para gestionar usuarios internos desde el panel admin. Permitirá listar, crear, ver y editar usuarios, cambiar rol y activar/desactivar acceso sin tocar la base de datos ni perder trazabilidad de leads, notas o eventos.

## Scope
**In:**
- Crear `UserResource` en Filament para el modelo `User`.
- Listado paginado de usuarios con columnas básicas: nombre, email, rol, activo, fecha de creación.
- Formulario de creación y edición con `name`, `email`, `password`, `rol` y `activo`.
- `password` obligatorio al crear y opcional al editar.
- Roles permitidos usando los valores actuales del dominio: `admin` y `usuario`.
- Acción rápida para activar/desactivar usuarios desde listado o edición.
- Restricción de acceso al Resource para usuarios con `rol = admin` y `activo = true`.
- Mantener la regla actual de acceso al panel: usuarios inactivos no entran al panel.

**Out (explicitly excluded):**
- Borrado físico de usuarios, salvo que el usuario lo apruebe explícitamente después.
- Nueva tabla de roles/permisos.
- Dependencias de permisos como Spatie o Filament Shield.
- Recuperación de contraseña, invitaciones por email o verificación de email.
- Auditoría específica de cambios de usuarios.
- Cambios de esquema de base de datos.

## Current Behavior
- `User` ya tiene campos `rol` y `activo`.
- `User::canAccessPanel()` permite entrar al panel admin solo si `activo = true`; no diferencia por rol.
- No existe Resource de Filament para gestionar usuarios.
- Los responsables de leads se eligen desde usuarios activos.
- El borrado físico de usuarios puede afectar datos relacionados: `leads.responsable_id` queda en null, `eventos_auditoria.usuario_id` queda en null y `notas_internas.usuario_id` se eliminaría en cascada.

## Target Behavior
- Un usuario administrador activo puede gestionar usuarios internos desde `/admin/users`.
- Un usuario activo con rol `usuario` puede seguir accediendo al panel y a las funcionalidades existentes, pero no puede acceder al Resource de usuarios.
- Usuarios inactivos siguen sin poder acceder al panel.
- La desactivación se usa como baja operativa segura, preservando relaciones y trazabilidad.
- No se permite que un administrador se desactive a sí mismo desde una acción rápida si eso le bloquearía el acceso inmediatamente.

## Acceptance Criteria
- Invitados redirigen a `/admin/login` al intentar acceder a `/admin/users`.
- Usuarios inactivos reciben 403 al intentar acceder a `/admin/users`.
- Usuarios activos con rol `usuario` reciben 403 al intentar acceder a `/admin/users`.
- Usuarios activos con rol `admin` pueden listar usuarios.
- El listado muestra nombre, email, rol, estado activo/inactivo y fecha de creación.
- Un admin puede crear un usuario con contraseña hasheada, rol válido y estado activo/inactivo.
- Un admin puede editar nombre, email, rol y activo.
- Editar un usuario sin enviar nueva contraseña mantiene la contraseña actual.
- Un admin puede activar/desactivar otro usuario desde una acción rápida.
- No existe acción de borrado físico en esta tarea.
- No hay cambios de base de datos.

## Edge Cases
- Email duplicado al crear o editar usuario.
- Contraseña vacía en edición.
- Rol inválido enviado manualmente.
- Intento de acceso al Resource por usuario no admin.
- Intento de desactivarse a sí mismo.
- Usuario relacionado con leads, notas o eventos.

## Assumptions / Risks
- `rol` seguirá siendo string con valores `admin` y `usuario`; no se añade enum ni dependencia de permisos.
- La baja segura será `activo = false`, no delete físico.
- Si se requiere borrado físico real más adelante, debe planificarse con política de conservación de notas y auditoría.
- La autorización se implementará de forma explícita y cubierta por tests porque afecta seguridad.

## Database Impact
Use `Not applicable` when the task does not affect the database.

- Change summary: Not applicable. Se usan columnas existentes `rol` y `activo`.
- DB schema file from Source of Truth Map: `agents/db/schema.sql` sin cambios esperados.
- DB change log file from Source of Truth Map: `agents/db/changes.sql` sin cambios esperados.
- Affected structures/data: tabla `users` existente; datos actualizados mediante CRUD.
- Forward migration approach: N/A.
- Rollback approach: N/A.
- Persisted data compatibility: compatible; no se cambia estructura ni significado de datos.
- Operational risks: desactivar al usuario equivocado puede bloquear acceso; mitigación con guard para auto-desactivación y tests.
- Validation plan: tests feature para acceso, listado, creación, edición y activación/desactivación.
- Backup/recovery notes: no aplica para schema; cambios de usuarios son datos operativos reversibles reactivando usuarios.
- Required doc updates: no esperadas salvo que se cambie la regla durable de roles.

## Open Questions
- Ninguna bloqueante para el alcance recomendado. El borrado físico queda excluido por seguridad.

## Source of Truth to Read
- `agents/docs/DoD.md`
- `agents/docs/testing.md`
- `agents/docs/decisions.md`
- `agents/db/schema.sql`
- `agents/db/domain.md`
- `app/Models/User.php`
- `app/Providers/Filament/AdminPanelProvider.php`
- `app/Filament/Resources/LeadResource.php`
- `database/migrations/0001_01_01_000000_create_users_table.php`
- `database/migrations/2026_05_21_110657_add_rol_and_activo_to_users_table.php`

## Decision Records
- ADRs read from `agents/docs/decisions.md`: ADR-000 Stack tecnológico PrawnForms.
- New decisions to record after user approval: Ninguna por ahora; usar `activo` como baja operativa ya está en el dominio.
