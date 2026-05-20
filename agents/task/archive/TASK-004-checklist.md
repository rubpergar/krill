# Lista de Verificación TASK-004

## Fuente
- Tarea: TASK-004
- Plan: `agents/task/TASK-004-plan.md`

## Reglas
- Trabaja en orden a menos que esté bloqueado.
- Mantén los elementos derivados del plan aprobado.
- TODAS las casillas deben comenzar con `[ ]` (sin marcar).

## Lista de Verificación

### 1. Contexto
- [x] Vuelve a leer el plan aprobado y los documentos fuente de verdad referenciados.
- [x] Carga y aplica `agents/skills/test-driven-development/SKILL.md`.
- [x] Verifica que ninguna pregunta abierta bloquee la implementación.

### 2. Registro TDD

#### 2.1 Esquema BD + Drizzle
- [x] Agregar tabla `incidents` a `apps/api/src/db/schema.ts`
- [x] Actualizar auto-creación en `apps/api/src/db/index.ts`

#### 2.2 Incident schema (Zod)
- [x] RED: Test para schema de creación de incidencia (indirecto vía route tests)
- [x] GREEN: Implementar `incidents.schema.ts`

#### 2.3 Incident repository
- [x] RED: Test para repositorio (indirecto vía route tests)
- [x] GREEN: Implementar `incidents.repository.ts`

#### 2.4 POST /api/v1/incidents
- [x] RED: Test POST con datos válidos → 201
- [x] RED: Test POST sin token → 401
- [x] RED: Test POST con title vacío → 400
- [x] RED: Test POST con title > 200 chars → 400
- [x] RED: Test POST sin description → 400
- [x] RED: Test POST con priority inválido → 400
- [x] RED: Test POST con priority válido → 201
- [x] RED: Test POST sin priority → 201 default medium
- [x] RED: Test POST incidencia tiene status 'open'
- [x] GREEN: Implementar `incidents.service.ts` + `incidents.routes.ts` + montar en v1

#### 2.5 Refactor
- [x] REFACTOR: Verificar que tests existentes siguen pasando

### 3. Alcance y Documentos
- [x] Todos los ciclos TDD completados.
- [x] Cambios dentro del alcance aprobado.
- [x] `agents/db/schema.sql` actualizado
- [x] `agents/db/changes.sql` actualizado
- [x] `agents/db/domain.md` actualizado
- [x] `agents/docs/api.md` actualizado

### 4. Controles de Cambios de Base de Datos
- [x] Archivo de esquema actualizado
- [x] Archivo de cambios actualizado
- [x] Compatibilidad de datos persistentes revisada (N/A)
- [x] Notas de respaldo/recuperación documentadas (N/A)

### 5. Validación (→ validado)
- [x] Suite de pruebas completa: `pnpm --filter @krill/api run test -- --run` → 41 passed, 6 files
- [x] Lint: `pnpm --filter @krill/api run lint` → passed
- [x] Typecheck: `pnpm --filter @krill/api run typecheck` → passed
- [x] Build: `pnpm --filter @krill/api run build` → passed
- [x] DoD verificado

### 6. Cierre (→ cerrado)
- [ ] Preguntar al usuario antes de marcar completada
- [ ] Archivar plan/checklist tras aprobación

## Estados Alcanzados
- [x] Implementado
- [x] Validado
- [ ] Cerrado

## Notas de Reanudación
...
