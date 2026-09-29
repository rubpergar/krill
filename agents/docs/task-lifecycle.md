# Task Lifecycle

This document is the source of truth for the lifecycle of an SDD task. Commands may provide the operations, and `agents/task/task-template.md` defines the artifact shape, but neither may introduce a different lifecycle or state model.

## Why there is no `sdd.md` or `tdd.md`

SDD is the lifecycle defined here; TDD is the `.opencode/skills/tdd/SKILL.md` discipline; test logistics belong in `agents/docs/testing.md`; acceptance gates belong in `agents/docs/dod.md`. Do not create an SDD or TDD document unless a future design gives it a distinct, non-overlapping responsibility.

## Lifecycle source of truth

The task file is the only lifecycle state. It lives at the fixed path `agents/task/TASK.md` and either exists (a task is active) or does not (no task). There are no task ids and no per-directory placement; there is never more than one task file. The frontmatter must not contain a `status` field such as `todo`, `current`, `in_progress`, or `done`.

| State | Meaning | Approval |
|---|---|---|
| `agents/task/TASK.md` absent | No active task | Not applicable |
| `agents/task/TASK.md` present | The one task currently owned by the workflow | `approved_at` required before implementation |

`agents/task/task-template.md` is never the active task; it is copied to `agents/task/TASK.md` when planning starts.

The `Phase` in the `### Resume State` subsection of `## Execution` describes the operational substate of the single file:

`planning` → `ready_to_implement` → `implementing` → `reviewing` → `ready_for_closeout`, with `blocked` as an off-line branch that stops progress

The only valid phases are `planning`, `ready_to_implement`, `implementing`, `reviewing`, `blocked`, and `ready_for_closeout`. A missing or unknown phase is malformed state and must be rejected rather than normalized implicitly.

`planning` means the file exists but the plan is not approved yet; it must not contain an `approved_at`. `blocked` means implementation cannot proceed. Returning to an earlier phase is allowed when review or validation finds a real problem. A change to an approved plan also requires `phase: blocked` until the user explicitly re-approves it. `phase` is an operational substate of one file, not a second lifecycle, and never moves anything between paths.

`approved_at` is audit metadata for an approved task, not a status. It is written when the user approves the plan.

An unresolved `blocked` task is not changed to `implementing` merely because a new session starts. A task already at `ready_for_closeout` is not restarted by `/implement`; `/closeout` is its next operation.

## Creating and selecting a task

1. `/plan` checks whether `agents/task/TASK.md` exists before acting.
2. If no task file exists, `/plan` creates it from `agents/task/task-template.md`.
3. If a task file exists, it is the active task. `/plan` may refine its plan only when the conversation explicitly changes or clarifies it; it must preserve the entire existing Execution section.
4. While open questions remain, the task stays at `phase: planning` with no `approved_at`. When the plan is complete, ask for explicit approval using the question interface. On approval, add `approved_at`, set `phase: ready_to_implement`, and record the checkpoint. On rejection, keep `phase: planning` with the open question recorded.

A file created without `approved_at` must never be implemented silently. Backlog, priorities, and dependencies between separate tasks belong to the external tracker or the user, not to `agents/task/`.

## Execution and resumption

The active task file is the hot, persistent context. It replaces the former standalone plan/checklist split; no separate checklist file is generated.

`/implement` must:

- require the single task file `agents/task/TASK.md`;
- reject a task with a frontmatter `status` field, a missing `approved_at`, an unknown phase, or `phase: planning`;
- read the existing plan and Execution section before changing anything;
- never regenerate, replace, reorder, or reset an existing Execution section;
- preserve every completed item and every existing evidence entry;
- add only missing scaffolding or new items explicitly justified by the approved plan;
- set or update the structured resume state before continuing;
- persist `Phase`, `Next action`, `Blockers`, `Last validation`, `Last checkpoint`, and `Scope changes` in the task file;
- update the TDD Ledger after each relevant RED and GREEN checkpoint, including its result and evidence; and
- leave the task file in place if the session stops, fails, or is interrupted.

On a new session, or after an agent failure, the first action is to read the active task file and resume from `Resume State` and the first incomplete ledger item. Do not reconstruct progress from chat history or Git history. If the next action is unknown, mark the task `blocked` and ask the user; do not infer a completed step.

The ledger records durable execution evidence. Each RED and GREEN checkpoint has its own completion marker, so an interrupted behavior can resume at the exact cycle. The resume state records the small, replaceable pointer to the next action. A short append-only checkpoint entry is used for interruptions, blockers, scope changes, and important validation results; it is not a second checklist.

Phase-aware resumption is explicit: `ready_to_implement` starts implementation; `implementing` resumes the first incomplete ledger checkpoint, including any pending validation tracked in `Next action`; `reviewing` continues or reruns review; `ready_for_closeout` goes to `/closeout`; and `blocked` stops for resolution. Validation or review may deliberately return a task to `implementing`, but a new session must not make that transition merely by starting `/implement`.

## Review readiness

`/review` is an independent review of the task's diff, plan, acceptance criteria, tests, and relevant source-of-truth documents. It reports findings and does not approve, close, or delete the task. It must not silently rewrite the plan to make an implementation pass. It also reports simplification and maintainability improvements, which are findings to resolve or defer, never silent edits.

After a clean review, `/review` records the evidence and sets `phase: ready_for_closeout` only when the active task also satisfies the readiness gates in `agents/docs/dod.md`. Findings return the task to `implementing` or `blocked`, with the next action recorded. A task is not ready for closeout merely because the code compiles or the TDD Ledger has checkmarks.

## Closeout and idempotency

`/closeout` is an administrative transition, not an implementation phase. It may run only when the task file exists, has `phase: ready_for_closeout`, and contains evidence that the applicable gates in `agents/docs/dod.md` pass. Durable knowledge is promoted to its owning document; no task summary is archived.

The command then uses this order:

1. Verify the lifecycle state and DoD evidence while the task file is present.
2. Ask the user for explicit closeout approval through the question interface, unless unchanged task state already records `Closeout approval: approved`.
3. Persist the approval result in `Closeout Evidence`. A declined or ambiguous result leaves the task file in place; an approved result is reused on retry unless the plan or implementation changed or the user revokes it.
4. Promote durable knowledge to code, tests, API/domain/design docs, `agents/docs/decisions.md`, or other authoritative documents as appropriate. ADR changes still require their separate explicit approval. Anything not durable belongs to the code, tests, and Git history; do not create a task summary.
5. Delete `agents/task/TASK.md` only after the preceding steps succeed. The plan remains reachable through the task's commits and, when needed, the pull request.

The `Closeout approval` field in the task's Closeout Evidence is a persistent decision. A retry must respect `approved`, `declined`, or `pending` values already recorded.

Never write `done` into the task or delete the task file before validation. If validation or documentation promotion fails, keep the task file and record the blocker. If a post-approval recheck finds that the plan or implementation changed, invalidate the approval, return to `implementing` or `blocked`, and require a new approval before closeout.
