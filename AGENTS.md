# AGENTS.md

This repository starts as an agent skeleton and can be prepared for active project work.

## Mode

Current mode: `skeleton`.

This repository is in agent bootstrap mode. Product feature implementation is not allowed.

For skeleton-mode scope, required setup information, validation, and transition to project mode, follow `agents/docs/bootstrap.md`. After transition to project mode, the archived bootstrap is at `agents/task/archive/bootstrap-*.md` (historical reference only).

Do not modify product source code or unrelated files unless the bootstrap docs explicitly allow it or the user explicitly requests it.

## Project
Fill this section during bootstrap. Leave fields blank only while they are unknown or not configured yet.
- Product:
- Domain:
- Users:
- Goal:

## Stack
Fill only what applies during bootstrap.
- Runtime/framework:
- Package manager:
- Database:
- Test tools:
- Deployment:
- External services:

## Operating Rules
- In skeleton mode, editing agent configuration files (`AGENTS.md`, `agents/**`, `.opencode/**`) does not require user approval. The Source of Truth Map approval column only applies in project mode.
- Before modifying a source-of-truth document in project mode, check the **Approval needed?** column in the Source of Truth Map to determine if explicit approval is needed.
- Product behavior changes require the SDD workflow below.
- Template/agent-maintenance changes may be done directly when the user explicitly asks.
- Skeleton maintenance is not product implementation and does not require a backlog task, plan, or checklist unless the user asks for that workflow.
- New project initialization in `skeleton` mode requires explicit user approval and must follow `agents/docs/bootstrap.md`.
- Exploratory, advisory, review-only, or planning-only requests do not change code unless the user asks for edits.
- Keep changes scoped to the active task or the explicitly requested maintenance.
- Prefer updating stable source-of-truth docs over duplicating instructions.
- Project source-of-truth docs and approved task plans override skill guidance when they conflict.
- Treat blank fields, placeholder markers, and `not available` commands as missing configuration, not as instructions to improvise.
- Archived bootstrap documents are historical references only and must not be followed unless the user explicitly requests bootstrap maintenance or review.

## Token Budget
- Communicate with the user in Spanish unless they request another language.
- Keep progress updates brief and only send them for meaningful discoveries, blockers, edits, or validation results.
- Avoid restating context already present in the conversation.
- Prefer concise final responses: outcome, changed files, validation, and relevant caveats.
- Do not use intentionally degraded or overly terse language if it reduces correctness or clarity.

## Source of Truth Map
Read the smallest useful set. Use this table to decide what to open, not as a mandatory read list.

| File | Area | Purpose | Read when | Approval needed to edit? |
|---|---|---|---|---|
| `agents/docs/bootstrap.md` | Bootstrap | Skeleton setup and project transition | skeleton mode or bootstrap maintenance | No |
| `agents/task/backlog.md` | Active task | Task queue and current selection | Planning or implementing product work | No |
| `agents/task/TASK-XXX-plan.md` | Task plan | Scope and behavior contract | Implementing or validating task | No |
| `agents/task/TASK-XXX-checklist.md` | Task checklist | Execution ledger and resume point | Implementing or resuming task | No |
| `agents/task/plan.md` | Plan template | Template for task plans | Creating a new task plan | No |
| `agents/task/checklist.md` | Checklist template | Template for checklists | Creating a new checklist | No |
| `agents/docs/DoD.md` | Acceptance | Definition of done | Before validation and closeout | Yes |
| `agents/docs/testing.md` | Testing | Test commands, fixtures, validation rules | Adding/running tests or validating work | Only if validation changes |
| `agents/docs/decisions.md` | Decisions | ADR records | Planning, durable decision, or past rationale matters | No |
| `agents/docs/api.md` | API contracts | Routes, payloads, errors, compatibility | API routes, clients, or payloads affected | No |
| `agents/db/schema.sql` | DB schema | Current structure. Override path during bootstrap if project has its own. | Persistence, migrations, queries, or schema affected | No |
| `agents/db/changes.sql` | DB change log | Ordered SQL changes with rollback notes. Override path during bootstrap if project has its own. | Persistence, migrations, queries, or schema affected | No |
| `agents/db/domain.md` | DB domain | Vocabulary, entities, business rules | Data model or business rules affected | No |
| `agents/docs/design.md` | UI design | Reusable UI tokens, components, a11y | UI, design system, or UX behavior affected | No |
| `agents/docs/dependency-policy.md` | Dependencies | Rules for new dependencies | Adding or evaluating a dependency | Yes |
| `agents/docs/debt.md` | Debt | Out-of-scope findings and bugs | Found something outside active task scope | Yes |

## Skills
Use a skill only when its trigger matches the request. Project stack and source-of-truth docs override skill assumptions.

| Skill | Path | Use when | Avoid when |
|---|---|---|---|
| Test-Driven Development | `agents/skills/test-driven-development/SKILL.md` | Read and apply once before implementation code for features, bug fixes, behavior changes, or behavior-preserving refactors; it is the TDD methodology authority | Docs-only, planning-only, config-only changes with no behavior |
| Interface Design | `agents/skills/interface-design/SKILL.md` | Designing, implementing, improving, or reviewing UI/UX, frontend visuals, responsive behavior, interaction states, forms, navigation, dashboards, components, and accessibility tied to UI | Backend-only work, SEO-only audits, security review, brand identity-only work, image generation, or measured performance optimization |
| SEO Audit | `agents/skills/seo-audit/SKILL.md` | Auditing public pages for crawlability, indexation, metadata, content structure, Core Web Vitals, internal links, schema, or rankings | Private dashboards, backend-only work, UI polish without SEO scope |
| Code Review Excellence | `agents/skills/code-review-excellence/SKILL.md` | Reviewing code changes, PRs, architecture-sensitive diffs, or when explicitly asked for a code review | Implementing code directly, formatting-only checks, or replacing automated lint/tests |
| Security Review | `agents/skills/security-review/SKILL.md` | Reviewing authentication, authorization, data flow, secrets, user input, API security, infrastructure config, or when explicitly asked for a security review | Theoretical hardening without code context, test-only files unless requested, or broad security rewrites outside an approved plan |
| Performance | `agents/skills/performance/SKILL.md` | Auditing or improving page load, Core Web Vitals, bundle/resource loading, runtime jank, images, fonts, caching, or web performance regressions | Premature optimization, backend-only work with no web performance impact, or memoization/refactors without measured bottlenecks |
| Context7 MCP | `agents/skills/context7-mcp/SKILL.md` | Library, framework, SDK, API, CLI, or cloud-service documentation and examples | Business-logic debugging, refactoring, review, or non-library programming concepts |
| Find Skills | `agents/skills/find-skills/SKILL.md` | Discovering or installing agent skills for a capability | Direct implementation when no skill discovery is requested |

Frontend precedence: use only `interface-design` for UI/UX, frontend visuals, responsive behavior, interaction states, forms, navigation, components, accessibility tied to UI, and UI review. Do not load separate UI skills.
Quality precedence: use `security-review` for exploitable security analysis, `performance` for measured web performance work, and `code-review-excellence` for general code review. UI accessibility is handled by `interface-design` unless the project later adds a separate specialist accessibility workflow. Project source-of-truth docs and approved task plans override skill assumptions.

"Read and apply" means: open the skill file with the Read tool and follow its instructions. Do NOT use the skill tool — project skills are not registered as system-level skills in this runtime.

## SDD Workflow
Product implementation starts only when there is exactly one task under `## Current` in `agents/task/backlog.md`.

1. Select task
   - Read `agents/task/backlog.md`.
   - If `## Current` has zero or multiple tasks, ask the user to select or create one.

2. Plan
   - Read relevant accepted ADRs in `agents/docs/decisions.md` before proposing behavior or implementation choices.
   - Create/update `agents/task/TASK-XXX-plan.md` from `agents/task/plan.md`.
   - Resolve behavior, data, security, API, and user-facing UX questions before implementation.
   - If the task affects the database, record DB impact, migration, rollback, compatibility, validation, recovery, and required doc updates in the task plan.
   - If a durable decision may be needed, include an ADR proposal in the plan instead of writing directly to `agents/docs/decisions.md`.
   - Do not implement until the user approves the task-specific plan.

3. Checklist
   - Create/update `agents/task/TASK-XXX-checklist.md` from `agents/task/checklist.md`.
   - Derive checklist items from the approved plan only.
   - If the task affects the database, include checklist items for DB schema updates, DB change log updates, backup/recovery checks, and migration validation.

4. Implement with TDD
   - Read and apply `agents/skills/test-driven-development/SKILL.md` once at the start of implementation and follow it for the red/green/refactor process.
   - Read the approved task plan, checklist, `agents/docs/testing.md`, and relevant source-of-truth files.
   - Use `agents/docs/testing.md` only for project-specific commands, locations, fixtures, and validation requirements.
   - Mark checklist items as they are completed.
   - If test-first work is not feasible, stop unless the exception is already documented in the approved plan and checklist.

5. Validate
   - Run targeted tests, then full validation commands. See `agents/docs/testing.md` for the actual commands.
   - Run lint/typecheck/build when relevant.
   - Report unrelated failures before broadening scope.
   - Check `agents/docs/DoD.md`.

6. Document
   - Update source-of-truth docs only when the durable project contract changes.
   - API changes update `agents/docs/api.md`.
   - DB changes update the DB schema and DB change log files declared in the Source of Truth Map, plus `agents/db/domain.md` when the domain model or business rules materially change.
   - Reusable UI rules update `agents/docs/design.md`.
   - Dependency changes update `agents/docs/dependency-policy.md` when the policy itself changes, and `agents/docs/decisions.md` when a new dependency ADR is recorded.
   - Lasting decisions may update `agents/docs/decisions.md` only after explicit user approval.

7. Close out
   - Ask before marking the backlog task done.
   - When the user approves marking a task done, move its task plan/checklist files to `agents/task/archive/` in the same closeout step.
   - Do not create branches or commits unless the user asks.

## Boundaries
- Do not invent missing requirements.
- Do not change unrelated files.
- Do not perform broad refactors during feature work. If something outside scope is found, register it in `agents/docs/debt.md` instead of modifying it.
- Do not introduce dependencies without following `agents/docs/dependency-policy.md`.
- Do not change public APIs unless the approved plan says so.
- Do not change authentication, authorization, payments, migrations, or other security-sensitive behavior without explicit plan coverage.
- Do not delete tests unless replacing them with equivalent or better coverage.
- Do not change DB schema without updating the DB change log file declared in the Source of Truth Map with forward migration SQL and rollback notes.
- If a task affects the database, the task plan must cover migration approach, rollback or irreversibility, compatibility with persisted data, operational risks, validation, backup/recovery expectations, and required doc updates.
- Prefer additive or staged DB changes for existing systems when direct destructive changes would risk persisted data or mixed-version deployments.
- Never expose secrets, tokens, credentials, private keys, or production-like sensitive data.

## Commands
Validation commands (test, lint, typecheck, build, full validation) are defined in `agents/docs/testing.md`.

Non-validation commands:

| Purpose | Command | Notes |
|---|---|---|
| Install | not configured | Package manager and lockfile policy |
| Dev server | not configured | Port and env requirements |

## Code Conventions
- Prefer existing patterns and local helpers.
- Keep changes small, intentional, and task-scoped.
- Add comments only for non-obvious logic.
- Move detailed conventions into source-of-truth docs when they become durable project rules.

## Project Structure
Add only primary routes with their purpose.
