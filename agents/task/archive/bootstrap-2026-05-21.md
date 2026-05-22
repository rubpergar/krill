# Bootstrap

Source of truth for `skeleton` mode. Defines how to prepare the agent skeleton for a real project before switching to `project` mode.

## Purpose

Configure the agent with enough verified context to work without avoidable uncertainty. Bootstrap is not product implementation.

## Allowed Scope

Limited to agent and workflow files (`AGENTS.md`, `agents/**`, `.opencode/**`) unless the user explicitly expands scope.

## Document Preservation Rules

- During bootstrap, do not delete, replace wholesale, or restructure files under `agents/docs/`.
- Treat documents in `agents/docs/` as stable templates to be filled in place with verified information.
- If information cannot be found during repository exploration or user confirmation, leave the corresponding fields blank unless the template explicitly expects another placeholder such as `not available`.
- Do not remove or clear `agents/docs/debt.md` or `agents/docs/decisions.md` just because they are empty or have no applicable content yet. Empty initial state is valid.
- Do not remove or clear `agents/docs/testing.md` even when the project has no test tooling yet. Record unavailable commands as `not available`.
- If the project already has a frontend/UI, fill `agents/docs/design.md` using its existing template. Keep the YAML block and document structure intact, and validate with `npx @google/design.md lint agents/docs/design.md` when Node.js is available.
- If the project does not have a frontend/UI, keep `agents/docs/design.md` in place and mark it `Not applicable` without restructuring the file.
- When bootstrap uncertainty could lead to accidental deletion, reorganization, or fabricated content, stop and ask the user before proceeding.

## Approval Rules

- **Skeleton mode**: editing agent configuration files does not require user approval. The agent may write to `AGENTS.md`, `agents/**`, and `.opencode/**` freely during bootstrap.
- **Project mode**: the Source of Truth Map in `AGENTS.md` governs which docs need explicit approval before modification.

## Two Paths

The repository can be prepared for a real project in two ways:

### Path A: Existing Project Discovery

A project with existing source code (package manifests, `src/`, config files, etc.).

Uses the `/bootstrap` command (`.opencode/commands/bootstrap.md`), which:
1. Inspects the repository structure and stack
2. Interviews the user to confirm findings and fill gaps
3. Detects existing DB schema and DB change log files and updates the Source of Truth Map paths in `AGENTS.md` when appropriate
4. Writes source-of-truth docs with confirmed facts only
5. Runs a readiness check
6. Offers transition to project mode if ready

Document handling during this path is additive and in-place: preserve existing templates, keep unknown fields blank, and prefer `not available` only where the target document explicitly expects it.

**Readiness criteria:**
- Product identity (name, domain, users, goal) confirmed by user
- Runtime/framework confirmed
- Package manager confirmed
- Install command confirmed
- At least one test command confirmed
- Lint/typecheck/build may be deferred

**DB file detection:**
- If the project already contains DB schema or ordered SQL change log files, `/bootstrap` should propose those as the `DB schema` and `DB change log` paths in the Source of Truth Map.
- If the project does not contain them, keep `agents/db/schema.sql` and `agents/db/changes.sql` as the default paths.
- After bootstrap, normal implementation work should use the DB paths declared in the Source of Truth Map without any extra DB policy document.

**Transition:** When readiness passes (100% critical fields or >= 75% with user consent), the command updates `AGENTS.md` mode, archives this file regardless of completeness, and confirms the switch. Pending fields are tracked in the project-mode message in `AGENTS.md`.

### Path B: New Project Initialization

A zero-start project with no product code yet.

No single `/bootstrap` command. The agent initializes the technical scaffold and fills configuration incrementally as the project grows. This requires explicit user approval and a short initialization plan.

**Readiness criteria (lighter):**
- Stack (runtime, framework, package manager) chosen and initialized
- Install command works
- At least one test command configured (even placeholder)
- Lint and dev commands may be deferred

**Transition:** When these minimums are met, the agent may propose transition to project mode. The user decides.

## Transition To Project Mode

After user approval, perform in one scoped maintenance step:

1. In `AGENTS.md`:
   - Change `Current mode: skeleton` to `Current mode: project`
   - Replace the skeleton-mode heading message with:
     ```
     Current mode: `project`.
     
     This repository is an active project. Use the SDD/TDD workflow and the source-of-truth documents under `agents/**`.
     
     Bootstrap is complete. Archived bootstrap documents are historical references only and must not be followed unless the user explicitly requests bootstrap maintenance or review.
     ```
2. Move this file from `agents/docs/bootstrap.md` to `agents/task/archive/bootstrap-YYYY-MM-DD.md`
3. Confirm the archived document is historical reference only

## Archived Bootstrap Documents

Archived bootstrap documents are historical references only. Do not follow them during project work unless the user explicitly asks to review bootstrap history or perform bootstrap maintenance.
