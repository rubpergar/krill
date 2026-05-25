# TASK-016 Plan — Notificación por email interno con Resend

## Status
`validated`

## Task
- ID: TASK-016
- Title: Notificación por email interno con Resend
- Backlog source: `agents/task/backlog.md`

## Summary
Enviar un email de notificación al equipo interno cuando se recibe una nueva solicitud a través del formulario público. Usar el mailer `resend` (configurado en Laravel 13 por defecto) como transporte en producción, y `log` en desarrollo.

## Scope
**In:**
- Crear `App\Mail\NewLeadNotification` (Mailable) con los datos del lead: nombre, email, teléfono, empresa, tipo de necesidad, mensaje.
- Crear la vista Blade `resources/views/emails/new-lead-notification.blade.php` con formato profesional usando el sistema de diseño existente.
- Disparar el email desde `PublicLeadController` inmediatamente después de crear el lead, con manejo de fallos silencioso (el lead se guarda aunque falle el email).
- El destinatario se configura vía `MAIL_INTERNAL_NOTIFICATION_ADDRESS` en `.env`.
- Si no hay destinatario configurado, no se envía el email (graceful degradation).
- Usar `Mail::mailer('resend')` como transporte.
- Mantener `MAIL_MAILER=log` como default en desarrollo; el mailer resend solo se usa explícitamente para esta notificación.
- Añadir pruebas con `Mail::fake()` para verificar envío, contenido, y supresión cuando no hay destinatario.

**Out (explicitly excluded):**
- Enviar email al solicitante (acuse de recibo — será TASK-018 si procede).
- Notificaciones por cambio de estado o asignación.
- Notificaciones push, SMS, Slack u otros canales.
- Cola de trabajos (queue) para el envío — se envía síncrono.
- Interfaz de usuario para configurar el destinatario.
- Logging adicional más allá del que proporciona Laravel.

## Current Behavior
- `PublicLeadController` crea el lead y redirige a `/gracias` sin enviar ninguna notificación.
- El mailer `resend` ya está configurado en `config/mail.php` pero sin uso.
- No existe ninguna clase Mailable en el proyecto.
- `MAIL_MAILER=log` en desarrollo.

## Target Behavior
- Al crear un lead desde el formulario público, se envía un email de notificación interna con los datos de la solicitud.
- El email se envía al destinatario configurado en `MAIL_INTERNAL_NOTIFICATION_ADDRESS`.
- Si falla el envío, el lead se guarda igualmente (no se interrumpe el flujo).
- Si no hay destinatario, no se envía el email.

## Acceptance Criteria
- Al enviar el formulario con datos válidos, se dispara un `NewLeadNotification` al destinatario configurado.
- El email contiene: nombre, email, teléfono, empresa, tipo de necesidad y mensaje del lead.
- Si `MAIL_INTERNAL_NOTIFICATION_ADDRESS` está vacío, no se envía ningún email.
- Si falla el envío (excepción), el lead se guarda igual y el usuario ve la confirmación.
- Las pruebas con `Mail::fake()` verifican que se envía al destinatario correcto con los datos correctos.

## Edge Cases
- Destinatario vacío o no configurado → no enviar.
- Email con caracteres especiales o largos en los campos del lead.
- Error de conexión con Resend → capturar excepción, no interrumpir el flujo.
- Lead creado sin teléfono o empresa (campos opcionales en el futuro).

## Assumptions / Risks
- Laravel 13 ya incluye soporte nativo para Resend vía `resend` transport.
- No se necesita instalar paquetes adicionales; el transporte resend está en el core de Laravel.
- El envío es síncrono; si el volumen crece podría añadirse queue después.
- No hay cambios de esquema, UI ni modelos.

## Database Impact
- Not applicable: no hay cambios de base de datos.

## Open Questions
- Ninguna.

## Source of Truth to Read
- `agents/docs/DoD.md`
- `agents/docs/testing.md`
- `agents/docs/decisions.md` (ADR-000: Resend en el stack)
- `config/mail.php`
- `config/services.php`
- `app/Http/Controllers/PublicLeadController.php`
- `.env`

## Decision Records
- ADRs read from `agents/docs/decisions.md`: ADR-000 Stack tecnológico PrawnForms (Resend incluido como servicio de email).
- New decisions to record after user approval: Ninguna prevista.
