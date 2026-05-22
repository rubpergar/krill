# Task Plan

## Status
`validated`

## Task
- ID: TASK-007
- Title: Autenticación Filament (login, logout, protección de rutas)
- Backlog source: `agents/task/backlog.md`

## Summary
Cerrar el acceso privado al panel Filament en `/admin` usando la autenticación integrada de Filament y una autorización explícita en el modelo `User`. El panel ya tiene `->login()` y `authMiddleware([Authenticate::class])`; esta tarea debe verificar el flujo completo, asegurar que solo usuarios internos activos accedan y cubrir login/logout/protección de rutas con tests.

## Scope
**In:**
- Verificar que `/admin` redirige a login cuando no hay sesión.
- Verificar que `/admin/login` está disponible para usuarios no autenticados.
- Implementar autorización de panel en `App\Models\User` con el contrato de Filament (`FilamentUser`) y `canAccessPanel(Panel $panel)`.
- Permitir acceso al panel `admin` solo a usuarios activos (`activo = true`).
- Mantener usuarios con rol `admin` y `usuario` como usuarios internos válidos para esta tarea; permisos finos quedan fuera.
- Verificar login correcto de usuario activo y bloqueo de usuario inactivo.
- Verificar logout del panel o, como mínimo, que una sesión autenticada puede cerrarse mediante el flujo Filament disponible.
- Añadir tests feature del flujo de autenticación/protección del panel.

**Out (explicitly excluded):**
- CRUD de usuarios Filament (TASK-020).
- Permisos por recurso, acciones o políticas específicas.
- Gestión avanzada de roles más allá de `activo`.
- Registro público de usuarios.
- Recuperación de contraseña, verificación de email o edición de perfil.
- Cambios de esquema en `users`.
- Cambios visuales en el login de Filament.

## Current Behavior
El panel Filament está configurado en `/admin` con `->login()` y `authMiddleware([Authenticate::class])`. El modelo `User` tiene `rol` y `activo`, pero todavía no implementa la autorización específica de Filament (`FilamentUser::canAccessPanel`). Por tanto, falta dejar explícito qué usuarios pueden acceder al panel y cubrir el flujo con tests.

## Target Behavior
El panel privado funciona así:

- Visitante no autenticado que accede a `/admin` es redirigido al login de Filament.
- `/admin/login` muestra el formulario de login.
- Usuario autenticado y activo puede acceder al dashboard del panel.
- Usuario inactivo no puede acceder al panel aunque sus credenciales sean válidas.
- Logout termina la sesión del panel y vuelve a exigir autenticación para `/admin`.

La autorización se debe ubicar en `User::canAccessPanel(Panel $panel)` para alinearse con la documentación Filament 5.1.1: implementar `Filament\Models\Contracts\FilamentUser` y decidir acceso por panel.

## Acceptance Criteria
- `App\Models\User` implementa `FilamentUser`.
- `canAccessPanel()` permite acceso al panel `admin` solo si `activo` es true.
- Usuarios inactivos no pueden acceder a `/admin`.
- Usuarios activos pueden autenticarse y acceder a `/admin`.
- Visitantes no autenticados son redirigidos desde `/admin` al login de Filament.
- El login de Filament existe y responde correctamente.
- El logout del panel deja de permitir acceso autenticado sin nueva sesión.
- Tests feature cubren visitante, usuario activo, usuario inactivo y logout/protección post-logout.
- No se añaden dependencias nuevas.

## Edge Cases
- Usuario autenticado pero `activo = false` intenta abrir `/admin`.
- Usuario con rol `usuario` activo accede al panel: permitido por ahora como usuario interno.
- Panel ID distinto de `admin` en el futuro: no debe bloquear paneles hipotéticos por accidente.
- Tests deben usar usuarios con password hasheado o factory compatible con Laravel.
- La ruta exacta de logout puede variar por Filament; si no es estable para tests, validar cierre de sesión mediante el mecanismo soportado por Laravel/Filament sin acoplarse a HTML frágil.

## Assumptions / Risks
- Filament 5.1.1 recomienda controlar acceso implementando `FilamentUser` y `canAccessPanel(Panel $panel)`.
- `->login()` y `authMiddleware([Authenticate::class])` ya están configurados en `AdminPanelProvider`; no se prevén cambios amplios en provider.
- Se asume que `activo` es la regla mínima de acceso en esta tarea. Permisos por `rol` se tratarán en tareas posteriores.
- Bloquear por `rol = admin` ahora sería demasiado restrictivo para el objetivo “usuarios internos, administradores” y adelantaría diseño de permisos.
- Puede haber diferencias internas de rutas Filament para logout; los tests deben preferir comportamiento observable sobre selectores o URLs internas frágiles.

## Database Impact
`Not applicable` — la tarea usa columnas existentes (`rol`, `activo`) y no requiere migraciones.

- Change summary: Sin cambios de esquema.
- DB schema file from Source of Truth Map: `agents/db/schema.sql`
- DB change log file from Source of Truth Map: `agents/db/changes.sql`
- Affected structures/data: tabla `users`, solo lectura de `activo` y `rol` existentes.
- Forward migration approach: No aplica.
- Rollback approach: No aplica a esquema; revertir autorización en `User` si fuera necesario.
- Persisted data compatibility: Compatible con usuarios existentes; usuarios inactivos quedarán bloqueados como espera el dominio.
- Operational risks: Si hay usuarios internos con `activo = false` por error, perderán acceso al panel.
- Validation plan: Tests feature con usuarios activos/inactivos y rutas `/admin`/login/logout.
- Backup/recovery notes: No se requieren acciones específicas.
- Required doc updates: `agents/db/domain.md` solo si cambia la regla durable de acceso; no se espera cambio porque ya documenta `activo` como desactivación de acceso.

## Open Questions
- Ninguna bloqueante. Recomendación asumida: permitir cualquier usuario interno activo (`admin` o `usuario`) y posponer permisos por rol a tareas posteriores.

## Source of Truth to Read
- `agents/docs/testing.md`
- `agents/docs/DoD.md`
- `agents/db/domain.md`
- `app/Models/User.php`
- `app/Providers/Filament/AdminPanelProvider.php`
- `database/factories/UserFactory.php`
- `database/seeders/DatabaseSeeder.php`
- Filament 5.1.1 docs: panel auth `->login()`, `authMiddleware()`, `FilamentUser::canAccessPanel()`.

## Decision Records
- ADRs read from `agents/docs/decisions.md`: `ADR-000: Stack tecnológico PrawnForms`
- New decisions to record after user approval: Ninguna por ahora; la regla `activo = true` para acceso al panel ya encaja con el dominio existente.
