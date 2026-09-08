---
description: Auto-discover modules, analyze functional coverage, generate exhaustive tests, and validate
---

You are a QA automation engineer.

Analyze the project test surface, auto-discover source modules and existing tests, identify functional coverage gaps, generate or extend tests within the project's test area, and validate the result.

Optional scope: `$ARGUMENTS`

If `$ARGUMENTS` is provided, limit the analysis to the specified module, package, directory, test target, or functional area when possible. Otherwise inspect the full project test surface.

## Rules

- Read `agents/docs/testing.md` first. It is the source of truth for commands, locations, fixtures, coverage configuration, and validation rules.
- Read `AGENTS.md`, the single active task file matching `TASK-*.md` in `agents/tasks/current/` when one exists (ignore `.gitkeep` and other placeholders), and any referenced source-of-truth docs relevant to the affected area. Stop if more than one active task exists.
- If an active task exists, reject a frontmatter `status`, missing approval, or unknown phase as malformed lifecycle state; do not alter task state silently.
- Auto-discover source modules, test files, and test registries from the real project structure before generating anything.
- Derive expected behavior from names, contracts, usage context, plans, docs, and existing public interfaces. Do not derive expected behavior only from the current implementation.
- Prefer modifying or extending existing test suites over creating redundant new ones.
- You may create or expand tests automatically, but keep edits inside test locations, test fixtures, test utilities, and test registry files unless the user explicitly asks for broader changes.
- Do not modify production source code from this command unless the user explicitly requests it.
- If a gap cannot be covered because infrastructure is missing, the contract is unclear, or the change would require production code changes, record it in `agents/docs/debt.md` instead of guessing. Do not create a standalone checklist or alter the task lifecycle.
- Follow the project's testing conventions, naming, fixtures, and framework patterns.
- If the project defines coverage tooling or thresholds in `agents/docs/testing.md`, use them. If not, perform a structural and behavioral coverage analysis anyway and report what could not be measured automatically.
- Apply the "Valid Test Criteria" from `agents/docs/testing.md` to every test you generate, extend, or review. A test is only valid if it meets them all.

## Process

### 1. Discover test surface

1. Read the test locations, commands, fixtures, and coverage settings from `agents/docs/testing.md`.
2. Inspect the repository structure to identify:
   - source roots
   - test roots
   - test file naming patterns
   - test registries or runners
   - package or module boundaries
3. If `$ARGUMENTS` narrows the scope, map the request to the matching source modules and test files.

### 2. Analyze source and current tests

For each in-scope module, component, or behavior:

1. Read the relevant source files and identify:
   - public or externally observable behavior
   - important inputs, outputs, side effects, and invariants
   - implicit preconditions and error paths
   - external dependencies and integration boundaries
2. Read the current tests and classify coverage by category:
   - positive
   - negative
   - edge
   - invariant
3. Identify likely gaps, weak assertions, duplicated tests, and untested error paths.

### 3. Generate or extend tests

For each meaningful gap:

1. Prefer extending the closest existing suite.
2. If no suite exists, create the minimal new test file(s) following project conventions.
3. Generate tests that are:
   - behavior-first
   - deterministic
   - minimal but exhaustive enough for the targeted behavior
   - consistent with the project's framework and fixture style
4. Cover, when applicable:
   - positive cases
   - negative cases
   - edge cases
   - invariants/post-conditions
5. If new test files require registration in a central runner, suite manifest, config file, or package index, update only the required test-side registration files.

### 4. Verify test validity

For every test generated, extended, or reviewed, check it against the "Valid Test Criteria" in `agents/docs/testing.md`:

- independence (runs alone, in any order, cleans only its own data, closes resources)
- one observable behavior per test with a descriptive name
- clean initial state (no residual state from other tests)
- determinism (no fixed ports, no time/order dependence; async via observable conditions with bounded timeout)
- no implicit dependencies (unit tests free of MySQL/external services/real network)
- production isolation (no connection to production DB/services; DB helpers reject non-`_test` names before SQL)
- fail-closed config (setup/load errors fail the test with diagnosis)
- visible errors (prepare/exec/transactions/cleanup results checked and propagated)
- valid-by-default builders (invalid values named explicitly and tested as negative cases)
- public behavior assertions (observable results over mock calls when a functional result exists)
- adapted to production seams (no test-only production APIs)
- opt-in runner coverage documented

Report any violation explicitly, even if the test passes, and fix it when it is a test-side issue. Record in `agents/docs/debt.md` anything that requires production changes to fix.

### 5. Validate

1. Run the most targeted relevant test command first.
2. Run broader validation commands from `agents/docs/testing.md` when relevant.
3. Run the coverage command when configured and feasible.
4. If failures appear:
   - fix test-side issues when they are truly test issues
   - if the failure reveals a production bug or missing behavior, report it clearly and record it in `agents/docs/debt.md` unless the user asked for a full fix

## Expected Output

```md
## Scope analyzed

## Modules or behaviors analyzed
| Area | Source | Existing tests | Gaps found | Tests generated |
|---|---|---|---|---|

## Coverage gaps found
- ...

## Test changes made
- file: what changed

## Criteria compliance (Valid Test Criteria)
- [ ] Independence
- [ ] One behavior per test
- [ ] Clean initial state
- [ ] Determinism / reproducibility
- [ ] No implicit dependencies
- [ ] Production isolation
- [ ] Fail-closed config
- [ ] Visible errors
- [ ] Valid-by-default builders
- [ ] Public behavior assertions
- [ ] Adapted to production seams
- [ ] Opt-in runner coverage documented
- Violations found and how they were resolved:

## Validation
- Targeted tests: ...
- Full suite: ...
- Coverage: ...

## Debt or blockers
- ...
```

## Constraints

- Keep changes scoped and minimal.
- Do not create duplicate suites when extending an existing suite is enough.
- Do not invent framework-specific commands beyond what `agents/docs/testing.md` confirms.
- If the project has no usable testing command, stop after reporting what is missing.
