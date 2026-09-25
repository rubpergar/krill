# Bootstrap

Source of truth for `skeleton` mode. Defines how to prepare the agent skeleton for a real project before switching to `project` mode.

## Purpose

Configure the agent with enough verified context to work without avoidable uncertainty. Bootstrap is not product implementation.

## Allowed Scope

Limited to agent and workflow files (`AGENTS.md`, `agents/**`, `.opencode/**`) unless the user explicitly expands scope.

## Approval Rules

- **Skeleton mode**: editing agent configuration files does not require user approval. The agent may write to `AGENTS.md`, `agents/**`, and `.opencode/**` freely during bootstrap.
- **Project mode**: the Source of Truth Map in `AGENTS.md` governs which docs need explicit approval before modification.

## Two Paths

The repository can be prepared for a real project in two ways:

### Path A: Existing Project Discovery

A project with existing source code (package manifests, `src/`, config files, etc.).

Uses the `/bootstrap` command (`.opencode/commands/bootstrap.md`), which loads the `project-bootstrap` skill. That skill owns the procedure; this document owns the readiness criteria and the transition contract below.

**Readiness criteria (critical):**
- Product identity (name, domain, users, goal) confirmed by user
- Runtime/framework confirmed
- Package manager confirmed
- Install command confirmed
- At least one test command confirmed

**Deferred fields (do not block readiness):** lint, typecheck, build, deployment, external services.

**DB file detection:**
- If the project already contains DB schema or ordered SQL change log files, `/bootstrap` should propose those as the `DB schema` and `DB change log` paths in the Source of Truth Map.
- If the project does not contain them, keep `agents/db/schema.sql` and `agents/db/changes.sql` as the default paths.
- After bootstrap, normal implementation work should use the DB paths declared in the Source of Truth Map without any extra DB policy document.

**Transition:** When readiness passes (100% of the critical criteria, or >= 75% with user consent), the command records durable findings, removes the bootstrap instructions, command, and skill, updates `AGENTS.md` mode, and confirms the switch. Pending fields are tracked in the project-mode message in `AGENTS.md`.

### Path B: New Project Initialization

A zero-start project with no product code yet.

No single `/bootstrap` command. The agent initializes the technical scaffold and fills configuration incrementally as the project grows. This requires explicit user approval and a short initialization plan.

**Readiness criteria (lighter):**
- Stack (runtime, framework, package manager) chosen and initialized
- Install command works
- At least one test command configured (even placeholder)
- Lint and dev commands may be deferred

**Transition:** When these minimums are met, the agent may propose transition to project mode. The user decides.

## Conditional Documents

Some source-of-truth documents only apply when the project needs them: `agents/docs/api.md` (contracts not visible in code), `agents/docs/design.md` (a UI), `agents/docs/dependency-policy.md` (a package manager), and `agents/db/schema.sql`, `agents/db/changes.sql`, `agents/db/domain.md` (persistence). Fill only the ones that apply, and delete the rest during the transition. An adopted project keeps only the documents it uses.

## Transition To Project Mode

After user approval, perform in one scoped maintenance step:

1. In `AGENTS.md`:
   - Change `Current mode: skeleton` to `Current mode: project`.
   - Replace the skeleton-mode heading message with:
     ```
     Current mode: `project`.
     
     This repository is an active project. Use the SDD/TDD workflow and the source-of-truth documents under `agents/**`.
     
     Bootstrap is complete. The bootstrap instructions and command have been removed; do not recreate them during normal project work.
     ```
2. Remove the skeleton-only bootstrap rules and the `agents/docs/bootstrap.md` row from the `AGENTS.md` Source of Truth Map.
3. Verify that durable findings have been written to `AGENTS.md` and the applicable source-of-truth documents.
4. Prune the conditional documents that do not apply: delete each unused or `Not applicable` source-of-truth document from the list above and its Source of Truth Map row.
5. Delete `agents/docs/bootstrap.md`.
6. Delete `.opencode/commands/bootstrap.md`.
7. Delete `.opencode/skills/project-bootstrap/`.
