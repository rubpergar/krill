# Testing Guide

Customize before product implementation. If a command is unavailable, write `not available` and explain the fallback.

This file defines project-specific testing logistics. Use `agents/skills/test-driven-development/SKILL.md` as the authority for the TDD workflow itself.

## Commands

### Fast (TDD cycle / pre-commit)
| Purpose | Command |
|---|---|
| Targeted unit | |
| Full unit | |
| Lint | |
| Typecheck | |

### Slow (pre-merge / CI)
| Purpose | Command |
|---|---|
| Integration | |
| E2E | |
| Build | |
| Full validation | |
| Coverage report | |
| DESIGN.md lint | `npx @google/design.md lint agents/docs/design.md` (requires Node.js; optional — skip if unavailable) |

## Test Levels
| Level | Purpose | Isolation | When to run |
|---|---|---|---|
| Unit | Business logic, pure functions, isolated components | No network, no DB, no IO | Every TDD cycle |
| Integration | Interaction between layers (repository + service, API + DB) | Mock at external boundaries, real DB or testcontainers for project DB | Pre-commit / CI |
| E2E | Full flow (UI → API → DB → response) | Real or staging environment | CI / pre-release |

## Coverage
| Item | Configuration |
|---|---|
| Tool | |
| Threshold | |
| Command | |
| Excluded paths | |
| Fail on below threshold | yes / no |

## Environment
- Required services:
- Required environment variables:
- Reset/cleanup:

## Fixtures
| Type | Location | When used |
|---|---|---|
| Unit (factories, builders, mocks) | | Unit tests |
| Integration (seed data, DB snapshots) | | Integration tests |
| E2E (test users, sandbox data) | | E2E tests |
| Shared utilities | | All levels |

## External Services Strategy
| Level | Strategy |
|---|---|
| Unit | Always mock or stub |
| Integration | Project DB: real. Third-party APIs: mock or testcontainer |
| E2E | Staging or sandbox environment |

## Test Locations
- Unit:
- Integration:
- E2E:

## TDD Coordination
- Read and apply the TDD skill once before implementation code when the task changes behavior or refactors behavior-preserving code.
- Use the commands and locations in this guide while following the skill's red/green/refactor cycle.
- Record any approved TDD exception in the active task file before implementing under that exception.

## Test Quality
- Prefer deterministic fixtures.
- Avoid shared mutable state and order-dependent tests.
- Keep sensitive or production-like data out of fixtures.
- Mock external services at boundaries; prefer real code for domain logic.
- Do not assert only on mock calls when user-visible behavior can be asserted.

## Valid Test Criteria
A test is valid only if it meets all of the following criteria. The `/test` command applies them when generating, extending, or reviewing tests and reports any violation; task validation must also check them.

- **Independence:** each test must be able to run on its own and in any order, with its own identifiers, logical connections, and state. It must clean up only the data it creates and always close connections, threads, sockets, servers, and temporary files.
- **Uniqueness / one behavior per test:** each case validates a single observable contract and has a descriptive name. It may contain multiple assertions related to that contract, but must not mix independent behaviors.
- **Clean initial state:** no test may depend on residual state from other tests. Setup must produce a known state and cleanup must leave the environment reproducible.
- **Reproducibility / determinism:** the result must not depend on execution order, time, fixed ports, or real external services. For async behavior, use observable conditions with a bounded timeout (`QTRY_VERIFY`, `QSignalSpy`, etc.); do not rely on fixed waits as the only evidence.
- **No implicit dependencies:** do not assume services, DBs, credentials, or network are implicitly available. External dependencies are injected or mocked at boundaries; unit tests must not require MySQL, external sockets, or real services.
- **Production isolation:** no automated test may open connections against production databases, services, or ports. Every DB helper must reject any empty database or one whose name does not end in a test suffix (`_test`) BEFORE executing SQL.
- **Fail-closed config:** any failure to create, open, write, or load configuration or fixtures must fail the test with a diagnosis; it must not fail silently nor fall back to automatic lookups that could reach production.
- **Visible errors:** all results of `prepare`/`exec`, transactions, inserts, updates, state queries, and cleanup must be checked and the error propagated visibly in the test. A setup or cleanup failure must fail the case, not surface later as an ambiguous failure.
- **Valid-by-default builders:** builders/helpers must create domain-valid entities by default; if an invalid value is needed, it must be named explicitly as such and tested as a negative case.
- **Public behavior:** prefer assertions on observable results, states, and effects. Mock calls may be verified when a call absence is part of the contract, but must not be the only evidence when a functional result is checkable.
- **Adapted to production seams:** use existing public seams; do not introduce production APIs or branches only to support an unsafe or artificial test.
- **Opt-in runner and coverage:** the default runner must not execute tests capable of contacting production or real services. Any opt-in integration must document requirements, command, skip criteria, and remaining coverage.
- **Reproducible validation:** compilation, targeted tests, and the applicable full suite must pass; skips, unrun commands, and missing dependencies must be reported with their residual risk.

## Failure Handling
- Fix unexpected targeted-test failures before continuing.
- Report unrelated failures before broadening scope.
- Record skipped commands, reasons, and residual risk.
