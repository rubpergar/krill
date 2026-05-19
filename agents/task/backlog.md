# Backlog

Use this file as the task queue. Keep only one task under `## Current`.

Task format:

```md
- TASK-XXX: Short task title
```

When work starts on a current task, create:
- `agents/task/TASK-XXX-plan.md`
- `agents/task/TASK-XXX-checklist.md`

When the task is complete and the user approves closeout, move the task to `## Done` and move its task files to `agents/task/archive/` in the same step.

## Current

## To do

- TASK-002: Implementar roles, permisos y protección de rutas usuario/admin
- TASK-003: Implementar estructura REST API versionada bajo `/api/v1`
- TASK-004: Implementar creación, validación y persistencia de incidencias
- TASK-005: Implementar endpoints de listado y detalle de incidencias del usuario
- TASK-006: Implementar endpoints admin para gestión, filtros, prioridades y cambios de estado
- TASK-007: Implementar interfaz bento responsive conectada a la API
- TASK-008: Implementar tests principales de API, usuario, admin y permisos

## Done

- TASK-001: Implementar autenticación de usuarios y gestión de sesión/token
