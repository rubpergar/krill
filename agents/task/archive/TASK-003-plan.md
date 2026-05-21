# TASK-003 Plan — Formulario público Blade con campos y validaciones frontend

## Status
`draft`

## Task
- ID: TASK-003
- Title: Formulario público Blade con campos y validaciones frontend
- Backlog source: `agents/task/backlog.md`

## Summary
Crear la vista pública del formulario de captación con todos los campos definidos en el análisis: nombre, email, teléfono, empresa, tipo de necesidad, mensaje y consentimiento. Incluye validaciones HTML5 y JavaScript, diseño responsive con Tailwind, campo honeypot anti-spam (solo frontend) y prevención de doble clic.

## Scope
**In:**
- Ruta GET `/` con Blade view del formulario
- Campos: nombre (req), email (req), teléfono, empresa, tipo necesidad (select, req), mensaje (textarea, req)
- Checkbox consentimiento de privacidad obligatorio con enlace
- Validaciones frontend: HTML5 required, type=email, maxlength
- Validaciones JS: formato email más estricto, campos obligatorios antes de submit
- Campo honeypot invisible
- Diseño responsive (Tailwind CSS)
- Identificación visual de campos obligatorios con asterisco
- Mensajes de error asociados visualmente a cada campo
- Botón de envío se deshabilita tras primer clic
- Protección CSRF (token en formulario)

**Out:**
- Endpoint POST /lead (TASK-004)
- Validación backend de datos (TASK-004)
- Guardado de lead en BD (TASK-004)
- Pantalla de confirmación post-envío (TASK-005)
- Rate limiting (TASK-006)
- Cualquier estilo o layout que no sea el propio del formulario

## Current Behavior
- Ruta `/` inexistente (devuelve 404 de Laravel)

## Target Behavior
- `GET /` devuelve HTML 200 con formulario completo y responsivo
- Sin autenticación, accesible públicamente

## Acceptance Criteria
1. `GET /` devuelve 200 y renderiza el formulario
2. Campos presentes: nombre, email, teléfono, empresa, tipo necesidad (select), mensaje, consentimiento
3. Campos obligatorios marcados visualmente con asterisco
4. Campos obligatorios tienen atributo `required`
5. Email tiene `type="email"` y validación JS adicional
6. Checkbox consentimiento es `required`
7. Campo honeypot invisible existe en el DOM
8. Mensajes de error se muestran junto al campo correspondiente
9. Botón de envío se deshabilita al hacer clic
10. CSRF token presente en el formulario

## Edge Cases
- **JS deshabilitado:** validaciones HTML5 cubren lo esencial
- **Honeypot relleno por humano:** no hay backend aquí, se valida en TASK-006
- **Inputs largos:** maxlength en campos de texto
- **Navegadores antiguos:** HTML5 required y type=email son ampliamente soportados

## Assumptions / Risks
- Se usa Tailwind CSS (incluido por defecto en Laravel 13 con Vite)
- Se usa el layout base `layouts/app.blade.php` de Laravel (o se crea uno mínimo)
- Sin diseño de marca definitivo — estilos genéricos pero limpios
- **Riesgo bajo:** tarea puramente visual, sin backend

## Database Impact
`Not applicable` — esta tarea no toca la base de datos.

## Open Questions
- ¿Hay un logo o nombre visual de PrawnForms que deba incluir? Se usará texto "PrawnForms" como placeholder.
- ¿URL de la política de privacidad? Se usará `#` como placeholder.

## Source of Truth to Read
- `analisis_proyecto_s5.md` (secciones 10.1-10.3 UC-01, UC-02, UC-04; sección 15.1 definición de pantalla formulario)
- `agents/docs/testing.md`
- `agents/docs/DoD.md`

## Decision Records
- ADRs read from `agents/docs/decisions.md`: ADR-000 (stack Laravel + Blade para frontend público)
- New decisions to record after user approval: Ninguno
