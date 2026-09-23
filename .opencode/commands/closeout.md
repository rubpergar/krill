---
description: Verify and close the active task with optional historical distillation
---

Complete the administrative closeout of the single active task. Read `agents/docs/task-lifecycle.md` and `agents/docs/dod.md` first.

## Preconditions

Validate the active task exactly as `agents/docs/task-lifecycle.md` defines: exactly one task file in `current/`, `approved_at` present, no frontmatter `status`, and `phase: ready_for_closeout`. The DoD, Converge, validation, durable documentation, and independent review evidence required by `agents/docs/dod.md` must already be recorded. Do not repair missing implementation or documentation by silently changing the approved plan; leave the task active and record the blocker.

## Approval and ordering

Before asking, perform a complete preflight against the task file, the actual diff, and `agents/docs/dod.md`. Confirm every acceptance criterion, validation, Converge result, required document, review result, blocker, and scope change. If any preflight check fails, do not ask for closeout approval: persist the
failure in `Resume State` and `Checkpoint Log`, set `phase: implementing` or `blocked`, and report the next action.

If preflight passes and `Closeout approval` is not already `approved` for the unchanged task, ask the user for explicit approval through the OpenCode question interface. Do not print the question as ordinary output when the interface is available, and do not treat silence or an ambiguous answer as approval. If approval is already recorded and the plan/implementation has not changed, reuse it rather than asking again.

After approval, while the task remains in `current/`:

1. Recheck DoD, acceptance evidence, Converge, validation, scope, blockers, source-of-truth documentation, and review.
2. Persist `Closeout approval: approved` with the approval evidence. On a retry, respect that value unless the plan or implementation changed or the user explicitly revokes approval.
3. Promote durable knowledge to code, tests, API/domain/design docs, or other authoritative documents when needed. Create or modify an ADR only after the separate explicit approval required by `agents/docs/decisions.md`; otherwise leave the decision task-local and record that choice.
4. Decide whether the task has historical value. Persist either `Historical summary decision: retain` or `Historical summary decision: omit` with the reason. On a retry, respect the existing decision rather than
   recalculating it. Retain only reusable rationale, non-obvious trade-offs, migrations/regressions, constraints, rejected alternatives, or references useful to related future work.
5. If the decision is `retain`, write a compact summary to `agents/tasks/archive/TASK-XXX.md`; never copy the full execution file. If it is `omit`, create no archive file.
6. Remove `agents/tasks/current/TASK-XXX.md` last.

Never write a `done` status, keep a completed task in `current/`, or remove the current task before all prior steps succeed. If a summary already exists after an interrupted closeout, verify it matches the task and do not overwrite it; then finish removing the current task. If any step fails, leave the task in
`current/` and persist the blocker and next action. A closeout rejection or ambiguous answer also leaves the task in `current/`, keeps the `ready_for_closeout` phase, records `Closeout approval: declined` or `pending`,
and records the next action needed to obtain or resolve approval.

If a post-approval recheck discovers that the plan or implementation changed, invalidate the closeout approval, set `phase: implementing` or `blocked`, and record why a new approval is needed.

Archived summaries are cold context. They are not read automatically, are not the source of truth, and must never override current code, tests, or durable documentation.

When a summary is retained, include only the task identity, outcome, meaningful scope, durable decisions and rejected alternatives, constraints/gotchas, migration or regression context, references, and acceptance outcome. Exclude execution checkboxes, temporary command output, Resume State, resolved questions, and the TDD ledger.

## Flow

1. Confirm the single current task, its approval metadata, and ready-for-closeout phase.
2. Run the complete preflight. If it fails, persist the blocker and stop.
3. Ask for explicit closeout approval through the question interface unless an unchanged task already records `Closeout approval: approved`.
4. Recheck all gates and durable documentation after approval.
5. Distill a valuable summary or record why no summary is retained.
6. Remove the current task as the final lifecycle transition.
7. Report the result and any uncommitted changes; do not create commits or branches unless the user separately asks.
