# Testing Guide

Customize before product implementation. If a command is unavailable, write `not available` and explain the fallback.

This file defines project-specific testing logistics. Use `agents/skills/test-driven-development/SKILL.md` as the authority for the TDD workflow itself.

## Commands

### Fast (TDD cycle / pre-commit)
| Purpose | Command |
|---|---|---|
| Targeted unit | `php artisan test --filter={TestName}` |
| Full unit | `php artisan test` |
| Lint | `./vendor/bin/pint --test` |
| Typecheck | `not available` |

### Slow (pre-merge / CI)
| Purpose | Command |
|---|---|---|
| Integration | `php artisan test` |
| E2E | `not available` |
| Build | `npm run build` |
| Full validation | `php artisan test && ./vendor/bin/pint --test` |
| Coverage report | `not available` |
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
| Tool | `not available` |
| Threshold | `not available` |
| Command | `not available` |
| Excluded paths | `not available` |
| Fail on below threshold | `not available` |

## Environment
- Required services: SQLite (built-in) o PostgreSQL
- Required environment variables: `APP_ENV`, `DB_CONNECTION`
- Reset/cleanup: `php artisan migrate:fresh --seed`

## Fixtures
| Type | Location | When used |
|---|---|---|
| Unit (factories, builders, mocks) | `database/factories/` | Unit tests |
| Integration (seed data, DB snapshots) | `database/seeders/` | Integration tests |
| E2E (test users, sandbox data) | `not available` | E2E tests |
| Shared utilities | `tests/` (TestCase.php, Pest.php) | All levels |

## External Services Strategy
| Level | Strategy |
|---|---|
| Unit | Always mock or stub |
| Integration | Project DB: real. Third-party APIs: mock or testcontainer |
| E2E | Staging or sandbox environment |

## Test Locations
- Unit: `tests/Unit/`
- Integration: `tests/Feature/`
- E2E: `not available`

## TDD Coordination
- Read and apply the TDD skill once before implementation code when the task changes behavior or refactors behavior-preserving code.
- Use the commands and locations in this guide while following the skill's red/green/refactor cycle.
- Record any approved TDD exception in the task plan and checklist before implementing under that exception.

## Test Quality
- Prefer deterministic fixtures.
- Avoid shared mutable state and order-dependent tests.
- Keep sensitive or production-like data out of fixtures.
- Mock external services at boundaries; prefer real code for domain logic.
- Do not assert only on mock calls when user-visible behavior can be asserted.

## Failure Handling
- Fix unexpected targeted-test failures before continuing.
- Report unrelated failures before broadening scope.
- Record skipped commands, reasons, and residual risk.
