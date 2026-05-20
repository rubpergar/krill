# Plantilla de Lista de Verificación de Tarea

Copia a `agents/task/TASK-XXX-checklist.md` después de que el plan de tarea sea aprobado. No implementes desde esta plantilla.

## Fuente
- Tarea: TASK-XXX
- Plan: `agents/task/TASK-XXX-plan.md`

## Reglas
- Trabaja en orden a menos que esté bloqueado.
- Mantén los elementos derivados del plan aprobado.
- **TODAS las casillas deben comenzar con `[ ]` (sin marcar). Nunca premarcar elementos al generar la lista de verificación.**
- Marca los elementos completados solo durante la implementación.

## Lista de Verificación

### 1. Contexto
- [ ] Vuelve a leer el plan aprobado y los documentos fuente de verdad referenciados (no lo saltes incluso si los leíste durante la planificación).
- [ ] Carga y aplica `agents/skills/test-driven-development/SKILL.md`, o registra por qué no aplica.
- [ ] Verifica que ninguna pregunta abierta bloquee la implementación.

### 2. Registro TDD
Rastrea cada comportamiento/subtarea del plan a través de los ciclos RED → GREEN → REFACTOR.

- [ ] Comportamiento/subtarea 1:
- [ ] Comportamiento/subtarea 2:
- [ ] ...

### 3. Alcance y Documentos
- [ ] Todos los ciclos TDD completados o documentados como excepciones aprobadas.
- [ ] Los cambios se mantuvieron dentro del alcance aprobado. Sin refactorizaciones no relacionadas.
- [ ] Hallazgos fuera de alcance registrados en `agents/docs/debt.md`.
- [ ] Verificación de sincronización: compara el código implementado contra los documentos fuente de verdad afectados del plan. Discrepancias → detente y pregunta al usuario. Resuelve antes de continuar.
- [ ] Documentos duraderos actualizados (`agents/docs/api.md`, archivos de BD del Mapa de Fuente de Verdad, `agents/docs/design.md`, etc.) según sea necesario.

### 4. Controles de Cambios de Base de Datos
Usa `No aplica` cuando la tarea no afecte la base de datos.

- [ ] Archivo de esquema de BD del Mapa de Fuente de Verdad actualizado al estado de esquema resultante.
- [ ] Archivo de registro de cambios de BD del Mapa de Fuente de Verdad actualizado con SQL de avance y notas de reversión.
- [ ] Compatibilidad de datos persistentes revisada, incluyendo manejo de backfill/valores por defecto/nulos.
- [ ] Expectativa de respaldo o recuperación documentada para cambios destructivos o riesgosos.
- [ ] Consultas o pasos de validación previa y posterior registrados cuando sea necesario.

### 5. Validación (→ validado)
- [ ] Pruebas específicas:
- [ ] Suite de pruebas completa:
- [ ] Lint:
- [ ] Verificación de tipos:
- [ ] Compilación:
- [ ] Criterios validados de DoD verificados:

### 6. Cierre (→ cerrado)
- [ ] Pregunta al usuario antes de marcar la tarea del backlog como completada.
- [ ] Mueve los archivos de tarea a `agents/task/archive/` después de la aprobación del usuario.

## Estados Alcanzados
- [ ] Implementado (secciones 1-3 completas)
- [ ] Validado (sección 5 completa)
- [ ] Cerrado (sección 6 completa + aprobación del usuario)

## Notas de Reanudación
...
