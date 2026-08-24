---
description: Rigorous review of the active task's code (branch/commit diff) contrasted against the plan and acceptance criteria
---

Act as a senior production reviewer and perform a complete review of the code associated with krill's active task.

Review the diff of the task's work (current branch or task commits) and decide whether it is ready for closeout, detect real defects, and explain what must be fixed or justified. Be exhaustive within the task's scope, but do not turn it into a general refactor or a list of personal preferences.

Additional user context: `$ARGUMENTS`

## Input

- Identify the active task: the single file in `agents/tasks/current/`.
- Extract the ID (TASK-XXX) and read `agents/tasks/current/TASK-XXX.md` (Plan + Execution).
- Determine the review range: the diff of the current branch against its merge base, or the task's commits. If `$ARGUMENTS` provides concrete branches/commits, use them.
- Treat the rest of `$ARGUMENTS` as free context and options (e.g. `--deep`, `--no-checks`).

## Non-Negotiable Rules

- Use as source of truth for the plan/criteria: `agents/tasks/current/TASK-XXX.md`, the relevant source-of-truth docs (`agents/docs/decisions.md`, `api.md`, `dod.md`, `testing.md`, DB) and the ADRs.
- Use only read-only git operations: `git diff`, `git log`, `git status`. Do not make changes, commits, checkouts of other branches, or push.
- Capture the `head` and the base up front; the conclusion must correspond to the final reviewed state.
- Do not fetch a monolithic diff: first get the file list and review per file or in small groups.
- Do not read binaries or generated files as code; check their presence and role only if relevant.
- Respect `AGENTS.md`, the ADRs, the glossary, the task plan, and the source-of-truth docs.
- Do not invent requirements, states, modules, or acceptance criteria.
- Do not turn style, naming, or formatting into findings unless they affect clarity, security, maintainability, or bug risk.
- Do not formalize as a finding a pre-existing problem the diff neither causes nor exposes; leave it in `Residual risks or gaps`.
- Do not formalize a design alternative unless there is a concrete problem with demonstrable impact.

## Phase 1: Context Capture

1. Confirm the single active task file in `agents/tasks/current/`.
2. Read `agents/tasks/current/TASK-XXX.md` (Plan: Summary, Scope, Current/Target Behavior, Acceptance Criteria, Edge Cases, Assumptions; Execution: TDD ledger, Converge, Validation).
3. Get the git state: `git status --short`, `git log --oneline -15`, `git branch --show-current`.
4. Determine the diff range: base (merge base with the integration branch or the parent commit) → head.

Build an internal manifest with:
- Task ID and title, branch, base/head.
- Files classified as production, tests, config, migrations, documentation, binaries, or generated.
- The plan's explicit acceptance criteria.

## Phase 2: Scope and Contract

- Determine the actual scope with this priority:
  1. Plan and Execution of `agents/tasks/current/TASK-XXX.md`.
  2. Task description and user context.
  3. ADRs, API, domain, testing, dod, and related contractual documentation.
- Build an internal acceptance matrix:

```text
criterion | source | evidence | verified / failed / unverifiable / not applicable
```

Do not fill the matrix with invented criteria. If there are no explicit criteria, say so and limit the review to existing behavior and repository conventions.

Also build a behavior matrix derived from the diff:

```text
file or module | modified symbols | callers | contracts | happy paths | error paths | tests | coverage
```

## Phase 3: Diff and Context

- Get the specific diff of the production and test files.
- Read the full modified functions at head.
- Consult the surrounding code needed to understand ownership, lifecycle, contracts, and calls.
- Search in a scoped way for affected callers and consumers.
- Compare previous/next behavior when a regression may exist.
- Run a coverage pass over each row of the behavior matrix:
  - Is there a happy path? An error or timeout path?
  - Empty inputs, boundary values, partial states?
  - Is the public contract preserved?
  - Is ownership and cleanup maintained?
  - Does the test check observable behavior and not only implementation?
  - Is the change actually wired to production?
- Review the tests against the "Valid Test Criteria" in `agents/docs/testing.md` (independence, uniqueness, clean state, determinism, production isolation, visible errors, etc.).

## Phase 4: Adaptive Parallelization

Decide whether delegating pays off based on the actual diff:
- Up to 5 code files and 200 modified lines, without special risk: analyze directly without subagents.
- For larger changes or those affecting persistence, security, concurrency, IPC, public contracts, or lifecycle: launch subagents in parallel.
- With `--deep`, more than 20 code files, or important findings: add an independent gap pass.

When parallelizing, pass the manifest and only the relevant fragments to the subagents; they must not repeat global searches or edit files.

## Phase 5: Reconciliation

1. Compare the subagents' conclusions with the real diff.
2. Directly verify every candidate finding.
3. Merge duplicates and keep the strongest evidence.
4. Resolve discrepancies by reviewing the code, not by averaging opinions.
5. Audit that every modified production file appears in the matrix.
6. Audit that every explicit criterion has a state.
7. Separate reproducible defect, acceptance failure, and unverifiable evidence.
8. Reject speculative findings or refactors without concrete impact.

Classify severity:
- `blocking`: data corruption or loss, vulnerability, crash, critical regression, or serious breach of an essential contract.
- `important`: a real correctness, operation, compatibility, tests, performance, or maintainability problem that must be resolved or justified before closeout.
- `nit`: a minor, concrete, relevant improvement that should not block.

## Phase 6: Validation

Do not automatically run builds, tests, linters, or project commands without authorization. After static analysis, if `--no-checks` is absent, ask the user with `question`:
- Do not run checks.
- Run specific checks detected in `agents/docs/testing.md`.
- Run the full suite.
- Run a specific command provided by the user.

If checks are authorized, run the specific ones first and broaden only if the risk justifies it. Record commands, results, failures, and limitations.

## Phase 7: Currency

Before the final report, re-check the minimal git state and confirm the head did not change. If it changed, re-review only the affected files/criteria. If you cannot verify it, state that the report may be outdated.

## Output

The first line must be exactly `Findings`. Do not prepend a summary or manifest.

```text
Findings

1. [finding]
- Severity: `blocking|important|nit`
- Reference: file:line or file
- Explanation: concrete problem, activation condition, impact, and evidence
- Minimal suggested fix: only when it helps and without imposing a broad refactor

Status of previous indications
- Resolved: ...
- Pending, partial, or unverifiable: ...

Scope deviations
- ...

Reviewed context
- Task, commits/ref, sources consulted, and confidence level

Review coverage
- Contract and acceptance: state and brief evidence
- Code and execution paths: state and brief evidence
- Tests and wiring: state and brief evidence
- Documentation and deliverables: state and brief evidence

Validation
- Checks run or the reason they were not run

Residual risks or gaps
- Only relevant risks that do not rise to formal findings

Recommendation
- `request changes`, `comment`, or `approve`, always as an informational recommendation
```

If you find no problems, write explicitly `No blocking or important findings in the reviewed diff` and keep the validation and residual gaps when relevant.

Do not publish anything or execute write actions. Keep a technical, specific, and constructive tone.