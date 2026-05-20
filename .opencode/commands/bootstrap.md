---
description: Adopt the agent into an existing project, configure source-of-truth docs, and transition to project mode
---

Adopta este esqueleto de agente para un **proyecto existente** (uno con código fuente, manifiestos, archivos de configuración). Para proyectos nuevos/vacíos usa la ruta de inicialización incremental descrita en `agents/docs/bootstrap.md`.

Fuente de verdad para las reglas de bootstrap y preparación: `agents/docs/bootstrap.md`.

Contexto opcional: `$ARGUMENTS`

Si se proporciona `$ARGUMENTS`, úsalo como semilla para pre-llenar respuestas y reducir el número de preguntas.

## General Rules

- No modifiques el código fuente del producto, la configuración ni las dependencias durante la adopción.
- Escribe solo en `AGENTS.md`, `agents/` y archivos de agente.
- Clasifica cada hallazgo como `detected` (observado), `inferred` (necesita confirmación) o `missing` (no encontrado).
- Los campos no confirmados se marcan como `pending confirmation`.
- Las suposiciones aprobadas por el usuario se marcan como `user-approved assumption: <description>`.
- Si el repositorio está vacío o no tiene código de producto, informa al usuario que este comando es para adopción de proyectos existentes y sugiere la ruta de inicialización de proyectos nuevos desde `agents/docs/bootstrap.md`.

## Flow

### 1. Auto-detection

Inspecciona el repositorio en busca de código de producto existente. Busca:
- Manifests (`package.json`, `Cargo.toml`, `pyproject.toml`, `go.mod`, etc.)
- Source directories (`src/`, `lib/`, `app/`, `packages/`)
- Project configuration files

Si no hay código de producto, detente e informa al usuario.

### 2. Phase 1 — Non-invasive Inspection

**2.1 Structure** — Lista los directorios raíz. Inspecciona `src/`/`lib/`/`app/`/`packages/` hasta 3 niveles. Detecta señales de monorepo (configuración de workspace, `packages/`, `apps/`).

**2.2 Stack** — Revisa los manifiestos para el runtime: `package.json` (JS/TS), `Cargo.toml` (Rust), `pyproject.toml` (Python), `go.mod` (Go), `Gemfile` (Ruby), `composer.json` (PHP), `pom.xml`/`build.gradle` (Java/Kotlin), `.csproj` (.NET). Verifica las dependencias para frameworks.

**2.3 Package Manager** — Identifica por archivo de bloqueo: `package-lock.json` (npm), `yarn.lock` (yarn), `pnpm-lock.yaml` (pnpm), `Cargo.lock` (cargo), `poetry.lock` (poetry), `Gemfile.lock` (bundler), `go.sum` (go), `composer.lock` (composer). Si hay múltiples, pregunta al usuario.

**2.4 Tests** — Busca configuración/dependencias: `jest.config.*`, `vitest.config.*`, `.mocharc.*`, `playwright.config.*`, `cypress.config.*`, `pytest.ini`, `[tool.pytest]`, `rspec`, `cargo test`, `*.test.*`/`*.spec.*`. Identifica el comando de prueba existente.

**2.5 CI** — Revisa los pipelines (`.github/workflows/*.yml`, `.gitlab-ci.yml`, `Jenkinsfile`, `.circleci/config.yml`, `azure-pipelines.yml`). Extrae los comandos de test/lint/build/deploy.

**2.6 Docs** — Lee `README.md`, `CONTRIBUTING.md`, `CHANGELOG.md`, `docs/`, `ARCHITECTURE.md`, ADRs, `API.md` o `api/`/`openapi/`/`swagger/`, configuraciones de agente existentes (`.opencode/`, `.claude/`, `AGENTS.md`).

**2.7 Config** — Revisa `.gitignore`, `.dockerignore`, `Dockerfile`, `docker-compose.yml`, `.env.example` (solo plantilla, nunca `.env`), configuración de estilo (`.editorconfig`, `.prettierrc`, `tsconfig.json`, etc.), configuración de linter (ESLint, Prettier, Ruff, rustfmt, clippy, golangci-lint, RuboCop, etc.).

### 3. Phase 2 — Summary

Presenta los hallazgos en tres grupos:

| Category | Findings |
|---|---|
| **Detected** (observed) | Stack, PM, test tool, CI, linters |
| **Inferred** (needs confirmation) | Probable commands, framework, architecture |
| **Missing** (needs user) | Product identity, deployment, DB, external services |

### 4. Phase 3 — Confirmation Questions

Pregunta al usuario una por una. Usa `$ARGUMENTS` como semilla cuando sea relevante.

**4.1 Product:**
- Nombre del producto
- Dominio/industria
- Usuarios objetivo
- Objetivo principal

**4.2 Commands:**
Presenta los detectados/inferidos. Pregunta por el comando real para cada propósito. Usa `not available` cuando no exista.

| Purpose | Detected | Confirmed |
|---|---|---|
| Install | ... | ... |
| Dev server | ... | ... |
| Test (targeted) | ... | ... |
| Test (full suite) | ... | ... |
| Lint | ... | ... |
| Typecheck | ... | ... |
| Build | ... | ... |

**4.3 Stack:**
Confirma: runtime, framework, PM, base de datos, herramientas de prueba, despliegue, servicios externos.

**4.4 Critical Modules:**
Servicios clave, puntos de entrada, áreas sensibles.

**4.5 Restrictions:**
Seguridad (auth, pagos, PII), rendimiento, límites de despliegue, estándares de código, flujos de rama/release.

**4.6 Additional Documents:**
Pregunta si el proyecto necesita:
- `agents/docs/api.md` (¿API?)
- `agents/db/schema.sql` + `agents/db/domain.md` (¿BD/modelo?)
- `agents/docs/design.md` (¿UI?)
- `agents/docs/decisions.md` (¿ADR?)

### 5. Phase 4 — Fill Source-of-Truth Docs

Escribe solo hechos confirmados por el usuario. Nunca escribas inferencias no confirmadas como autoritativas.

**5.1 `AGENTS.md`:**
- Completa `## Project` (Product, Domain, Users, Goal)
- Completa `## Stack` (Runtime/framework, Package manager, Database, Test tools, Deployment, External services)
- Completa `## Commands` con los comandos confirmados
- Completa `## Project Structure` con las rutas principales y su propósito

**5.2 `agents/docs/testing.md`:**
- Comandos de prueba, ubicaciones, servicios, variables de entorno

**5.3 Additional Documents (per 4.6):**
- `agents/docs/api.md`: URL base, rutas, auth, formatos, errores
- `agents/db/schema.sql`: tipo de BD, esquema, migraciones, conexión
- `agents/db/domain.md`: vocabulario, entidades, reglas de negocio
- `agents/docs/design.md`: componentes, estilos, accesibilidad, tokens
- `agents/docs/decisions.md`: ADRs existentes

Marca los archivos no utilizados como `Not applicable`.

### 6. Phase 5 — Mark Uncertainty

Antes de escribir, distingue:

- **confirmed**: el usuario respondió explícitamente (incluyendo respuestas `not available`).
- **assumed**: el usuario aceptó una inferencia ("user-approved assumption").
- **pending**: el usuario no respondió, dijo "no lo sé", o no pudo ser detectado y confirmado.

Campos confirmados → se escriben tal cual.
Campos asumidos → se escriben con la nota `user-approved assumption: <description>`.
Campos pendientes → no se escriben como autoritativos; se marcan `pending confirmation`.

### 7. Readiness Check

Clasifica los campos en dos categorías (consulta `agents/docs/bootstrap.md` para los criterios completos):

**Critical fields** (required for project mode):
- Producto: nombre, dominio, usuarios, objetivo
- Runtime/framework
- Package manager
- Comando de instalación
- Al menos un comando de prueba

**Deferrable fields** (important but do not block transition):
- Base de datos, despliegue, servicios externos
- Lint, typecheck, build
- Documentos adicionales (api.md, design.md, decisions.md, schema.sql)
- Estructura del proyecto

Un campo cuenta como resuelto si está `confirmed` o `assumed` (incluyendo `not available`). Un campo `pending` cuenta como no resuelto.

Evalúa la completitud:

| % Critical resolved | Scenario | Action |
|---|---|---|
| 100% | Fully complete | Clean readiness. Offer transition. |
| ≥75% and <100% | Partially complete | Readiness passes with observations. Offer transition listing pending fields. User decides. |
| <75% and ≥50% | Mostly incomplete | Readiness does NOT pass. Explain blockers. Do not offer transition. |
| <50% | Largely incomplete | Readiness does NOT pass. Explain blockers. Do not offer transition. |
| 0% with no context | Nothing completed | Only happens with empty repos. Already stopped at auto-detection. |

Para parcial o mayormente incompleto: pregunta si el usuario quiere responder los campos pendientes ahora o posponerlo.

### 8. Transition to Project Mode

Sigue el veredicto de preparación:

**Si la preparación es satisfactoria (completa o parcial):**
Pregunta: "¿Quieres hacer la transición al modo proyecto?"

- Si sí (completo):
  - En `AGENTS.md`: cambia `Current mode: \`skeleton\`` a `Current mode: \`project\``
  - Reemplaza el mensaje de modo skeleton con el mensaje de modo proyecto (consulta `agents/docs/bootstrap.md`)
  - Mueve `agents/docs/bootstrap.md` a `agents/task/archive/bootstrap-YYYY-MM-DD.md`
  - Confirma que el archivo archivado es referencia histórica

- Si sí (parcial):
  - Misma transición y archivo que completo, pero agrega al mensaje de modo proyecto: "Campos pendientes: <list>. Resuélvelos en un plan de tarea antes de trabajar en esas áreas."
  - Archiva `bootstrap.md` en `agents/task/archive/bootstrap-YYYY-MM-DD.md` (referencia histórica; los campos pendientes se rastrean en el mensaje de modo anterior).

- Si no:
  - La configuración parcial se guarda. El repositorio permanece en modo skeleton.
  - El usuario puede reanudar más tarde.

**Si la preparación NO es satisfactoria (mayormente incompleto):**
- No ofrezcas la transición.
- Explica: "No se puede hacer la transición al modo proyecto hasta que estos campos críticos estén resueltos: <list>."
- Sugiere: "Ejecuta `/bootstrap` de nuevo cuando tengas esa información, o usa `/bootstrap <context>` para pre-llenar respuestas."
