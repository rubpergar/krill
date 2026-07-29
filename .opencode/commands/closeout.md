---
description: Cerrar la tarea activa: actualizar el backlog, archivar archivos y finalizar la documentación
---

Completa el proceso de cierre para la tarea activa.

Reglas:
- Lee `agents/task/backlog.md` e identifica la tarea única bajo `## Current`.
- Si `## Current` tiene cero o múltiples tareas, detente y pide al usuario que aclare qué tarea cerrar.
- Extrae el ID de tarea (TASK-XXX) de la entrada del backlog.
- Pide al usuario aprobación explícita antes de marcar la tarea como terminada. No continúes sin confirmación.
- Si `agents/docs/decisions.md` tiene nuevas decisiones aprobadas durante la tarea, asegúrate de que estén registradas.
- Si `agents/docs/debt.md` tiene hallazgos fuera del alcance registrados durante la tarea, confirma que aún sean precisos.
- Si la tarea afectó la base de datos, verifica que `agents/db/changes.sql` y el archivo de esquema de BD del Mapa de Fuente de la Verdad estén actualizados.
- Si la tarea afectó la API, verifica que `agents/docs/api.md` refleje los cambios.
- Si la tarea afectó el sistema de diseño de UI, verifica que `agents/docs/design.md` esté actualizado.
- No crees commits ni ramas de git a menos que el usuario lo pida explícitamente.
- Si hay cambios de código sin commit, informa al usuario y sugiere ejecutar `/commit` por separado.
- Sigue `AGENTS.md` y `agents/docs/DoD.md` para las reglas canónicas de cierre y documentación.

Flujo:
1. Lee `agents/task/backlog.md` y confirma exactamente una tarea bajo `## Current`.
2. Pregunta al usuario: "¿Apruebas cerrar TASK-XXX y moverla a Done?"
3. Si el usuario aprueba:
   - Verifica que la tarea cumpla los criterios de `## In Progress` de `agents/docs/DoD.md`.
   - Antes de mover, establece el estado del plan a `closed`.
   - Antes de mover, lee `TASK-XXX-checklist.md` y marca los elementos no verificados en la sección 6 (Closeout) como `[x]` si se completaron en este paso.
   - Mueve la tarea de `## Current` a `## Done` en el backlog.
   - Mueve `TASK-XXX-plan.md` a `agents/task/archive/`.
   - Mueve `TASK-XXX-checklist.md` a `agents/task/archive/`.
   - Verifica que los documentos durables estén actualizados según lo requiera `AGENTS.md`, incluyendo API, BD, diseño, decisiones y deuda cuando corresponda.
   - Reporta cualquier cambio sin commit y sugiere `/commit` si es necesario.
4. Si el usuario no aprueba, detente y pregunta qué necesita resolverse antes del cierre.
5. Confirma que todas las acciones de cierre se completaron y lista los archivos archivados.
