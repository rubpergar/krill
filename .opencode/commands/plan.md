---
description: Create or refine the single task plan
---

Create or refine the active SDD task file using the planning discussion already developed in the conversation.

Read `agents/docs/task-lifecycle.md` first. It is the source of truth for the task file, approval, phases, and transitions. Read `agents/task/task-template.md` and relevant accepted ADRs before editing.

## Rules

- Create or refine the single task file `agents/task/TASK.md` exactly as `agents/docs/task-lifecycle.md` defines, using the question interface for any approval decision.
- If no task file exists, create it from `agents/task/task-template.md` with `phase: planning` and no `approved_at`.
- Preserve an existing `## Execution` section, checked items, evidence, and Resume State when refining a task.
- Fill the Plan from the conversation and inspected project context. Do not invent requirements, APIs, DB structures, or technical facts.
- For external facts (library behavior, standards, dependency evaluation), delegate a bounded research sub-agent that returns a cited summary, and record the conclusion and its source in the Plan. Do not research what the repository already answers.
- Record missing critical information under `### Open Questions`.
- Ask one high-leverage question at a time through the question interface, preferring concise options with the recommended option first.
- If the plan changes an active task's acceptance criteria or scope, record the change, set `phase: blocked`, and obtain explicit re-approval before implementation continues.

## Approval transition

When no blocking questions remain, ask for explicit approval through the question interface; never approve on an implicit or ambiguous answer. On approval, perform the transition exactly as `agents/docs/task-lifecycle.md` defines: preserve the plan, add `approved_at`, set `phase: ready_to_implement`, and record the checkpoint. On rejection, keep `phase: planning` with the open question recorded.

## Flow

1. Inspect the task file, the template, ADRs, and relevant context.
2. Create or update only `agents/task/TASK.md`.
3. Preserve existing Execution content on every update.
4. Ask the next unresolved question through the question interface, or request approval when the plan is complete.
5. Report the task file path, remaining questions, and whether the task is approved.
