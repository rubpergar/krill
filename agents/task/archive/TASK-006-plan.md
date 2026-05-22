# Task Plan

## Status
`validated`

## Task
- ID: TASK-006
- Title: Anti-spam básico (honeypot + rate limiting)
- Backlog source: `agents/task/backlog.md`

## Summary
Añadir protección anti-spam básica al envío del formulario público sin incorporar captcha ni servicios externos. La tarea debe validar el honeypot existente (`website_url`) en backend y limitar la frecuencia de `POST /` para reducir envíos automatizados o repetidos.

## Scope
**In:**
- Validar el campo honeypot `website_url` en el endpoint `POST /`.
- Rechazar envíos donde el honeypot venga informado.
- Añadir rate limiting al envío del formulario público.
- Mantener el comportamiento actual para envíos legítimos: lead creado y redirect a `/gracias`.
- Mantener el comportamiento actual para validaciones normales: redirect a `/` con errores y sin crear lead.
- Cubrir honeypot y rate limit con tests feature.
- Actualizar `agents/docs/api.md` si cambia el contrato público del endpoint.

**Out (explicitly excluded):**
- Captcha, Turnstile, reCAPTCHA u otros servicios externos.
- Bloqueos persistentes por IP, listas negras o reputación.
- Panel administrativo para revisar spam.
- Nueva tabla de eventos de spam.
- Cambios en modelo `Lead` o esquema de base de datos.
- Email, notificaciones o auditoría.

## Current Behavior
El formulario incluye un campo oculto `website_url`, pero el backend no lo valida. El endpoint `POST /` acepta envíos válidos y crea leads sin límite específico de frecuencia más allá de los mecanismos generales de Laravel.

## Target Behavior
El endpoint `POST /` debe aplicar dos defensas básicas:

- Honeypot: si `website_url` tiene cualquier valor, el envío se considera spam y no crea lead.
- Rate limiting: una misma fuente no puede enviar el formulario indefinidamente en ventanas cortas de tiempo.

Para usuarios legítimos, el flujo no cambia: envío válido crea lead y redirige a `/gracias`. Para spam o abuso, el sistema debe evitar la creación del lead y responder de forma segura sin exponer detalles útiles a bots.

## Acceptance Criteria
- Un envío válido con `website_url` vacío sigue creando exactamente un `Lead` y redirige a `/gracias`.
- Un envío con `website_url` informado no crea ningún `Lead`.
- El honeypot está validado en backend, no solo oculto en frontend.
- El endpoint `POST /` aplica rate limiting.
- Cuando se supera el rate limit, no se crea ningún `Lead` adicional.
- Los errores de validación normales siguen redirigiendo a `/` con errores de sesión.
- Los tests cubren caso legítimo, honeypot informado y exceso de rate limit.
- No se añade ninguna dependencia nueva.

## Edge Cases
- Bot envía todos los campos válidos y también `website_url`.
- Bot envía solo `website_url` sin el resto de campos.
- Usuario legítimo hace doble click o reintenta rápidamente.
- Tests deben aislar el rate limiter para no contaminar otros tests.
- Entornos detrás de proxy pueden afectar la IP usada como clave de rate limit.

## Assumptions / Risks
- Se mantiene el campo honeypot actual `website_url` para no tocar el frontend salvo que sea necesario.
- Rate limit recomendado para empezar: bajo y conservador, suficiente para frenar spam básico sin bloquear usuarios reales. Propuesta inicial: 5 envíos por minuto por IP para `POST /`.
- El rechazo por honeypot debe evitar crear leads; la respuesta exacta puede ser redirect genérico a `/gracias` o error de validación discreto. Recomendación: responder de forma indistinguible de éxito (`/gracias`) para no dar feedback útil a bots.
- El rate limit puede devolver `429 Too Many Requests`, que sí es una señal visible; es aceptable para abuso por frecuencia.
- No hay decisión durable que requiera ADR: es una defensa local del formulario público.

## Database Impact
`Not applicable` — esta tarea no cambia esquema ni persistencia esperada de leads válidos.

- Change summary: Sin cambios de base de datos.
- DB schema file from Source of Truth Map: `agents/db/schema.sql`
- DB change log file from Source of Truth Map: `agents/db/changes.sql`
- Affected structures/data: Ninguna estructura nueva. Se reduce la creación de leads spam.
- Forward migration approach: No aplica.
- Rollback approach: No aplica a esquema; revertir validación honeypot/rate limit si fuera necesario.
- Persisted data compatibility: Sin impacto en datos existentes.
- Operational risks: Rate limit demasiado estricto podría bloquear usuarios legítimos en redes compartidas.
- Validation plan: Tests feature con `RefreshDatabase` y aislamiento del rate limiter.
- Backup/recovery notes: No se requieren acciones específicas.
- Required doc updates: `agents/docs/api.md` si se documenta el posible `429` o el comportamiento de spam.

## Open Questions
- Ninguna bloqueante. Recomendación asumida: honeypot informado redirige a `/gracias` sin crear lead; rate limit devuelve `429`.

## Source of Truth to Read
- `agents/docs/testing.md`
- `agents/docs/DoD.md`
- `agents/docs/api.md`
- `routes/web.php`
- `app/Http/Controllers/PublicLeadController.php`
- `resources/views/formulario.blade.php`
- `tests/Feature/TASK_004/EnviarFormularioTest.php`
- `tests/Feature/TASK_005/ConfirmacionTest.php`

## Decision Records
- ADRs read from `agents/docs/decisions.md`: `ADR-000: Stack tecnológico PrawnForms`
- New decisions to record after user approval: Ninguna por ahora; rate limit y honeypot son decisiones locales de protección del formulario.
