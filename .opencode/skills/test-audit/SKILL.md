---
name: test-audit
description: Audit the project test surface for quality and functional coverage, then fill only the gaps the user confirms. Use when reviewing whether existing tests are valid, finding coverage gaps, or building a safety net for legacy code. Never chases a coverage percentage.
---

# Test Audit

Audit the test surface first; write tests only for confirmed gaps. The default output is a report, not new tests.

`agents/docs/testing.md` is the source of truth for commands, locations, fixtures, coverage settings, the Valid Test Criteria, and the Functional Coverage rule. Read and apply it; do not restate it here.

## Default mode: audit only

1. **Discover the test surface.** Read `agents/docs/testing.md`; inspect source roots, test roots, naming patterns, registries, and module boundaries. Map any provided scope to the matching modules and files. For a large surface, split the audit into a few independent areas and run each in its own sub-agent, then merge the reports; do not spawn one sub-agent per file.
2. **Analyze behavior.** For each in-scope behavior, identify public behavior, inputs and outputs, side effects, invariants, preconditions, error paths, and external boundaries.
3. **Classify coverage.** Label existing coverage as positive, negative, edge, or invariant. Flag gaps, weak assertions, duplicates, implementation-coupled tests, and tautological tests.
4. **Verify validity.** Check every existing test against the Valid Test Criteria in `agents/docs/testing.md` and report each violation, even when the test passes.
5. **Report.** Do not write anything unless the user confirms.

Use the Functional Coverage rule in `agents/docs/testing.md` to decide what counts as a gap. A behavior without a test is a gap regardless of the coverage percentage; the percentage is a signal, never a target.

## Generation mode: only confirmed gaps

When the user confirms specific gaps:

- Prefer extending the closest existing suite; otherwise create the minimal new file following project conventions.
- Test at pre-agreed seams, behavior-first, one behavior per test. Follow `.opencode/skills/tdd/SKILL.md`.
- Tests adapt to the production contract; never change production to satisfy a test.
- Do not add tautological or implementation-coupled tests; expected values come from an independent source.
- Update only the required test-side registration files.
- If a gap needs missing infrastructure, an unclear contract, or production changes, record it in `agents/docs/debt.md` instead of guessing.

## Validation

When tests are written, run the most targeted command first, then broader ones, then coverage if configured. Fix test-side failures; report production bugs and record them in `agents/docs/debt.md` unless asked to fix them.

## Report

- Scope analyzed.
- Modules or behaviors table: area, source, existing tests, gaps found, tests written.
- Coverage gaps found.
- Validity violations found and how they were resolved.
- Test changes made.
- Validation results (targeted, full suite, coverage).
- Debt or blockers.

## Constraints

- Keep changes scoped and inside test locations, fixtures, utilities, and registries unless the user asks otherwise.
- Do not create duplicate suites when extending an existing suite is enough.
- Do not invent commands beyond what `agents/docs/testing.md` confirms.
- If the project has no usable test command, stop and report what is missing.
