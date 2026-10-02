# Dependency Policy

Rules for adding a dependency (library, package, framework). The goal is to avoid accidental dependency bloat and ensure every addition is justified.

This document applies only when the project has a package manager. Delete it otherwise.

## Before adding

- State the specific problem it solves.
- Prefer the standard library or existing project code when they suffice.
- If a similar dependency already exists, explain why it does not.

## Evaluate at least two alternatives

Include "do not add anything". For each, consider:

- **Maturity**: stable version, active maintenance, community size.
- **License**: compatible with the project, no copyleft surprise.
- **Maintenance cost**: breaking changes, number of transitive dependencies.
- **Security**: historical CVEs, attack surface, supply-chain risk.
- **Size**: bundle, install time, and disk impact.

## Versioning

Pin versions according to a project decision. If the choice is durable (for example, exact versions only), record it as an ADR in `agents/docs/decisions.md`. Updates are handled by automated tooling or explicit PRs, each reviewed for breaking changes before merge.

## Record the decision

Every new runtime dependency is recorded as an ADR in `agents/docs/decisions.md` with the name, exact version, purpose, alternatives considered, and evaluation summary.

## Exceptions

Dev tooling that is the ecosystem standard (linter, formatter, test framework, type checker, build tool) still needs justification and an ADR entry, but may skip the alternatives evaluation. Dependencies from the initial scaffold are already decided by the stack choice.
