# Task Lifecycle

This document is the source of truth for the lifecycle of an SDD task. Commands may provide the operations, and `agents/tasks/task-template.md` defines the artifact shape, but neither may introduce a different lifecycle or state model.

## Why there is no `sdd.md` or `tdd.md`

Krill does not distribute separate `sdd.md` or `tdd.md` files:

- SDD is the task lifecycle and artifact contract defined here, exposed through `/plan`, `/implement`, `/review-task`, and `/closeout`.
- TDD is a reusable implementation discipline in `.opencode/skills/tdd/SKILL.md`.
- Project-specific test commands, fixtures, and validation logistics belong in `agents/docs/testing.md`.
- Acceptance gates belong in `agents/docs/dod.md`.

Keeping these responsibilities separate avoids three copies of the same rules being loaded for every task. Do not create an SDD or TDD document unless a future design gives it a distinct, non-overlapping responsibility.

## Lifecycle source of truth

The task directory is the only lifecycle state. The task frontmatter must not contain a `status` field such as `todo`, `current`, `in_progress`, or `done`.

| Location | Meaning | Approval | Allowed contents |
|---|---|---|---|
| `agents/tasks/todo/TASK-XXX.md` | Plan is being clarified or is waiting for approval | Not approved | Plan, open questions, and an execution scaffold |
| `agents/tasks/current/TASK-XXX.md` | The one approved task currently owned by the workflow | Approved before entering this directory | Plan, execution ledger, resume state, validation, and closeout evidence |
| `agents/tasks/archive/TASK-XXX.md` | Optional compact historical summary after closeout | Closed | Durable historical context only; never the full execution file |

There must be zero or one task file matching `TASK-*.md` in `current/`, never more than one. Ignore `.gitkeep` and other directory placeholders when counting tasks. A task in `current/` is active even when it is blocked, under review, or waiting for closeout. The `Phase` in its `### Resume State` subsection of `## Execution` describes that operational substate:

For a current task, `ready_to_implement` → `implementing` → `validating` → `reviewing` → `ready_for_closeout`

`planning` is valid only while the task is in `todo/`.

The only valid phases for a task in `current/` are `ready_to_implement`, `implementing`, `validating`, `reviewing`, `blocked`, and `ready_for_closeout`. A missing or unknown phase is malformed state and must be rejected rather than normalized implicitly.

`blocked` may be used only by a task in `current/`. A todo task with unresolved planning questions remains in `todo/` with `phase: planning`; it is not an active blocked task. Returning to an earlier phase is allowed when review or validation finds a real problem. A change to an approved plan also requires `phase: blocked` until the user explicitly re-approves it. `phase` is not a second lifecycle; it must never be used to move a file between directories.

An unresolved `blocked` task is not changed to `implementing` merely because a new session starts. A task already at `ready_for_closeout` is not restarted by `/implement`; `/closeout` is its next operation.

`approved_at` is audit metadata for a task already in `current/`, not a status. It is written when the user approves the plan and the file is moved from `todo/` to `current/`.

## Creating and selecting a task

1. `/plan` lists both `current/` and `todo/` before acting.
2. If there is more than one current task, the state is invalid. Stop and ask the user to resolve it; never choose one based on conversational context.
3. If there is one current task, it is the active task. `/plan` may refine its plan only when the conversation explicitly changes or clarifies the plan; it must preserve the entire existing execution section.
4. If there is no current task and one todo task, `/plan` refines that task.
5. If there is no current task and no todo task, `/plan` creates a new todo task from the request.
6. If there is no current task and multiple todo tasks, use the OpenCode question interface to ask the user to select one. Do not guess. Todo tasks are never started while a current task exists.
7. While open questions remain, an unapproved task stays in `todo/`. When the plan is complete, ask for explicit approval using the question interface. On approval, move the file to `current/`, add `approved_at`, set `phase: ready_to_implement`, and record the checkpoint. On rejection, leave it in `todo/` with the open question recorded.

Moving a file to `current/` is therefore both the approval transition and the exclusive active-task claim. Manual files in `current/` without `approved_at` are invalid and must not be implemented silently.

## Execution and resumption

The current task file is the hot, persistent context. It replaces the former standalone plan/checklist split; no `TASK-XXX-checklist.md` is generated.

`/implement` must:

- require exactly one valid task in `current/`;
- reject a task with a frontmatter `status` field, a missing `approved_at`, an unknown phase, or a phase that is not valid for `current/`;
- read the existing plan and execution section before changing anything;
- never regenerate, replace, reorder, or reset an existing execution section;
- preserve every completed item and every existing evidence entry;
- add only missing scaffolding or new items explicitly justified by the approved plan;
- set or update the structured resume state before continuing;
- persist `phase`, `next_action`, `blockers`, `last_validation`, `last_checkpoint`, and `scope_changes` in the task file;
- update the TDD ledger after each relevant RED and GREEN checkpoint, including its result and evidence; and
- leave the task in `current/` if the session stops, fails, or is interrupted.

On a new session, or after an agent failure, the first action is to read the single current task and resume from `Resume State` and the first incomplete
ledger item. Do not reconstruct progress from chat history, Git history, or an archive summary. If the next action is unknown, mark the task `blocked` and ask the user; do not infer a completed step.

The ledger records durable execution evidence. Each RED and GREEN checkpoint has its own completion marker, so an interrupted behavior can resume at the exact cycle. The resume state records the small, replaceable pointer to the next action. A short append-only checkpoint entry is used for interruptions, blockers, scope changes, and important validation results; it is not a second checklist.

Phase-aware resumption is explicit: `ready_to_implement` starts implementation; `implementing` resumes the first incomplete ledger checkpoint; `validating` continues the pending validation; `reviewing` continues or reruns review; `ready_for_closeout` goes to `/closeout`; and `blocked` stops for resolution. Validation or review may deliberately return a task to `implementing`, but a new session must not make that transition merely by starting `/implement`.

## Review readiness

`/review-task` is an independent review of the task's diff, plan, acceptance criteria, tests, and relevant source-of-truth documents. It reports findings and does not approve, close, archive, or move the task. It must not silently rewrite the plan to make an implementation pass.

After a clean review, `/review-task` records the evidence and sets
`phase: ready_for_closeout` only when the active task also satisfies the
readiness gates in `agents/docs/dod.md`. Findings return the task to
`implementing` or `blocked`, with the next action recorded. A task is not ready
for closeout merely because the code compiles or the TDD ledger has checkmarks.

## Closeout and idempotency

`/closeout` is an administrative transition, not an implementation phase. It
may run only when the task is still in `current/`, has
`phase: ready_for_closeout`, and contains evidence that the applicable gates in
`agents/docs/dod.md` pass.

The command then uses this order:

1. Verify the lifecycle state and DoD evidence while the task remains in
   `current/`.
2. Ask the user for explicit closeout approval through the question interface, unless unchanged task state already records `Closeout approval: approved`.
3. Persist the approval result in `Closeout Evidence`. A declined or ambiguous result leaves the task in `current/`; an approved result is reused on retry unless the plan or implementation changed or the user revokes it.
4. Promote durable knowledge to code, tests, API/domain/design docs, or other authoritative documents as appropriate. ADR changes still require their separate explicit approval.
5. If the task contains reusable rationale, a non-obvious trade-off, migration/regression context, a constraint, or a useful reference for a future related task, write a compact summary to `archive/`. Otherwise do not create an archive file; trivial mechanical work is already represented by the code, tests, and Git history.
6. Remove the task file from `current/` only after the optional summary is successfully written or the decision not to retain one is recorded.

The `Closeout approval` and `Historical summary decision` fields in the task's Closeout Evidence are persistent decisions. A retry must respect `approved`, `declined`, `retain`, or `omit` values already recorded and must stop on a conflict with an existing archive summary.

Never write `done` into the task, remove `current/` before validation, or archive the full execution file. If closeout is interrupted after the summary is written but before removal, the next run must verify the existing summary and finish the removal without overwriting it. If validation, documentation, or summary creation fails, leave the task in `current/` and record the blocker. If a post-approval recheck finds that the plan or implementation changed, invalidate the approval, return to `implementing` or `blocked`, and require a new approval before closeout.

When retained, an archive summary contains only:

- task identity and outcome;
- meaningful in-scope and out-of-scope context;
- durable decisions and rejected alternatives that explain current behavior;
- constraints, gotchas, migration or regression context;
- references to authoritative docs, tests, commits, or pull requests; and
- the outcome of the acceptance criteria.

It must not contain execution checkboxes, temporary command output, resume notes, scaffolding, resolved questions, or the RED/GREEN ledger.

## Historical context

Archived summaries are cold context, not a source of truth and not part of the normal planning context. Consult one only when its historical rationale is specifically relevant, for example to:

- investigate why a decision was made;
- analyze a regression or migration;
- find a solution applied to a similar task;
- understand a constraint or rejected alternative; or
- investigate a related task whose current code or docs need explanation.

Current code and tests have priority, followed by current API/domain/design documentation and accepted ADRs. An archive summary may be stale or describe an approach that is no longer present in production.
