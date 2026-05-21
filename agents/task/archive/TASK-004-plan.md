# Task Plan

## Status
`validated`

## Task
- ID: TASK-004
- Title: Endpoint POST de envío con validación backend y guardado de lead
- Backlog source: `agents/task/backlog.md`

## Summary
Implementar el endpoint que recibe el formulario público, valida los datos en backend y guarda un `Lead` en la base de datos con los metadatos mínimos de origen. El objetivo es que el formulario deje de ser solo presentación y pase a persistir solicitudes reales con reglas coherentes con el dominio ya definido.

## Scope
**In:**
- Añadir ruta `POST` para el envío del formulario público.
- Validar en servidor los campos visibles del formulario.
- Exigir consentimiento para permitir el guardado.
- Mapear el payload al modelo `Lead`.
- Guardar metadatos básicos de origen disponibles en la request (`ip_origen`, `user_agent`, `origen`).
- Crear el lead con estado inicial de dominio.
- Cubrir el flujo con tests feature.

**Out (explicitly excluded):**
- Pantalla de confirmación final de UX (TASK-005).
- Anti-spam por honeypot y rate limiting (TASK-006).
- Notificaciones email (TASK-016).
- Auditoría de creación si requiere decisión adicional de producto.
- Cambios de esquema o nuevas columnas.

## Current Behavior
`GET /` muestra el formulario público en Blade, pero no existe un endpoint funcional para procesarlo. El formulario no guarda datos ni valida en backend.

## Target Behavior
Al enviar el formulario, la aplicación acepta un `POST`, valida los datos requeridos, rechaza payloads inválidos con errores de validación estándar de Laravel y, cuando son válidos, crea un registro en `leads` con:
- `estado = Nuevo`
- `consentimiento_aceptado = true`
- `consentimiento_fecha = now()`
- `ip_origen`, `user_agent` y `origen` poblados cuando aplique

La respuesta de éxito mantiene un flujo mínimo coherente mientras TASK-005 aún no exista: `redirect('/')` con mensaje flash de éxito.

## Acceptance Criteria
- Existe una ruta `POST` operativa para el envío del formulario público.
- Backend valida `nombre`, `email`, `tipo_necesidad`, `mensaje` y `consentimiento` como obligatorios.
- Backend valida también `telefono` y `empresa` como obligatorios para mantenerse alineado con el formulario público actual.
- `email` se valida con regla de email válida.
- Un envío válido crea exactamente un `Lead` en base de datos.
- El `Lead` creado guarda `estado` inicial correcto según dominio (`Nuevo`).
- El `Lead` creado guarda `consentimiento_aceptado = true` y fecha de consentimiento.
- La request inválida no crea registros y devuelve errores de validación.
- Los tests cubren caso válido y varios inválidos.

## Edge Cases
- Campo `consentimiento` ausente o false.
- `tipo_necesidad` fuera de los valores soportados por el enum.
- `email` mal formado.
- Campos opcionales omitidos.
- Texto largo en `mensaje` dentro de límites razonables de la columna `text`.
- `ip_origen` no disponible o proxificada en entorno local.

## Assumptions / Risks
- Se asume que el endpoint seguirá usando la misma URL base del formulario para minimizar cambios (`POST /`).
- Aunque el esquema permite `null` en `telefono` y `empresa`, en esta etapa se mantienen obligatorios para no desalinear frontend y backend.
- El enum de dominio para `tipo_necesidad` debe ser la fuente de verdad en validación backend.
- La creación de `EventoAuditoria` se pospone para no adelantar responsabilidades de tareas posteriores de historial/auditoría.

## Database Impact
- Change summary: Sin cambios de esquema. Se empieza a persistir en la tabla existente `leads`.
- DB schema file from Source of Truth Map: `agents/db/schema.sql`
- DB change log file from Source of Truth Map: `agents/db/changes.sql`
- Affected structures/data: tabla `leads`; campos `nombre`, `email`, `telefono`, `empresa`, `tipo_necesidad`, `mensaje`, `estado`, `origen`, `ip_origen`, `user_agent`, `consentimiento_aceptado`, `consentimiento_fecha`.
- Forward migration approach: No aplica; no se prevén migraciones en esta tarea.
- Rollback approach: No aplica a esquema; rollback funcional sería retirar la ruta/controlador y tests asociados.
- Persisted data compatibility: Compatible con el esquema actual. No modifica registros existentes.
- Operational risks: Validaciones distintas entre frontend y backend pueden generar UX inconsistente si no se alinean.
- Validation plan: Tests feature para creación válida, errores de validación y ausencia de inserciones en casos inválidos.
- Backup/recovery notes: No se requieren acciones específicas al no haber migración ni transformación de datos.
- Required doc updates: Solo si durante la implementación cambia el contrato duradero del formulario o se decide documentar la ruta pública en `agents/docs/api.md`.

## Open Questions
- Ninguna pendiente. Decisiones cerradas durante implementación:
- `telefono` y `empresa` se validan como obligatorios.
- El éxito redirige a `/` con mensaje flash.
- No se crea `EventoAuditoria` en esta tarea.

## Source of Truth to Read
- `agents/docs/testing.md`
- `agents/docs/DoD.md`
- `agents/db/schema.sql`
- `agents/db/domain.md`
- `agents/docs/api.md`
- `app/Models/Lead.php`
- `app/Enums/TipoNecesidad.php`
- `app/Enums/LeadStatus.php`

## Decision Records
- ADRs read from `agents/docs/decisions.md`: `ADR-000: Stack tecnológico PrawnForms`
- New decisions to record after user approval: Ninguna por ahora; si se fija un contrato duradero para la ruta pública o para la creación de auditoría en alta de leads, evaluar ADR solo si afecta tareas futuras de forma recurrente.
