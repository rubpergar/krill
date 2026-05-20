---
description: Generate the task plan file from the current conversation context
---

Genera `agents/task/TASK-XXX-plan.md` para la tarea activa usando la discusión de planificación ya desarrollada en la conversación.

Rules:
- Lee `agents/task/backlog.md` e identifica la única tarea bajo `## Current`.
- Si `## Current` tiene cero o múltiples tareas, detente y pide al usuario que seleccione o cree una.
- Extrae el ID de la tarea (TASK-XXX) de la entrada del backlog.
- Lee `agents/task/plan.md` para entender la estructura requerida del plan.
- Lee los ADRs aceptados relevantes de `agents/docs/decisions.md` antes de finalizar las decisiones de implementación.
- Usa el contexto de la conversación (discusión de planificación, salida de `/prompt-run`, aclaraciones del usuario) para llenar cada sección de la plantilla del plan.
- No inventes requisitos, APIs, estructuras de BD o hechos técnicos que no fueron discutidos o confirmados.
- Si falta información crítica en la conversación, listala bajo `## Open Questions` en lugar de adivinar.
- Establece `## Status` como `draft` para que el usuario pueda revisar y aprobar antes de la implementación.
- Si ya existe un archivo de plan para esta tarea, actualízalo con nuevos puntos de discusión en lugar de sobrescribir ciegamente.
- Si la tarea afecta la base de datos, llena la sección `## Database Impact` con el enfoque discutido.
- Completa `## Source of Truth to Read` con los archivos relevantes para la tarea.

Flow:
1. Lee `agents/task/backlog.md` y confirma exactamente una tarea bajo `## Current`.
2. Lee `agents/task/plan.md` para la estructura de la plantilla.
3. Lee `agents/docs/decisions.md` para ADRs aplicables.
4. Sintetiza el contexto de la conversación en un plan completo.
5. Escribe `agents/task/TASK-XXX-plan.md` con estado `draft`.
6. Muestra al usuario un resumen del plan y resalta cualquier pregunta abierta que necesite resolución antes de la aprobación.
