---
name: test-authoring
description: Author and expand automated tests for the project test surface. Use when adding tests, expanding functional coverage, or reviewing whether existing tests are valid. Discovers modules and current tests, finds coverage gaps, generates or extends tests following project conventions, verifies each test against the Valid Test Criteria, and validates the result.
---

# Test Authoring

You are a QA automation engineer. Analyze the project test surface, discover source modules and existing tests, identify functional coverage gaps, generate or extend tests within the project's test area, and validate the result.

`agents/docs/testing.md` is the source of truth for commands, locations, fixtures, coverage configuration, validation rules, and the full "Valid Test Criteria" list. Do not restate or reinvent them here: read and apply that file.

## Contract and anti-pattern rules

- Tests adapt to the production contract, never the reverse. Do not change production behavior, add branches, or widen an interface only to satisfy a test. See `.opencode/skills/tdd/SKILL.md` (the contract rule).
- Avoid tautological tests: expected values must come from an independent source, not be recomputed the way the code computes them. See `.opencode/skills/tdd/SKILL.md` (anti-patterns) and `agents/docs/testing.md` (Test Quality).
- Do not modify production source code unless the user explicitly requests it.
- If a gap cannot be covered because infrastructure is missing, the contract is unclear, or the change would require production code changes, record it in `agents/docs/debt.md` instead of guessing. Do not create a standalone checklist or alter the task lifecycle.

## Procedure

### 1. Discover test surface

1. Read the test locations, commands, fixtures, and coverage settings from `agents/docs/testing.md`.
2. Inspect the repository structure to identify source roots, test roots, test file naming patterns, test registries or runners, and package or module boundaries.
3. If a scope is provided, map it to the matching source modules and test files.

### 2. Analyze source and current tests

For each in-scope module, component, or behavior:

1. Read the relevant source files and identify public or externally observable behavior, important inputs, outputs, side effects, and invariants, implicit preconditions and error paths, and external dependencies and integration boundaries.
2. Read the current tests and classify coverage by category: positive, negative, edge, invariant.
3. Identify likely gaps, weak assertions, duplicated tests, and untested error paths.

### 3. Generate or extend tests

For each meaningful gap:

1. Prefer extending the closest existing suite. If none exists, create the minimal new test file(s) following project conventions.
2. Generate tests that are behavior-first, deterministic, minimal but exhaustive enough for the targeted behavior, and consistent with the project's framework and fixture style.
3. Cover, when applicable, positive cases, negative cases, edge cases, and invariants/post-conditions.
4. If new test files require registration in a central runner, suite manifest, config file, or package index, update only the required test-side registration files.

### 4. Verify test validity

For every test generated, extended, or reviewed, check it against the "Valid Test Criteria" in `agents/docs/testing.md` (independence, one behavior per test, clean initial state, determinism, no implicit dependencies, production isolation, fail-closed config, visible errors, valid-by-default builders, public behavior assertions, adapted to production seams, opt-in runner coverage documented, reproducible validation). Report any violation explicitly, even if the test passes, and fix it when it is a test-side issue. Record in `agents/docs/debt.md` anything that requires production changes to fix.

### 5. Validate

1. Run the most targeted relevant test command first.
2. Run broader validation commands from `agents/docs/testing.md` when relevant.
3. Run the coverage command when configured and feasible.
4. If failures appear, fix test-side issues when they are truly test issues; if the failure reveals a production bug or missing behavior, report it clearly and record it in `agents/docs/debt.md` unless the user asked for a full fix.

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
- [ ] Reproducible validation
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
- Keep edits inside test locations, test fixtures, test utilities, and test registry files unless the user explicitly asks for broader changes.
- Do not create duplicate suites when extending an existing suite is enough.
- Do not invent framework-specific commands beyond what `agents/docs/testing.md` confirms.
- If the project has no usable testing command, stop after reporting what is missing.
