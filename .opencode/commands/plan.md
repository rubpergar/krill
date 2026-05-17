---
description: Generate the task plan file from the current conversation context
---

Generate `agents/task/TASK-XXX-plan.md` for the active task using the planning discussion already developed in the conversation.

Rules:
- Read `agents/task/backlog.md` and identify the single task under `## Current`.
- If `## Current` has zero or multiple tasks, stop and ask the user to select or create one.
- Extract the task ID (TASK-XXX) from the backlog entry.
- Read `agents/task/plan.md` to understand the required plan structure.
- Read relevant accepted ADRs from `agents/docs/decisions.md` before finalizing implementation choices.
- Use the conversation context (planning discussion, /prompt-run output, user clarifications) to fill every section of the plan template.
- Do not invent requirements, APIs, DB structures, or technical facts that were not discussed or confirmed.
- If critical information is missing from the conversation, list it under `## Open Questions` instead of guessing.
- Set `## Status` to `draft` so the user can review and approve before implementation.
- If a plan file already exists for this task, update it with any new discussion points instead of overwriting blindly.
- If the task affects the database, fill the `## Database Impact` section with the approach discussed.
- Populate `## Source of Truth to Read` with files relevant to the task.

Flow:
1. Read `agents/task/backlog.md` and confirm exactly one task under `## Current`.
2. Read `agents/task/plan.md` for the template structure.
3. Read `agents/docs/decisions.md` for applicable ADRs.
4. Synthesize the conversation context into a complete plan.
5. Write `agents/task/TASK-XXX-plan.md` with status `draft`.
6. Show the user a summary of the plan and highlight any open questions that need resolution before approval.
