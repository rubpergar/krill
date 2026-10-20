# Dependency Policy

Rules for adding or changing a dependency. The goal is to keep the dependency surface small, reproducible, and auditable.

This document applies only when the project has a package manager. Mark as `Not applicable` otherwise; the bootstrap transition deletes this file when it is not used.

## Before adding

- State the specific problem it solves.
- Prefer the standard library or existing project code when they suffice.
- If a similar dependency already exists, explain why it does not.
- Check the project's existing versioning and update policy before choosing a version.

## Evaluate at least two alternatives

Include "do not add anything". For each, consider:

- **Maturity**: stable version, active maintenance, community size.
- **License**: compatible with the project, no copyleft surprise.
- **Maintenance cost**: breaking changes, number of transitive dependencies.
- **Security**: historical CVEs, attack surface, install scripts, supply-chain risk.
- **Size**: bundle, install time, and disk impact.

## Versioning

Direct dependencies use exact versions by default: no `^`, `~`, `*`, `latest`, or git/URL ranges. Install them with the package manager's exact-save mode (for example `pnpm add --save-exact`). A different policy is an explicit project decision recorded as an ADR; the exception and its scope belong in that ADR.

Commit the lockfile. CI, or the project's validation command, installs from it with the package manager's frozen mode (for example `pnpm install --frozen-lockfile`). Transitive versions are pinned by the lockfile; do not add a direct dependency only to pin a transitive range. Use a documented override when the package manager requires one.

Updates go through automated tooling (for example Renovate or Dependabot) or explicit PRs. Review breaking changes and audit results before merging.

Existing direct ranges are a finding to resolve in a task, not a silent rewrite.

## Security checks

Before adding a runtime dependency, run the project's audit command (for example `pnpm audit --prod`) and record the result in the ADR. Run the same audit in CI, a scheduled job, or the project's validation command, and review findings.

Review install scripts before allowing them; record the approval in the task or ADR.

Do not auto-merge dependency updates without reviewing breaking changes and audit results. If a known vulnerability is accepted, record the reason and the follow-up in the ADR or task record.

## Record the decision

Every new runtime dependency is recorded as an ADR in `agents/docs/decisions.md` with the name, exact version, purpose, alternatives considered, evaluation summary, and audit result.

## Exceptions

Dev tooling that is the ecosystem standard (linter, formatter, test framework, type checker, build tool) still needs justification and an ADR entry, but may skip the alternatives evaluation. Dependencies from the initial scaffold are already decided by the stack choice. In both cases, direct versions still follow the versioning rule.
