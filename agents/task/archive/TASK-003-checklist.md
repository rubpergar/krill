# Lista de Verificación TASK-003

## Fuente
- Tarea: TASK-003
- Plan: `agents/task/TASK-003-plan.md`

## Reglas
- Trabaja en orden a menos que esté bloqueado.
- Mantén los elementos derivados del plan aprobado.
- TODAS las casillas deben comenzar con `[ ]` (sin marcar).

## Lista de Verificación

### 1. Contexto
- [x] Vuelve a leer el plan aprobado y los documentos fuente de verdad referenciados.
- [x] Carga y aplica `agents/skills/test-driven-development/SKILL.md`, o registra por qué no aplica.
- [x] Verifica que ninguna pregunta abierta bloquee la implementación.

### 2. Registro TDD

#### 2.1 api-response helpers (unitario, puro)
- [x] RED: Test `success` helper returns `{ data }` with default 200
- [x] RED: Test `success` helper returns `{ data }` with custom status
- [x] RED: Test `error` helper returns `{ error }` with default 400
- [x] RED: Test `error` helper returns `{ error }` with custom status
- [x] RED: Test `paginated` helper returns `{ data, pagination }`
- [x] GREEN: Implement `api-response.ts`
- [x] REFACTOR: Verify clean exports

#### 2.2 GET /api/v1/health
- [x] RED: Test health endpoint returns 200 with status 'ok' and timestamp
- [x] RED: Test health endpoint has valid ISO timestamp
- [x] GREEN: Implement health route + v1 router + refactor app.ts

#### 2.3 Refactor auth routes
- [x] RED (regression): Verify existing auth tests pass before changes
- [x] REFACTOR: Migrate auth routes to OpenAPIHono + zValidator for /refresh + /logout + use response helpers
- [x] GREEN: Verify auth tests still pass

#### 2.4 Refactor admin routes
- [x] RED (regression): Verify existing admin tests pass before changes
- [x] REFACTOR: Migrate admin routes to OpenAPIHono + use response helpers
- [x] GREEN: Verify admin tests still pass

### 3. Alcance y Documentos
- [x] Todos los ciclos TDD completados o documentados como excepciones aprobadas.
- [x] Los cambios se mantuvieron dentro del alcance aprobado. Sin refactorizaciones no relacionadas.
- [x] Hallazgos fuera de alcance registrados en `agents/docs/debt.md`.
- [x] Verificación de sincronización: código vs api.md.
- [x] `agents/docs/api.md` actualizado con health endpoint y estructura.

### 4. Controles de Cambios de Base de Datos
No aplica — esta tarea no afecta la base de datos.

### 5. Validación (→ validado)
- [x] Pruebas específicas: `pnpm --filter @krill/api run test -- --run src/shared/api-response.test.ts` → 5 passed
- [x] Suite de pruebas completa: `pnpm --filter @krill/api run test -- --run` → 31 passed, 5 files
- [x] Lint: `pnpm --filter @krill/api run lint` → passed
- [x] Verificación de tipos: `pnpm --filter @krill/api run typecheck` → passed
- [x] Compilación: `pnpm --filter @krill/api run build` → passed
- [x] Criterios validados de DoD verificados.

### 6. Cierre (→ cerrado)
- [ ] Pregunta al usuario antes de marcar la tarea del backlog como completada.
- [ ] Mueve los archivos de tarea a `agents/task/archive/` después de la aprobación del usuario.

## Estados Alcanzados
- [x] Implementado (secciones 1-3 completas)
- [x] Validado (sección 5 completa)
- [ ] Cerrado (sección 6 completa + aprobación del usuario)

## Notas de Reanudación
...
