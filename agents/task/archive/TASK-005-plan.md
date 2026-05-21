# Task Plan

## Status
`draft`

## Task
- ID: TASK-005
- Title: Pantalla de confirmación post-envío
- Backlog source: `agents/task/backlog.md`

## Summary
Añadir una pantalla pública de confirmación después de enviar correctamente el formulario. El cambio completa el flujo UX del formulario: tras guardar el lead, el usuario deja de volver al mismo formulario con un flash temporal y pasa a una página clara de agradecimiento, sin riesgo de reenviar el POST al refrescar.

## Scope
**In:**
- Crear una ruta `GET /gracias` o equivalente para la pantalla de confirmación.
- Crear una vista Blade de confirmación coherente con el estilo actual del formulario.
- Cambiar el éxito de `POST /` para redirigir a la pantalla de confirmación.
- Mantener el patrón PRG (Post/Redirect/Get) para evitar reenvíos accidentales.
- Añadir CTA para enviar otra solicitud o volver al formulario.
- Cubrir el flujo con tests feature.
- Actualizar `agents/docs/api.md` si cambia el contrato público del POST.

**Out (explicitly excluded):**
- Envío de acuse de recibo por email al solicitante (TASK-018).
- Notificación interna por Resend (TASK-016).
- Anti-spam por honeypot/rate limiting (TASK-006).
- Mostrar datos personales del lead en la confirmación.
- Crear nuevas tablas, columnas o cambios de persistencia.
- Rediseño global del formulario o sistema visual.

## Current Behavior
El formulario público guarda el lead correctamente mediante `POST /` y, en éxito, redirige a `/` con un flash `status`. El usuario ve el mismo formulario tras el envío, lo que confirma mínimamente la acción pero no separa claramente el estado de éxito del estado de edición.

## Target Behavior
Tras un envío válido, `POST /` debe redirigir a una pantalla de confirmación pública y genérica. La pantalla debe comunicar que la solicitud fue recibida, explicar brevemente el siguiente paso esperado y ofrecer una acción clara para volver al formulario si el usuario quiere enviar otra solicitud.

La pantalla no debe mostrar `nombre`, `email`, teléfono, empresa ni otros datos del lead. Debe ser segura para acceso directo y refresco del navegador; por ello se recomienda una confirmación genérica accesible por `GET`, sin depender de datos sensibles en sesión.

## Acceptance Criteria
- Existe una ruta `GET` para la pantalla de confirmación post-envío.
- Un `POST /` válido crea el `Lead` y redirige a la pantalla de confirmación.
- Un `POST /` inválido sigue redirigiendo al formulario con errores de validación, sin crear leads.
- La pantalla de confirmación muestra un mensaje claro de recepción de solicitud.
- La pantalla de confirmación incluye una acción para volver al formulario o enviar otra solicitud.
- La pantalla de confirmación no muestra datos personales del lead.
- El flujo mantiene el patrón PRG y evita reenvío del formulario al refrescar la página de confirmación.
- La vista es responsive y mantiene accesibilidad básica: título semántico, texto legible, foco visible en enlaces/botones y contraste suficiente.

## Edge Cases
- Usuario refresca la pantalla de confirmación.
- Usuario accede directamente a `/gracias` sin haber enviado el formulario.
- Usuario vuelve atrás desde confirmación al formulario.
- Envío inválido no debe llegar a confirmación.
- Doble click o reenvío rápido queda fuera de esta tarea y se tratará en TASK-006 con rate limiting/honeypot.

## Assumptions / Risks
- Se usa una página genérica `/gracias` para evitar dependencia de sesión y exposición de datos personales.
- La página de confirmación no demuestra por sí misma que el lead específico se haya creado; esa garantía queda cubierta por tests del flujo POST.
- La redirección de éxito cambiará el contrato actual documentado en `agents/docs/api.md` de `302 /` a `302 /gracias`.
- Mantener el estilo actual con Tailwind CDN evita introducir dependencias o rediseño global.
- Si en el futuro se necesita una confirmación personalizada, deberá revisarse privacidad, expiración de sesión y no exposición de datos sensibles.

## Database Impact
`Not applicable` — esta tarea no cambia esquema ni reglas de persistencia. Sigue usando el guardado existente de TASK-004.

- Change summary: Sin cambios de base de datos.
- DB schema file from Source of Truth Map: `agents/db/schema.sql`
- DB change log file from Source of Truth Map: `agents/db/changes.sql`
- Affected structures/data: Ninguna estructura nueva; el POST seguirá creando `leads` como en TASK-004.
- Forward migration approach: No aplica.
- Rollback approach: No aplica a esquema; revertir ruta/vista/redirección si fuera necesario.
- Persisted data compatibility: Sin impacto en datos existentes.
- Operational risks: Bajo; el cambio afecta navegación post-envío, no persistencia.
- Validation plan: Tests feature para ruta de confirmación, redirección tras POST válido y ausencia de datos personales en la vista.
- Backup/recovery notes: No se requieren acciones específicas.
- Required doc updates: `agents/docs/api.md` si el POST cambia su respuesta de éxito documentada.

## Open Questions
- Ninguna bloqueante. Recomendación asumida: usar `/gracias` como pantalla genérica, pública y sin datos personales.

## Source of Truth to Read
- `agents/docs/testing.md`
- `agents/docs/DoD.md`
- `agents/docs/api.md`
- `agents/docs/design.md`
- `agents/skills/test-driven-development/SKILL.md`
- `agents/skills/interface-design/SKILL.md`
- `routes/web.php`
- `app/Http/Controllers/PublicLeadController.php`
- `resources/views/formulario.blade.php`

## Decision Records
- ADRs read from `agents/docs/decisions.md`: `ADR-000: Stack tecnológico PrawnForms`
- New decisions to record after user approval: Ninguna por ahora; el uso de `/gracias` como pantalla genérica se considera decisión local de la tarea.
