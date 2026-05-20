---
description: Generate checklist and start TDD implementation for the active task
---

Genera `agents/task/TASK-XXX-checklist.md` para la tarea activa y comienza la implementación siguiendo el flujo SDD/TDD.

Rules:
- Lee `agents/task/backlog.md` e identifica la única tarea bajo `## Current`.
- Si `## Current` tiene cero o múltiples tareas, detente y pide al usuario que seleccione o cree una.
- Extrae el ID de la tarea (TASK-XXX) de la entrada del backlog.
- Verifica que `agents/task/TASK-XXX-plan.md` exista. Si no, detente y sugiere ejecutar `/plan` primero.
- Establece el estado del plan como `approved` en `agents/task/TASK-XXX-plan.md` (usar este comando implica que el plan está listo).
- Lee `agents/task/checklist.md` para la estructura de plantilla de la checklist.
- Deriva los elementos de la checklist únicamente del plan aprobado. No agregues elementos que no estén cubiertos por el plan.
- **TODOS los elementos de la checklist deben comenzar con `[ ]` (sin marcar). Nunca marques elementos previamente al generarlos.**
- Si la tarea afecta la base de datos, incluye elementos de checklist para actualizaciones de esquema de BD, actualizaciones del registro de cambios de BD, verificaciones de backup/recuperación y validación de migración.
- Lee y aplica `agents/skills/test-driven-development/SKILL.md` una vez al inicio de la implementación y sigue el ciclo RED → GREEN → REFACTOR.
- Lee `agents/docs/testing.md` para comandos específicos del proyecto de test, lint, typecheck y build.
- Marca los elementos de la checklist a medida que se completan durante la implementación.
- No cambies archivos fuera del alcance aprobado.
- Registra los hallazgos fuera de alcance en `agents/docs/debt.md` en lugar de modificarlos.
- Si el trabajo test-first no es factible para un elemento específico, detente y documenta por qué a menos que la excepción ya esté en el plan aprobado.

Flow:
1. Lee `agents/task/backlog.md` y confirma exactamente una tarea bajo `## Current`.
2. Verifica que `agents/task/TASK-XXX-plan.md` exista. Si no, detente.
3. Establece el estado del plan como `approved`.
4. Lee el plan aprobado y `agents/task/checklist.md`.
5. Genera `agents/task/TASK-XXX-checklist.md` con elementos derivados del plan.
6. Lee y aplica `agents/skills/test-driven-development/SKILL.md`.
7. Lee `agents/docs/testing.md` para comandos de validación.
8. Implementa siguiendo el orden de la checklist y los ciclos TDD.
9. Marca los elementos completados en la checklist a medida que avanzas.
10. Cuando la implementación esté completa, ejecuta los comandos de validación desde `agents/docs/testing.md`.
11. Reporta el estado final: progreso de la checklist, resultados de validación y cualquier elemento pendiente o deuda registrada.
