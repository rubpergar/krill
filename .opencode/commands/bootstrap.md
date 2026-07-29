---
description: Adaptar el agente a un proyecto existente, configurar los documentos fuente de la verdad y hacer la transición a modo proyecto
---

Adapta este esqueleto de agente para un **proyecto existente** (uno con código fuente, manifiestos, archivos de configuración). Para proyectos nuevos/vacíos usa la ruta de inicialización incremental descrita en `agents/docs/bootstrap.md`.

Fuente de la verdad para reglas y preparación del bootstrap: `agents/docs/bootstrap.md`.

Contexto opcional: `$ARGUMENTS`

Si se proporciona `$ARGUMENTS`, úsalo como semilla para pre-rellenar respuestas y reducir el número de preguntas.

## Reglas Generales

- No modifiques el código fuente del producto, la configuración ni las dependencias durante la adopción.
- Escribe únicamente en `AGENTS.md`, `agents/` y archivos del agente.
- Clasifica cada hallazgo como `detected` (observado), `inferred` (necesita confirmación) o `missing` (no encontrado).
- Los campos no confirmados se marcan como `pending confirmation`.
- Las suposiciones aprobadas por el usuario se marcan como `user-approved assumption: <description>`.
- Si el repositorio está vacío o no tiene código de producto, informa al usuario que este comando es para adopción en proyectos existentes y sugiere la ruta de inicialización de proyectos nuevos de `agents/docs/bootstrap.md`.

## Flujo

### 1. Auto-detección

Inspecciona el repositorio en busca de código de producto existente. Busca:
- Manifiestos (`package.json`, `Cargo.toml`, `pyproject.toml`, `go.mod`, etc.)
- Directorios de código (`src/`, `lib/`, `app/`, `packages/`)
- Archivos de configuración del proyecto

Si no hay código de producto, detente e informa al usuario.

### 2. Fase 1 — Inspección No Invasiva

**2.1 Estructura** — Lista los directorios raíz. Inspecciona `src/`/`lib/`/`app/`/`packages/` hasta 3 niveles. Detecta señales de monorepo (configuración de workspace, `packages/`, `apps/`).

**2.2 Stack** — Revisa los manifiestos para el runtime: `package.json` (JS/TS), `Cargo.toml` (Rust), `pyproject.toml` (Python), `go.mod` (Go), `Gemfile` (Ruby), `composer.json` (PHP), `pom.xml`/`build.gradle` (Java/Kotlin), `.csproj` (.NET). Verifica dependencias en busca de frameworks.

**2.3 Gestor de Paquetes** — Identifícalo por el lockfile: `package-lock.json` (npm), `yarn.lock` (yarn), `pnpm-lock.yaml` (pnpm), `Cargo.lock` (cargo), `poetry.lock` (poetry), `Gemfile.lock` (bundler), `go.sum` (go), `composer.lock` (composer). Si hay múltiples, pregunta al usuario.

**2.4 Tests** — Busca config/deps: `jest.config.*`, `vitest.config.*`, `.mocharc.*`, `playwright.config.*`, `cypress.config.*`, `pytest.ini`, `[tool.pytest]`, `rspec`, `cargo test`, `*.test.*`/`*.spec.*`. Identifica el comando de test existente.

**2.5 CI** — Revisa los pipelines (`.github/workflows/*.yml`, `.gitlab-ci.yml`, `Jenkinsfile`, `.circleci/config.yml`, `azure-pipelines.yml`). Extrae los comandos de test/lint/build/deploy.

**2.6 Docs** — Lee `README.md`, `CONTRIBUTING.md`, `CHANGELOG.md`, `docs/`, `ARCHITECTURE.md`, ADRs, `API.md` o `api/`/`openapi/`/`swagger/`, configuraciones de agente existentes (`.opencode/`, `.claude/`, `AGENTS.md`).

**2.7 Config** — Revisa `.gitignore`, `.dockerignore`, `Dockerfile`, `docker-compose.yml`, `.env.example` (solo la plantilla, nunca `.env`), configuración de estilo (`.editorconfig`, `.prettierrc`, `tsconfig.json`, etc.), configuración de linter (ESLint, Prettier, Ruff, rustfmt, clippy, golangci-lint, RuboCop, etc.).

**2.8 Runtime del agente** — Si existe `opencode.json` o una configuración de agente equivalente, inspecciona los plugins y MCPs configurados. Trátalos como `detected` solo cuando están declarados en la configuración del proyecto, no porque puedan existir globalmente en la máquina.

### 3. Fase 2 — Resumen

Presenta los hallazgos en tres grupos:

| Categoría | Hallazgos |
|---|---|
| **Detected** (observado) | Stack, PM, herramienta de test, CI, linters |
| **Inferred** (necesita confirmación) | Comandos probables, framework, arquitectura |
| **Missing** (necesita usuario) | Identidad del producto, despliegue, BD, servicios externos, runtime del agente no declarado en el proyecto |

### 4. Fase 3 — Preguntas de Confirmación

Pregunta al usuario una por una. Usa `$ARGUMENTS` como semilla cuando sea relevante.

**4.1 Producto:**
- Nombre del producto
- Dominio/industria
- Usuarios objetivo
- Objetivo principal

**4.2 Comandos:**
Presenta los detectados/inferidos. Pregunta el comando real para cada propósito. Usa `not available` cuando no exista.

| Propósito | Detectado | Confirmado |
|---|---|---|
| Instalar | ... | ... |
| Servidor de desarrollo | ... | ... |
| Test (específico) | ... | ... |
| Test (suite completa) | ... | ... |
| Lint | ... | ... |
| Typecheck | ... | ... |
| Build | ... | ... |

**4.3 Stack:**
Confirma: runtime, framework, PM, base de datos, herramientas de test, despliegue, servicios externos.

**4.4 Runtime del agente:**
Confirma los plugins y MCPs a nivel de proyecto disponibles para el agente. Si se detectaron desde `opencode.json`, preséntalos para confirmación. Si no están declarados en la configuración del proyecto, déjalos en blanco a menos que el usuario quiera registrarlos explícitamente como capacidades del proyecto.

**4.5 Módulos Críticos:**
Servicios clave, puntos de entrada, áreas sensibles.

**4.6 Restricciones:**
Seguridad (auth, pagos, PII), rendimiento, límites de despliegue, estándares de código, flujos de ramas/releases.

**4.7 Documentos Adicionales:**
Pregunta si el proyecto necesita:
- `agents/docs/api.md` (¿API?)
- `agents/db/schema.sql` + `agents/db/domain.md` (¿BD/modelo?)
- `agents/docs/design.md` (¿UI?)
- `agents/docs/decisions.md` (¿ADR?)

### 5. Fase 4 — Rellenar Documentos Fuente de la Verdad

Escribe solo hechos confirmados por el usuario. Nunca escribas inferencias no confirmadas como autoritativas.

**5.1 `AGENTS.md`:**
- Rellena `## Project` (Product, Domain, Users, Goal)
- Rellena `## Stack` (Runtime/framework, Package manager, Database, Test tools, Deployment, External services)
- Rellena `## Agent Runtime` (Plugins, MCPs) cuando esté confirmado
- Rellena `## Commands` con los comandos confirmados
- Rellena `## Project Structure` con las rutas principales y su propósito

**5.2 `agents/docs/testing.md`:**
- Comandos de test, ubicaciones, servicios, variables de entorno

**5.3 Documentos Adicionales (según 4.6):**
- `agents/docs/api.md`: URL base, rutas, auth, formatos, errores
- `agents/db/schema.sql`: tipo de BD, esquema, migraciones, conexión
- `agents/db/domain.md`: vocabulario, entidades, reglas de negocio
- `agents/docs/design.md`: componentes, estilos, a11y, tokens
- `agents/docs/decisions.md`: ADRs existentes

Marca los archivos no utilizados como `Not applicable`.

### 6. Fase 5 — Marcar Incertidumbre

Antes de escribir, distingue:

- **confirmed**: el usuario respondió explícitamente (incluyendo respuestas `not available`).
- **assumed**: el usuario aceptó una inferencia ("user-approved assumption").
- **pending**: el usuario no respondió, dijo "no lo sé", o no se pudo detectar y confirmar.

Campos confirmados → se escriben tal cual.
Campos asumidos → se escriben con la nota `user-approved assumption: <description>`.
Campos pendientes → no se escriben como autoritativos; se marcan `pending confirmation`.

### 7. Verificación de Preparación

Clasifica los campos en dos categorías (consulta `agents/docs/bootstrap.md` para los criterios completos):

**Campos críticos** (requeridos para modo proyecto):
- Producto: nombre, dominio, usuarios, objetivo
- Runtime/framework
- Gestor de paquetes
- Comando de instalación
- Al menos un comando de test

**Campos diferibles** (importantes pero no bloquean la transición):
- Base de datos, despliegue, servicios externos
- Lint, typecheck, build
- Documentos adicionales (api.md, design.md, decisions.md, schema.sql)
- Estructura del proyecto

Un campo cuenta como resuelto si está `confirmed` o `assumed` (incluyendo `not available`). Un campo `pending` cuenta como no resuelto.

Evalúa la completitud:

| % Críticos resueltos | Escenario | Acción |
|---|---|---|
| 100% | Completamente completo | Preparación limpia. Ofrecer transición. |
| ≥75% y <100% | Parcialmente completo | La preparación pasa con observaciones. Ofrecer transición listando campos pendientes. El usuario decide. |
| <75% y ≥50% | Mayormente incompleto | La preparación NO pasa. Explicar bloqueos. No ofrecer transición. |
| <50% | Largamente incompleto | La preparación NO pasa. Explicar bloqueos. No ofrecer transición. |
| 0% sin contexto | Nada completado | Solo ocurre con repos vacíos. Ya se detuvo en auto-detección. |

Para parcial o mayormente incompleto: pregunta si el usuario quiere responder los campos pendientes ahora o diferirlos.

### 8. Transición a Modo Proyecto

Sigue el veredicto de preparación:

**Si la preparación pasa (completa o parcial):**
Pregunta: "¿Quieres hacer la transición a modo proyecto?"

- Si sí (completo):
  - En `AGENTS.md`: cambia `Current mode: \`skeleton\`` a `Current mode: \`project\``
  - Reemplaza el mensaje de modo skeleton con el mensaje de modo proyecto (consulta `agents/docs/bootstrap.md`)
  - Mueve `agents/docs/bootstrap.md` a `agents/task/archive/bootstrap-YYYY-MM-DD.md`
  - Confirma que el archivo archivado es referencia histórica

- Si sí (parcial):
  - Misma transición y archivado que completo, pero añade al mensaje de modo proyecto: "Pending fields: <list>. Resuelve estos campos en un plan de tarea antes de trabajar en esas áreas."
  - Archiva `bootstrap.md` en `agents/task/archive/bootstrap-YYYY-MM-DD.md` (referencia histórica; los campos pendientes se registran en el mensaje de modo anterior).

- Si no:
  - La configuración parcial se guarda. El repositorio permanece en modo skeleton.
  - El usuario puede reanudar más tarde.

**Si la preparación NO pasa (mayormente incompleto):**
- No ofrezcas transición.
- Explica: "Cannot transition to project mode until these critical fields are resolved: <list>."
- Sugiere: "Run `/bootstrap` again when you have that information, or use `/bootstrap <context>` to pre-fill answers."
