---
description: Close out the active task: update backlog, archive files, and finalize docs
---

Completa el proceso de cierre para la tarea activa.

Rules:
- Lee `agents/task/backlog.md` e identifica la única tarea bajo `## Current`.
- Si `## Current` tiene cero o múltiples tareas, detente y pide al usuario que aclare qué tarea cerrar.
- Extrae el ID de la tarea (TASK-XXX) de la entrada del backlog.
- Pide al usuario aprobación explícita antes de marcar la tarea como completada. No continúes sin confirmación.
- Mueve la entrada de la tarea de `## Current` a `## Done` en `agents/task/backlog.md`.
- Mueve `agents/task/TASK-XXX-plan.md` a `agents/task/archive/TASK-XXX-plan.md`.
- Mueve `agents/task/TASK-XXX-checklist.md` a `agents/task/archive/TASK-XXX-checklist.md`.
- Si `agents/docs/decisions.md` tiene nuevas decisiones que fueron aprobadas durante la tarea, asegúrate de que estén registradas.
- Si `agents/docs/debt.md` tiene hallazgos fuera de alcance registrados durante la tarea, confirma que sigan siendo precisos.
- Si la tarea afectó la base de datos, verifica que `agents/db/changes.sql` y el archivo de esquema de BD del Source of Truth Map estén actualizados.
- Si la tarea afectó la API, verifica que `agents/docs/api.md` refleje los cambios.
- Si la tarea afectó el sistema de diseño UI, verifica que `agents/docs/design.md` esté actualizado.
- No crees commits ni ramas de git a menos que el usuario lo pida explícitamente.
- Si hay cambios de código sin commit, informa al usuario y sugiere ejecutar `/commit` por separado.

Flow:
1. Lee `agents/task/backlog.md` y confirma exactamente una tarea bajo `## Current`.
2. Pregunta al usuario: "¿Apruebas cerrar TASK-XXX y moverla a Done?"
3. Si el usuario aprueba:
   - Mueve la tarea de `## Current` a `## Done` en el backlog.
   - Mueve `TASK-XXX-plan.md` a `agents/task/archive/`.
   - Mueve `TASK-XXX-checklist.md` a `agents/task/archive/`.
   - Verifica que los documentos durables estén actualizados (decisions, debt, API, DB, design) según corresponda.
   - Reporta cualquier cambio sin commit y sugiere `/commit` si es necesario.
4. Si el usuario no aprueba, detente y pregunta qué necesita resolverse antes del cierre.
5. Confirma todas las acciones de cierre completadas y lista los archivos archivados.
