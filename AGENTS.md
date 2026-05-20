# AGENTS.md

Este repositorio comienza como un esqueleto de agente y puede prepararse para trabajo activo en un proyecto.

## Modo

Modo actual: `skeleton`.

Este repositorio está en modo de bootstrap de agente. No se permite la implementación de funcionalidades de producto.

Para el alcance del modo skeleton, la información de configuración requerida, la validación y la transición al modo proyecto, sigue `agents/docs/bootstrap.md`. Después de la transición al modo proyecto, el bootstrap archivado está en `agents/task/archive/bootstrap-*.md` (solo referencia histórica).

No modifiques el código fuente del producto ni archivos no relacionados a menos que los documentos de bootstrap lo permitan explícitamente o el usuario lo solicite explícitamente.

## Proyecto
Completa esta sección durante el bootstrap. Deja los campos en blanco solo mientras sean desconocidos o aún no estén configurados.
- Product:
- Domain:
- Users:
- Goal:

## Stack
Completa solo lo que aplique durante el bootstrap.
- Runtime/framework:
- Package manager:
- Database:
- Test tools:
- Deployment:
- External services:

## Reglas Operativas
- En modo skeleton, editar archivos de configuración del agente (`AGENTS.md`, `agents/**`, `.opencode/**`) no requiere aprobación del usuario. La columna de aprobación del Source of Truth Map solo aplica en modo proyecto.
- Antes de modificar un documento fuente de verdad en modo proyecto, revisa la columna **¿Aprobación necesaria?** en el Source of Truth Map para determinar si se necesita aprobación explícita.
- Los cambios de comportamiento del producto requieren el flujo de trabajo SDD a continuación.
- Los cambios de plantilla/mantenimiento del agente pueden hacerse directamente cuando el usuario lo solicite explícitamente.
- El mantenimiento del skeleton no es implementación de producto y no requiere una tarea en el backlog, plan ni checklist a menos que el usuario solicite ese flujo de trabajo.
- La inicialización de un nuevo proyecto en modo `skeleton` requiere aprobación explícita del usuario y debe seguir `agents/docs/bootstrap.md`.
- Las solicitudes exploratorias, de asesoría, solo de revisión o solo de planificación no cambian código a menos que el usuario solicite ediciones.
- Mantén los cambios dentro del alcance de la tarea activa o del mantenimiento explícitamente solicitado.
- Prefiere actualizar documentos fuente de verdad estables en lugar de duplicar instrucciones.
- Los documentos fuente de verdad del proyecto y los planes de tarea aprobados anulan la guía de skills cuando entran en conflicto.
- Trata los campos en blanco, los marcadores de placeholder y los comandos `not available` como configuración faltante, no como instrucciones para improvisar.
- Los documentos de bootstrap archivados son solo referencias históricas y no deben seguirse a menos que el usuario solicite explícitamente mantenimiento o revisión del bootstrap.

## Presupuesto de Tokens
- Comunícate con el usuario en español a menos que solicite otro idioma.
- Mantén las actualizaciones de progreso breves y envíalas solo para descubrimientos significativos, bloqueos, ediciones o resultados de validación.
- Evita repetir contexto ya presente en la conversación.
- Prefiere respuestas finales concisas: resultado, archivos modificados, validación y advertencias relevantes.
- No uses lenguaje intencionalmente degradado o demasiado escueto si reduce la corrección o claridad.

## Mapa de Fuentes de Verdad
Lee el conjunto útil más pequeño. Usa esta tabla para decidir qué abrir, no como una lista de lectura obligatoria.

| File | Área | Propósito | Leer cuando | ¿Aprobación necesaria? |
|---|---|---|---|---|
| `agents/docs/bootstrap.md` | Bootstrap | Configuración del skeleton y transición a proyecto | modo skeleton o mantenimiento del bootstrap | No |
| `agents/task/backlog.md` | Tarea activa | Cola de tareas y selección actual | Planificar o implementar trabajo de producto | No |
| `agents/task/TASK-XXX-plan.md` | Plan de tarea | Alcance y contrato de comportamiento | Implementar o validar tarea | No |
| `agents/task/TASK-XXX-checklist.md` | Checklist de tarea | Registro de ejecución y punto de reanudación | Implementar o reanudar tarea | No |
| `agents/task/plan.md` | Plantilla de plan | Plantilla para planes de tarea | Crear un nuevo plan de tarea | No |
| `agents/task/checklist.md` | Plantilla de checklist | Plantilla para checklists | Crear un nuevo checklist | No |
| `agents/docs/DoD.md` | Aceptación | Definición de completado | Antes de la validación y cierre | Yes |
| `agents/docs/testing.md` | Pruebas | Comandos de prueba, fixtures, reglas de validación | Agregar/ejecutar pruebas o validar trabajo | Solo si cambia la validación |
| `agents/docs/decisions.md` | Decisiones | Registros ADR | Planificar, decisión duradera o asuntos de justificación pasada | No |
| `agents/docs/api.md` | Contratos de API | Rutas, payloads, errores, compatibilidad | Rutas, clientes o payloads de API afectados | No |
| `agents/db/schema.sql` | Esquema de BD | Estructura actual. Sobrescribe la ruta durante el bootstrap si el proyecto tiene la suya propia. | Persistencia, migraciones, consultas o esquema afectados | No |
| `agents/db/changes.sql` | Registro de cambios de BD | Cambios SQL ordenados con notas de rollback. Sobrescribe la ruta durante el bootstrap si el proyecto tiene la suya propia. | Persistencia, migraciones, consultas o esquema afectados | No |
| `agents/db/domain.md` | Dominio de BD | Vocabulario, entidades, reglas de negocio | Modelo de datos o reglas de negocio afectados | No |
| `agents/docs/design.md` | Diseño de UI | Tokens de UI reutilizables, componentes, a11y | UI, sistema de diseño o comportamiento UX afectados | No |
| `agents/docs/dependency-policy.md` | Dependencias | Reglas para nuevas dependencias | Agregar o evaluar una dependencia | Yes |
| `agents/docs/debt.md` | Deuda técnica | Hallazgos y bugs fuera del alcance | Se encontró algo fuera del alcance de la tarea activa | Yes |

## Skills
Use a skill only when its trigger matches the request. Project stack and source-of-truth docs override skill assumptions.

| Skill | Path | Use when | Avoid when |
|---|---|---|---|
| Test-Driven Development | `agents/skills/test-driven-development/SKILL.md` | Read and apply once before implementation code for features, bug fixes, behavior changes, or behavior-preserving refactors; it is the TDD methodology authority | Docs-only, planning-only, config-only changes with no behavior |
| Interface Design | `agents/skills/interface-design/SKILL.md` | Designing, implementing, improving, or reviewing UI/UX, frontend visuals, responsive behavior, interaction states, forms, navigation, dashboards, components, and accessibility tied to UI | Backend-only work, SEO-only audits, security review, brand identity-only work, image generation, or measured performance optimization |
| SEO Audit | `agents/skills/seo-audit/SKILL.md` | Auditing public pages for crawlability, indexation, metadata, content structure, Core Web Vitals, internal links, schema, or rankings | Private dashboards, backend-only work, UI polish without SEO scope |
| Code Review Excellence | `agents/skills/code-review-excellence/SKILL.md` | Reviewing code changes, PRs, architecture-sensitive diffs, or when explicitly asked for a code review | Implementing code directly, formatting-only checks, or replacing automated lint/tests |
| Security Review | `agents/skills/security-review/SKILL.md` | Reviewing authentication, authorization, data flow, secrets, user input, API security, infrastructure config, or when explicitly asked for a security review | Theoretical hardening without code context, test-only files unless requested, or broad security rewrites outside an approved plan |
| Performance | `agents/skills/performance/SKILL.md` | Auditing or improving page load, Core Web Vitals, bundle/resource loading, runtime jank, images, fonts, caching, or web performance regressions | Premature optimization, backend-only work with no web performance impact, or memoization/refactors without measured bottlenecks |
| Context7 MCP | `agents/skills/context7-mcp/SKILL.md` | Library, framework, SDK, API, CLI, or cloud-service documentation and examples | Business-logic debugging, refactoring, review, or non-library programming concepts |
| Find Skills | `agents/skills/find-skills/SKILL.md` | Discovering or installing agent skills for a capability | Direct implementation when no skill discovery is requested |

Frontend precedence: use only `interface-design` for UI/UX, frontend visuals, responsive behavior, interaction states, forms, navigation, components, accessibility tied to UI, and UI review. Do not load separate UI skills.
Quality precedence: use `security-review` for exploitable security analysis, `performance` for measured web performance work, and `code-review-excellence` for general code review. UI accessibility is handled by `interface-design` unless the project later adds a separate specialist accessibility workflow. Project source-of-truth docs and approved task plans override skill assumptions.

"Read and apply" means: open the skill file with the Read tool and follow its instructions. Do NOT use the skill tool — project skills are not registered as system-level skills in this runtime.

## Flujo de Trabajo SDD
La implementación de producto comienza solo cuando hay exactamente una tarea en `## Current` de `agents/task/backlog.md`.

1. Seleccionar tarea
   - Lee `agents/task/backlog.md`.
   - Si `## Current` tiene cero o múltiples tareas, pide al usuario que seleccione o cree una.

2. Planificar
   - Lee los ADR aceptados relevantes en `agents/docs/decisions.md` antes de proponer opciones de comportamiento o implementación.
   - Crea/actualiza `agents/task/TASK-XXX-plan.md` a partir de `agents/task/plan.md`.
   - Resuelve preguntas de comportamiento, datos, seguridad, API y UX orientada al usuario antes de la implementación.
   - Si la tarea afecta la base de datos, registra el impacto en BD, migración, rollback, compatibilidad, validación, recuperación y actualizaciones de documentación requeridas en el plan de tarea.
   - Si puede ser necesaria una decisión duradera, incluye una propuesta ADR en el plan en lugar de escribir directamente en `agents/docs/decisions.md`.
   - No implementes hasta que el usuario apruebe el plan específico de la tarea.

3. Checklist
   - Crea/actualiza `agents/task/TASK-XXX-checklist.md` a partir de `agents/task/checklist.md`.
   - Deriva los elementos del checklist solo del plan aprobado.
   - Si la tarea afecta la base de datos, incluye elementos del checklist para actualizaciones del esquema de BD, actualizaciones del registro de cambios de BD, verificaciones de backup/recuperación y validación de migración.

4. Implementar con TDD
   - Lee y aplica `agents/skills/test-driven-development/SKILL.md` una vez al inicio de la implementación y síguelo para el proceso red/green/refactor.
   - Lee el plan de tarea aprobado, el checklist, `agents/docs/testing.md` y los archivos fuente de verdad relevantes.
   - Usa `agents/docs/testing.md` solo para comandos específicos del proyecto, ubicaciones, fixtures y requisitos de validación.
   - Marca los elementos del checklist a medida que se completan.
   - Si el trabajo test-first no es factible, detente a menos que la excepción ya esté documentada en el plan y checklist aprobados.

5. Validar
   - Ejecuta pruebas específicas, luego los comandos de validación completa. Consulta `agents/docs/testing.md` para los comandos reales.
   - Ejecuta lint/typecheck/build cuando sea relevante.
   - Reporta fallos no relacionados antes de ampliar el alcance.
   - Revisa `agents/docs/DoD.md`.

6. Documentar
   - Actualiza los documentos fuente de verdad solo cuando el contrato duradero del proyecto cambie.
   - Los cambios de API actualizan `agents/docs/api.md`.
   - Los cambios de BD actualizan el esquema de BD y los archivos de registro de cambios de BD declarados en el Source of Truth Map, además de `agents/db/domain.md` cuando el modelo de dominio o las reglas de negocio cambien materialmente.
   - Las reglas de UI reutilizables actualizan `agents/docs/design.md`.
   - Los cambios de dependencias actualizan `agents/docs/dependency-policy.md` cuando la política misma cambia, y `agents/docs/decisions.md` cuando se registra un nuevo ADR de dependencia.
   - Las decisiones duraderas pueden actualizar `agents/docs/decisions.md` solo después de la aprobación explícita del usuario.

7. Cerrar
   - Pregunta antes de marcar la tarea del backlog como completada.
   - Cuando el usuario apruebe marcar una tarea como completada, mueve sus archivos de plan/checklist a `agents/task/archive/` en el mismo paso de cierre.
   - No crees ramas ni commits a menos que el usuario lo solicite.

## Límites
- No inventes requisitos faltantes.
- No cambies archivos no relacionados.
- No realices refactors amplios durante el trabajo en funcionalidades. Si se encuentra algo fuera del alcance, regístralo en `agents/docs/debt.md` en lugar de modificarlo.
- No introduzcas dependencias sin seguir `agents/docs/dependency-policy.md`.
- No cambies APIs públicas a menos que el plan aprobado lo indique.
- No cambies autenticación, autorización, pagos, migraciones u otro comportamiento sensible a la seguridad sin cobertura explícita del plan.
- No elimines pruebas a menos que las reemplaces con cobertura equivalente o mejor.
- No cambies el esquema de BD sin actualizar el archivo de registro de cambios de BD declarado en el Source of Truth Map con SQL de migración forward y notas de rollback.
- Si una tarea afecta la base de datos, el plan de tarea debe cubrir el enfoque de migración, rollback o irreversibilidad, compatibilidad con datos persistidos, riesgos operativos, validación, expectativas de backup/recuperación y actualizaciones de documentación requeridas.
- Prefiere cambios aditivos o por etapas en BD para sistemas existentes cuando los cambios destructivos directos arriesgarían datos persistidos o despliegues de versión mixta.
- Nunca expongas secretos, tokens, credenciales, llaves privadas o datos sensibles similares a producción.

## Comandos
Los comandos de validación (test, lint, typecheck, build, full validation) están definidos en `agents/docs/testing.md`.

Comandos que no son de validación:

| Propósito | Comando | Notas |
|---|---|---|
| Install | not configured | Gestor de paquetes y política de lockfile |
| Dev server | not configured | Requisitos de puerto y entorno |

## Convenciones de Código
- Prefiere patrones existentes y helpers locales.
- Mantén los cambios pequeños, intencionados y dentro del alcance de la tarea.
- Agrega comentarios solo para lógica no obvia.
- Traslada las convenciones detalladas a documentos fuente de verdad cuando se conviertan en reglas duraderas del proyecto.

## Estructura del Proyecto
Agrega solo rutas principales con su propósito.
