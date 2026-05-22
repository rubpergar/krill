---
description: Adopt the agent into an existing project, configure source-of-truth docs, and transition to project mode
---

Adopts this agent skeleton for an **existing project** (one with source code, manifests, config files). For new/empty projects use the incremental initialization path described in `agents/docs/bootstrap.md`.

Source of truth for bootstrap rules and readiness: `agents/docs/bootstrap.md`.

Optional context: `$ARGUMENTS`

If `$ARGUMENTS` is provided, use it as a seed to pre-fill answers and reduce the number of questions.

## General Rules

- Do not modify product source code, configuration, or dependencies during adoption.
- Write only to `AGENTS.md`, `agents/`, and agent files.
- Do not delete, move, or restructure files under `agents/docs/` during bootstrap.
- Preserve the existing template structure of `agents/docs/*` files and fill them in place.
- Classify each finding as `detected` (observed), `inferred` (needs confirmation), or `missing` (not found).
- Unconfirmed fields are marked `pending confirmation`.
- User-approved assumptions are marked `user-approved assumption: <description>`.
- If information cannot be verified, leave the target fields blank unless the document explicitly expects `not available`.
- Do not clear or delete `agents/docs/debt.md` or `agents/docs/decisions.md` just because they are empty. Empty initial content is valid.
- Do not clear or delete `agents/docs/testing.md` when the project has no testing, lint, typecheck, or build tooling. Record those commands as `not available`.
- If the repository has frontend/UI code, fill `agents/docs/design.md` using its current template and keep the YAML block intact. Validate with `npx @google/design.md lint agents/docs/design.md` when Node.js is available.
- If bootstrap uncertainty could cause accidental deletion, reorganization, or fabricated content, stop and ask the user before writing.
- If the repository is empty or has no product code, inform the user this command is for existing project adoption and suggest the new project initialization path from `agents/docs/bootstrap.md`.

## Flow

### 1. Auto-detection

Inspect the repository for existing product code. Look for:
- Manifests (`package.json`, `Cargo.toml`, `pyproject.toml`, `go.mod`, etc.)
- Source directories (`src/`, `lib/`, `app/`, `packages/`)
- Project configuration files

If there is no product code, stop and inform the user.

### 2. Phase 1 — Non-invasive Inspection

**2.1 Structure** — List root directories. Inspect `src/`/`lib/`/`app/`/`packages/` up to 3 levels. Detect monorepo signs (workspace config, `packages/`, `apps/`).

**2.2 Stack** — Review manifests for runtime: `package.json` (JS/TS), `Cargo.toml` (Rust), `pyproject.toml` (Python), `go.mod` (Go), `Gemfile` (Ruby), `composer.json` (PHP), `pom.xml`/`build.gradle` (Java/Kotlin), `.csproj` (.NET). Check dependencies for frameworks.

**2.3 Package Manager** — Identify by lockfile: `package-lock.json` (npm), `yarn.lock` (yarn), `pnpm-lock.yaml` (pnpm), `Cargo.lock` (cargo), `poetry.lock` (poetry), `Gemfile.lock` (bundler), `go.sum` (go), `composer.lock` (composer). If multiple, ask the user.

**2.4 Tests** — Look for config/deps: `jest.config.*`, `vitest.config.*`, `.mocharc.*`, `playwright.config.*`, `cypress.config.*`, `pytest.ini`, `[tool.pytest]`, `rspec`, `cargo test`, `*.test.*`/`*.spec.*`. Identify existing test command.

**2.5 CI** — Review pipelines (`.github/workflows/*.yml`, `.gitlab-ci.yml`, `Jenkinsfile`, `.circleci/config.yml`, `azure-pipelines.yml`). Extract test/lint/build/deploy commands.

**2.6 Docs** — Read `README.md`, `CONTRIBUTING.md`, `CHANGELOG.md`, `docs/`, `ARCHITECTURE.md`, ADRs, `API.md` or `api/`/`openapi/`/`swagger/`, existing agent configs (`.opencode/`, `.claude/`, `AGENTS.md`).

**2.7 Config** — Review `.gitignore`, `.dockerignore`, `Dockerfile`, `docker-compose.yml`, `.env.example` (template only, never `.env`), style config (`.editorconfig`, `.prettierrc`, `tsconfig.json`, etc.), linter config (ESLint, Prettier, Ruff, rustfmt, clippy, golangci-lint, RuboCop, etc.).

### 3. Phase 2 — Summary

Present findings in three groups:

| Category | Findings |
|---|---|
| **Detected** (observed) | Stack, PM, test tool, CI, linters |
| **Inferred** (needs confirmation) | Probable commands, framework, architecture |
| **Missing** (needs user) | Product identity, deployment, DB, external services |

### 4. Phase 3 — Confirmation Questions

Ask the user one by one. Use `$ARGUMENTS` as seed when relevant.

**4.1 Product:**
- Product name
- Domain/industry
- Target users
- Main goal

**4.2 Commands:**
Present detected/inferred ones. Ask for the real command for each purpose. Use `not available` when it does not exist.

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
Confirm: runtime, framework, PM, database, test tools, deployment, external services.

**4.4 Critical Modules:**
Key services, entry points, sensitive areas.

**4.5 Restrictions:**
Security (auth, payments, PII), performance, deployment limits, code standards, branch/release workflows.

**4.6 Additional Documents:**
Ask if the project needs:
- `agents/docs/api.md` (API?)
- `agents/db/schema.sql` + `agents/db/domain.md` (DB/model?)
- `agents/docs/design.md` (UI?)
- `agents/docs/decisions.md` (ADR?)

If a document already exists, preserve it in place and fill only the fields supported by verified information.

### 5. Phase 4 — Fill Source-of-Truth Docs

Write only facts confirmed by the user. Never write unconfirmed inferences as authoritative.

**5.1 `AGENTS.md`:**
- Fill `## Project` (Product, Domain, Users, Goal)
- Fill `## Stack` (Runtime/framework, Package manager, Database, Test tools, Deployment, External services)
- Fill `## Commands` with confirmed commands
- Fill `## Project Structure` with primary routes and their purpose

**5.2 `agents/docs/testing.md`:**
- Test commands, locations, services, env vars
- When a command or tool does not exist yet, write `not available` instead of deleting rows, sections, or the file

**5.3 Additional Documents (per 4.6):**
- `agents/docs/api.md`: base URL, routes, auth, formats, errors
- `agents/db/schema.sql`: DB type, schema, migrations, connection
- `agents/db/domain.md`: vocabulary, entities, business rules
- `agents/docs/design.md`: components, styles, a11y, tokens, using the existing template and preserving blank unknown fields
- `agents/docs/decisions.md`: existing ADRs, without deleting the file if there are none yet

Mark unused files as `Not applicable` only when the document template explicitly supports that state. Otherwise preserve the file and leave unknown fields blank.

### 6. Phase 5 — Mark Uncertainty

Before writing, distinguish:

- **confirmed**: user answered explicitly (including `not available` responses).
- **assumed**: user accepted an inference ("user-approved assumption").
- **pending**: user did not answer, said "I don't know", or could not be detected and confirmed.

Confirmed fields → written as-is.
Assumed fields → written with note `user-approved assumption: <description>`.
Pending fields → not written as authoritative; marked `pending confirmation`.
If there is any doubt about how to represent missing information without altering the template safely, ask the user before editing.

### 7. Readiness Check

Classify fields into two categories (see `agents/docs/bootstrap.md` for full criteria):

**Critical fields** (required for project mode):
- Product: name, domain, users, goal
- Runtime/framework
- Package manager
- Install command
- At least one test command

**Deferrable fields** (important but do not block transition):
- Database, deployment, external services
- Lint, typecheck, build
- Additional documents (api.md, design.md, decisions.md, schema.sql)
- Project structure

A field counts as resolved if `confirmed` or `assumed` (including `not available`). A `pending` field counts as unresolved.

Evaluate completeness:

| % Critical resolved | Scenario | Action |
|---|---|---|
| 100% | Fully complete | Clean readiness. Offer transition. |
| ≥75% and <100% | Partially complete | Readiness passes with observations. Offer transition listing pending fields. User decides. |
| <75% and ≥50% | Mostly incomplete | Readiness does NOT pass. Explain blockers. Do not offer transition. |
| <50% | Largely incomplete | Readiness does NOT pass. Explain blockers. Do not offer transition. |
| 0% with no context | Nothing completed | Only happens with empty repos. Already stopped at auto-detection. |

For partial or mostly incomplete: ask if the user wants to answer pending fields now or defer.

### 8. Transition to Project Mode

Follow the readiness verdict:

**If readiness passes (complete or partial):**
Ask: "Do you want to transition to project mode?"

- If yes (complete):
  - In `AGENTS.md`: change `Current mode: \`skeleton\`` to `Current mode: \`project\``
  - Replace skeleton-mode message with project-mode message (see `agents/docs/bootstrap.md`)
  - Move `agents/docs/bootstrap.md` to `agents/task/archive/bootstrap-YYYY-MM-DD.md`
  - Confirm archived file is historical reference

- If yes (partial):
  - Same transition and archive as complete, but add to project-mode message: "Pending fields: <list>. Resolve them in a task plan before working on those areas."
  - Archive `bootstrap.md` to `agents/task/archive/bootstrap-YYYY-MM-DD.md` (historical reference; pending fields are tracked in the mode message above).

- If no:
  - The partial configuration is saved. Repository stays in skeleton mode.
  - User can resume later.

**If readiness does NOT pass (mostly incomplete):**
- Do not offer transition.
- Explain: "Cannot transition to project mode until these critical fields are resolved: <list>."
- Suggest: "Run `/bootstrap` again when you have that information, or use `/bootstrap <context>` to pre-fill answers."
