---
description: Create or refine the active task plan from conversation context
---

Create or refine `agents/task/TASK-XXX-plan.md` for the active task using the planning discussion already developed in the conversation.

Rules:
- Read `agents/task/backlog.md` and identify the single task under `## Current`.
- If `## Current` has zero or multiple tasks, stop and ask the user to select or create one.
- Extract the task ID (TASK-XXX) from the backlog entry.
- Read `agents/task/plan.md` to understand the required plan structure.
- Read relevant accepted ADRs from `agents/docs/decisions.md` before finalizing behavior or implementation choices.
- Do not assume a special agent mode is required. This command must work correctly in the normal working mode.
- Before asking questions, inspect the smallest useful set of files and project context needed to understand the task.
- If the user references multiple repositories, large codebases, or supporting documents, inspect them first and parallelize exploration when useful.
- Use the conversation context (planning discussion, /prompt-run output, user clarifications) to fill every section of the plan template.
- Do not invent requirements, APIs, DB structures, or technical facts that were not discussed or confirmed.
- If critical information is missing from the conversation, list it under `## Open Questions` instead of guessing.
- Keep `## Status` as `draft` while planning is still in progress so the user can review and approve before implementation.
- Create the plan early and refine it iteratively. Do not wait until every question is answered before writing the first draft.
- If a plan file already exists for this task, update it with any new discussion points instead of overwriting blindly.
- Prefer asking one high-leverage planning question at a time.
- Prefer interface-based option questions over free-form chat whenever there are clear alternatives.
- For each question, present concise options, put the recommended option first, explain the tradeoff briefly, and leave room for a custom answer when needed.
- After each planning answer, update the draft plan immediately so the file stays in sync with the conversation.
- If the task affects the database, fill the `## Database Impact` section with the approach discussed.
- Populate `## Source of Truth to Read` with files relevant to the task.
- Follow `AGENTS.md` for the canonical planning workflow and planning-question behavior.

Flow:
1. Read `agents/task/backlog.md` and confirm exactly one task under `## Current`.
2. Read `agents/task/plan.md` for the template structure.
3. Read `agents/docs/decisions.md` and the relevant source-of-truth files and referenced context for the active task.
4. Synthesize the available context into the current best draft plan.
5. Create or update `agents/task/TASK-XXX-plan.md` with status `draft`.
6. Ask the next highest-value unresolved question.
7. After each user answer, update the draft plan and continue until the user confirms the plan is complete.
8. When pausing, show the current plan progress and the remaining open questions that block approval.
