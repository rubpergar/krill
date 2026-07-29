# Plantilla de Lista de Verificación de Tarea

Copia a `agents/task/TASK-XXX-checklist.md` una vez aprobado el plan de tarea. No implementes desde esta plantilla.

## Fuente
- Tarea: TASK-XXX
- Plan: `agents/task/TASK-XXX-plan.md`

## Reglas
- Trabaja en orden a menos que haya un bloqueo.
- Mantén los ítems derivados del plan aprobado.
- TODAS las casillas deben comenzar con `[ ]` (sin marcar). Nunca premarcar ítems al generar la lista de verificación.
- Marca los ítems completados solo durante la implementación y el cierre.

## Lista de Verificación

### 1. Contexto
- [ ] Vuelve a leer el plan aprobado y las fuentes de verdad referenciadas (no lo omitas aunque se hayan leído durante la planificación).
- [ ] Carga y aplica `agents/skills/test-driven-development/SKILL.md`, o registra por qué no aplica.
- [ ] Verifica que ninguna pregunta abierta bloquee la implementación.
- [ ] Establece el estado del plan a `in_progress` antes del primer cambio de implementación.

### 2. Registro TDD
Rastrea cada comportamiento/subtarea del plan a través de ciclos RED → GREEN → REFACTOR.

- [ ] Comportamiento/subtarea 1:
- [ ] Comportamiento/subtarea 2:
- [ ] ...

### 3. Alcance y Documentación
- [ ] Todos los ciclos TDD completados o documentados como excepciones aprobadas.
- [ ] Los cambios se mantuvieron dentro del alcance aprobado. Sin refactorizaciones no relacionadas.
- [ ] Hallazgos fuera de alcance registrados en `agents/docs/debt.md`.
- [ ] Verificación de sincronización: compara el código implementado con las fuentes de verdad afectadas del plan. Discrepancias → detente y pregunta al usuario. Resuelve antes de continuar.
- [ ] Documentación duradera actualizada (`agents/docs/api.md`, archivos de BD del Mapa de Fuentes de Verdad, `agents/docs/design.md`, etc.) según sea necesario.

### 4. Controles de Cambios en Base de Datos
Usa `No aplica` cuando la tarea no afecte la base de datos.

- [ ] Archivo de esquema de BD del Mapa de Fuentes de Verdad actualizado al estado de esquema resultante.
- [ ] Archivo de registro de cambios de BD del Mapa de Fuentes de Verdad actualizado con SQL forward y notas de rollback.
- [ ] Compatibilidad con datos persistidos revisada, incluyendo manejo de backfill/valores por defecto/null.
- [ ] Expectativa de respaldo o recuperación documentada para cambios destructivos o riesgosos.
- [ ] Consultas o pasos de validación pre-check y post-check registrados cuando sea necesario.

### 5. Validación (aún `in_progress`)
- [ ] Pruebas específicas:
- [ ] Suite completa de pruebas:
- [ ] Lint:
- [ ] Typecheck:
- [ ] Build:
- [ ] Criterios de DoD `in_progress` verificados:

### 6. Cierre (→ `closed`)
- [ ] Pregunta al usuario antes de marcar la tarea del backlog como completada.
- [ ] Actualiza el estado del plan a `closed` antes de archivar los archivos de la tarea.
- [ ] Mueve los archivos de la tarea a `agents/task/archive/` después de que el usuario lo apruebe.

## Notas de Reanudación
...
