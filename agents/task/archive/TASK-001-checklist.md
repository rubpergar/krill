# Lista de Verificación de Tarea

## Fuente
- Tarea: TASK-001
- Plan: `agents/task/TASK-001-plan.md`

## Lista de Verificación

### 1. Contexto
- [x] Vuelve a leer el plan aprobado y los documentos fuente de verdad referenciados.
- [x] Carga y aplica `agents/skills/test-driven-development/SKILL.md`.
- [x] Verifica que ninguna pregunta abierta bloquee la implementación.

### 2. Registro TDD

- [x] RED: Escribir test de `POST /api/v1/auth/register` (registro exitoso)
- [x] RED: Escribir test de `POST /api/v1/auth/register` (email duplicado)
- [x] RED: Escribir test de `POST /api/v1/auth/register` (validación de input)
- [x] RED: Escribir test de `POST /api/v1/auth/login` (login exitoso)
- [x] RED: Escribir test de `POST /api/v1/auth/login` (credenciales inválidas)
- [x] RED: Escribir test de `GET /api/v1/auth/me` (token válido)
- [x] RED: Escribir test de `GET /api/v1/auth/me` (sin token / token inválido)
- [x] RED: Escribir test de `POST /api/v1/auth/refresh` (refresh exitoso)
- [x] RED: Escribir test de `POST /api/v1/auth/refresh` (token inválido/expirado)
- [x] RED: Escribir test de `POST /api/v1/auth/logout` (logout exitoso)
- [x] RED: Escribir test de middleware verifyAuth (inyecta user en contexto)
- [x] RED: Escribir test de integración de flujo completo (registro → login → me → refresh → logout)
- [x] GREEN: Implementar módulo auth hasta que todos los tests pasen
- [x] REFACTOR: Limpiar y asegurar que todos los tests siguen pasando

### 3. Alcance y Documentos
- [x] Todos los ciclos TDD completados o documentados como excepciones aprobadas.
- [x] Los cambios se mantuvieron dentro del alcance aprobado. Sin refactorizaciones no relacionadas.
- [x] Hallazgos fuera de alcance registrados en `agents/docs/debt.md`.
- [x] Verificación de sincronización: código vs documentos fuente de verdad coinciden.
- [x] Documentos duraderos actualizados.

### 4. Controles de Cambios de Base de Datos
- [x] Archivo `agents/db/schema.sql` actualizado con el estado del esquema.
- [x] Archivo `agents/db/changes.sql` actualizado con SQL de avance y notas de reversión.
- [x] `agents/db/domain.md` actualizado con entidad User y RefreshToken.
- [x] `agents/docs/api.md` actualizado con rutas de auth.

### 5. Validación (→ validado)
- [x] Pruebas específicas: `pnpm --filter @krill/api test -- modules/auth/`
- [x] Suite de pruebas completa: `pnpm test`
- [x] Lint: `pnpm lint` (API OK, web timeout no relacionado)
- [x] Verificación de tipos: `pnpm typecheck`
- [x] Criterios validados de DoD verificados.

### 6. Cierre (→ cerrado)
- [ ] Pregunta al usuario antes de marcar la tarea del backlog como completada.
- [ ] Mueve los archivos de tarea a `agents/task/archive/` después de la aprobación del usuario.

## Estados Alcanzados
- [x] Implementado (secciones 1-3 completas)
- [x] Validado (sección 5 completa)
- [ ] Cerrado (sección 6 completa + aprobación del usuario)

## Notas de Reanudación
- Todos los tests (15/15) pasan.
- Typecheck y lint API OK.
- El web lint timeout es un problema preexistente (no relacionado con la tarea).
- El middleware `auth.middleware.ts` se dejó como placeholder configurado pero no se usó directamente (la lógica JWT está en `auth.routes.ts`).
