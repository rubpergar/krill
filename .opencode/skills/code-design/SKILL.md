---
name: code-design
description: Design discipline for production code: YAGNI, abstraction thresholds, complexity limits, module responsibility, and keeping production free of test-only code. Use when implementing a feature, refactoring, reviewing code, or deciding whether to introduce an abstraction.
---

# Code Design

Apply these rules when writing, refactoring, or reviewing production code. They are deliberate project policy, not generic advice.

## Simplicity
- Prefer the simplest solution that satisfies the approved requirement and the current tests.
- Do not add speculative features, parameters, or hooks for needs the plan does not have.

## Abstraction thresholds
- Introduce an interface only when there are 2 or more real implementations, or the approved plan explicitly requires that abstraction.
- Extract a helper or adapter only when there are 2 or more real consumers with repeated logic.
- Keep code in one place until real duplication or variation appears.

## Production stays production
Production code is never shaped by tests. See the contract rule in [`../tdd/SKILL.md`](../tdd/SKILL.md).

## Contracts
- Keep modules and functions focused on a clear responsibility.

## Module design
When surveying architecture or designing or restructuring a module's interface, read [DEEP-MODULES.md](DEEP-MODULES.md) for the shared vocabulary, deletion test, and interface-level reasoning. Small internal functions and deep modules are compatible; avoid exposing internal coordination to callers merely to keep individual files small.

## Complexity
- Keep functions small enough to reason about locally. A cyclomatic complexity around 10 is a warning line, not a gate: count `if`/`else if`, `switch` cases, loops, `catch`, and short-circuit boolean operators, then use judgment rather than the number.
- Do not raise decision complexity without a concrete reason. Explain a material increase in the plan or review, prefer simplifying during refactoring, and use the project's existing measurement tools instead of adding one.
- Prefer guard clauses and early returns over deep nesting. Nesting deeper than about 3 levels is a split signal.
- When a function passes the warning line, extract a cohesive block or replace a conditional with data or polymorphism. Do not split arbitrarily.
- Keep one level of abstraction per function; do not mix orchestration with low-level detail.
- A function that is hard to test at its seam, or whose name needs "and", is a split signal.

## Comments
- Comment only non-obvious logic, and explain intent, invariants, ownership, constraints, or why the structure exists, not what the code does.
- Avoid line-by-line narration and comments that paraphrase the code.
- Follow the project's preferred comment language when one is defined.

## Conventions
- Prefer existing patterns and local helpers.
