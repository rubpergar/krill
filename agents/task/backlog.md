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
- TASK-018: Acuse de recibo al solicitante (opcional)
- TASK-022: Exportación de solicitudes a CSV (opcional)
- TASK-023: Despliegue (pendiente — pospuesto)

## Done

- TASK-001: Inicializar Laravel + Filament + PostgreSQL + Pest y configurar Krill para PrawnForms. Transicionar a project mode
- TASK-002: Migraciones y modelos (Lead, User, NotaInterna, EventoAuditoria, enums, factory, seeder)
- TASK-003: Formulario público Blade con campos y validaciones frontend
- TASK-004: Endpoint POST de envío con validación backend y guardado de lead
- TASK-005: Pantalla de confirmación post-envío
- TASK-006: Anti-spam básico (honeypot + rate limiting)
- TASK-007: Autenticación Filament (login, logout, protección de rutas)
- TASK-008: Resource Lead — listado paginado con columnas
- TASK-009: Filtros combinables en listado (estado, tipo, texto, fecha, responsable)
- TASK-024: Aplicar sistema de diseño completo a toda la aplicación (formulario público, panel Filament, vistas, componentes)
- TASK-010: Vista detalle de solicitud
- TASK-011: Cambio de estado con registro en auditoría
- TASK-012: Notas internas en detalle de solicitud
- TASK-013: Asignación de responsable con auditoría
- TASK-014: Historial de auditoría visible en detalle
- TASK-015: Cierre como convertido/descartado con acción rápida
- TASK-016: Notificación por email interno con Resend
- TASK-017: Dashboard con métricas básicas
- TASK-020: Resource Usuarios Filament (CRUD, roles, activar/desactivar)
- TASK-021: Archivar/eliminar solicitudes con permisos
- TASK-019: Pruebas de seguridad, revisión de privacidad y documentación básica
