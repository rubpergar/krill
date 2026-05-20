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

- TASK-001: Implementar autenticación de usuarios y gestión de sesión/token
- TASK-002: Implementar roles, permisos y protección de rutas usuario/admin
- TASK-003: Implementar estructura REST API versionada bajo /api/v1
- TASK-004: Implementar creación, validación y persistencia de incidencias
- TASK-005: Implementar endpoints de listado y detalle de incidencias del usuario
- TASK-006: Implementar endpoints admin para gestión, filtros, prioridades y cambios de estado
- TASK-007: Implementar interfaz bento responsive conectada a la API
- TASK-008: Implementar tests principales de API, usuario, admin y permisos
