# TASK-024 Plan

## Status
`validated`

## Task
- ID: TASK-024
- Title: Aplicar sistema de diseño completo a toda la aplicación (formulario público, panel Filament, vistas, componentes)
- Backlog source: `agents/task/backlog.md`

## Summary
Rediseñar visualmente toda la aplicación existente para aplicar el sistema de diseño generado en Stitch y documentado en `agents/docs/design.md`. El cambio debe sustituir el estilo inicial basado en grises/índigo y la configuración ámbar de Filament por la dirección `Oceanic SaaS Logic`: interfaz profesional, técnica, clara y basada en teal, con tipografía Inter, superficies limpias, componentes consistentes y accesibilidad WCAG 2.2 AA.

El objetivo es un cambio visual global y sistemático, no una suma de retoques aislados. No se cambiarán flujos, validaciones, rutas, persistencia, permisos ni reglas de negocio.

## Scope
**In:**
- Aplicar los tokens duraderos de `agents/docs/design.md`: colores, tipografía, radios, espaciado, estados interactivos y principios visuales.
- Sustituir la apariencia del formulario público en `resources/views/formulario.blade.php`.
- Sustituir la apariencia de la página de confirmación en `resources/views/confirmacion.blade.php`.
- Configurar el panel Filament en `app/Providers/Filament/AdminPanelProvider.php` para usar el color primario teal y la fuente Inter, siguiendo la API actual de Filament 5.
- Ajustar el estilo del listado de solicitudes en `app/Filament/Resources/LeadResource.php` cuando Filament lo permita desde configuración de Resource/columnas/filtros, sin alterar la query ni las reglas funcionales.
- Añadir o reorganizar CSS de aplicación para centralizar tokens y estilos reutilizables, preferentemente en `resources/css/app.css` con Tailwind CSS 4 y `@theme`.
- Reemplazar el uso de Tailwind CDN en vistas públicas por assets del pipeline Vite/Laravel si es necesario para aplicar tokens reales y build estable.
- Mejorar jerarquía visual, responsive móvil/desktop, estados de foco, hover, error y éxito en las vistas públicas.
- Mantener semántica HTML, labels asociados, navegación por teclado, contraste AA y targets táctiles adecuados.
- Añadir o actualizar tests feature mínimos que aseguren que las páginas siguen cargando y conservan contenido/formularios clave tras el rediseño.
- Actualizar `agents/docs/design.md` solo si durante implementación se decide modificar un token, componente reusable o regla durable respecto al diseño de Stitch.

**Out (explicitly excluded):**
- Cambios de base de datos, migraciones, modelos o factories.
- Cambios en rutas públicas o rutas Filament.
- Cambios en validación backend, rate limiting, honeypot, CSRF o lógica de guardado.
- Cambios en autenticación, autorización, roles o permisos.
- Añadir nuevas funcionalidades al panel: detalle, edición, notas, auditoría, dashboard de métricas o nuevos Resources.
- Reescribir componentes internos de Filament más allá de configuración pública, tema/CSS permitido y ajustes razonables.
- Añadir dependencias visuales, icon packs, animaciones externas o librerías JS sin aprobación explícita.
- Crear dark mode funcional en esta tarea; `agents/docs/design.md` lo marca como Planned, no como alcance actual.
- Hacer una auditoría SEO o performance medida; solo se aplicará higiene básica de UI y build.

## Current Behavior
- El formulario público usa Blade con Tailwind desde CDN y una presentación básica: fondo gris, tarjeta blanca, sombras simples, foco índigo y botón índigo.
- La página de confirmación usa el mismo patrón visual básico con tarjeta centrada y botón índigo.
- Filament está configurado con `Color::Amber` como color primario.
- `LeadResource` muestra una tabla funcional con columnas y filtros, usando estilos estándar de Filament sin adaptación al sistema de diseño de Stitch.
- No existe una capa clara de tokens visuales compartidos aplicada por Vite/Tailwind en las vistas públicas.
- El diseño actual funciona, pero no refleja el sistema `Oceanic SaaS Logic` ni una identidad visual coherente entre público y administración.

## Target Behavior
- Toda la aplicación existente comparte una dirección visual coherente basada en `Oceanic SaaS Logic`.
- Las vistas públicas usan paleta teal/slate: background `#f5faf8`, surface `#ffffff`, foreground `#0f172a`, muted `#64748b`, border `#e2e8f0`, primary/focus `#0d9488`.
- La tipografía base y jerarquías usan Inter o stack equivalente configurado de forma consistente.
- Formulario y confirmación tienen layout responsive: centrado en móvil, contenido cómodo en desktop, jerarquía clara, espaciado consistente y estados de error/éxito visibles.
- Filament usa teal como color primario y una fuente alineada con el sistema de diseño.
- El listado de leads conserva columnas, filtros, paginación y orden, pero se percibe integrado con el sistema visual.
- Los estados interactivos cumplen foco visible, contraste suficiente y no dependen solo del color.
- La aplicación sigue pasando los tests existentes y el build de assets.

## Acceptance Criteria
- `GET /` sigue respondiendo `200` y muestra el formulario completo con todos los campos actuales, CSRF, honeypot y enlace al panel.
- `GET /gracias` sigue respondiendo `200` y muestra la confirmación y enlace de vuelta.
- El envío `POST /` mantiene la validación, guardado, honeypot y rate limiting actuales sin cambios funcionales.
- Las vistas públicas ya no dependen de `https://cdn.tailwindcss.com` si se introduce el pipeline Vite para estilos.
- Los estilos públicos aplican tokens equivalentes a `agents/docs/design.md` para color primario, fondo, superficie, texto, borde, foco, radio y espaciado.
- Los inputs, selects, textarea, checkbox, botones, mensajes de error y mensajes de éxito tienen estados default, hover/focus cuando aplica, error y disabled coherentes con el sistema.
- El diseño público no tiene scroll horizontal en móvil y mantiene legibilidad en desktop.
- El panel Filament usa `#0d9488` o paleta teal equivalente como color primario, reemplazando `Color::Amber`.
- El panel Filament usa Inter o proveedor/fallback equivalente, sin bloquear la carga si la fuente externa falla.
- `LeadResource` conserva las columnas, filtros, paginación y orden descendente existentes.
- No se añaden acciones create/edit/delete/view al Resource de leads.
- No hay migraciones ni cambios de esquema.
- Tests feature existentes siguen pasando.
- Se añaden o actualizan tests para proteger el renderizado básico tras el rediseño cuando tenga sentido.
- `npm run build`, `php artisan test` y `./vendor/bin/pint --test` pasan, o cualquier fallo se documenta con causa y riesgo residual.

## Edge Cases
- Formulario con errores de validación en varios campos a la vez.
- Mensaje de éxito o confirmación visto en móvil estrecho.
- Campos con textos largos: nombre, empresa, email, mensaje y labels del select.
- Lead list con valores nulos de empresa y responsable.
- Filtros de Filament abiertos en viewport pequeño.
- Usuario invitado redirigido a login del panel tras cambio de tema.
- Usuario inactivo mantiene respuesta 403 tras cambio de tema.
- Fallback de fuente si Inter no carga.
- Contraste de texto muted sobre background y surface.
- Foco visible en teclado para inputs, checkbox, botones y enlaces.

## Assumptions / Risks
- Esta tarea opera en modo Redesign porque el usuario pidió cambiar todo el estilo y diseño de la aplicación entera.
- `agents/docs/design.md` es la fuente de verdad visual y no debe reinterpretarse como una sugerencia opcional.
- Filament 5 permite configurar colores con `colors()` y fuentes con `font()`; para estilos más finos puede requerir un tema personalizado o assets registrados.
- Tailwind CSS 4 permite definir tokens con `@theme` en CSS; deben estar a nivel raíz del archivo, no anidados.
- Si se migra de CDN a Vite en vistas públicas, puede requerirse añadir `@vite` a las Blade públicas y verificar build.
- El uso de Inter puede implicar CDN de fuente o provider de Filament; se debe evitar introducir una dependencia nueva si el proveedor integrado/fallback es suficiente.
- Filament tiene límites razonables de personalización sin publicar/reescribir vistas internas; el plan prioriza configuración y tema antes que overrides frágiles.
- La aplicación actual tiene pocas vistas, pero “aplicación entera” incluye también el shell visual de Filament y componentes futuros por medio de tokens reutilizables.
- Cambios visuales pueden afectar tests que hacen `assertSee` si se reorganiza markup; los tests deben seguir comprobando comportamiento y contenido clave, no clases exactas salvo que sea necesario.

## Database Impact
Use `Not applicable` when the task does not affect the database.

- Change summary: Not applicable. La tarea solo modifica presentación, assets y configuración visual.
- DB schema file from Source of Truth Map: `agents/db/schema.sql` sin cambios previstos.
- DB change log file from Source of Truth Map: `agents/db/changes.sql` sin cambios previstos.
- Affected structures/data: ninguna estructura ni dato persistido.
- Forward migration approach: Not applicable.
- Rollback approach: revertir cambios en vistas, CSS/assets y configuración Filament.
- Persisted data compatibility: compatible; no cambia lectura/escritura de datos.
- Operational risks: cambios de assets pueden afectar carga visual si Vite/build no queda correctamente conectado; mitigación con `npm run build` y pruebas de renderizado.
- Validation plan: tests feature específicos de páginas públicas/admin, suite completa, Pint y build Vite.
- Backup/recovery notes: Not applicable; no hay operaciones destructivas ni migraciones.
- Required doc updates: `agents/docs/design.md` solo si se cambian tokens/reglas duraderas respecto al archivo generado por Stitch.

## Open Questions
- ¿Quieres que el rediseño afecte también la pantalla de login estándar de Filament, además del panel autenticado? Propuesta: sí, porque forma parte de la aplicación visible.
- ¿Prefieres cargar Inter desde proveedor externo integrado (Bunny/Google según Filament) o mantener solo fallback local del sistema? Propuesta: usar Inter con fallback, sin añadir paquete nuevo.
- ¿Debe conservarse el texto actual del formulario o podemos ajustar microcopy visual/UX sin cambiar campos ni validaciones? Propuesta: permitir microcopy mínimo para claridad, sin cambiar significado.
- ¿Quieres que esta tarea cree componentes Blade reutilizables para input/button/card o prefieres mantener el cambio local en las dos vistas actuales? Propuesta: crear solo los componentes/helpers mínimos si se repiten patrones y reducen duplicación.

## Source of Truth to Read
- `agents/docs/DoD.md`
- `agents/docs/testing.md`
- `agents/docs/decisions.md`
- `agents/docs/design.md`
- `agents/skills/interface-design/SKILL.md`
- `resources/views/formulario.blade.php`
- `resources/views/confirmacion.blade.php`
- `resources/css/app.css`
- `resources/js/app.js`
- `vite.config.js`
- `app/Providers/Filament/AdminPanelProvider.php`
- `app/Filament/Resources/LeadResource.php`
- `tests/Feature/TASK_003/FormularioTest.php`
- `tests/Feature/TASK_004/EnviarFormularioTest.php`
- `tests/Feature/TASK_005/ConfirmacionTest.php`
- `tests/Feature/TASK_007/FilamentAuthTest.php`
- `tests/Feature/TASK_008/LeadResourceTest.php`
- `tests/Feature/TASK_009/FiltrosTest.php`
- Context7 docs: `/filamentphp/filament/v5.1.1`, styling overview, panel colors, fonts, custom themes/assets.
- Context7 docs: `/tailwindlabs/tailwindcss.com`, Tailwind CSS 4 `@theme` design tokens.

## Decision Records
- ADRs read from `agents/docs/decisions.md`:
  - ADR-000: Stack tecnológico PrawnForms. Confirma Laravel 13 + Filament 5 + PostgreSQL + Pest + Blade público + Resend, con Filament como panel privado.
- New decisions to record after user approval:
  - None expected. La dirección visual ya queda en `agents/docs/design.md`; solo haría falta ADR si se decide una política duradera nueva, como proveedor obligatorio de fuentes, estrategia de theming de Filament o regla global de componentes Blade.
