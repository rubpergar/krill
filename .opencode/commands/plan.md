---
description: Create or refine a task plan in the canonical task lifecycle
---

Create or refine the SDD task artifact using the planning discussion already developed in the conversation.

Read `agents/docs/task-lifecycle.md` first. It is the source of truth for task locations, approval, phases, and transitions. Read `agents/tasks/task-template.md` and relevant accepted ADRs before editing.

## Rules

- Select or refine the task exactly as `agents/docs/task-lifecycle.md` defines, using the question interface for any selection or approval decision.
- Preserve an existing `## Execution` section, checked items, evidence, and Resume State when refining a current task.
- Fill the Plan from the conversation and inspected project context. Do not invent requirements, APIs, DB structures, or technical facts.
- Record missing critical information under `### Open Questions`.
- Ask one high-leverage question at a time through the question interface, preferring concise options with the recommended option first.
- If the plan changes an active task's acceptance criteria or scope, record the change, set `phase: blocked`, and obtain explicit re-approval before implementation continues.

## Approval transition

When no blocking questions remain, ask for explicit approval through the question interface; never move the file on an implicit or ambiguous answer. On approval, perform the transition exactly as `agents/docs/task-lifecycle.md` defines: preserve the task ID and plan, move the file to `current/`, add `approved_at`, set `phase: ready_to_implement`, and record the checkpoint.

## Flow

1. Inspect the task directories, template, ADRs, and relevant context.
2. Create or update only the selected task file.
3. Preserve existing Execution content on every update.
4. Ask the next unresolved question through the question interface, or request approval when the plan is complete.
5. Report the location, remaining questions, and whether the task is approved.
