# Testing Guide

Customize before product implementation. If a command is unavailable, write `not available` and explain the fallback.

This file defines project-specific testing logistics: commands, levels, environment, fixtures, locations, and coverage configuration. Test quality and validity criteria are owned by the `.opencode/skills/tdd/` skill; the coverage-audit rule is owned by the `audit-tests` skill. Do not restate them here.

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
| DESIGN.md lint | optional; applicable only while `agents/docs/design.md` is retained |

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
- Use the commands and locations in this guide while following the skill's red/green cycle.
- Record any approved TDD exception in the task record before implementing under that exception. When no task record exists, state the exception and its approval in the conversation and the commit message.

## Failure Handling
- Fix unexpected targeted-test failures before continuing.
- Report unrelated failures before broadening scope.
- Compilation, targeted tests, and the applicable full suite must pass; record skipped commands, reasons, and residual risk.
