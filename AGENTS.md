# AGENTS.md

This repository starts as an agent skeleton and can be prepared for active project work.

## Mode

Current mode: `skeleton`.

This repository is in agent bootstrap mode. Product feature implementation is not allowed.

For skeleton-mode scope, required setup information, validation, and transition to project mode, follow `agents/docs/bootstrap.md`.

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
- Skeleton maintenance is not product implementation and does not require a product task unless the user asks for that workflow.
- New project initialization in `skeleton` mode requires explicit user approval and must follow `agents/docs/bootstrap.md`.
- Exploratory, advisory, review-only, or planning-only requests do not change code unless the user asks for edits.
- Keep changes scoped to the active task or the explicitly requested maintenance.
- Prefer updating stable source-of-truth docs over duplicating instructions.
- Project source-of-truth docs and approved task plans override skill guidance when they conflict.
- Treat blank fields, placeholder markers, and `not available` commands as missing configuration, not as instructions to improvise.
- After transition to project mode, `agents/docs/bootstrap.md` and `.opencode/commands/bootstrap.md` are removed. Their durable findings must already be recorded in `AGENTS.md` and the applicable source-of-truth documents.

## Token Budget
- Communicate with the user in Spanish unless they request another language.
- Keep progress updates brief and only send them for meaningful discoveries, blockers, edits, or validation results.
- Avoid restating context already present in the conversation.
- Prefer concise final responses: outcome, changed files, validation, and relevant caveats.
- Do not use intentionally degraded or overly terse language if it reduces correctness or clarity.
- Use subagents selectively: prefer them for heavy exploration, cross-repo comparison, independent final review, or tightly scoped analysis that would otherwise bloat the main context. Do not offload every small TDD step.
- Read the smallest useful set of files for the current decision. Do not reload large documents or broad file sets when a narrower read will do.
- When switching from exploration to implementation, carry forward only the distilled facts needed for the current step.
- Prefer targeted file reads and focused diffs over re-reading whole files after every change.
- If the task grows, summarize the current state in the active task file instead of keeping it only in conversation memory.
- For large repos or multi-repo work, split discovery into parallel sub-tasks and keep the main thread focused on decisions and integration.

## Source of Truth Map
Read the smallest useful set. Use this table to decide what to open, not as a mandatory read list.

| File | Area | Purpose | Read when | Approval needed to edit? |
|---|---|---|---|---|
| `agents/docs/bootstrap.md` | Bootstrap | Skeleton setup and project transition | skeleton mode or bootstrap maintenance | No |
| `agents/tasks/current/TASK-XXX.md` | Active task file | Scope, behavior contract, and execution ledger (Plan + Execution). The only `TASK-*.md` file in `current/` is the active task | Implementing, validating, or resuming task | No |
| `agents/tasks/todo/TASK-XXX.md` | Pending task file | Planned task awaiting approval/start | Planning a pending task | No |
| `agents/tasks/archive/TASK-XXX.md` | Archived task summary | Compact historical summary (cold context, not source of truth) | Historical rationale or similar prior work | No |
| `agents/tasks/task-template.md` | Task template | Template for the task file (Plan + Execution) | Creating a new task | No |
| `agents/docs/task-lifecycle.md` | Task lifecycle | Canonical location, phase, resumption, review, and closeout rules | Any SDD lifecycle operation | No |
| `agents/docs/dod.md` | Acceptance | Definition of done | Before validation and closeout | Yes |
| `agents/docs/testing.md` | Testing | Test commands, fixtures, validation rules | Adding/running tests or validating work | Only if validation changes |
| `agents/docs/decisions.md` | Decisions | ADR records | Planning, durable decision, or past rationale matters | Yes |
| `agents/docs/api.md` | API contracts | Routes, payloads, errors, compatibility | API routes, clients, or payloads affected | No |
| `agents/db/schema.sql` | DB schema | Current structure. Override path during bootstrap if project has its own. | Persistence, migrations, queries, or schema affected | No |
| `agents/db/changes.sql` | DB change log | Ordered SQL changes with rollback notes. Override path during bootstrap if project has its own. | Persistence, migrations, queries, or schema affected | No |
| `agents/db/domain.md` | DB domain | Vocabulary, entities, business rules | Data model or business rules affected | No |
| `agents/docs/design.md` | UI design | Reusable UI tokens, components, a11y | UI, design system, or UX behavior affected | No |
| `agents/docs/dependency-policy.md` | Dependencies | Rules for new dependencies | Adding or evaluating a dependency | Yes |
| `agents/docs/debt.md` | Debt | Out-of-scope findings and bugs | Found something outside active task scope | No |

## Agent Runtime
Fill during bootstrap when the project configures agent-specific runtime capabilities.
- Plugins:
- MCPs:

Use runtime capabilities only when the current project configures them or `## Agent Runtime` records them.

| Capability | Type | Use when | Avoid when |
|---|---|---|---|
| Context7 | MCP | Library, framework, SDK, API, CLI, or cloud-service docs are needed | Business-logic debugging, refactoring, or non-library concepts |
| Playwright | MCP | Browser automation, UI validation, or E2E flows are needed | Backend-only or library-only work |
| `opencode-pty` | Plugin | Terminal behavior benefits from PTY handling | Plain non-interactive commands work fine |
| `opencode-vibeguard` | Plugin | Extra workflow/quality guardrails help the project | You need it to replace clear rules or review discipline |

When Context7 is available to the current project, use it as the primary documentation source for library and API questions. If unavailable, say so and fall back to the best available project and built-in context.

## Skills

Skills live in `.opencode/skills/` and are model-invoked: the runtime lists each skill by name and description, and the agent loads one with the skill tool when its trigger matches. A command that requires a specific skill names it explicitly.

This skeleton ships only the process skills, `tdd` and `code-review-excellence`. Domain skills (UI, security, performance, SEO, and others) are added per project when the stack requires them. Project source-of-truth docs and approved task plans override skill assumptions.

## SDD Workflow

The complete lifecycle contract is in `agents/docs/task-lifecycle.md`. Commands must read it and enforce its preconditions instead of restating them. The non-negotiable invariants are:

- The task directory is the only lifecycle state. There is zero or one task file matching `TASK-*.md` in `current/`; a command that operates on the active task requires exactly one.
- Do not add a frontmatter `status` field, a global backlog, or a standalone checklist.
- Product implementation follows TDD unless the approved task records an exception; the methodology is `.opencode/skills/tdd/SKILL.md` and the project logistics are in `agents/docs/testing.md`.
- Durable docs are updated only when their contracts change, and lasting ADRs require user approval.
- Do not create commits or branches unless the user asks.

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
- Prefer the simplest solution that satisfies the approved requirement and current tests.
- Introduce an interface only when there are 2 or more real implementations, or the approved plan explicitly requires that abstraction.
- Extract a helper or adapter only when there are 2 or more real consumers with repeated logic.
- Question any production code that exists only to make tests easier; prefer test-side setup unless the production design genuinely benefits.
- Add comments only for non-obvious logic.
- Comments should explain intent, invariants, ownership, constraints, or why the structure exists - not restate obvious mechanics.
- Avoid line-by-line narration, obvious assignment comments, or comments that only paraphrase the code.
- Keep comments concise and locally useful. Prefer a short comment before a non-obvious block over many inline micro-comments.
- The project should define the preferred comment language during bootstrap or in its source-of-truth docs. Until then, follow the dominant repository language if one exists.
- Move detailed conventions into source-of-truth docs when they become durable project rules.

## Quality Standards
- Design code to be maintainable and extensible without overengineering the current requirement.
- Keep modules and functions focused on a clear responsibility.
- Avoid duplication, but do not introduce abstractions without at least two real consumers or an explicit task requirement.
- Preserve existing public contracts unless the approved plan explicitly changes them.
- Add or update tests for every behavior change, including relevant edge cases and error paths.
- Consider performance, security, observability, and compatibility when they are relevant to the change.
- Prefer incremental changes that can be reviewed, tested, and rolled back independently.

## Project Structure
Add only primary routes with their purpose.
