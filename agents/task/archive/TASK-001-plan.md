# TASK-001 Plan — Bootstrap del proyecto PrawnForms

## Status
`implemented | validated`

## Task
- ID: TASK-001
- Title: Inicializar Laravel + Filament + PostgreSQL + Pest y configurar Krill para PrawnForms. Transicionar a project mode.
- Backlog source: `agents/task/backlog.md`

## Summary
El repositorio está en modo `skeleton` sin código de producto. Se inicializará el scaffold técnico (Laravel 11 con Filament 3, PostgreSQL, Pest) y se configurarán los archivos fuente de verdad de Krill para el proyecto PrawnForms (S5). Al finalizar, se transicionará a `project mode`.

## Scope
**In:**
1. Inicializar Laravel 11 (`composer create-project laravel/laravel .`)
2. Configurar `.env` con conexión a PostgreSQL (`prawn_db`, credenciales estándar)
3. Instalar Filament 3 (`composer require filament/filament`, `php artisan filament:install --panels` con panel único `/admin`)
4. Instalar Pest (`composer require pestphp/pest --dev`, `php artisan pest:install`)
5. Configurar `AGENTS.md`:
   - `## Project` con identidad PrawnForms
   - `## Stack` (PHP 8.3, Laravel 11, Composer, PostgreSQL, Pest, Resend)
   - `## Commands` con comandos del proyecto
   - `## Project Structure` con rutas principales
6. Configurar `agents/docs/testing.md` con comandos y estructura de tests
7. Registrar ADR-000 en `agents/docs/decisions.md`
8. Transicionar a `project mode`:
   - Cambiar `Current mode: skeleton` → `Current mode: project` en AGENTS.md
   - Archivar `agents/docs/bootstrap.md` → `agents/task/archive/bootstrap-2026-05-21.md`

**Out (explicitly excluded):**
- Cualquier código de producto (formularios, modelos, controladores, migraciones de dominio, vistas)
- Configuración de producción o despliegue
- Migraciones de base de datos del dominio (se harán en TASK-002)
- Usuarios o datos semilla

## Current Behavior
- Modo `skeleton`
- Sin código de producto
- `AGENTS.md` con campos Project y Stack vacíos
- `agents/docs/testing.md` con comandos sin configurar
- `agents/docs/decisions.md` vacío

## Target Behavior
- Scaffold Laravel 11 funcional, Filament 3 instalado, PostgreSQL configurado, Pest listo
- `AGENTS.md` completo con identidad y stack de PrawnForms
- `agents/docs/testing.md` con comandos funcionales
- ADR-000 registrado
- Modo `project` activo, bootstrap archivado

## Acceptance Criteria
1. `php artisan --version` muestra Laravel 11
2. `php artisan filament:install` completado sin errores
3. `php artisan test` ejecuta el test de ejemplo de Pest y pasa
4. `.env` contiene `DB_CONNECTION=pgsql`, `DB_DATABASE=prawn_db`
5. `AGENTS.md` refleja PrawnForms con stack completo
6. `agents/docs/bootstrap.md` está archivado en `agents/task/archive/`
7. `agents/docs/decisions.md` contiene ADR-000

## Edge Cases
- **PHP/Composer no instalados:** se verifica previamente; si falta, se notifica y se detiene
- **PostgreSQL no accesible:** se configura SQLite como fallback para tests; el `.env` de desarrollo apunta a PostgreSQL
- **Filament publish:** responder valores por defecto (panel único, ruta `/admin`)

## Assumptions / Risks
- PHP 8.3+ y Composer están disponibles
- PostgreSQL está instalado o accesible en el entorno
- Node.js y NPM están disponibles (Laravel los necesita para Vite/asset bundling)
- **Riesgo bajo:** proceso estándar y documentado
- **Riesgo medio:** si PostgreSQL no corre, se usa SQLite para tests

## Database Impact
- Change summary: No se crean tablas de dominio. Solo migraciones del framework (users, password_resets, personal_access_tokens, sessions de Filament).
- DB schema file from Source of Truth Map: `agents/db/schema.sql` — no se actualiza (se hará en TASK-002)
- DB change log file from Source of Truth Map: `agents/db/changes.sql` — no se actualiza
- Affected structures/data: Ninguna
- Forward migration approach: `php artisan migrate`
- Rollback approach: `php artisan migrate:rollback`
- Persisted data compatibility: No aplica (sin datos)
- Operational risks: Ninguno
- Validation plan: `php artisan migrate:fresh` funciona sin errores
- Backup/recovery notes: No aplica
- Required doc updates: Ninguno

## Open Questions
Ninguna — resueltas con el usuario:
- Nombre app: PrawnForms
- BD: `prawn_db`
- Credenciales: estándar
- Filament: panel único en `/admin`

## Source of Truth to Read
- `agents/docs/bootstrap.md` (Path B)
- `agents/docs/DoD.md`
- `agents/docs/testing.md`

## Decision Records
- ADRs read from `agents/docs/decisions.md`: Ninguno
- New decisions to record after user approval: ADR-000 (Stack tecnológico PrawnForms)
