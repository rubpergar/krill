# Dependency Policy

Rules for introducing new dependencies (libraries, packages, frameworks) into the project. The goal is to avoid accidental dependency bloat and ensure every addition is justified, evaluated, and recorded.

## Scope

Applies to all runtime dependencies. Dev dependencies for tooling (lint, format, test, typecheck) follow a lighter path described in the exceptions section.

Dependencies that are part of the initial project scaffold (chosen during bootstrap) are exempt — they are already decided by the stack selection.

## 1. Justification

Before adding any dependency, answer:

- What specific problem does it solve?
- Can this be solved with the language/runtime standard library or existing project code?
- If a similar dependency already exists in the project, why does it not suffice?

## 2. Alternatives Considered

Evaluate at least two alternatives (including "do not add anything"). For each:

| Alternative | Maturity | License | Maintenance | Security | Size |
|---|---|---|---|---|---|
| ... | ... | ... | ... | ... | ... |

## 3. Evaluation Criteria

### Maturity
- Stable version (not alpha/beta/0.x unless justified)
- Regular releases and active maintenance
- Number of maintainers and community size

### License
Must be compatible with the project's license. Check:
- SPDX identifier
- GPL family copyleft risk
- Patent grants if applicable

### Maintenance Cost
- Frequency of breaking changes
- Number of transitive dependencies
- Community responsiveness (issues, PRs)

### Security
- Historical CVEs and how they were handled
- Attack surface of the dependency
- Supply-chain risk (maintainer trustworthiness, access control)

### Size Impact
- Bundle size contribution (if browser/client-side)
- Transitive dependency tree depth and width
- Install time and disk impact

## 4. Versioning Policy — Exact Versions Only

### Rule
All dependencies in `package.json` MUST use exact versions (`"1.2.3"`). Ranges with caret (`"^1.2.3"`), tilde (`"~1.2.3"`), or other operators are NOT allowed unless explicitly approved via an ADR exception.

### Rationale
- `^1.2.3` allows automatic resolution of `1.2.4`, `1.3.0`, etc. Even minor/patch releases can introduce behavioral changes, regressions, or incompatibilities.
- Exact pinning gives explicit control over when updates happen.
- The lockfile (`package-lock.json` / `yarn.lock` / `pnpm-lock.yaml`) already pins transitive resolutions, but pinning in `package.json` adds a visible, auditable layer of intent.

### How Updates Work
- Major, minor, and patch updates are managed via automated tooling (Dependabot, Renovate) or explicit manual PRs.
- Each update PR must be reviewed for breaking changes, changelog diff, and compatibility before merge.
- Security patches follow the same process but with higher priority — they are not exempt from review.

## 5. Decision Record

Every new dependency (including the chosen version) MUST be recorded as an ADR in `agents/docs/decisions.md` with:

- Name and exact version
- Purpose and scope of use
- Alternatives considered and why they were rejected
- Evaluation summary (license, maturity, maintenance, security, size)

## 6. Exceptions

The following dev dependencies may skip the alternatives evaluation step, but still need justification and an ADR entry:

- Linter and formatter (ESLint, Prettier, Ruff, rustfmt, etc.) — when they are the ecosystem standard
- Test framework (Vitest, Jest, pytest, etc.) — when consistent with project stack
- Type checker (TypeScript, mypy, etc.)
- Build tooling (Vite, esbuild, Webpack, etc.) — when consistent with project stack

All other dev dependencies (plugins, custom runners, code generators) follow the full policy.

## 7. Boundary Exclusion

The SDD workflow boundary rule (`AGENTS.md`) already says:

> "Do not introduce dependencies without documenting why."

This policy is the "documenting why" mechanism. That rule is updated to point here.

## 8. Exception Process

To approve an exception to any rule in this policy:
- Document the exception in the task file's Plan with rationale.
- Get explicit user approval.
- Record the exception as an ADR.

## Exempt from This Policy

- Dependencies introduced during project bootstrap / scaffold initialization.
- Critical security patches (CVE with active exploitation) — but the update still needs an ADR entry within one working cycle.
