# TASK-019 Plan — Pruebas de seguridad, revisión de privacidad y documentación básica

## Status
`closed`

## Task
- ID: TASK-019
- Title: Pruebas de seguridad, revisión de privacidad y documentación básica
- Backlog source: `agents/task/backlog.md`

## Summary
Consolidar garantías mínimas de seguridad y privacidad para PrawnForms antes de considerar completo el flujo base: añadir pruebas de regresión sobre acceso, validación, anti-spam y exposición de datos; crear una página pública básica de privacidad enlazada desde el consentimiento; y documentar las reglas operativas de privacidad/seguridad del proyecto.

## Scope
**In:**
- Añadir tests de seguridad/privacidad para rutas públicas y panel privado.
- Verificar que invitados no acceden a recursos privados de leads/usuarios.
- Verificar que usuarios inactivos no acceden al panel.
- Verificar que usuarios no admin no gestionan usuarios ni eliminan leads físicamente.
- Verificar que honeypot y rate limit siguen evitando creación de leads abusivos.
- Verificar que la pantalla de confirmación no expone datos personales del envío.
- Añadir ruta y vista pública `/privacidad` con aviso básico de tratamiento de datos.
- Enlazar la política de privacidad desde el checkbox de consentimiento.
- Añadir documentación básica interna de seguridad y privacidad.

**Out (explicitly excluded):**
- Auditoría legal completa o texto jurídico definitivo.
- Cambios de infraestructura, cabeceras HTTP globales, WAF o configuración de servidor.
- Nuevos roles, permisos granulares o cambios de esquema.
- Cifrado de campos PII en base de datos.
- Retención automática o borrado programado.

## Current Behavior
- El formulario público valida consentimiento y guarda datos personales mínimos necesarios para seguimiento.
- El texto del checkbox menciona política de privacidad, pero no enlaza una página pública.
- El panel Filament está protegido por login y `activo` en `User::canAccessPanel`.
- La gestión de usuarios está restringida a admin activo por `UserPolicy`.
- El borrado físico de leads está limitado a admin activo sobre leads archivados.
- Existen tests funcionales por tarea, pero no una suite dedicada de revisión de seguridad/privacidad.

## Target Behavior
- `/privacidad` responde `200` con aviso claro y sin depender de autenticación.
- El formulario enlaza a `/privacidad` desde el consentimiento.
- La confirmación `/gracias` permanece genérica y no refleja PII del envío.
- Los tests de TASK-019 cubren controles críticos de acceso y privacidad.
- La documentación interna resume datos tratados, accesos, controles existentes, riesgos residuales y validaciones ejecutables.

## Acceptance Criteria
- `GET /privacidad` devuelve `200` y muestra información básica: responsable/proyecto, finalidad, datos tratados, acceso interno, conservación y contacto pendiente.
- El formulario público contiene enlace a `/privacidad` en el texto de consentimiento.
- Una submission válida redirige a `/gracias` y la respuesta de confirmación no muestra nombre, email, teléfono, empresa ni mensaje del usuario.
- Invitados son redirigidos al login desde `/admin/leads`, `/admin/users` y detalle de lead.
- Usuario inactivo recibe `403` en `/admin/leads` y `/admin/users`.
- Usuario activo no admin recibe `403` en `/admin/users`.
- Usuario activo no admin no ve ni ejecuta eliminación física de leads.
- Honeypot con `website_url` no crea lead.
- Rate limit del formulario responde `429` tras superar el límite configurado.
- Tests targeted de TASK-019 pasan.
- Suite completa, Pint y build pasan.

## Edge Cases
- La página `/privacidad` debe ser pública y no debe romper el flujo de formulario tradicional.
- La confirmación no debe depender de sesión con datos personales.
- Los tests de rate limit deben limpiar el limiter para ser deterministas.
- No se deben introducir datos personales reales en fixtures o documentación.

## Assumptions / Risks
- El aviso de privacidad será operativo y básico, no asesoramiento legal definitivo.
- Se conserva el almacenamiento de IP y user-agent existente porque ya forma parte del modelo actual; se documenta como riesgo/dato técnico tratado.
- No se añaden dependencias.

## Database Impact
- Change summary: no schema change.
- DB schema file from Source of Truth Map: `agents/db/schema.sql`.
- DB change log file from Source of Truth Map: `agents/db/changes.sql`.
- Affected structures/data: none.
- Forward migration approach: not applicable.
- Rollback approach: not applicable.
- Persisted data compatibility: unchanged.
- Operational risks: none from schema; privacy risk remains tied to existing PII storage.
- Validation plan: feature tests, full test suite, Pint, build.
- Backup/recovery notes: not applicable.
- Required doc updates: add/update privacy/security documentation and `agents/docs/api.md` for new public route.

## Open Questions
- Resolved by user instruction: apply recommended behavior without further confirmation.

## Source of Truth to Read
- `agents/docs/DoD.md`
- `agents/docs/testing.md`
- `agents/docs/decisions.md`
- `agents/docs/api.md`
- `agents/db/domain.md`

## Decision Records
- ADRs read from `agents/docs/decisions.md`: ADR-000 Stack tecnológico PrawnForms.
- New decisions to record after user approval: none; this task adds project documentation and tests, not a cross-project architectural rule.
