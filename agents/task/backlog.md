# Backlog

Usa este archivo como cola de tareas. Mantén solo una tarea bajo `## Current`.

Formato de tarea:

```md
- TASK-XXX: Título corto de la tarea
```

Cuando el trabajo comience en una tarea actual, crea:
- `agents/task/TASK-XXX-plan.md`
- `agents/task/TASK-XXX-checklist.md`

Cuando la tarea esté completa y el usuario apruebe el cierre, mueve la tarea a `## Done` y mueve sus archivos de tarea a `agents/task/archive/` en el mismo paso.

## Current

## To do

## Done
