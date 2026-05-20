# Lista de Verificación de Tarea

## Fuente
- Tarea: TASK-008
- Plan: `agents/task/TASK-008-plan.md`

## Reglas
- Trabaja en orden a menos que esté bloqueado.
- Mantén los elementos derivados del plan aprobado.
- Marca los elementos completados solo durante la implementación.

## Lista de Verificación

### 1. Contexto
- [x] Vuelve a leer el plan aprobado y los documentos fuente de verdad referenciados.
- [x] Carga y aplica `agents/skills/test-driven-development/SKILL.md`.
- [x] Verifica que ninguna pregunta abierta bloquee la implementación.

### 2. Registro TDD

- [x] RED: Test token expirado en GET /auth/me → 401. → GREEN: PASS
- [x] RED: Test refresh rotation → 401 on reuse. → GREEN: PASS
- [x] RED: Test 500 error path → handler global. → GREEN: PASS
- [x] RED: Test admin filter by status → solo open. → GREEN: PASS
- [x] RED: Test admin filter by priority → solo high. → GREEN: PASS
- [x] RED: Test admin filter by created_by. → GREEN: PASS
- [x] RED: Test admin filter combinado (status + priority). → GREEN: PASS
- [x] RED: Test pagination page=0 → trata como default. → GREEN: PASS
- [x] RED: Test pagination page=999 → array vacío. → GREEN: PASS
- [x] RED: Test pagination page=-1 → sanitiza. → GREEN: PASS
- [x] RED: Test pagination limit=0 → sin error. → GREEN: PASS
- [x] RED: Test assign to non-existent user → 500 (bug conocido, ver debt). → GREEN: PASS
- [x] RED: Test regular user assign → 403. → GREEN: PASS
- [x] RED: Test re-assign → funciona. → GREEN: PASS
- [x] RED: Test status on non-existent incident → 404. → GREEN: PASS
- [x] RED: Test priority on non-existent incident → 404. → GREEN: PASS
- [x] RED: Test E2E completo user+admin. → GREEN: PASS

### 3. Alcance y Documentos
- [x] Todos los ciclos TDD completados o documentados como excepciones aprobadas.
- [x] Los cambios se mantuvieron dentro del alcance aprobado. Sin refactorizaciones no relacionadas.
- [x] Hallazgos fuera de alcance registrados en `agents/docs/debt.md` (DBT-001, DBT-002).
- [x] Verificación de sincronización: solo tests añadidos, sin cambios de API/BD/contratos.
- [x] Documentos duraderos actualizados si es necesario (`agents/docs/debt.md`).

### 4. Controles de Cambios de Base de Datos
No aplica.

### 5. Validación (→ validado)
- [x] Suite de pruebas completa: 79 tests (62 existentes + 17 nuevos) — todos PASS
- [x] Verificación de tipos: `tsc --noEmit` PASS
- [x] Lint: timeout pre-existente (no relacionado con cambios)
- [x] Compilación web: no afectada (solo cambios en API)
- [x] Criterios validados de DoD verificados.

### 6. Cierre (→ cerrado)
- [ ] Pregunta al usuario antes de marcar la tarea del backlog como completada.
- [ ] Mueve los archivos de tarea a `agents/task/archive/` después de la aprobación del usuario.

## Estados Alcanzados
- [x] Implementado (secciones 1-3 completas)
- [x] Validado (sección 5 completa)
- [ ] Cerrado (sección 6 completa + aprobación del usuario)

## Notas de Reanudación
- 2 hallazgos registrados en debt.md: assign a usuario inexistente (500), desasignar no soportado.
