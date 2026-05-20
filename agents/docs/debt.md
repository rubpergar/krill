# Deuda Técnica

Registro de errores, problemas, mejoras o incidentes que el agente encuentra mientras trabaja en una tarea y que están fuera del alcance de la tarea actual.

Cuando el agente encuentra algo relevante pero fuera de alcance, debe registrarlo aquí en lugar de modificarlo sin permiso. El usuario revisa periódicamente el registro y decide si crear una tarea formal.

## Estados
- `open`: pendiente de revisión del usuario.
- `dismissed`: el usuario decidió no abordarlo.

## Formato

```md
## DBT-XXX: Título corto
Fecha: YYYY-MM-DD
Estado: open | dismissed
Riesgo: low | medium | high
Impacto: low | medium | high
Prioridad sugerida: low | medium | high | critical
Evidencia: Archivo(s), línea(s) o enlace relacionado.
Descripción: Explicación del problema.
Recomendación: Qué hacer para resolverlo.
```

## Registro

## DBT-001: Asignar incidencia a usuario inexistente causa 500 en lugar de 404
Fecha: 2026-05-20
Estado: dismissed
Riesgo: low
Impacto: medium
Prioridad sugerida: medium
Evidencia: `apps/api/src/modules/v1/integration.test.ts` — test "returns 404 when assigning to a non-existent user"
Descripción: El endpoint `PATCH /admin/incidents/:id/assign` retorna 500 cuando se envía un `assignedTo` con ID de usuario que no existe. Debería validar la existencia del usuario y retornar 404.
Recomendación: Agregar validación en el servicio de asignación antes de persistir, verificando que el usuario destino exista.
Resolución: Validación agregada en `admin-incidents.service.ts` — ahora retorna 404 si el usuario no existe.

## DBT-002: No es posible desasignar una incidencia (assignedTo: null rechazado)
Fecha: 2026-05-20
Estado: dismissed
Riesgo: low
Impacto: low
Prioridad sugerida: low
Evidencia: `apps/api/src/modules/v1/integration.test.ts` — test "returns 403 when a regular user tries to assign" reemplazó el test de desasignación
Descripción: El schema de validación del endpoint `PATCH /admin/incidents/:id/assign` rechaza `assignedTo: null`, por lo que no es posible desasignar una incidencia. Enviar body vacío `{}` asigna al admin autenticado.
Recomendación: Modificar el schema de validación para aceptar `null` en `assignedTo` y actualizar el servicio para limpiar el campo.
Resolución: Schema actualizado a `z.number().optional().nullable()`, service acepta `number | null`, route handler distingue `undefined` vs `null`.
