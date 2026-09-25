---
description: Verify and close the active task with optional historical distillation
---

Complete the administrative closeout of the single active task. Read `agents/docs/task-lifecycle.md` and `agents/docs/dod.md` first.

## Preconditions

Validate the active task exactly as `agents/docs/task-lifecycle.md` defines: exactly one task file in `current/`, `approved_at` present, no frontmatter `status`, and `phase: ready_for_closeout`. The DoD, Converge, validation, durable documentation, and independent review evidence required by `agents/docs/dod.md` must already be recorded. Do not repair missing implementation or documentation by silently changing the approved plan; leave the task active and record the blocker.

## Preflight and approval

- Before asking, perform a complete preflight against the task file, the actual diff, and `agents/docs/dod.md`. Confirm every acceptance criterion, validation, Converge result, required document, review result, blocker, and scope change. If any preflight check fails, do not ask for closeout approval: persist the failure in `Resume State` and `Checkpoint Log`, set `phase: implementing` or `blocked`, and report the next action.
- Ask the user for explicit approval through the OpenCode question interface, unless unchanged task state already records `Closeout approval: approved`. Do not print the question as ordinary output when the interface is available, and do not treat silence or an ambiguous answer as approval. If approval is already recorded and the plan or implementation has not changed, reuse it rather than asking again.
- A rejection or ambiguous answer leaves the task in `current/`, keeps the `ready_for_closeout` phase, records `Closeout approval: declined` or `pending`, and records the next action needed to obtain or resolve approval.

## Order

Execute the closeout order defined in `agents/docs/task-lifecycle.md` (Closeout and idempotency). That contract already covers approval reuse, interruption, the `done` prohibition, and archive contents.

Command-level requirements:

- Respect the Source of Truth Map approval column before modifying any durable document. ADR changes need their separate explicit approval.
- Report the result and any uncommitted changes. Do not create commits or branches unless the user separately asks.

## Flow

1. Confirm the single current task, its approval metadata, and the `ready_for_closeout` phase.
2. Run the complete preflight. If it fails, persist the blocker and stop.
3. Ask for explicit closeout approval through the question interface unless an unchanged task already records `Closeout approval: approved`.
4. Recheck all gates and durable documentation after approval.
5. Execute the closeout order in `agents/docs/task-lifecycle.md`.
6. Report the result and any uncommitted changes; do not create commits or branches unless the user separately asks.
