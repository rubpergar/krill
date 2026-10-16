# Task Lifecycle

This document is the source of truth for the lifecycle of an SDD task. Commands may provide the operations, and `agents/task/task-template.md` defines the artifact shape, but neither may introduce a different lifecycle or state model.

## Why there is no `sdd.md` or `tdd.md`

SDD is the lifecycle defined here; TDD is the `.opencode/skills/tdd/SKILL.md` discipline; test logistics belong in `agents/docs/testing.md`; acceptance gates belong in `agents/docs/dod.md`. Do not create an SDD or TDD document unless a future design gives it a distinct, non-overlapping responsibility.

## Lifecycle source of truth

The task file is the only lifecycle state. It lives at the fixed path `agents/task/TASK.md`; its presence means one task record exists, and its phase describes the workflow state. There are no task ids and no per-directory placement; there is never more than one task file. The frontmatter must not contain a `status` field such as `todo`, `current`, `in_progress`, or `done`.

| State | Meaning | Approval |
|---|---|---|
| `agents/task/TASK.md` absent | No task is being tracked through the full lifecycle; brief work does not require the file, and a task may be planned when the full lifecycle is needed | Not applicable |
| `agents/task/TASK.md` present | One SDD task record exists; its phase describes planning through readiness for integration. | `approved_at` required before implementation |

`agents/task/task-template.md` is never the task record; instantiate it as `agents/task/TASK.md` when planning starts, with real frontmatter and `Phase: planning`.

The `Phase` in the `### Resume State` subsection of `## Execution` describes the operational substate of the single file:

`planning` → `ready_to_implement` → `implementing` → `reviewing` → `ready_for_closeout`, with `blocked` as an off-line branch that stops progress

The only valid phases are `planning`, `ready_to_implement`, `implementing`, `reviewing`, `blocked`, and `ready_for_closeout`. A missing or unknown phase is malformed state and must be rejected rather than normalized implicitly.

`planning` means the file exists but the plan is not approved yet; it must not contain an `approved_at`. `blocked` means implementation cannot proceed. Returning to an earlier phase is allowed when review or validation finds a real problem. A change to an approved plan also requires `phase: blocked` until the user explicitly re-approves it. `phase` is an operational substate of one file, not a second lifecycle, and never moves anything between paths.

`approved_at` is audit metadata for an approved task, not a status. It is written when the user approves the plan.

## Phase gates

A phase is left only when its gate holds. This table is the single owner of phase exit conditions; the sections below only describe who performs each operation. Each gate is verifiable against the task file, the diff, and `agents/docs/dod.md`, and points at evidence that already exists rather than restating it. If the evidence is missing, the gate does not pass.

| Phase | Gate to leave it |
|---|---|
| `planning` | No blocking `### Open Questions`, and the user explicitly approves the plan. Write `approved_at` and set `phase: ready_to_implement`. |
| `ready_to_implement` | The Execution scaffold exists and the first `Next action` is set. Starting the first implementation step sets `phase: implementing`. |
| `implementing` | The implementation evidence and validation criteria in `agents/docs/dod.md` are recorded, no blocker remains, and the task is ready for independent review. Then set `phase: reviewing`; this ends the `/implement` invocation. Report `/review` as the next step and do not invoke it automatically. |
| `reviewing` | An independent review is complete (or an approved exception is recorded in the task file), the gates in `agents/docs/dod.md` pass, and no `blocking` or `important` finding remains open. Findings addressed by implementation are `fixed` with evidence; findings the user decides not to address are `dismissed` without a required reason. `nit` findings may remain open and never block closeout. Then set `phase: ready_for_closeout`; otherwise return to `implementing`. Use `blocked` only when resolving a finding needs a user decision or a plan change. |
| `blocked` | The blocker recorded in `Resume State` is resolved. A changed plan is re-approved first and returns the task to `ready_to_implement`; a resolved technical blocker returns it to `implementing`. |
| `ready_for_closeout` | Integrate through the developer's chosen flow. If a new `blocking` or `important` concern is raised before integration, ask the developer how to proceed; do not integrate while it remains open or change the phase automatically. |

## Creating and planning a task

1. `/plan` checks whether `agents/task/TASK.md` exists before acting.
2. If no task file exists, `/plan` creates it from `agents/task/task-template.md`.
3. If a task file exists, it is the only recorded SDD task. `/plan` may refine its plan only when the conversation explicitly changes or clarifies it; it must preserve the entire existing Execution section. An integrated record cannot be repurposed; follow Finishing and removal before planning another task.
4. Build the Plan from the conversation and inspected repository context; do not invent requirements, APIs, DB structures, or technical facts. Record unresolved critical information in `### Open Questions` and ask one high-leverage question at a time.
5. Research external facts only when they materially affect the plan. Use a bounded research sub-agent and cite its conclusion; do not research facts already answered by the repository.
6. Request explicit approval when the plan is ready, then apply the phase gate and record its checkpoint.

Backlog, priorities, and dependencies between separate tasks belong to the external tracker or the user, not to `agents/task/`.

## Execution and resumption

The task record is the hot, persistent context. It replaces the former standalone plan/checklist split; no separate checklist file is generated.

`/implement` must:

- require the single task file `agents/task/TASK.md`;
- reject a task with a frontmatter `status` field, a missing `approved_at`, an unknown phase, `phase: planning`, or an unresolved `phase: blocked`;
- read the existing plan and Execution section before changing anything;
- never regenerate, replace, reorder, or reset an existing Execution section;
- preserve every completed item and every existing evidence entry;
- add only missing scaffolding or new items explicitly justified by the approved plan;
- before continuing and after a meaningful pause, failure, interruption, scope change, or validation, persist `Phase`, `Next action`, `Blockers`, `Last validation`, `Last checkpoint`, `Scope changes`, and `Updated` in the task file;
- update the TDD Ledger after each relevant RED and GREEN checkpoint, including its result and evidence; and
- leave the task file in place if the session stops, fails, or is interrupted.

When the implementation gate passes, `/implement` records `phase: reviewing`, reports `/review` as the next step, and ends its invocation. It does not invoke `/review` automatically. A phase or `Next action` is resumption information, not authorization to execute another command.

On a new session, or after an agent failure, read the task file and resume from `Resume State` and the first incomplete ledger item. Do not reconstruct progress from chat history or Git history, or change phase merely because a session started. If the next action is unknown, mark the task `blocked` and ask the user; do not infer a completed step. `/implement` does not restart a task already at `ready_for_closeout`.

The ledger records durable execution evidence. Each RED and GREEN checkpoint has its own completion marker, so an interrupted behavior can resume at the exact cycle. The resume state records the small, replaceable pointer to the next action. A short append-only checkpoint entry is used for interruptions, blockers, scope changes, and important validation results; it is not a second checklist.

## Review readiness

`/review` is the independent review required by the phase gate. It does not approve, close, or delete the task, and must not rewrite the Plan or TDD Ledger.

`/review` may be invoked for feedback at any valid, non-blocked phase. It may advance the task only when the applicable phase gate in the table above holds; invoking it early does not bypass a gate. Its diff range and Git procedures are defined by `.opencode/commands/review.md` and `.opencode/skills/code-review/SKILL.md`.

After recording the review and reporting a concise summary of its findings, `/review` ends its invocation and waits for the user. It never invokes `/implement` or fixes findings.

The `/review` orchestrator may update only `Resume State`, `Checkpoint Log`, and `Review Findings`. Record findings and review evidence there; update `Next action`, `Blockers`, `Last validation`, `Last checkpoint`, and `Updated` to match the result.

## Finishing and removal

Task records are execution context, not archives. To investigate one-off task rationale after integration, use Git or pull-request history; current code, tests, and source-of-truth documents take precedence.

After integration, the developer manually removes `agents/task/TASK.md` before planning another full-lifecycle task. Do not delete it before integration; removal is not a gate for the current task.
