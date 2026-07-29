---
description: Generar checklist e iniciar la implementación TDD para la tarea activa
---

Genera `agents/task/TASK-XXX-checklist.md` para la tarea activa y comienza la implementación siguiendo el flujo de trabajo SDD/TDD.

Reglas:
- Lee `agents/task/backlog.md` e identifica la tarea única bajo `## Current`.
- Si `## Current` tiene cero o múltiples tareas, detente y pide al usuario que seleccione o cree una.
- Extrae el ID de tarea (TASK-XXX) de la entrada del backlog.
- Verifica que `agents/task/TASK-XXX-plan.md` exista. Si no existe, detente y sugiere ejecutar `/plan` primero.
- Lee el estado del plan antes de hacer cualquier cambio. Si es `draft`, detente y pide al usuario que revise el plan y cambie `## Status` a `approved` manualmente cuando esté listo. Nunca apruebes un borrador implícitamente a través de `/implement`.
- Si el estado del plan no es `approved`, detente e informa que la implementación solo puede comenzar desde un plan `approved`.
- Lee `agents/task/checklist.md` para la estructura de la plantilla de checklist.
- Deriva los elementos del checklist solo del plan aprobado. No añadas elementos que no estén cubiertos por el plan.
- TODOS los elementos del checklist deben comenzar con `[ ]` (sin marcar). Nunca premalgues elementos al generarlos.
- Si la tarea afecta la base de datos, incluye elementos del checklist para actualizaciones del esquema de BD, actualizaciones del registro de cambios de BD, verificaciones de backup/recuperación y validación de migraciones.
- Lee y aplica `agents/skills/test-driven-development/SKILL.md` una vez al inicio de la implementación.
- Sigue el ciclo RED → GREEN → REFACTOR de la skill de TDD durante la implementación.
- Después de cada paso GREEN, ejecuta el control de calidad ligero de `AGENTS.md`: prefiere el diseño más simple que pase, evita abstracciones prematuras y cuestiona el código de producción que existe solo para soportar tests.
- Lee `agents/docs/testing.md` para los comandos de test, lint, typecheck y build específicos del proyecto.
- Marca los elementos del checklist a medida que se completan durante la implementación.
- No cambies archivos fuera del alcance aprobado.
- Registra los hallazgos fuera del alcance en `agents/docs/debt.md` en lugar de modificarlos.
- Si el trabajo test-first no es factible para un elemento específico, detente y documenta por qué a menos que la excepción ya esté en el plan aprobado.
- Después de la implementación y validación, ejecuta una revisión final independiente limitada al plan aprobado, checklist y cambios de la tarea. Prefiere un subagente separado o un contexto de revisión nuevo cuando esté disponible.
- Sigue `AGENTS.md` para el flujo de trabajo de implementación canónico, el control de calidad de TDD y la política de revisión final independiente.

Flujo:
1. Lee `agents/task/backlog.md` y confirma exactamente una tarea bajo `## Current`.
2. Verifica que `agents/task/TASK-XXX-plan.md` exista. Si no, detente.
3. Verifica que el estado del plan sea `approved`; de lo contrario, detente antes de editar cualquier cosa.
4. Establece el estado del plan a `in_progress` antes de que comience la implementación.
5. Lee el plan aprobado y `agents/task/checklist.md`.
6. Genera o actualiza `agents/task/TASK-XXX-checklist.md` con elementos derivados del plan.
7. Lee y aplica `agents/skills/test-driven-development/SKILL.md` y `agents/docs/testing.md`.
8. Implementa siguiendo el orden del checklist y el flujo de trabajo canónico de `AGENTS.md`.
9. Marca los elementos completados en el checklist a medida que avanzas.
10. Cuando la implementación esté completa, ejecuta los comandos de validación de `agents/docs/testing.md`.
11. Ejecuta la revisión final independiente requerida por `AGENTS.md`. Si se encuentran problemas, corrígelos antes de terminar `/implement`.
12. Deja el plan en `in_progress` hasta que `/closeout` termine.
13. Reporta el estado final: progreso del checklist, resultados de validación, resultado de la revisión y cualquier elemento abierto o deuda registrada.
