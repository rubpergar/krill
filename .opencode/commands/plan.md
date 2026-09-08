---
description: Create or refine a task plan in the canonical task lifecycle
---

Create or refine the SDD task artifact using the planning discussion already developed in the conversation.

Read `agents/docs/task-lifecycle.md` first. It is the source of truth for task locations, approval, phases, and transitions. Read `agents/tasks/task-template.md` and relevant accepted ADRs before editing.

## Rules

- List task files matching `TASK-*.md` in `agents/tasks/current/` and `agents/tasks/todo/` before acting; ignore `.gitkeep` and other placeholders.
- If there is exactly one task in `current/`, it is the only active planning target. Refine its Plan only when the conversation explicitly changes or clarifies it; preserve its complete `## Execution` section, checked items, evidence, and Resume State.
- A current task must contain `approved_at`, a recognized current-task phase, and no frontmatter `status`; otherwise stop and report the invalid lifecycle state instead of refining it.
- A selected todo task must also have no frontmatter `status`; reject malformed legacy state instead of deleting or translating it implicitly. Its phase must be `planning` (or be absent in an older draft that can be explicitly initialized as `planning`).
- If more than one task file matches `TASK-*.md` in `current/`, stop and ask the user to resolve the invalid multiplicity. Do not use conversational context to choose one.
- If there is no current task and exactly one task in `todo/`, refine that task.
- If there is no current or todo task, create a new task in `todo/` from `agents/tasks/task-template.md`.
- If there is no current task and multiple todo tasks exist, use the OpenCode question interface to ask the user to select one. Do not guess or print the question as ordinary output when the interface is available.
- Do not create `backlog.md`, `TASK-XXX-plan.md`, or `TASK-XXX-checklist.md`. Do not add a frontmatter `status` field.
- Keep a task in `todo/` while questions are unresolved. Never begin product implementation from `todo/`.
- Fill the Plan from the conversation and inspected project context. Do not invent requirements, APIs, DB structures, or technical facts.
- Record missing critical information under `### Open Questions`.
- Ask one high-leverage question at a time through the question interface, preferring concise options with the recommended option first.
- If the plan changes an active task's acceptance criteria or scope, record the change, set `phase: blocked`, and obtain explicit re-approval before implementation continues.

## Approval transition

When no blocking questions remain, ask whether the user approves the plan through the OpenCode question interface. Do not move the file on an implicit or ambiguous answer.

On explicit approval:

1. Preserve the task ID and all plan content.
2. Move `agents/tasks/todo/TASK-XXX.md` to
   `agents/tasks/current/TASK-XXX.md`.
3. Add `approved_at` to the frontmatter.
4. Set `phase: ready_to_implement` in `### Resume State`.
5. Record the approval transition in `Last checkpoint` and `Checkpoint Log`.

If the task is already in `current/`, do not move it or reset its phase. If the user does not approve a changed plan, keep `phase: blocked` and record the unresolved question. If the user explicitly re-approves a changed active plan, record that approval in `Last checkpoint` and `Checkpoint Log`, then set `phase: ready_to_implement`.

## Flow

1. Inspect the task directories, template, ADRs, and relevant context.
2. Create or update only the selected task file.
3. Preserve existing Execution content on every update.
4. Ask the next unresolved question through the question interface, or request approval when the plan is complete.
5. Report the location, remaining questions, and whether the task is approved.
