---
description: Resume or execute the approved current task with persistent TDD state
---

Implement the single approved task in `agents/tasks/current/` following the SDD/TDD workflow.

Read `agents/docs/task-lifecycle.md`, the active task file, the relevant source of truth, `agents/docs/testing.md`, and `.opencode/skills/tdd/SKILL.md` before implementation. Load the `code-design` skill when writing or reviewing production code.

## Preconditions

Validate the active task exactly as `agents/docs/task-lifecycle.md` defines: exactly one task file in `current/`, `approved_at` present, no frontmatter `status`, a recognized current-task phase, and no blocking open question. If the state is invalid or the phase does not allow implementation, stop and report it; never normalize malformed state. If there is no valid current task, suggest `/plan`.

## Resume-safe execution rules

- Read the full existing `## Execution` section before changing it.
- If `## Execution` already exists, never regenerate, replace, reorder, or reset it. Preserve all checked items, evidence, checkpoint history, and previous Resume State.
- Add only missing scaffolding or items explicitly derived from the approved Plan. If the approved plan and execution ledger disagree, stop and resolve the discrepancy rather than silently rewriting history.
- Before new implementation work, set `phase: implementing` and write a concrete `Next action`. Preserve a `reviewing` phase until review findings determine whether work must resume.
- After every meaningful pause, failure, interruption, scope change, or validation, persist `phase`, `Next action`, `Blockers`, `Last validation`, `Last checkpoint`, `Scope changes`, and `Updated` in `### Resume State`.
- After each relevant RED and GREEN checkpoint, update the matching TDD ledger item with its result and evidence in the same file before moving to another behavior. Refactoring belongs to the review stage, not the implementation loop.
- A completed ledger item is never unchecked because a session restarted.
- If the session or agent fails, leave the task in `current/`. A new session resumes from Resume State and the first incomplete ledger item, not from chat history or an archive summary.
- Use the TDD skill's exception process and record any approved exception in the task before relying on it.

## Converge and readiness

Before considering implementation complete:

- Run the validation commands in `agents/docs/testing.md`, from most targeted to broadest applicable command.
- Run Converge against every acceptance criterion. Each criterion needs a test, observable behavior, or a documented exception.
- Confirm no unrelated changes, unexplained scope changes, or unresolved blockers remain.
- Confirm required durable documentation is synchronized.
- Record the validation and Converge evidence in the task file.
- Set `phase: validating` during checks and `phase: reviewing` when ready for independent review. A clean review permits `phase: ready_for_closeout`.

If implementation diverges from the approved plan, stop and resolve it with the user. Leave the task in `current/` with the discrepancy recorded.

## Flow

1. Validate the single current task and its approval metadata.
2. Read Resume State and the first incomplete execution item.
3. Preserve the existing ledger and continue at its Next action.
4. Execute small RED → GREEN cycles, persisting each checkpoint; refactoring is deferred to review.
5. Validate, Converge, and record evidence.
6. Request independent review when required; do not close or archive the task.
7. Leave the task in `current/` until `/closeout` completes.
