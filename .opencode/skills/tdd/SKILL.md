---
name: tdd
description: Test-driven development. Use when building features or fixing bugs test-first, when the user mentions red-green, or when adding or reviewing tests. Covers public interfaces, seams, tautological tests, and mocking.
---

# Test-Driven Development

TDD is the red → green loop: write a failing test, watch it fail, then write only enough code to pass it. If you did not watch the test fail, you do not know whether it tests the right thing.

## When to use

Always for new features, bug fixes, behavior changes, and behavior-preserving refactors.

Exceptions, only with explicit user approval: throwaway prototypes, generated code, configuration-only changes.

## The contract rule

**Tests adapt to the production contract. Never the other way around.**

- Do not change production behavior, add production branches, or widen a public interface only to make a test pass.
- If a test is hard to write, that is design feedback: adjust the test or the design. Do not bend production to satisfy an artificial test.
- Do not add methods, flags, or branches to production code that exist only for tests. Test setup and cleanup belong in test utilities.
- A test that forces production to change shape in order to pass is an anti-pattern, not a requirement.

## What a good test is

Tests verify behavior through public interfaces, not implementation details. Code can change entirely; tests should not. A good test reads like a specification: "user can check out with a valid cart" tells you what capability exists, and it survives refactors because it does not care about internal structure.

## Seams: where tests go

A **seam** is the public boundary you test at: the interface where you observe behavior without reaching inside. Tests live at seams, never against internals.

**Test only at pre-agreed seams.** Before writing tests, write down the seams under test and confirm them with the user. Testing effort should land on the critical paths and complex logic, not on every edge case.

## Anti-patterns

- **Implementation-coupled:** mocks internal collaborators, tests private methods, or verifies through a side channel (for example, querying the database instead of using the interface). The tell: the test breaks when you refactor but behavior has not changed.
- **Tautological:** the assertion recomputes the expected value the way the code does (`expect(add(a, b)).toBe(a + b)`), so it passes by construction and can never disagree with the code. Expected values must come from an independent source of truth: a known-good literal, a worked example, or the spec.
- **Horizontal slicing:** writing all tests first, then all implementation. Work in vertical slices instead: one test, one implementation, repeat.

See [tests.md](tests.md) for good and bad examples, and [mocking.md](mocking.md) for when and how to mock, including the mocking anti-patterns.

## Rules of the loop

- **Red before green.** Write the failing test first, then only enough code to pass it. Do not anticipate future tests or add speculative features.
- **One slice at a time.** One seam, one test, one minimal implementation per cycle.
- **Refactoring is not part of the loop.** It belongs to the review stage, not the red → green cycle. Keep tests green and do not add behavior while implementing.

## Pre-existing and legacy code

If production code already existed before this task (legacy code, user-written code, code from a previous task, or third-party code):

- Do not delete it.
- Add a failing regression or specification test that captures the expected behavior or the observed bug.
- Verify it fails for the correct reason, then recover the TDD cycle from there.

For code written during this task without a failing test first: delete it and implement fresh from tests.
