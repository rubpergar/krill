---
name: project-bootstrap
description: Adopt the Krill agent skeleton into an existing project: inspect the repository, confirm findings with the user, fill the source-of-truth docs, run the readiness check, and transition from skeleton to project mode. Use when adopting Krill into an existing project, configuring source-of-truth docs, confirming stack and commands, or transitioning skeleton to project mode.
---

# Project Bootstrap

Adopt the agent skeleton for an **existing project** (one with source code, manifests, config files). Read `agents/docs/bootstrap.md` first: it is the source of truth for allowed scope, approval rules, readiness criteria, and the transition contract. Follow it; do not restate or override it. For new or empty projects, use the incremental initialization path described in that same file.

## General rules

- Do not modify product source code, configuration, or dependencies during adoption.
- Write only to `AGENTS.md`, `agents/**`, and agent files, within the allowed scope in `agents/docs/bootstrap.md`.
- Classify every finding as `detected` (observed), `inferred` (needs confirmation), or `missing` (not found).
- Mark unconfirmed fields `pending confirmation` and user-accepted inferences `user-approved assumption: <description>`.
- If the repository has no product code, stop and point the user to the new project initialization path in `agents/docs/bootstrap.md`.

## Procedure

### 1. Auto-detection

Inspect for existing product code:
- Manifests (`package.json`, `Cargo.toml`, `pyproject.toml`, `go.mod`, etc.)
- Source directories (`src/`, `lib/`, `app/`, `packages/`)
- Project configuration files

If there is no product code, stop and inform the user.

### 2. Non-invasive inspection

- **Structure**: list root directories; inspect `src/`/`lib/`/`app/`/`packages/` up to 3 levels; detect monorepo signs (workspace config, `packages/`, `apps/`).
- **Stack**: review manifests for runtime and frameworks (`package.json` JS/TS, `Cargo.toml` Rust, `pyproject.toml` Python, `go.mod` Go, `Gemfile` Ruby, `composer.json` PHP, `pom.xml`/`build.gradle` Java/Kotlin, `.csproj` .NET).
- **Package manager**: identify by lockfile (`package-lock.json` npm, `yarn.lock` yarn, `pnpm-lock.yaml` pnpm, `Cargo.lock` cargo, `poetry.lock` poetry, `Gemfile.lock` bundler, `go.sum` go, `composer.lock` composer). If several match, ask the user.
- **Tests**: look for config or deps (`jest.config.*`, `vitest.config.*`, `.mocharc.*`, `playwright.config.*`, `cypress.config.*`, `pytest.ini`, `[tool.pytest]`, `rspec`, `cargo test`, `*.test.*`/`*.spec.*`); identify the existing test command.
- **CI**: review pipelines (`.github/workflows/*.yml`, `.gitlab-ci.yml`, `Jenkinsfile`, `.circleci/config.yml`, `azure-pipelines.yml`); extract test/lint/build/deploy commands.
- **Docs**: read `README.md`, `CONTRIBUTING.md`, `CHANGELOG.md`, `docs/`, `ARCHITECTURE.md`, ADRs, `API.md` or `api/`/`openapi/`/`swagger/`, existing agent configs (`.opencode/`, `.claude/`, `AGENTS.md`).
- **Config**: review `.gitignore`, `.dockerignore`, `Dockerfile`, `docker-compose.yml`, `.env.example` (template only, never `.env`), style config (`.editorconfig`, `.prettierrc`, `tsconfig.json`, etc.), linter config (ESLint, Prettier, Ruff, rustfmt, clippy, golangci-lint, RuboCop, etc.).
- **Agent runtime**: if `opencode.json` or equivalent exists, inspect configured plugins and MCPs. Treat them as `detected` only when declared in project config, not because they may exist globally on the machine.

### 3. Summary

Present findings in three groups:

| Category | Findings |
|---|---|
| **Detected** (observed) | Stack, PM, test tool, CI, linters |
| **Inferred** (needs confirmation) | Probable commands, framework, architecture |
| **Missing** (needs user) | Product identity, deployment, DB, external services, agent runtime not declared in project |

### 4. Confirmation questions

Ask one by one through the OpenCode question interface; do not print questions as ordinary output when the interface is available. Use `$ARGUMENTS` as a seed when relevant.

- **Product**: name, domain/industry, target users, main goal.
- **Commands**: present detected/inferred values and ask for the real command per purpose (Install, Dev server, Test targeted, Test full suite, Lint, Typecheck, Build). Use `not available` when it does not exist.
- **Stack**: confirm runtime, framework, PM, database, test tools, deployment, external services.
- **Agent runtime**: confirm project-level plugins and MCPs. Present values detected from `opencode.json` for confirmation. If not declared in project config, leave them blank unless the user explicitly wants them recorded as project capabilities.
- **Critical modules**: key services, entry points, sensitive areas.
- **Restrictions**: security (auth, payments, PII), performance, deployment limits, code standards, branch/release workflows.
- **Additional documents**: ask whether the project needs `agents/docs/api.md` (API?), `agents/db/schema.sql` + `agents/db/domain.md` (DB/model?), `agents/docs/design.md` (UI?). `agents/docs/decisions.md` always stays.

### 5. Fill source-of-truth docs

Write only facts confirmed by the user. Never write unconfirmed inferences as authoritative.

- **`AGENTS.md`**: `## Project` (Product, Domain, Users, Goal); `## Stack` (runtime/framework, package manager, database, test tools, deployment, external services); `## Agent Runtime` (plugins, MCPs) when confirmed; `## Commands` with confirmed commands; `## Project Structure` with primary routes and purpose.
- **`agents/docs/testing.md`**: test commands, locations, services, env vars.
- **Additional docs (per step 4)**: `agents/docs/api.md` (base URL, routes, auth, formats, errors); `agents/db/schema.sql` (DB type, schema, migrations, connection); `agents/db/domain.md` (vocabulary, entities, business rules); `agents/docs/design.md` (components, styles, a11y, tokens); `agents/docs/decisions.md` (existing ADRs).

Mark unused files `Not applicable`. The transition deletes every `Not applicable` document and its Source of Truth Map row, so an adopted project keeps only the documents it uses.

### 6. Mark uncertainty

Before writing, distinguish:

- **confirmed**: the user answered explicitly (including `not available`).
- **assumed**: the user accepted an inference (record as `user-approved assumption: <description>`).
- **pending**: the user did not answer, said "I don't know", or it could not be detected and confirmed.

Write confirmed fields as-is. Write assumed fields with the assumption note. Do not write pending fields as authoritative; mark them `pending confirmation`.

### 7. Readiness check

Classify each field as `confirmed`, `assumed`, or `pending`. A field counts as resolved if `confirmed` or `assumed`; `pending` is unresolved. Apply the readiness criteria and pass thresholds defined in `agents/docs/bootstrap.md` to decide whether readiness passes.

If readiness is partial or does not pass, ask whether the user wants to resolve pending fields now or defer. If it does not pass, explain the blockers and do not offer transition.

### 8. Transition to project mode

Follow the transition contract in `agents/docs/bootstrap.md`: switch the `AGENTS.md` mode, replace the skeleton-mode message with the project-mode message, remove the skeleton-only bootstrap rules and the `agents/docs/bootstrap.md` row from the Source of Truth Map, and verify that durable findings are recorded before deleting anything.

When the transition is partial, add `Pending fields: <list>. Resolve them in a task plan before working on those areas.` to the project-mode message.

Delete the bootstrap-only artifacts and the unused conditional documents as the final step, in this order:

1. Every `Not applicable` source-of-truth document (`api.md`, `design.md`, `dependency-policy.md`, `agents/db/*`) and its Source of Truth Map row.
2. `agents/docs/bootstrap.md`
3. `.opencode/commands/bootstrap.md`
4. `.opencode/skills/project-bootstrap/` (this skill directory)

Report the completed transition before the final self-deletion.

If the user declines, keep the partial configuration, stay in skeleton mode, and note that the user can resume later.
