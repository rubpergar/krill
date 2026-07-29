# AGENTS.md

Este repositorio comienza como un esqueleto de agente y puede prepararse para trabajo activo en un proyecto.

## Modo

Modo actual: `skeleton`.

Este repositorio está en modo de arranque de agente. No se permite la implementación de funcionalidades de producto.

Para el alcance del modo esqueleto, la información de configuración necesaria, validación y transición al modo proyecto, sigue `agents/docs/bootstrap.md`. Tras la transición al modo proyecto, el arranque archivado está en `agents/task/archive/bootstrap-*.md` (solo referencia histórica).

No modifiques código fuente del producto ni archivos no relacionados, a menos que los documentos de arranque lo permitan explícitamente o que el usuario lo solicite explícitamente.

## Proyecto
Rellena esta sección durante el arranque. Deja los campos en blanco solo si aún se desconocen o no están configurados.
- Producto:
- Dominio:
- Usuarios:
- Objetivo:

## Stack
Rellena solo lo que corresponda durante el arranque.
- Runtime/framework:
- Gestor de paquetes:
- Base de datos:
- Herramientas de prueba:
- Despliegue:
- Servicios externos:

## Reglas Operativas
- En modo esqueleto, editar archivos de configuración del agente (`AGENTS.md`, `agents/**`, `.opencode/**`) no requiere aprobación del usuario. La columna de Aprobación necesaria del Mapa de Fuentes de Verdad solo aplica en modo proyecto.
- Antes de modificar un documento fuente de verdad en modo proyecto, revisa la columna **¿Aprobación necesaria?** en el Mapa de Fuentes de Verdad para determinar si se necesita aprobación explícita.
- Los cambios de comportamiento del producto requieren el flujo SDD que se indica a continuación.
- Los cambios de plantilla/mantenimiento de agente pueden realizarse directamente cuando el usuario lo solicite explícitamente.
- El mantenimiento del esqueleto no es implementación de producto y no requiere una tarea en backlog, plan ni lista de verificación, a menos que el usuario solicite ese flujo.
- La inicialización de un nuevo proyecto en modo `skeleton` requiere aprobación explícita del usuario y debe seguir `agents/docs/bootstrap.md`.
- Las solicitudes exploratorias, de asesoría, solo de revisión o solo de planificación no modifican código a menos que el usuario solicite ediciones.
- Mantén los cambios limitados a la tarea activa o al mantenimiento solicitado explícitamente.
- Prefiere actualizar documentos fuente de verdad estables en lugar de duplicar instrucciones.
- Los documentos fuente de verdad del proyecto y los planes de tarea aprobados tienen prioridad sobre las guías de skills cuando entren en conflicto.
- Trata los campos en blanco, los marcadores de placeholder y los comandos `not available` como configuración faltante, no como instrucciones para improvisar.
- Los documentos de arranque archivados son solo referencia histórica y no deben seguirse a menos que el usuario solicite explícitamente mantenimiento o revisión del arranque.

## Presupuesto de Tokens
- Comunícate con el usuario en español a menos que solicite otro idioma.
- Mantén las actualizaciones de progreso breves y envíalas solo para descubrimientos importantes, bloqueos, ediciones o resultados de validación.
- Evita reiterar contexto ya presente en la conversación.
- Prefiere respuestas finales concisas: resultado, archivos modificados, validación y salvedades relevantes.
- No uses lenguaje intencionalmente degradado o demasiado escueto si reduce la corrección o claridad.
- Usa subagentes selectivamente: prefíerelos para exploración pesada, comparación entre repositorios, revisión final independiente o análisis de alcance limitado que de otro modo inflaría el contexto principal. No delegues cada pequeño paso de TDD.
- Lee el conjunto más pequeño útil de archivos para la decisión actual. No recargues documentos grandes o conjuntos de archivos amplios cuando una lectura más acotada sea suficiente.
- Al cambiar de exploración a implementación, conserva solo los hechos destilados necesarios para el paso actual.
- Prefiere lecturas de archivos dirigidas y diffs enfocados en lugar de releer archivos completos tras cada cambio.
- Si la tarea crece, resume el estado actual en el plan/lista de verificación de la tarea en lugar de mantener todos los detalles solo en la memoria de la conversación.
- Para repositorios grandes o trabajo multirrepositorio, divide el descubrimiento en subtareas paralelas y mantén el hilo principal centrado en decisiones e integración.

## Mapa de Fuentes de Verdad
Lee el conjunto más pequeño útil. Usa esta tabla para decidir qué abrir, no como una lista de lectura obligatoria.

| Archivo | Área | Propósito | Leer cuando | ¿Aprobación necesaria para editar? |
|---|---|---|---|---|
| `agents/docs/bootstrap.md` | Arranque | Configuración del esqueleto y transición a proyecto | modo esqueleto o mantenimiento de arranque | No |
| `agents/task/backlog.md` | Tarea activa | Cola de tareas y selección actual | Planificar o implementar trabajo de producto | No |
| `agents/task/TASK-XXX-plan.md` | Plan de tarea | Alcance y contrato de comportamiento | Implementar o validar tarea | No |
| `agents/task/TASK-XXX-checklist.md` | Lista de verificación de tarea | Registro de ejecución y punto de reanudación | Implementar o reanudar tarea | No |
| `agents/task/plan.md` | Plantilla de plan | Plantilla para planes de tarea | Crear un nuevo plan de tarea | No |
| `agents/task/checklist.md` | Plantilla de lista de verificación | Plantilla para listas de verificación | Crear una nueva lista de verificación | No |
| `agents/docs/DoD.md` | Aceptación | Definición de completado | Antes de validación y cierre | Sí |
| `agents/docs/testing.md` | Pruebas | Comandos de prueba, fixtures, reglas de validación | Añadir/ejecutar pruebas o validar trabajo | Solo si cambia la validación |
| `agents/docs/decisions.md` | Decisiones | Registros ADR | Planificar, decisión duradera, o asuntos de razonamiento pasado | No |
| `agents/docs/api.md` | Contratos API | Rutas, cargas, errores, compatibilidad | Rutas API, clientes o cargas afectados | No |
| `agents/db/schema.sql` | Esquema DB | Estructura actual. Ruta sobreescribible durante arranque si el proyecto tiene la suya propia. | Persistencia, migraciones, consultas o esquema afectados | No |
| `agents/db/changes.sql` | Registro de cambios DB | Cambios SQL ordenados con notas de rollback. Ruta sobreescribible durante arranque si el proyecto tiene la suya propia. | Persistencia, migraciones, consultas o esquema afectados | No |
| `agents/db/domain.md` | Dominio DB | Vocabulario, entidades, reglas de negocio | Modelo de datos o reglas de negocio afectados | No |
| `agents/docs/design.md` | Diseño UI | Tokens UI reutilizables, componentes, a11y | UI, sistema de diseño o comportamiento UX afectado | No |
| `agents/docs/dependency-policy.md` | Dependencias | Reglas para nuevas dependencias | Añadir o evaluar una dependencia | Sí |
| `agents/docs/debt.md` | Deuda | Hallazgos y bugs fuera del alcance | Encontrado algo fuera del alcance de la tarea activa | Sí |

## Runtime del Agente
Rellena durante el arranque cuando el proyecto configure capacidades de runtime específicas del agente.
- Plugins:
- MCPs:

Usa las capacidades de runtime solo cuando el proyecto actual las configure o `## Runtime del Agente` las registre.

| Capacidad | Tipo | Usar cuando | Evitar cuando |
|---|---|---|---|
| Context7 | MCP | Se necesita documentación de librerías, frameworks, SDKs, APIs, CLI o servicios cloud | Depuración de lógica de negocio, refactorización o conceptos que no sean de librerías |
| Playwright | MCP | Se necesita automatización de navegador, validación de UI o flujos E2E | Trabajo solo de backend o solo de librerías |
| `opencode-pty` | Plugin | El comportamiento del terminal se beneficia del manejo PTY | Comandos no interactivos simples funcionan bien |
| `opencode-vibeguard` | Plugin | Barreras extra de flujo/calidad ayudan al proyecto | Se necesita para reemplazar reglas claras o disciplina de revisión |

Cuando Context7 esté disponible para el proyecto actual, úsalo como fuente de documentación principal para preguntas sobre librerías y APIs. Si no está disponible, indícalo y recurre al mejor contexto disponible del proyecto y del entorno.

## Skills
Usa una skill solo cuando su activador coincida con la solicitud. El stack del proyecto y los documentos fuente de verdad tienen prioridad sobre las suposiciones de las skills.

| Skill | Ruta | Usar cuando | Evitar cuando |
|---|---|---|---|
| Test-Driven Development | `agents/skills/test-driven-development/SKILL.md` | Leer y aplicar una vez antes del código de implementación para funcionalidades, correcciones de bugs, cambios de comportamiento o refactors que preserven comportamiento; es la autoridad metodológica de TDD | Cambios solo de documentación, solo de planificación, solo de configuración sin comportamiento |
| Interface Design | `agents/skills/interface-design/SKILL.md` | Diseñar, implementar, mejorar o revisar UI/UX, visuales de frontend, comportamiento responsive, estados de interacción, formularios, navegación, paneles, componentes y accesibilidad vinculada a UI | Trabajo solo de backend, auditorías solo de SEO, revisión de seguridad, trabajo solo de identidad de marca, generación de imágenes u optimización de rendimiento medida |
| SEO Audit | `agents/skills/seo-audit/SKILL.md` | Auditar páginas públicas para rastreabilidad, indexación, metadatos, estructura de contenido, Core Web Vitals, enlaces internos, schema o rankings | Paneles privados, trabajo solo de backend, ajuste de UI sin alcance SEO |
| Code Review Excellence | `agents/skills/code-review-excellence/SKILL.md` | Revisar cambios de código, PRs, diffs sensibles a arquitectura, o cuando se solicite explícitamente una revisión de código | Implementar código directamente, verificaciones solo de formato o reemplazar lint/tests automatizados |
| Security Review | `agents/skills/security-review/SKILL.md` | Revisar autenticación, autorización, flujo de datos, secretos, entrada de usuario, seguridad de API, configuración de infraestructura, o cuando se solicite explícitamente una revisión de seguridad | Hardening teórico sin contexto de código, archivos solo de prueba a menos que se soliciten, o reescrituras de seguridad amplias fuera de un plan aprobado |
| Performance | `agents/skills/performance/SKILL.md` | Auditar o mejorar carga de página, Core Web Vitals, carga de bundles/recursos, jank en tiempo de ejecución, imágenes, fuentes, caché o regresiones de rendimiento web | Optimización prematura, trabajo solo de backend sin impacto en rendimiento web, o memoización/refactors sin cuellos de botella medidos |
| Context7 MCP | `agents/skills/context7-mcp/SKILL.md` | Documentación y ejemplos de librerías, frameworks, SDKs, APIs, CLI o servicios cloud | Depuración de lógica de negocio, refactorización, revisión o conceptos de programación que no sean de librerías |
| Find Skills | `agents/skills/find-skills/SKILL.md` | Descubrir o instalar skills de agente para una capacidad | Implementación directa cuando no se solicite descubrimiento de skills |

Precedencia de frontend: usa solo `interface-design` para UI/UX, visuales de frontend, comportamiento responsive, estados de interacción, formularios, navegación, componentes, accesibilidad vinculada a UI y revisión de UI. No cargues skills de UI separadas.
Precedencia de calidad: usa `security-review` para análisis de seguridad explotable, `performance` para trabajo de rendimiento web medido, y `code-review-excellence` para revisión de código general. La accesibilidad de UI es manejada por `interface-design` a menos que el proyecto añada posteriormente un flujo de trabajo de accesibilidad especializado separado. Los documentos fuente de verdad del proyecto y los planes de tarea aprobados tienen prioridad sobre las suposiciones de las skills.

"Leer y aplicar" significa: abre el archivo de la skill con la herramienta Read y sigue sus instrucciones. No uses la herramienta skill — las skills del proyecto no están registradas como skills a nivel de sistema en este runtime.

## Flujo SDD
La implementación de producto comienza solo cuando hay exactamente una tarea bajo `## Current` en `agents/task/backlog.md`.

1. Seleccionar tarea
   - Lee `agents/task/backlog.md`.
   - Si `## Current` tiene cero o múltiples tareas, pide al usuario que seleccione o cree una.

2. Planificar
   - Lee los ADR aceptados relevantes en `agents/docs/decisions.md` antes de proponer opciones de comportamiento o implementación.
   - Crea/actualiza `agents/task/TASK-XXX-plan.md` a partir de `agents/task/plan.md` tan pronto como sea posible durante la planificación, manteniéndolo en `draft` mientras las preguntas aún se estén resolviendo.
   - Inspecciona primero el conjunto más pequeño útil de archivos y contexto referenciado.
   - Para contexto grande o multirrepositorio, usa exploración paralela selectiva con subagentes.
   - Haz una pregunta de alto apalancamiento a la vez. Prefiere opciones de interfaz cuando existan alternativas claras.
   - Actualiza el borrador del plan tras cada respuesta de planificación.
   - Resuelve las preguntas de comportamiento, datos, seguridad, API y UX dirigidas al usuario antes de la implementación.
   - Si la tarea afecta a la base de datos, registra el impacto en DB, migración, rollback, compatibilidad, validación, recuperación y actualizaciones de documentación necesarias en el plan de tarea.
   - Si puede ser necesaria una decisión duradera, incluye una propuesta de ADR en el plan en lugar de escribir directamente en `agents/docs/decisions.md`.
   - Mantén el plan en `draft` mientras se esté refinando. Cuando no queden preguntas bloqueantes, pregunta al usuario si está listo para aprobación. Solo tras confirmación explícita puede el agente cambiar su estado a `approved`.

3. Lista de verificación
   - Crea/actualiza `agents/task/TASK-XXX-checklist.md` a partir de `agents/task/checklist.md`.
   - Deriva los elementos de la lista de verificación solo del plan aprobado.
   - Si la tarea afecta a la base de datos, incluye elementos de lista de verificación para actualizaciones de esquema DB, actualizaciones del registro de cambios DB, comprobaciones de backup/recuperación y validación de migración.

4. Implementar con TDD
   - Lee y aplica `agents/skills/test-driven-development/SKILL.md` una vez al inicio de la implementación y síguelo para el proceso red/green/refactor.
   - Lee el plan de tarea aprobado, la lista de verificación, `agents/docs/testing.md` y los archivos fuente de verdad relevantes.
   - Usa `agents/docs/testing.md` solo para comandos, ubicaciones, fixtures y requisitos de validación específicos del proyecto.
   - Antes de cada bloque de implementación, relee solo las secciones relevantes del plan, los elementos de la lista de verificación y los archivos fuente.
   - `/implement` solo puede comenzar desde un plan `approved`; establece el estado del plan a `in_progress` inmediatamente antes del primer cambio de implementación y mantenlo así hasta que el cierre sea aprobado.
   - Tras cada pasada GREEN, ejecuta un control de calidad ligero: prefiere el diseño más simple que pase, elimina la duplicación real, evita abstracciones prematuras y cuestiona el código de producción que solo existe para las pruebas.
   - Tras la implementación y validación, ejecuta una revisión final independiente limitada al plan aprobado, la lista de verificación y los cambios de la tarea. Prefiere un subagente separado o un contexto de revisión nuevo cuando esté disponible.
   - No generes subagentes para cada pequeño paso RED/GREEN. Úsalos para puntos de control con mucho contexto.
   - Registra los resultados de los puntos de control en la lista de verificación o el plan en lugar de depender de la memoria larga de la conversación.
   - Marca los elementos de la lista de verificación a medida que se completan.
   - Si el trabajo test-first no es factible, detente a menos que la excepción ya esté documentada en el plan aprobado y la lista de verificación.

5. Validar
   - Ejecuta pruebas dirigidas, luego comandos de validación completos. Consulta `agents/docs/testing.md` para los comandos reales.
   - Ejecuta lint/typecheck/build cuando corresponda.
   - Informa fallos no relacionados antes de ampliar el alcance.
   - Revisa `agents/docs/DoD.md`.

6. Documentar
   - Actualiza los documentos fuente de verdad solo cuando el contrato duradero del proyecto cambie.
   - Los cambios de API actualizan `agents/docs/api.md`.
   - Los cambios de DB actualizan el esquema DB y los archivos de registro de cambios DB declarados en el Mapa de Fuentes de Verdad, más `agents/db/domain.md` cuando el modelo de dominio o las reglas de negocio cambien sustancialmente.
   - Las reglas UI reutilizables actualizan `agents/docs/design.md`.
   - Los cambios de dependencias actualizan `agents/docs/dependency-policy.md` cuando la política en sí cambie, y `agents/docs/decisions.md` cuando se registre un nuevo ADR de dependencia.
   - Las decisiones duraderas pueden actualizar `agents/docs/decisions.md` solo tras aprobación explícita del usuario.

7. Cerrar
   - Pregunta antes de marcar la tarea del backlog como completada.
   - Verifica que la tarea cumpla con `agents/docs/DoD.md` mientras el plan esté aún `in_progress`.
   - Establece el estado del plan a `closed` en el paso final de cierre antes de archivar los archivos de la tarea.
   - Cuando el usuario apruebe marcar una tarea como completada, mueve sus archivos de plan/lista de verificación a `agents/task/archive/` en el mismo paso de cierre.
   - No crees ramas ni commits a menos que el usuario lo solicite.

## Límites
- No inventes requisitos faltantes.
- No modifiques archivos no relacionados.
- No realices refactors amplios durante el trabajo de funcionalidad. Si se encuentra algo fuera del alcance, regístralo en `agents/docs/debt.md` en lugar de modificarlo.
- No introduzcas dependencias sin seguir `agents/docs/dependency-policy.md`.
- No cambies APIs públicas a menos que el plan aprobado lo indique.
- No cambies autenticación, autorización, pagos, migraciones u otro comportamiento sensible de seguridad sin cobertura explícita del plan.
- No elimines pruebas a menos que las reemplaces con una cobertura equivalente o mejor.
- No cambies el esquema DB sin actualizar el archivo de registro de cambios DB declarado en el Mapa de Fuentes de Verdad con SQL de migración forward y notas de rollback.
- Si una tarea afecta a la base de datos, el plan de tarea debe cubrir el enfoque de migración, rollback o irreversibilidad, compatibilidad con datos persistidos, riesgos operativos, validación, expectativas de backup/recuperación y actualizaciones de documentación necesarias.
- Prefiere cambios DB aditivos o por fases para sistemas existentes cuando los cambios destructivos directos pudieran arriesgar datos persistidos o despliegues con versiones mixtas.
- Nunca expongas secretos, tokens, credenciales, claves privadas ni datos sensibles similares a los de producción.

## Comandos
Los comandos de validación (test, lint, typecheck, build, validación completa) están definidos en `agents/docs/testing.md`.

Comandos no relacionados con validación:

| Propósito | Comando | Notas |
|---|---|---|
| Instalar | no configurado | Política de gestor de paquetes y archivo de bloqueo |
| Servidor de desarrollo | no configurado | Requisitos de puerto y entorno |

## Convenciones de Código
- Prefiere patrones existentes y helpers locales.
- Mantén los cambios pequeños, intencionados y limitados a la tarea.
- Prefiere la solución más simple que cumpla el requisito aprobado y las pruebas actuales.
- Introduce una interfaz solo cuando haya 2 o más implementaciones reales, o el plan aprobado requiera explícitamente esa abstracción.
- Extrae un helper o adaptador solo cuando haya 2 o más consumidores reales con lógica repetida.
- Cuestiona cualquier código de producción que exista solo para facilitar las pruebas; prefiere configuración del lado de prueba a menos que el diseño de producción se beneficie genuinamente.
- Añade comentarios solo para lógica no obvia.
- Los comentarios deben explicar la intención, invariantes, propiedad, restricciones o por qué existe la estructura, no reiterar mecánicas obvias.
- Evita la narración línea por línea, comentarios de asignación obvios o comentarios que solo parafraseen el código.
- Mantén los comentarios concisos y localmente útiles. Prefiere un comentario corto antes de un bloque no obvio en lugar de muchos micro-comentarios en línea.
- El proyecto debe definir el idioma preferido para comentarios durante el arranque o en sus documentos fuente de verdad. Hasta entonces, sigue el idioma dominante del repositorio si existe.
- Traslada las convenciones detalladas a documentos fuente de verdad cuando se conviertan en reglas duraderas del proyecto.

## Estándares de Calidad
- Diseña el código para que sea mantenible y extensible sin sobreingeniería del requisito actual.
- Mantén los módulos y funciones enfocados en una responsabilidad clara.
- Evita la duplicación, pero no introduzcas abstracciones sin al menos dos consumidores reales o un requisito explícito de la tarea.
- Preserva los contratos públicos existentes a menos que el plan aprobado los cambie explícitamente.
- Añade o actualiza pruebas para cada cambio de comportamiento, incluyendo casos extremos relevantes y rutas de error.
- Considera rendimiento, seguridad, observabilidad y compatibilidad cuando sean relevantes para el cambio.
- Prefiere cambios incrementales que puedan revisarse, probarse y revertirse de forma independiente.

## Estructura del Proyecto
Añade solo las rutas principales con su propósito.
